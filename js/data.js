/* =========================================================================
   FTC 14712 — RUCKUS ROBOTICS
   Competition record. All figures sourced from the FTCScout public API
   (api.ftcscout.org), cross-checked against ftc-events.firstinspires.org.
   Last synced: 2026-07-22 (end of the 2025-26 DECODE season).

   Win-loss records below are QUALIFICATION-match records, which is what the
   public API exposes per event. Playoff results are noted separately where
   they are known.
   ========================================================================= */

const TEAM = {
  number: 14712,
  name: 'Ruckus Robotics',
  school: 'Avenues New York',
  city: 'New York',
  state: 'NY',
  country: 'USA',
  rookieYear: 2018,
  program: 'FIRST Tech Challenge',
};

/* The eight award categories this team has taken home, in the order we
   show them. `blurb` explains what the award actually recognizes — most
   visitors will not know what a "Think Award" is. */
const AWARD_TYPES = [
  {
    key: 'Inspire',
    label: 'Inspire Award',
    icon: '★',
    blurb: 'The top award in FIRST Tech Challenge. Goes to the team that is a strong contender in every other category at once — robot, portfolio, outreach, and conduct.',
  },
  {
    key: 'Winner',
    label: 'Tournament Winner',
    icon: '▲',
    blurb: 'Captained or was drafted onto the winning alliance in the elimination bracket.',
  },
  {
    key: 'Think',
    label: 'Think Award',
    icon: '✎',
    blurb: 'Recognizes the engineering portfolio — how clearly the team documents its design journey, reasoning, and iteration.',
  },
  {
    key: 'Innovate',
    label: 'Innovate Award',
    icon: '◈',
    blurb: 'For a uniquely creative, elegant robot design element that is both ingenious and effective on the field.',
  },
  {
    key: 'Design',
    label: 'Design Award',
    icon: '◆',
    blurb: 'Honors industrial design: a robot that is aesthetically resolved, sturdy, and purpose-built.',
  },
  {
    key: 'Connect',
    label: 'Connect Award',
    icon: '✦',
    blurb: 'For the team most connected to its local engineering community and to the wider world of STEM.',
  },
  {
    key: 'Motivate',
    label: 'Motivate Award',
    icon: '◉',
    blurb: 'For a team that is a role model — spreading enthusiasm for FIRST beyond its own roster.',
  },
  {
    key: 'Control',
    label: 'Control Award',
    icon: '⌘',
    blurb: 'Recognizes advanced software: sensors, autonomous routines, and machine control that push the robot beyond driver skill.',
  },
  {
    key: 'Finalist',
    label: 'Tournament Finalist',
    icon: '△',
    blurb: 'Reached the final match of the elimination bracket.',
  },
  {
    key: 'Sustain',
    label: 'Sustainability Award',
    icon: '◎',
    blurb: 'For building a team that will outlast its current roster — funding, recruitment, and mentorship that carry forward.',
  },
];

/* Placement 1 = the award itself / alliance captain. 2 and 3 are the
   2nd- and 3rd-place recognitions FIRST issues for judged awards. */
const PLACEMENT_LABEL = { 1: '1st', 2: '2nd', 3: '3rd' };

const SEASONS = [
  {
    season: 2018,
    label: '2018-19',
    game: 'Rover Ruckus',
    note: '',
    events: [],
  },
  {
    season: 2019,
    label: '2019-20',
    game: 'Skystone',
    events: [
      {
        code: 'NYCQJD2',
        name: 'John Dewey High School Qualifier 2',
        type: 'Qualifier',
        date: '2019-12-07',
        rank: 8,
        w: 3, l: 1, t: 1,
        opr: 8.3,
        avg: 31.8,
        awards: [],
      },
    ],
  },
  {
    season: 2020,
    label: '2020-21',
    game: 'Ultimate Goal',
    note: 'The remote season. No in-person events on record.',
    events: [],
  },
  {
    season: 2021,
    label: '2021-22',
    game: 'Freight Frenzy',
    events: [
      {
        code: 'USNYNYQUQ5',
        name: 'NY-NYC Qualifier 5',
        type: 'Qualifier',
        date: '2022-02-05',
        rank: 9,
        w: 1, l: 3, t: 1,
        opr: 20.4,
        avg: 46.2,
        awards: [{ type: 'Motivate', placement: 3 }],
      },
    ],
  },
  {
    season: 2022,
    label: '2022-23',
    game: 'Power Play',
    note: 'First breakout year: seven awards across three events and a run to the city championship.',
    events: [
      {
        code: 'USNYNYQUQ5',
        name: 'NY-NYC Qualifier 5',
        type: 'Qualifier',
        date: '2022-11-19',
        rank: 15,
        w: 3, l: 2, t: 0,
        opr: 13.7,
        avg: 49.4,
        awards: [
          { type: 'Design', placement: 1 },
          { type: 'Motivate', placement: 2 },
          { type: 'Think', placement: 3 },
        ],
      },
      {
        code: 'USNYNYBRQ3',
        name: 'NY-NYC Qualifier 3',
        type: 'Qualifier',
        date: '2022-12-03',
        rank: 4,
        w: 4, l: 1, t: 0,
        opr: 30.0,
        avg: 57.2,
        awards: [
          { type: 'Winner', placement: 2 },
          { type: 'Design', placement: 2 },
        ],
      },
      {
        code: 'USNYNYNYSQ',
        name: 'NY-NYC Super Qualifier 1',
        type: 'Super Qualifier',
        date: '2023-02-11',
        rank: 8,
        w: 3, l: 2, t: 0,
        opr: 32.7,
        avg: 92.2,
        awards: [
          { type: 'Think', placement: 1 },
          { type: 'Inspire', placement: 2 },
        ],
      },
      {
        code: 'USNYNYCMP',
        name: 'New York — NYC Championship',
        type: 'Championship',
        date: '2023-03-05',
        rank: 17,
        w: 2, l: 4, t: 0,
        opr: 38.6,
        avg: 121.0,
        awards: [],
      },
    ],
  },
  {
    season: 2023,
    label: '2023-24',
    game: 'CENTERSTAGE',
    note: 'The season everything landed. Three consecutive #1 seeds, three tournament wins, a 32-7 overall record, and a first trip to Houston.',
    highlight: true,
    events: [
      {
        code: 'USNYNYBRQ2',
        name: 'NY-NYC Qualifier 2',
        type: 'Qualifier',
        date: '2023-12-09',
        rank: 1,
        w: 4, l: 1, t: 0,
        opr: 55.0,
        avg: 73.4,
        awards: [
          { type: 'Inspire', placement: 1 },
          { type: 'Winner', placement: 1 },
          { type: 'Control', placement: 2 },
        ],
      },
      {
        code: 'USNYNYBRSQ1',
        name: 'NY-NYC Super Qualifier 1',
        type: 'Super Qualifier',
        date: '2024-02-03',
        rank: 1,
        w: 4, l: 1, t: 0,
        opr: 123.0,
        avg: 137.2,
        awards: [
          { type: 'Winner', placement: 1 },
          { type: 'Connect', placement: 1 },
          { type: 'Inspire', placement: 2 },
          { type: 'Innovate', placement: 3 },
        ],
      },
      {
        code: 'USNYNYCMP',
        name: 'New York — NYC Championship',
        type: 'Championship',
        date: '2024-03-03',
        rank: 1,
        w: 6, l: 0, t: 0,
        opr: 109.8,
        avg: 183.8,
        awards: [
          { type: 'Winner', placement: 1 },
          { type: 'Think', placement: 1 },
          { type: 'Inspire', placement: 2 },
        ],
      },
      {
        code: 'FTCCMP1EDIS',
        name: 'FIRST World Championship — Edison Division',
        type: 'World Championship',
        date: '2024-04-15',
        rank: 27,
        w: 6, l: 4, t: 0,
        opr: 98.1,
        avg: 185.0,
        awards: [],
      },
    ],
  },
  {
    season: 2024,
    label: '2024-25',
    game: 'INTO THE DEEP',
    note: 'A harder year on the field answered with the biggest judged win yet — the Inspire Award at the NYC Championship.',
    events: [
      {
        code: 'USNYNYNYQ',
        name: 'NYC Qualifier 1',
        type: 'Qualifier',
        date: '2024-11-17',
        rank: 8,
        w: 4, l: 2, t: 0,
        opr: 51.3,
        avg: 75.7,
        awards: [],
      },
      {
        code: 'USNYNYQUQ2',
        name: 'NYC Qualifier 5',
        type: 'Qualifier',
        date: '2025-01-19',
        rank: 22,
        w: 1, l: 4, t: 0,
        opr: 37.7,
        avg: 96.2,
        awards: [
          { type: 'Inspire', placement: 2 },
          { type: 'Connect', placement: 2 },
          { type: 'Innovate', placement: 2 },
        ],
      },
      {
        code: 'USNYNYBRSQ2',
        name: 'NYC Super Qualifier 2',
        type: 'Super Qualifier',
        date: '2025-02-09',
        rank: 26,
        w: 1, l: 4, t: 0,
        opr: 1.6,
        avg: 69.0,
        awards: [{ type: 'Inspire', placement: 2 }],
      },
      {
        code: 'USNYNYCMP1',
        name: 'NYC Championship',
        type: 'Championship',
        date: '2025-03-02',
        rank: 28,
        w: 1, l: 5, t: 0,
        opr: 89.6,
        avg: 168.3,
        awards: [{ type: 'Inspire', placement: 1 }],
      },
      {
        code: 'FTCCMP1EDIS',
        name: 'FIRST World Championship — Edison Division',
        type: 'World Championship',
        date: '2025-04-15',
        rank: 57,
        w: 2, l: 8, t: 0,
        opr: 84.6,
        avg: 218.4,
        awards: [{ type: 'Think', placement: 2 }],
      },
    ],
  },
  {
    season: 2025,
    label: '2025-26',
    game: 'DECODE',
    note: 'Back-to-back Inspire Awards at the NYC Championship, a finalist banner, and a third straight world championship berth.',
    highlight: true,
    events: [
      {
        code: 'USNYNYNYQ1',
        name: 'NYC Qualifier 1',
        type: 'Qualifier',
        date: '2025-11-16',
        rank: 8,
        w: 3, l: 2, t: 0,
        opr: 26.1,
        avg: 123.0,
        awards: [{ type: 'Inspire', placement: 1 }],
      },
      {
        code: 'USNYNYBRQ1',
        name: 'NYC Qualifier 2',
        type: 'Qualifier',
        date: '2025-12-06',
        rank: 17,
        w: 2, l: 3, t: 0,
        opr: 26.6,
        avg: 61.2,
        awards: [{ type: 'Inspire', placement: 2 }],
      },
      {
        code: 'USNYNYFMQ1',
        name: 'NYC Qualifier 8',
        type: 'Qualifier',
        date: '2026-01-17',
        rank: 16,
        w: 2, l: 3, t: 0,
        opr: 8.5,
        avg: 70.6,
        awards: [{ type: 'Innovate', placement: 1 }],
      },
      {
        code: 'USNYNYBRSQ2',
        name: 'NYC Super Qualifier 2',
        type: 'Super Qualifier',
        date: '2026-03-01',
        rank: 32,
        w: 1, l: 5, t: 0,
        opr: 43.5,
        avg: 112.2,
        awards: [{ type: 'Inspire', placement: 3 }],
      },
      {
        code: 'USNYNYCMP',
        name: 'New York — NYC Championship',
        type: 'Championship',
        date: '2026-03-08',
        rank: 21,
        w: 3, l: 3, t: 0,
        opr: 59.4,
        avg: 157.3,
        awards: [
          { type: 'Inspire', placement: 1 },
          { type: 'Finalist', placement: 2 },
        ],
      },
      {
        code: 'FTCCMP1LOVE',
        name: 'FIRST World Championship — Lovelace Division',
        type: 'World Championship',
        date: '2026-04-29',
        rank: 40,
        w: 5, l: 5, t: 0,
        opr: 95.1,
        avg: 212.0,
        awards: [{ type: 'Sustain', placement: 2 }],
      },
    ],
  },
];

/* Hand-written callouts. These are the things a stat table cannot say. */
const HIGHLIGHTS = [
  {
    stat: '6-0',
    title: 'Undefeated at the city championship',
    body: 'At the 2024 NYC Championship, we swept every qualification match, took the #1 seed, captained the winning alliance, and walked out with the Think Award on top of it.',
  },
  {
    stat: '123.0',
    title: 'Peak offensive power rating',
    body: 'Set at the 2024 NY-NYC Super Qualifier during CENTERSTAGE — the highest single-event OPR in team history, and roughly fifteen times the rookie-era mark.',
  },
  {
    stat: '3',
    title: 'Straight trips to the World Championship',
    body: 'Edison Division in 2024 and 2025, Lovelace Division in 2026. Three consecutive years qualifying out of one of the deepest regions in the program.',
  },
  {
    stat: '2',
    title: 'Back-to-back championship Inspire Awards',
    body: 'The Inspire Award is the highest honor in FIRST Tech Challenge. We took it at the NYC Championship in both 2025 and 2026 — the judged equivalent of winning the city twice in a row.',
  },
];

const SOURCES = [
  { label: 'FTCScout — Team 14712', url: 'https://ftcscout.org/teams/14712' },
  { label: 'FIRST Tech Challenge Events — Team 14712', url: 'https://ftc-events.firstinspires.org/team/14712' },
  { label: 'The Orange Alliance — Team 14712', url: 'https://theorangealliance.org/teams/14712' },
];

/* =========================================================================
   PROGRAM DATA
   Sourced from the team's 2025-26 "NEW WORLDS" engineering portfolio.
   Deliberately limited to material that outlives a single game: identity,
   partners, outreach programs, process, and equipment. Nothing here
   describes the Decode robot, and the student roster is intentionally
   omitted — it is a page of minors' names and photographs.
   ========================================================================= */

const IDENTITY = {
  traits: ['100% student-led', 'Coeducational', 'Avenues: New York', 'Eight seasons'],
  values: ['STEAM inquiry', 'Respectful collaboration', 'Mindful development', 'Communication'],
  mark:
    'The turtle is our mark — it runs through the branding, the logo, and the way we ' +
    'talk about ourselves. Our coaches describe the job as thinking outside the turtle shell.',
  coaches: ['Marlene Patricia', 'Steven Carpenter'],
};

const SPONSORS = [
  { name: 'nTop', note: 'Computational design software. We visited their labs; our optimized parts came back 60% lighter.' },
  { name: 'goBILDA', note: 'Robot parts — the largest line in the build budget.' },
  { name: 'BAE Systems', note: null },
  { name: "America's Navy", note: 'Forged by the Sea.' },
  { name: 'OXO', note: null },
  { name: 'Fabworks', note: null },
  { name: 'FEDRA Components', note: null },
  { name: 'NYC FIRST', note: 'Regional program partner.' },
];

/* One lasting capital asset bought per season, budgeted a year ahead. The
   clearest expression of how this team thinks past the current game. */
const LEGACY = [
  { label: '2023-24', game: 'CENTERSTAGE', item: 'A1 Mini 3D printer' },
  { label: '2024-25', game: 'INTO THE DEEP', item: '9 Axon Mini+ servos' },
  { label: '2025-26', game: 'DECODE', item: 'ShopBot CNC' },
  { label: '2026-27', game: 'Planned', item: 'A301 system', planned: true },
];

const PROCESS = [
  { step: 'Collaborate', body: 'Build in sprints so iteration happens in continuous small steps.' },
  { step: 'Ideate', body: 'Preliminary CAD across as many designs as possible, tracking the pros and cons of each.' },
  { step: 'CAD', body: 'Model collaboratively in Onshape, ready to export for computation and fabrication.' },
  { step: 'Computation', body: 'Topology optimization, static analysis, and computational fluid dynamics.' },
  { step: 'Prototype', body: 'Build rapidly off the CAD model to understand the details of each subsystem.' },
  { step: 'Fabricate', body: 'FDM printing and CNC machining, chosen against the computational constraints.' },
  { step: 'Test', body: 'Measure subsystems and take data, checking real performance against theory.' },
  { step: 'Reiterate', body: 'Test repeatedly, trialling materials and parameters to optimize each part.' },
];

const OUTREACH = [
  {
    title: 'Hudson Guild STEM Program',
    tag: 'Ongoing mentorship',
    body:
      'We are sole mentors to two ten-person FLL teams at a community center serving underserved ' +
      'students, visiting twice a week. We supply the space, the resources, and the mentors.',
  },
  {
    title: 'Sister team #32706 — rookies at Worlds',
    tag: 'Sister team',
    body:
      'We took on FTC #32706 as a sister team in their rookie year, running weekly build, CAD, and ' +
      'outreach sessions with them — design reviews, competition prep, and time in our shop. In ' +
      'their very first season they earned a berth at the 2026 FIRST World Championship, and we ' +
      'were glad to have helped along the way.',
  },
  {
    title: 'Signature Global Mentoring',
    tag: 'Program they built',
    body:
      'A matchmaking program pairing teams worldwide for mentorship in outreach, mechanical, and CAD. ' +
      'Built after meeting international teams at Worlds who wanted help but hit language barriers. ' +
      'Four of five matched teams kept working with their mentor afterwards.',
  },
  {
    title: 'Multilingual CAD & code videos',
    tag: 'Global reach',
    body:
      'Introductory FTC, Fusion 360, and Onshape videos published in Mandarin, Telugu, French, ' +
      'Portuguese, and Korean, with Bulgarian and Spanish planned — because FTC foundations were ' +
      'inaccessible to non-English speakers.',
  },
  {
    title: 'Sister-team mentoring',
    tag: 'Close to home',
    body:
      'Weekly workshops for rookies and for sister team #24416 Hephaestech, plus a CAD course ' +
      'we contributed to the school platform. Our 2026 NYC Championship finalist alliance was ' +
      'formed with a team we had mentored.',
  },
  {
    title: 'School-wide e-waste drive',
    tag: 'Community',
    body:
      'Collected 133 items. Working hardware went to Hudson Guild; hazardous material went to the ' +
      'NYC Department of Sanitation, a partner the team has worked with for years.',
  },
  {
    title: 'Rookie training & leadership ladder',
    tag: 'Sustain',
    body:
      'New members rotate through six areas and own work they are credited for; returning members ' +
      'take on mentoring, training materials, and project timelines. Sub-team balance shifted from ' +
      '78/15/7 to 46/39/15 across mechanical, outreach, and code.',
  },
];

/* Figures as reported in the 2025-26 portfolio — a single season's outreach,
   not a running all-time total. Labelled as such on the page. */
const REACH = [
  { value: '900+', label: 'Learned about FIRST from their lesson plans' },
  { value: '20+', label: 'International teams connected with' },
  { value: '95+', label: 'Students served through outreach' },
  { value: '$1,015', label: 'Raised for FTC #27329 CORE, a team competing through war' },
  { value: '133', label: 'Items collected in the e-waste drive' },
  { value: '75', label: 'Avenues students taken through CAD training' },
];
