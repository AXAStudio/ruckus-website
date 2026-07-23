/* =========================================================================
   three.js viewer for the latest robot.

   Loads automatically — three.js and the mesh are imported after the page's
   own content is up, so the initial paint stays fast, but the visitor never
   has to click anything. three.js is resolved through the import map in
   index.html. A post-processing stack (image-based lighting, ambient
   occlusion, a touch of bloom, antialiasing) gives the bare CAD mesh some
   depth and material.
   ========================================================================= */
(function () {
  const stage = document.getElementById('viewer-stage');
  const overlay = document.getElementById('viewer-overlay');
  const loading = document.getElementById('viewer-loading');
  const retry = document.getElementById('viewer-launch');
  const statusEl = document.getElementById('viewer-status');
  const hud = document.getElementById('viewer-hud');
  const resetBtn = document.getElementById('viewer-reset');
  const spinBtn = document.getElementById('viewer-spin');
  if (!stage) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setStatus = (msg) => { statusEl.textContent = msg || ''; };
  const setLoading = (msg) => { if (loading) loading.textContent = msg; };
  let started = false;

  async function start() {
    if (started) return;
    started = true;
    retry.hidden = true;
    setLoading('Loading the robot…');

    let THREE, OrbitControls, STLLoader, RoomEnvironment,
        EffectComposer, RenderPass, SSAOPass, UnrealBloomPass, OutputPass;
    try {
      THREE = await import('three');
      ({ OrbitControls } = await import('three/addons/controls/OrbitControls.js'));
      ({ STLLoader } = await import('three/addons/loaders/STLLoader.js'));
      ({ RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js'));
      ({ EffectComposer } = await import('three/addons/postprocessing/EffectComposer.js'));
      ({ RenderPass } = await import('three/addons/postprocessing/RenderPass.js'));
      ({ SSAOPass } = await import('three/addons/postprocessing/SSAOPass.js'));
      ({ UnrealBloomPass } = await import('three/addons/postprocessing/UnrealBloomPass.js'));
      ({ OutputPass } = await import('three/addons/postprocessing/OutputPass.js'));
    } catch (err) {
      return fail('Could not load the 3D engine — check the connection.');
    }

    function fail(msg) {
      started = false;
      retry.hidden = false;
      setLoading(msg);
    }

    const width = () => stage.clientWidth || 1;
    const height = () => stage.clientHeight || 1;
    const themeBg = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--viewer-bg').trim() || '#101410';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(themeBg());

    const camera = new THREE.PerspectiveCamera(45, width() / height(), 0.1, 1e6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width(), height());
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    stage.appendChild(renderer.domElement);

    // Image-based lighting from a synthetic room — gives the metal something to
    // reflect, so the shading reads as a material rather than a flat silhouette.
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // A key light on top of the IBL for direction and a highlight to bloom.
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(1, 1.5, 1);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xbfe89a, 0.6);
    rim.position.set(-1, 0.4, -1.2);
    scene.add(rim);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.zoomSpeed = 15.0;
    controls.zoomToCursor = false;

    // Pivot so the auto-spin always turns around the world's vertical axis.
    const pivot = new THREE.Group();
    scene.add(pivot);

    // ---- post-processing composer ----
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const ssao = new SSAOPass(scene, camera, width(), height());
    ssao.kernelRadius = 6;
    ssao.minDistance = 0.0008;
    ssao.maxDistance = 0.06;
    composer.addPass(ssao);

    const bloom = new UnrealBloomPass(new THREE.Vector2(width(), height()), 0.22, 0.5, 0.85);
    composer.addPass(bloom);

    composer.addPass(new OutputPass());
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.setSize(width(), height());

    let hasModel = false;
    let spinning = !reduceMotion;
    const home = { pos: new THREE.Vector3(), target: new THREE.Vector3() };

    setStatus('Loading robot model… (~15 MB)');
    new STLLoader().load(
      'robot/robot.stl',
      (geo) => {
        geo.computeVertexNormals();
        geo.center();

        const mat = new THREE.MeshStandardMaterial({
          color: 0x5fa73d, metalness: 0.55, roughness: 0.38, envMapIntensity: 0.9,
        });
        const mesh = new THREE.Mesh(geo, mat);
        // Export is already Y-up (base at the bottom) — three.js's up-axis too.
        pivot.add(mesh);

        const box = new THREE.Box3().setFromObject(pivot);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const radius = Math.max(size.x, size.y, size.z) * 0.5 || 1;
        const dist = (radius / Math.sin((camera.fov * Math.PI) / 360)) * 1.35;

        camera.position.set(center.x + dist * 0.7, center.y + dist * 0.45, center.z + dist * 0.95);
        camera.near = dist / 100;
        camera.far = dist * 100;
        camera.updateProjectionMatrix();
        controls.target.copy(center);
        controls.update();
        home.pos.copy(camera.position);
        home.target.copy(center);

        hasModel = true;
        overlay.hidden = true;
        hud.hidden = false;
        setStatus('');
      },
      (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          setStatus('Loading robot model… ' + pct + '%');
          setLoading('Loading the robot… ' + pct + '%');
        }
      },
      () => fail('Could not load the robot model. Serve the site over HTTP and try again.')
    );

    function resize() {
      camera.aspect = width() / height();
      camera.updateProjectionMatrix();
      renderer.setSize(width(), height());
      composer.setSize(width(), height());
      ssao.setSize(width(), height());
    }
    window.addEventListener('resize', resize);

    new MutationObserver(() => { scene.background = new THREE.Color(themeBg()); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    resetBtn.addEventListener('click', () => {
      camera.position.copy(home.pos);
      controls.target.copy(home.target);
      controls.update();
    });

    const setSpin = (on) => {
      spinning = on;
      spinBtn.textContent = on ? 'Pause spin' : 'Resume spin';
      spinBtn.setAttribute('aria-pressed', String(on));
    };
    spinBtn.addEventListener('click', () => setSpin(!spinning));
    if (reduceMotion) setSpin(false);

    (function animate() {
      requestAnimationFrame(animate);
      if (hasModel && spinning) pivot.rotation.y += 0.0035;
      controls.update();
      composer.render();
    })();
  }

  retry.addEventListener('click', start);

  // Auto-load without a click, but only after the page's own content has
  // painted so the heavy import never delays first render.
  const kick = () => {
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 200);
  };
  if (document.readyState === 'complete') kick();
  else window.addEventListener('load', kick);
})();
