/* =========================================================================
   Motion layer.

   Loads after app.js, so every card it animates already exists in the DOM.
   Nothing here is required to read the page: the styles that hide content
   are all scoped to `.motion` on <html>, which only this file sets — so with
   JS off, or under prefers-reduced-motion, the page renders finished.
   ========================================================================= */

(function () {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (reduced.matches) return;
  root.classList.add('motion');

  /* If the visitor flips the OS setting mid-visit, drop straight to the
     static page rather than leaving half-played transitions behind. */
  reduced.addEventListener('change', (e) => {
    if (e.matches) {
      root.classList.remove('motion');
      document.querySelectorAll('.reveal, .is-in').forEach((n) => n.classList.add('is-in'));
    }
  });

  /* Animation declarations outrank inline styles in the cascade, so a
     `forwards` entrance would permanently pin the transform the parallax
     below wants to write. Drop the hook once each entrance has played. */
  document.querySelectorAll('[data-enter]').forEach((node) => {
    node.addEventListener(
      'animationend',
      () => node.removeAttribute('data-enter'),
      { once: true }
    );
  });

  /* ---------- reveal on scroll ------------------------------------------
     Elements are staggered by their index within a group via --i, so a row
     of cards resolves left-to-right instead of all at once. */

  const groups = [
    ['#trophies > *', 'reveal'],
    ['#highlights > *', 'reveal'],
    ['#record .highlight', 'reveal'],
    ['.chart-card', 'reveal'],
    ['.footer__grid > *', 'reveal'],
  ];

  groups.forEach(([selector, cls]) => {
    document.querySelectorAll(selector).forEach((node, i) => {
      node.classList.add(cls);
      node.style.setProperty('--i', i);
    });
  });

  document.querySelectorAll('.band__cell').forEach((n, i) => n.style.setProperty('--i', i));
  document.querySelectorAll('.bar').forEach((n, i) => n.style.setProperty('--i', i));

  const watched = [
    ...document.querySelectorAll('.reveal'),
    ...document.querySelectorAll('.section__head'),
    ...document.querySelectorAll('.season'),
    ...document.querySelectorAll('.band__cell'),
    ...document.querySelectorAll('.chart'),
  ];

  /* Reveals are driven by an explicit rect test rather than
     IntersectionObserver. These styles hide real content, so the trigger has
     to be something whose behaviour is fully determined here: an observer
     that accepts targets but never reports them intersecting leaves the page
     blank below the fold, and there is no reliable way to detect that from
     the outside. A rect check runs synchronously on load, so anything in the
     first viewport is visible before the first paint either way.

     The test is `top < fold` with no bottom bound, so deep-linking to a
     fragment also reveals everything scrolled past above it. */
  let pending = watched.slice();

  const checkReveals = () => {
    if (!pending.length) return;
    const fold = window.innerHeight * 0.88;
    const stillPending = [];
    pending.forEach((node) => {
      if (node.getBoundingClientRect().top < fold) {
        node.classList.add('is-in');
        if (node.classList.contains('band__cell')) countUp(node);
      } else {
        stillPending.push(node);
      }
    });
    pending = stillPending;
  };

  function showEverything() {
    root.classList.remove('motion');
    watched.forEach((n) => n.classList.add('is-in'));
    document.querySelectorAll('[data-enter]').forEach((n) => n.removeAttribute('data-enter'));
    pending = [];
  }

  /* Printing never scrolls, so reveal the document up front. */
  window.addEventListener('beforeprint', showEverything);
  window.addEventListener('resize', checkReveals, { passive: true });

  /* The display face loads after first paint and re-flows the page, which can
     move an element across the fold without any scrolling. Re-check once
     layout has settled. */
  window.addEventListener('load', checkReveals);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(checkReveals);

  /* ---------- number count-ups ------------------------------------------ */

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function animateNumber(node, to, duration) {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      node.textContent = Math.round(easeOut(t) * to);
      if (t < 1) requestAnimationFrame(step);
      else node.textContent = to;
    };
    requestAnimationFrame(step);
  }

  function countUp(cell) {
    const num = cell.querySelector('.band__num');
    if (!num) return;
    const target = parseInt(num.textContent, 10);
    if (Number.isNaN(target)) return;
    animateNumber(num, target, 900);
  }

  /* The team number deals in one digit at a time, left to right. Deliberately
     not a scrambler or a counter: this is the team's identity, and a half-
     finished frame of either shows a number that isn't theirs. Every frame
     here shows correct digits or none. */
  const pit = document.getElementById('pit-number');
  if (pit) {
    const real = String(pit.dataset.value || pit.textContent.trim());
    pit.textContent = '';
    pit.setAttribute('aria-label', real);
    [...real].forEach((d, i) => {
      const slot = document.createElement('span');
      slot.className = 'digit';
      slot.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('i');
      inner.textContent = d;
      inner.style.animationDelay = `${340 + i * 85}ms`;
      slot.append(inner);
      pit.append(slot);
    });
  }

  /* ---------- scroll progress + hero parallax ---------------------------- */

  const progress = document.getElementById('scroll-progress');
  const heroCopy = document.querySelector('.hero__copy');
  const pitcard = document.querySelector('.pitcard');
  const field = document.querySelector('.hero__field');
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (progress) {
      progress.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
    }

    /* Hero layers separate slightly as the page pulls away — enough to feel
       like depth, not enough to fight the scroll. Skipped at rest so a
       page load does not fight the entrance animation. */
    if (y > 0 && y < window.innerHeight * 1.2) {
      if (heroCopy) heroCopy.style.transform = `translateY(${y * 0.14}px)`;
      if (pitcard) pitcard.style.transform = `translateY(${y * -0.06}px) rotate(${1.6 + y * 0.004}deg)`;
      if (field) field.style.transform = `translateY(${y * 0.26}px)`;
    }

    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      /* Reveals run straight off the scroll event, not inside the rAF
         throttle: they decide whether content is visible at all, so they must
         not inherit a dependency on frames being produced. The check exits on
         its first line once everything has been revealed, so the cost is
         nothing. Parallax and the progress bar are cosmetic and stay throttled. */
      checkReveals();

      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    },
    { passive: true }
  );

  checkReveals();
  onScroll();
})();
