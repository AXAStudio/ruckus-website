# FTC 14712 — Ruckus Robotics

A static showcase site for the competition record of FIRST Tech Challenge team
**14712, Ruckus Robotics** (Avenues New York — New York, NY).

Neobrutalist treatment built around the team color `rgb(95, 167, 61)` / `#5FA73D`.

## Running it

No build step. The page itself has no dependencies; only the 3D robot viewer
pulls three.js from a CDN, and only once launched. Serve the directory over HTTP:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from the filesystem also works.

## Layout

```
index.html        page structure and copy
css/styles.css    theme tokens, neobrutalist primitives, all layout
js/data.js        the team record + program data — the file you edit to update
js/app.js         renders the trophy case, chart, highlights, and timeline
js/motion.js      entrance, scroll reveals, count-ups, parallax
js/robot.js       the on-demand 3D viewer for the latest robot
robot/robot.stl   web-decimated preview of the robot CAD (~15 MB, 300k triangles)
Full Robot.stl    the full-resolution CAD export (~391 MB, 7.8M triangles)
```

The copy is written in the team's own first-person voice ("we", "our").

## The robot viewer

The **Last robot** section renders `robot/robot.stl` in a three.js WebGL viewer.
It loads automatically, but only after the page's own content has painted —
three.js and the ~15 MB mesh are imported on `load` (via `requestIdleCallback`)
so the initial render stays fast and dependency-free. three.js `0.160.0` is
pulled from jsDelivr through the import map in `index.html`, so the viewer (only
the viewer) needs a network connection. The mesh is shaded with a post-processing
stack: image-based lighting from a `RoomEnvironment`, SSAO, a light bloom, and
ACES tone mapping.

`robot/robot.stl` is a grid-clustered decimation of `Full Robot.stl` down from
7.8M to ~300k triangles — the original is far too large to load in a browser.
Regenerate it after a new CAD export by re-running the decimation over the new
`Full Robot.stl`.

`Full Robot.stl` (~391 MB) is **git-ignored**: it exceeds GitHub's 100 MB
per-file limit, so it is never committed or served from Pages. Keep it locally
to regenerate the preview; distribute the raw CAD some other way if needed
(release asset, Git LFS, external host).

## Deploying (GitHub Pages)

`.github/workflows/pages.yml` builds and deploys the repo root to GitHub Pages
on every push to `master`. One-time setup: in the repo, **Settings → Pages →
Build and deployment → Source → GitHub Actions**. After that, each push
publishes automatically; the live URL is
`https://axastudio.github.io/ruckus-website/`.

`.nojekyll` is present so Pages serves the files as-is without Jekyll
processing. All asset paths are relative, so the site works from the project
subpath without changes.

## Motion

The page reads as a sequence: the hero deals itself in, then each section
arrives as you scroll — headings slide in from the side, cards stagger, the
headline totals count up, and the chart bars grow from the baseline.

All of it is optional. Every rule that hides content is scoped to a `.motion`
class that `js/motion.js` puts on `<html>`, and it only does that when the
visitor has not asked for reduced motion. With JavaScript off, under
`prefers-reduced-motion: reduce`, or when printing, the page renders in its
finished state instead.

Reveals are triggered by an explicit `getBoundingClientRect` test bound
directly to the scroll event, deliberately not by `IntersectionObserver` and
not inside the `requestAnimationFrame` throttle. Those styles decide whether
content is visible at all, so the trigger must not depend on frames being
produced or on an observer actually reporting intersections. Parallax and the
progress bar are cosmetic and stay throttled.

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

## What this site deliberately does NOT publish

The site is limited to the **public competition record** plus the team's mark
(`IDENTITY`) and the resource links. Program-strategy material — the design
process, outreach programs, per-season capital-equipment plans, and sponsors —
was intentionally removed so competitors can't lift the team's playbook. Do not
re-add `PROCESS`, `OUTREACH`, `REACH`, `LEGACY`, or `SPONSORS` data or sections
without a deliberate decision to make them public again; note that anything in
`js/data.js` ships to the browser and is trivially readable.

- **The student roster is not reproduced** either — it is names and photographs
  of minors and does not belong on a public site.

## Data sources

Competition figures were pulled from the FTCScout public API and cross-checked
against the official FIRST event pages, and are corroborated by the awards
timeline in the team's own portfolio. Records reflect results through the end
of the 2025-26 DECODE season.

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
