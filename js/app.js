/* =========================================================================
   Renders the trophy case, the awards-per-season chart, the highlight
   cards, and the season timeline from js/data.js.
   ========================================================================= */

/* ---------- derived totals ---------------------------------------------- */

const allEvents = SEASONS.flatMap((s) =>
  s.events.map((e) => ({ ...e, season: s.season, seasonLabel: s.label, game: s.game }))
);

const allAwards = allEvents.flatMap((e) =>
  e.awards.map((a) => ({ ...a, event: e }))
);

const countBy = (list, key) =>
  list.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});

const awardCounts = countBy(allAwards, 'type');
const firstPlaceCounts = countBy(allAwards.filter((a) => a.placement === 1), 'type');

const totals = {
  awards: allAwards.length,
  inspire: awardCounts.Inspire || 0,
  wins: awardCounts.Winner || 0,
  worlds: allEvents.filter((e) => e.type === 'World Championship').length,
  events: allEvents.length,
  seasons: SEASONS.filter((s) => s.events.length > 0).length,
  quals: allEvents.reduce(
    (acc, e) => ({ w: acc.w + e.w, l: acc.l + e.l, t: acc.t + e.t }),
    { w: 0, l: 0, t: 0 }
  ),
  topSeed: allEvents.filter((e) => e.rank === 1).length,
};

/* ---------- small helpers ------------------------------------------------ */

const el = (tag, className, html) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
};

const awardMeta = (key) => AWARD_TYPES.find((t) => t.key === key) || { label: key, icon: '●' };

const fmtDate = (iso) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

/* ---------- 1. headline band -------------------------------------------- */

function renderBand() {
  const cells = [
    [totals.awards, 'Awards won'],
    [totals.inspire, 'Inspire awards'],
    [totals.wins, 'Tournament titles'],
    [totals.worlds, 'World championships'],
  ];
  const grid = document.getElementById('band-grid');
  cells.forEach(([num, label]) => {
    const cell = el('div', 'band__cell');
    cell.append(el('span', 'band__num', String(num)), el('span', 'band__lab', label));
    grid.append(cell);
  });
}

/* ---------- 2. trophy case ---------------------------------------------- */

function renderTrophies() {
  const host = document.getElementById('trophies');
  AWARD_TYPES.filter((t) => awardCounts[t.key]).forEach((type, i) => {
    const count = awardCounts[type.key];
    const firsts = firstPlaceCounts[type.key] || 0;
    const card = el('article', 'trophy' + (i === 0 ? ' trophy--top' : ''));

    const top = el('div', 'trophy__top');
    top.append(el('span', 'trophy__icon', type.icon), el('span', 'trophy__count', String(count)));

    card.append(
      top,
      el('h3', 'trophy__label', type.label),
      el('p', 'trophy__blurb', type.blurb),
      el(
        'p',
        'trophy__firsts',
        firsts ? `${firsts} × first place` : 'runner-up recognitions'
      )
    );
    host.append(card);
  });
}

/* ---------- 3. awards-per-season chart ----------------------------------
   One series, so no legend — the title names it. Every bar carries its own
   value label, which is also what earns the brand green its keep against a
   light surface. Seasons with no recorded events get a hatched zero bar so
   the gap in the record is visible rather than silently dropped. */

function renderChart() {
  const rows = SEASONS.map((s) => {
    const awards = s.events.flatMap((e) => e.awards);
    return {
      label: s.label,
      game: s.game,
      value: awards.length,
      events: s.events.length,
      breakdown: Object.entries(countBy(awards, 'type')).sort((a, b) => b[1] - a[1]),
    };
  });

  const max = Math.max(...rows.map((r) => r.value), 1);
  const chart = document.getElementById('chart');
  const axis = document.getElementById('chart-axis');
  const tooltip = document.getElementById('tooltip');

  rows.forEach((r) => {
    const bar = el('div', 'bar');
    bar.setAttribute('tabindex', '0');
    bar.setAttribute('role', 'img');
    bar.setAttribute(
      'aria-label',
      `${r.label} ${r.game}: ${r.value} award${r.value === 1 ? '' : 's'} across ${r.events} event${r.events === 1 ? '' : 's'}`
    );

    /* Hatching means "no events on record" — a season that was competed but
       yielded no awards still gets a solid stub, so the two are not conflated. */
    const fill = el('div', 'bar__fill' + (r.events === 0 ? ' bar__fill--zero' : ''));
    /* 32px at the top of the plot is reserved for the value label, so the bar
       scales against the remaining height — otherwise a 1-award season would
       be clamped to nothing. */
    fill.style.height =
      r.value === 0 ? '8px' : `calc((100% - 32px) * ${(r.value / max).toFixed(4)})`;

    bar.append(el('div', 'bar__value', String(r.value)), fill);

    const show = (evt) => {
      const target = evt.currentTarget;
      const box = target.getBoundingClientRect();
      tooltip.innerHTML =
        `<strong>${r.label} — ${r.game}</strong>` +
        (r.events
          ? `${r.value} award${r.value === 1 ? '' : 's'} · ${r.events} event${r.events === 1 ? '' : 's'}` +
            (r.breakdown.length
              ? '<ul>' +
                r.breakdown.map(([k, n]) => `<li>${awardMeta(k).label}${n > 1 ? ` ×${n}` : ''}</li>`).join('') +
                '</ul>'
              : '')
          : 'No events on record for this season.');
      tooltip.dataset.show = 'true';
      const top = box.top - tooltip.offsetHeight - 10;
      tooltip.style.top = `${top < 8 ? box.bottom + 10 : top}px`;
      tooltip.style.left = `${Math.min(
        Math.max(8, box.left + box.width / 2 - tooltip.offsetWidth / 2),
        window.innerWidth - tooltip.offsetWidth - 8
      )}px`;
    };
    const hide = () => { tooltip.dataset.show = 'false'; };

    bar.addEventListener('mouseenter', show);
    bar.addEventListener('mousemove', show);
    bar.addEventListener('mouseleave', hide);
    bar.addEventListener('focus', show);
    bar.addEventListener('blur', hide);

    chart.append(bar);

    const tick = el('div', 'chart__tick');
    tick.innerHTML = `${r.label}<b>${r.game}</b>`;
    axis.append(tick);
  });

  /* Table view — the required non-visual path to the same numbers. */
  const tbody = document.getElementById('chart-table-body');
  rows.forEach((r) => {
    const tr = el('tr');
    tr.append(
      el('td', null, r.label),
      el('td', null, r.game),
      el('td', null, String(r.events)),
      el('td', null, String(r.value))
    );
    tbody.append(tr);
  });
}

/* ---------- 4. highlights ------------------------------------------------ */

function renderHighlights() {
  const host = document.getElementById('highlights');
  HIGHLIGHTS.forEach((h) => {
    const card = el('article', 'highlight');
    card.append(
      el('span', 'highlight__stat', h.stat),
      el('h3', 'highlight__title', h.title),
      el('p', 'highlight__body', h.body)
    );
    host.append(card);
  });
}

/* ---------- 5. season timeline ------------------------------------------ */

function renderSeasons() {
  const host = document.getElementById('seasons');

  [...SEASONS].reverse().forEach((s) => {
    const awards = s.events.flatMap((e) => e.awards);
    const rec = s.events.reduce(
      (acc, e) => ({ w: acc.w + e.w, l: acc.l + e.l, t: acc.t + e.t }),
      { w: 0, l: 0, t: 0 }
    );

    const card = el(
      'article',
      'season' + (s.highlight ? ' season--flag' : '') + (s.events.length ? '' : ' season--empty')
    );

    const head = el('div', 'season__head');
    head.append(el('span', 'season__year', s.label), el('span', 'season__game', s.game));

    const tally = el('div', 'season__tally');
    if (s.events.length) {
      tally.append(
        el('span', null, `${s.events.length} event${s.events.length === 1 ? '' : 's'}`),
        el('span', null, `${rec.w}W-${rec.l}L${rec.t ? `-${rec.t}T` : ''} quals`),
        el('span', null, `${awards.length} award${awards.length === 1 ? '' : 's'}`)
      );
    } else {
      tally.append(el('span', null, 'no events on record'));
    }
    head.append(tally);
    card.append(head);

    if (s.note) card.append(el('p', 'season__note', s.note));

    if (s.events.length) {
      const list = el('ul', 'events');
      s.events.forEach((e) => {
        const li = el('li', 'event');

        const left = el('div');
        left.append(
          el('p', 'event__name', e.name),
          el('p', 'event__meta', `${e.type} · ${fmtDate(e.date)}`)
        );

        const stats = el('div', 'event__stats');
        const rankClass = 'pill' + (e.rank === 1 ? ' pill--rank1' : '');
        stats.append(el('span', rankClass, `Rank ${e.rank}`));
        stats.append(el('span', 'pill', `${e.w}W-${e.l}L${e.t ? `-${e.t}T` : ''}`));
        stats.append(el('span', 'pill', `OPR ${e.opr.toFixed(1)}`));
        if (e.type === 'World Championship') {
          stats.append(el('span', 'pill pill--worlds', 'Worlds'));
        }

        li.append(left, stats);

        if (e.awards.length) {
          const tags = el('div', 'event__awards');
          e.awards.forEach((a) => {
            const meta = awardMeta(a.type);
            const tag = el(
              'span',
              'award-tag' + (a.placement === 1 ? ' award-tag--first' : ''),
              `${meta.icon} ${meta.label} — ${PLACEMENT_LABEL[a.placement] || a.placement}`
            );
            tags.append(tag);
          });
          li.append(tags);
        }

        list.append(li);
      });
      card.append(list);
    }

    host.append(card);
  });
}

/* ---------- 6. identity -------------------------------------------------- */

function renderIdentity() {
  const mark = document.getElementById('identity-mark');
  if (mark) mark.textContent = IDENTITY.mark;

  const values = document.getElementById('values');
  if (values) IDENTITY.values.forEach((v) => values.append(el('li', null, v)));

  const coaches = document.getElementById('coaches');
  if (coaches) coaches.textContent = IDENTITY.coaches.join(' and ');
}

/* ---------- 7. odds and ends -------------------------------------------- */

function renderInlineFigures() {
  const map = {
    'fig-awards': totals.awards,
    'fig-events': totals.events,
    'fig-seasons': totals.seasons,
    'fig-topseed': totals.topSeed,
  };
  Object.entries(map).forEach(([id, value]) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  });
}

function renderSources() {
  const host = document.getElementById('sources');
  SOURCES.forEach((s) => {
    const li = el('li');
    const a = el('a', null, s.label);
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    li.append(a);
    host.append(li);
  });
}

function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('ruckus-theme');
  if (stored) document.documentElement.dataset.theme = stored;

  const sync = () => {
    const isDark =
      document.documentElement.dataset.theme === 'dark' ||
      (!document.documentElement.dataset.theme &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    btn.textContent = isDark ? '☀' : '☾';
    btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  };

  btn.addEventListener('click', () => {
    const isDark =
      document.documentElement.dataset.theme === 'dark' ||
      (!document.documentElement.dataset.theme &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('ruckus-theme', next);
    sync();
  });

  sync();
}

renderBand();
renderIdentity();
renderTrophies();
renderChart();
renderHighlights();
renderSeasons();
renderInlineFigures();
renderSources();
initTheme();
