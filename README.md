# FTC 14712 — Ruckus Robotics

A static showcase site for the competition record of FIRST Tech Challenge team
**14712, Ruckus Robotics** (Avenues New York — New York, NY).

Neobrutalist treatment built around the team color `rgb(95, 167, 61)` / `#5FA73D`.

## Running it

No build step, no dependencies. Serve the directory over HTTP:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from the filesystem also works.

## Layout

```
index.html        page structure and copy
css/styles.css    theme tokens, neobrutalist primitives, all layout
js/data.js        the team record — the only file you edit to update results
js/app.js         renders the trophy case, chart, highlights, and timeline
```

## Updating after a competition

Everything on the page is derived from `js/data.js`. Add the event to the right
season's `events` array and the headline totals, trophy-case counts, chart, and
timeline all recompute on their own.

```js
{
  code: 'USNYNYQ...',
  name: 'NYC Qualifier 3',
  type: 'Qualifier',          // or Super Qualifier / Championship / World Championship
  date: '2026-11-15',
  rank: 4,
  w: 4, l: 1, t: 0,           // qualification-match record
  opr: 61.2,
  avg: 140.0,
  awards: [{ type: 'Inspire', placement: 1 }],
}
```

Award `type` values must match a `key` in `AWARD_TYPES`. Adding a new award
category means adding an entry there — the trophy case renders whatever it finds.

## Data sources

Figures were pulled from the FTCScout public API and cross-checked against the
official FIRST event pages. Records reflect results through the end of the
2025-26 DECODE season.

- <https://ftcscout.org/teams/14712>
- <https://ftc-events.firstinspires.org/team/14712>
- <https://theorangealliance.org/teams/14712>

### A note on the numbers

- **W-L records are qualification matches only.** That is what the public API
  exposes per event. Playoff results show up as Winner / Finalist awards instead.
- **OPR is not comparable across seasons.** FIRST ships a new game every year with
  a new scoring scale. The chart therefore counts awards, not points.
- **Judged awards are issued in 1st, 2nd, and 3rd place.** All three are counted in
  the totals, with first-place finishes broken out on each trophy card.

This is an unofficial fan/showcase site and is not affiliated with FIRST.
