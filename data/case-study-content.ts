// ── Image slot type ───────────────────────────────────────────────────────────
export interface CsImage {
  src: string
  alt: string
  aspectRatio?: string          // CSS aspect-ratio value, defaults to '16/9'
  layout?: 'default' | 'phone' | 'wide'  // phone = 320px centered; wide = scrollable on mobile
  fullWidth?: boolean           // breaks out of editorial-width to span full container
}

// ── Video slot type ───────────────────────────────────────────────────────────
// Symmetric with CsImage so vertical videos get the same treatment as vertical
// screenshots: layout='phone' caps at 320px and centers, default takes full
// editorial column width.
export interface CsVideo {
  src: string
  aspectRatio?: string          // CSS aspect-ratio value; required when layout='phone' to reserve space
  layout?: 'default' | 'phone' | 'wide'
  alt?: string                  // for accessibility / fallback caption
}

// ── Inline bar chart ──────────────────────────────────────────────────────────
// Editorial horizontal bar chart rendered as SVG/CSS inline in the chapter.
// Uses the site typography and the project accent color — no PNG export needed.
export interface CsBarChart {
  title?: string
  subtitle?: string
  data: Array<{ label: string; value: number }>
}

export interface CsImpactStat {
  number: string
  description: string
}

export interface CsPullQuote {
  text: string
  attribution?: string
}

export interface CsCallout {
  title: string
  body: string
}

// All chapter content is always visible — there is no expand/collapse mechanic.
// Render order within a chapter: headline → paragraphs (beforeVideo sits after
// the first paragraph, or beside the headline/paragraphs in split layouts) →
// inlineImages (anchored between paragraphs) → pullQuote → beforeImage → beforeChart
// → phoneRow → impactStats → impactText
// → callout → images → keyTakeaway.
export interface CsChapter {
  label: string
  headline: string             // supports \n for forced line breaks
  headlineVideoSplit?: boolean // headline + beforeVideo render in a 2-col row (video matches headline height)
  paragraphs: string[]
  splitParagraphs?: number     // split layouts only: how many paragraphs sit beside the media (default 1); the rest flow below
  beforeImage?: CsImage        // primary image slot (max 1 per chapter)
  beforeVideo?: CsVideo        // primary video slot
  beforeChart?: CsBarChart     // inline bar chart, uses project accent
  phoneRow?: CsImage[]         // row of phone screenshots, side by side with accent border
  inlineImages?: { afterParagraph: number; image: CsImage }[]  // images anchored between paragraphs (afterParagraph is 1-based); standard non-split layout only
  pullQuote?: CsPullQuote
  callout?: CsCallout
  images?: CsImage[]           // additional images at the end of the chapter
  // Impact chapter only
  impactStats?: CsImpactStat[]
  impactText?: string[]        // paragraphs rendered after the stat grid
  // Reflection chapter only
  keyTakeaway?: CsCallout
}

export interface CaseStudyContent {
  slug: string
  heroImage: string                        // right-column hero visual (also used as heroVideo poster)
  heroVideo?: string                       // optional — replaces the static hero image with a looping video
  opening: { paragraphs: string[] }        // "What this project is really about"
  csr: { challenge: string; strategy: string; results: string }
  ministryQuoteBlock?: { text: string; attribution: string }  // re:markt only, full-width block
  chapters: CsChapter[]
}

// ── odo ───────────────────────────────────────────────────────────────────────

const odo: CaseStudyContent = {
  slug: 'odo',
  heroImage: '/images/odo/cover.jpg',
  opening: {
    paragraphs: [
      'Every major route planning tool works the same way. You enter a start point, a distance, maybe a bike type. The algorithm finds the most efficient path between the constraints. Then it offers you three variations of the same route.',
      'The problem is not the technology. It is the model. These tools treat personalization as a filter, a layer you add after the route exists. odo inverts this: rider intent is not a constraint on the route, it is the origin of the route. Scenery, surface, shade, wind, safety. Not preferences you toggle, but the inputs the route is generated from.',
      'That changes the job. It is not a routing problem, it is a translation problem: turning a rider\'s intent into API parameters, weighted signals, and output a cyclist can verify. The design challenge was never the interface. It was the pipeline behind it, and making that pipeline legible enough to feel like a recommendation instead of a black box.',
    ],
  },
  csr: {
    challenge:
      'Cyclists don\'t want the fastest route. They want the right one for the ride they\'re in the mood for. Existing tools are technically robust but treat personalization as secondary: the output is minor path variations, not meaningfully different rides.',
    strategy:
      'Designed an intent-to-route translation system: rider preferences for scenery, surface, shade, wind, and safety become weighted routing constraints, processed through live environmental APIs. The result is a set of named route profiles that generate genuinely different loops, not one route with slight variations. Grounded in research with 116 cyclists before design began.',
    results:
      'A functional vertical slice prototype running on live APIs: OpenRouteService for routing and surface data, Shademap for time-based shade, custom elevation processing for gradients. The pipeline works with real data, not synthetic inputs. Differentiation against Garmin, Komoot, and Strava confirmed through a Blue Ocean analysis.',
  },
  chapters: [
    {
      label: '01 · The Situation',
      headline: 'A market full of tools, none of them personal.',
      paragraphs: [
        'Cyclists plan rides in two settings. Familiar terrain runs on memory and habit. For unfamiliar terrain, a new region or a route beyond the usual range, they turn to digital tools. That is where the planning gap lives.',
        'The existing tools are built for athletic tracking and for navigation during the ride, not for planning. Komoot filters by terrain type, Strava serves segment data to athletes, Outdooractive aggregates trails, Wikiloc crowdsources routes. All of them share the same underlying model: optimize for distance and time, then let the rider filter the results.',
        'The result is a specific frustration that cyclists described consistently in our research: the tools give you options, but the options feel arbitrary. You don\'t know why the app chose this route, whether the scenic option is actually scenic, or which loop still has shade at 10am. Trust requires explanation. The current generation of route planners does not explain.',
      ],
    },
    {
      label: '02 · What We Found',
      headline: 'What 116 cyclists actually told us.',
      paragraphs: [
        'We started with a survey of 116 cyclists and nine in-depth interviews. Not as a formality: the results shaped the direction of the project, and in one case overturned an assumption we had walked in with.',
        'The overturned assumption: we expected riders to be roughly split between loops and point-to-point routes. Instead, 82 of 116 preferred loops, across every rider type. That is not a small detail. Existing tools are built around paths. odo had to be built around loops from the ground up.',
        'The priorities were just as clear: scenery and safety ranked highest, well above surface type and distance, for casual riders and athletes alike. Scenery, which almost no existing tool addresses meaningfully, is not a nice-to-have. It is often the reason people ride.',
        'The interviews added the texture. Friction clusters around three moments: uncertainty about conditions before the ride, the inability to compare routes on the dimensions that matter during planning, and the effort of reconfiguring everything when the ride intent changes.',
      ],
      beforeChart: {
        title: 'Preferred route format',
        subtitle: 'Survey of 116 cyclists',
        data: [
          { label: 'Loop', value: 82 },
          { label: 'Point-to-point', value: 16 },
          { label: 'Multi-destination', value: 14 },
          { label: 'Other', value: 4 },
        ],
      },
    },
    {
      label: '03 · The Real Problem',
      headline: 'Profiles over parameters.',
      paragraphs: [
        'After research, the question was not which features to build. It was which model of personalization would actually work.',
        'We explored three directions: adventure-driven routing built on novelty and discovery, safety-first routing that minimizes traffic exposure, and inspiration-driven routing curated by community and editorial input. All three had appeal. None captured what the research kept surfacing: ride intent changes day to day. The same cyclist wants a challenging mountain loop on Saturday and a flat scenic loop after work on Tuesday. A system built around a single intent cannot serve them both.',
        'Route profiles were the answer. A profile is not a set of filters. It is a named intent, Scenic, Safe, Challenging or Balanced, that maps to its own combination of weighted signals, routing constraints, and avoidance criteria. Switching profiles does not reconfigure a form. It generates a different route from a different premise.',
        'One tradeoff was deliberate: explainability over sophistication. An opaque scoring system would have been easier to build, but a rider who cannot understand a recommendation will not trust it on an unfamiliar ride. Every signal we use, shade at a given time, surface per segment, gradient, wind direction, is one a cyclist can verify. That verifiability is the trust mechanism.',
      ],
    },
    {
      label: '04 · How It Works',
      headline: 'The pipeline behind the profile.',
      paragraphs: [
        'The interface is simple. The system behind it is not, and the design work that matters is the data architecture. A route profile is a specification: select Scenic, and odo translates that intent into weighted API parameters. Maximize shade coverage, prioritize unpaved surfaces where available, minimize main road exposure, favor continuous elevation change over flat terrain. OpenRouteService generates candidate routes against those constraints.',
        'The raw output is then enriched. Shademap computes actual shade coverage for the planned start time from topographic and building data. Elevation becomes per-segment gradient metrics in four tiers that match how cyclists think about climbs. Surface type comes from OpenStreetMap and maps to plain labels: paved, gravel, compacted dirt, technical trail.',
        'Wind is the most behaviorally interesting signal. Cyclists care about wind direction relative to their route, not absolute speed. A tailwind out and a headwind home is a very different ride than the reverse. odo processes wind direction and route geometry together into a per-segment visualization: green above the axis for tailwind, red below for headwind. A rider can see, before starting, which sections will feel easy and which will hurt.',
        'The output is not a score. It is labeled, segmented data the interface can show in plain terms. The system explains itself continuously, not as a disclaimer but as the product.',
      ],
      beforeVideo: {
        src: '/videos/odo/ch04-shademap.mp4',
        aspectRatio: '1440/864',
        alt: 'Shademap demo: shadow progression across the Lake Constance and Liechtenstein region over a simulated day',
      },
      callout: {
        title: 'Stack',
        body: 'Next.js · React-Leaflet / Leaflet · OpenRouteService (routing, surface) · Shademap (time-based shade) · Custom elevation processing (gradient, segment classification)',
      },
    },
    {
      label: '05 · The Idea',
      headline: 'Two flows, real data, live APIs.',
      splitParagraphs: 2,
      paragraphs: [
        'We designed two entry flows for two planning realities the interviews kept describing: the rider with five minutes and the rider who wants to spend an hour.',
        'Quick Start opens on the three profiles most differentiated for the current moment, each carrying one loop route regenerated daily against live conditions. Three meaningfully different rides every morning, no configuration. This is the five-minute flow.',
        'Custom Ride is full control. Onboarding captures rider type, bike type, preferences and avoidances, a time window, and a starting point, then generates profiles for deep comparison before committing. This is the flow for planning a long weekend route in an unfamiliar region.',
        'The prototype validated both flows on live API calls. No mocked data, no placeholder responses: routes came from real OpenRouteService queries, shade from Shademap against real topography for the query time, including edge cases where API constraints produced route geometries we had to design around. The pipeline works with real signals in real places. The concept is not theoretical.',
      ],
      beforeVideo: {
        src: '/videos/odo/ch05-profiles.mp4',
        aspectRatio: '524/1060',
        layout: 'phone',
        alt: 'Quick Start flow in action: swiping between the three most differentiated route options for the current moment. Switching profiles regenerates the route from a different premise instead of reconfiguring filters.',
      },
    },
    {
      label: '06 · The Result',
      headline: 'Plan. Navigate. Improve.',
      paragraphs: [
        'The product loop has three phases, designed as a cycle rather than a one-shot experience. In the plan phase, the rider reviews the route before committing: difficulty, distance, elevation gain, duration, start time. The preview divides the route into segments with weather, surface, and gradient for each, highlighted on the map as the rider scrolls.',
        'The navigate phase is a handoff. odo is a planning tool, not turn-by-turn navigation: a deliberate scope decision. odo generates the route, the bike computer runs the ride, and odo never competes with hardware where Garmin and Wahoo have deep advantages.',
        'The feedback phase drives the long-term value. Post-ride, the rider rates segments and adjusts preferences, and the profile learns through explicit signals the rider controls, not opaque machine learning. Rate gravel sections poorly and they appear less. The profile updates the same way it recommends: visibly.',
      ],
      beforeImage: {
        src: '/images/odo/ch06-flow.webp',
        alt: 'Main user flow for odo: profile selection on the left, route detail view in the middle, segment-by-segment preview on the right.',
        aspectRatio: '2048/1041',
        fullWidth: true,
      },
    },
    {
      label: '07 · What Changed',
      headline: 'The architecture is the differentiation.',
      paragraphs: [
        'The most important thing we validated was not the interface. It was the feasibility of the underlying system.',
      ],
      impactStats: [
        { number: '116', description: 'cyclists surveyed before a single screen was designed' },
        { number: '9', description: 'in-depth interviews shaping the core concept' },
        { number: '4', description: 'differentiated route profiles validated with real API data' },
        { number: '3', description: 'live environmental APIs integrated in the functional prototype' },
      ],
      impactText: [
        'Shade at a given time, surface per segment, gradient per section, wind relative to route geometry: every signal odo needs can be sourced from existing APIs and translated into labels a rider can trust, without proprietary data.',
        'That is the core claim. Not a nicer route planner, but proof that intent-based routing works with available data, at consumer scale, without a data moat.',
      ],
      callout: {
        title: 'Blue Ocean differentiation',
        body: 'odo differentiates on four dimensions no existing tool covers simultaneously: intent-based routing instead of filters, visible signals instead of opaque scores, loops instead of paths, and profiles that adapt to rider feedback over time.',
      },
      images: [
        {
          src: '/images/odo/ch08-blueocean.webp',
          alt: 'Blue Ocean Strategy Canvas: odo compared against Garmin, Komoot, and Strava across six capability axes. odo dominates the route planning phase and intentionally scores low on live navigation and performance tracking, a deliberate scope choice that leaves navigation to dedicated bike computers.',
          aspectRatio: '2048/1255',
          fullWidth: true,
        },
      ],
    },
    {
      label: '08 · What I Learned',
      headline: 'Control beats automation every time.',
      paragraphs: [
        'The clearest finding across the research: cyclists do not want the system to decide for them. They want to understand what it is doing, adjust it, and trust the output because they can trace it back to their own preferences.',
        'That pushed explainability from feature to design principle. Every signal is visible, every label defined, every recommendation traceable. Harder to build than an opaque score, and meaningfully more trustworthy.',
        'The second lesson is scope. A vertical slice, one city, four profiles, two flows, validated deeper than a broad prototype ever could. Depth beats width when the claim you are testing is feasibility.',
      ],
      keyTakeaway: {
        title: 'Explainability is the feature.',
        body: 'Personalization only works when users understand why the system recommends what it does. The pipeline is the product. The interface is how you make it legible.',
      },
    },
  ],
}

// ── re:markt ──────────────────────────────────────────────────────────────────

const remarkt: CaseStudyContent = {
  slug: 'remarkt',
  heroImage: '/images/remarkt/cover.jpg',
  opening: {
    paragraphs: [
      'This is not a product design project. It is an operating system for a building most people have never thought of as a system at all. The supermarket is critical infrastructure that was never designed to fail gracefully. re:markt asks: what if it was?',
      'The design challenge was operational, not visual: a store that stays legible and enforceable for staff, customers, and logistics partners when the usual infrastructure is gone. Fair distribution not as an intention, but as a rule that holds without power, without internet, and with a crowd that is scared.',
      'The answer is not a generator. It is a prepared switch: a second operating mode built into the store from the start.',
    ],
  },
  csr: {
    challenge:
      '95% of German supermarkets stop operating within four hours of a power outage; only 5% have backup generators. There is no standardized crisis mode: no distribution logic, no allocation rules, no plan for when normal operations collapse. What remains is improvisation under pressure, which means chaos.',
    strategy:
      'Designed a dual-mode operating system built into the store from the start. Normal mode: standard retail. Crisis mode: floor converts to storage and distribution, a token-based issuance system replaces queuing, and a standardized re:box unit travels unchanged from producer to household across five distribution channels.',
    results:
      'Selected for the HfG exhibition. Invited to present at the Baden-Württemberg Ministry of Food, Rural Affairs and Consumer Protection, a direct policy context. The Ministry endorsed the work in writing.',
  },
  ministryQuoteBlock: {
    text: 'The projects arrived at extremely compelling, practically relevant results. The works have given us valuable impulses and opened fresh perspectives for our thinking and action with regard to strengthening societal resilience.',
    attribution: 'Baden-Württemberg Ministry of Food, Rural Affairs and Consumer Protection',
  },
  chapters: [
    {
      label: '01 · The Situation',
      headline: 'A system optimized for stability, not adaptability.',
      paragraphs: [
        'In normal conditions, supermarkets are extraordinarily efficient: lean inventory, just-in-time logistics, optimized shelf space. That efficiency is exactly the problem. It leaves no slack for disruption.',
        'Power loss, supply chain interruption, or panic buying can break operations within hours. 89% of German households rely on supermarkets as their primary food source, so when stores stop functioning, even temporarily, the social consequences are immediate and disproportionate.',
        'The gap is not a supply problem. It is a governance problem: no predefined crisis mode, no standardized logic for allocating goods under scarcity. Without rules, staff improvise. Improvisation under pressure produces chaos, and chaos costs the one thing a crisis needs most: trust.',
      ],
    },
    {
      label: '02 · What We Found',
      headline: 'Where the current system breaks.',
      paragraphs: [
        'We analyzed how the system fails along three dimensions: energy, cold chain, and human behavior. Each revealed a different layer of the same problem.',
        'Energy failure is the most visible, but it is the trigger, not the cause. When power goes out, refrigeration fails first, then checkout, then communication. Staff lose the tools to manage demand. Customers, uncertain what will be available or for how long, default to panic: buying more than they need, arriving earlier, staying longer.',
        'Cold chain failure compounds this. Perishables become unsellable within hours, so a store that enters a crisis with full shelves quickly holds less usable product than it appears to. The visible abundance is a liability.',
        'Human behavior is the layer most easily overlooked. People behave predictably under scarcity: they hoard, they queue, they compete. A store without allocation rules has no mechanism to counter this. "First come, first served" is not a distribution strategy. It is the absence of one.',
      ],
      pullQuote: {
        text: 'Resilience is not improvisation. It is pre-defined operations that stay legible when infrastructure becomes unstable.',
      },
    },
    {
      label: '03 · The Real Problem',
      headline: 'Three things that had to be true at once.',
      paragraphs: [
        'The concept had to work under three conditions at once: limited energy, high and unpredictable demand, and staff under severe stress. Anything that required extensive training, complex technology, or new infrastructure to activate was not a solution. It was a dependency.',
        'Three non-negotiables followed. First: fair distribution must be explainable. Allocation rules have to be simple enough that a customer understands them before entering the store, because rules that require interpretation get contested, and contested rules under stress create conflict.',
        'Second: the system must survive without digital infrastructure. QR codes and NFC tokens work offline, and paper fallbacks exist for everything digital.',
        'Third: compatibility with existing logistics standards. Custom packaging or rebuilt distribution infrastructure would make the concept undeployable at scale. The re:box had to fit into what already exists.',
      ],
    },
    {
      label: '04 · The Idea',
      headline: 'A store that operates in two modes.',
      paragraphs: [
        're:markt is a normal supermarket that contains, within its existing footprint, a fully operational crisis distribution system. Activating it requires no external resources and no emergency decisions. It requires executing a plan that was already made.',
        'In normal mode, the store works like any supermarket: open shelving, free movement, standard checkout.',
        'In crisis mode, the transformation is physical and operational at once. Community and waiting areas expand at the perimeter, the sales floor shrinks toward the center, and storage grows to receive incoming re:boxes. Signage switches from advertising to orientation: what is available, in what quantity, and how it will be distributed.',
        'The transition is not an emergency response. It is a mode change, like a building switching into its fire evacuation protocol. Except this one can hold for days, not minutes.',
      ],
      beforeImage: {
        src: '/images/remarkt/ch04-floorplan.png',
        alt: 'Floor plan in normal and crisis mode. Two stacked diagrams: in normal mode the sales floor dominates the middle, with community area on top and storage below. In crisis mode the proportions invert: community area expands, the sales floor shrinks to a sliver, and storage grows to receive incoming re:boxes.',
        aspectRatio: '5478/2400',
        fullWidth: true,
      },
      callout: {
        title: 'Infrastructure branding.',
        body: 'The visual system is not designed for marketing. It is designed for orientation and trust: signage, zoning, and communication in crisis mode work like public infrastructure, legible at a distance, interpretable under stress, authoritative without being aggressive.',
      },
    },
    {
      label: '05 · How It Works',
      headline: 'Three mechanisms that make it enforceable.',
      paragraphs: [
        'A good concept is not enough. The system has to be operable by real staff, under real stress, without specialized equipment. Three mechanisms carry that load.',
        'The re:box is a standardized unit that stays identical from producer to household: fixed dimensions, fixed weight, fixed contents. The producer packs it, the warehouse stores it, the store hands it over, the household carries it home. Keeping the unit stable across every handoff removes the failure points that appear when packaging changes between stages. Staff count boxes without opening them; households receive a predictable quantity.',
        'Token-based issuance replaces "first come, first served." Each household receives a QR or NFC token and a pickup window: everyone with a token has guaranteed access, so there is no advantage to arriving early. Queue dynamics collapse, and staff control throughput predictably.',
        'Zoning divides the space into entry, waiting, handoff, and exit, with controlled transitions between them. It shields staff from full crowd pressure and prevents the compression that leads to conflict. The markings are tape and signage, deployable in under thirty minutes.',
      ],
    },
    {
      label: '06 · The Result',
      headline: 'Five ways to reach a household.',
      paragraphs: [
        'A single store cannot serve a whole neighborhood in a crisis. re:markt is not one point of distribution but the anchor of a network that uses existing infrastructure wherever possible.',
        'The Hub is the operational center: it receives re:boxes, manages inventory, and dispatches to the other channels. Click & Collect lets households pre-order and pick up their re:box in a set time window without entering the full store.',
        'Delivery brings re:boxes directly to households, prioritizing people with limited mobility, the elderly, and families with small children: those least equipped to navigate a crowded store in a crisis. Pop-Up stations, vehicle-based, cover neighborhoods without a Hub nearby.',
        'DHL Station uses Germany\'s existing network of automated parcel lockers to distribute re:boxes without any additional staffing. A household picks up a re:box the way it picks up any parcel.',
        'The channels activate selectively, not all at once. A local outage might need only Hub and Click & Collect. A regional failure activates all five.',
      ],
      beforeImage: {
        src: '/images/remarkt/ch06-channels.png',
        alt: 'Five distribution channels arranged around the re:markt Hub: Click & Collect, Delivery, Pop-Up Store, and DHL Station. The Hub handles central distribution, storage, and coordination across all channels.',
        aspectRatio: '1300/2067',
      },
    },
    {
      label: '07 · What Changed',
      headline: 'What the numbers say.',
      paragraphs: [
        'The expected impact is predictability.',
      ],
      impactStats: [
        { number: 'Up to 80%', description: 'energy demand reduction in crisis mode' },
        { number: '4,000→800', description: 'kWh stepped down while staying operational' },
        { number: '5', description: 'distribution channels designed and specified' },
        { number: '89%', description: 'of German households rely on supermarkets as their primary food source' },
      ],
      impactText: [
        'Clear allocation rules reduce conflict. Energy prioritization keeps critical systems running. Standardized logistics removes the fragile handoffs that break when packaging or process changes between stages.',
        'The behavioral effect matters as much as the operational one. When people know what they can get, in what quantity, and when, panic behavior shifts to planning behavior. Crowds stabilize, pressure on staff drops, and trust in the supply system holds at exactly the moment it is most at risk.',
      ],
    },
    {
      label: '08 · What I Learned',
      headline: 'The interface was never the screen.',
      paragraphs: [
        'I came into this project expecting to design an interface. I left it having designed a governance system.',
        'In a crisis, the interface is the rules: how decisions are made, by whom, under what authority, with what fallback. The most important design work was the logic behind the token system, the zoning protocol, and the re:box specification. Getting those right gave the visual layer something real to communicate.',
        'The AI-generated concept film for the exhibition taught a second lesson: generative tools did not find the narrative, they executed one we had already built.',
      ],
      keyTakeaway: {
        title: 'Rule clarity is UX.',
        body: 'When infrastructure fails, UX becomes operational governance: clear modes, enforceable rules, communication that holds under stress.',
      },
    },
  ],
}

// ── Staedtler ─────────────────────────────────────────────────────────────────

const staedtler: CaseStudyContent = {
  slug: 'staedtler',
  heroImage: '/images/staedtler/cover.jpg',
  heroVideo: '/videos/staedtler/hero.mp4',
  opening: {
    paragraphs: [
      'Pick a lane, commit, defend it: that is how brands usually answer pressure. This case study asks what happens if Staedtler refuses to choose a lane at all.',
      'A synthesis of eight global futures reports surfaced one throughline across every domain we looked at: AI takes over routine work, the world fractures into isolated blocks, and in parallel a hunger grows for things that are real, made by hand, and present. Not nostalgia. A reaction to what is being lost right now.',
      'The conclusion: authenticity is becoming the hardest currency a brand can hold. People are not buying a pen anymore, they are buying a reason to choose this one. For Staedtler, that reason is creativity: the one part of the brand that survives every version of the future, expressed in two directions that pull against each other and are both completely real.',
    ],
  },
  csr: {
    challenge:
      "Staedtler's core business is shrinking as pen and paper lose ground to tablets, apps, and AI, while its own digital push, Noris Digital, never found its footing. Price pressure from cheap manufacturing squeezes every category at once, and the brand cannot say clearly what it stands for beyond school and office.",
    strategy:
      'Reframed the crisis as a question of range, not survival: how does Staedtler protect its analog identity while still opening the markets of tomorrow. The answer is a single brand core, creativity, expressed in two honest, opposite registers: goal-driven Fast Lane creativity and process-driven Slow Lane creativity. Neither is a compromise of the other.',
    results:
      'A dual product concept framed as a fictional Staedtler campaign launching in 2042. Mars Note, a Fast Lane device, turns a sticky note wall into a live shared workspace; Mars Mind, a Slow Lane device, holds sketching, journaling, and meditation with nothing else competing for attention. A three horizon roadmap carries both lanes from a 2026 portfolio reset to the 2042 launch.',
  },
  chapters: [
    {
      label: '01 · The Situation',
      headline: 'A brand squeezed from every direction.',
      paragraphs: [
        'Four pressures, none of them hypothetical. The core business is shrinking: pen and paper lose ground every year to tablets, apps, and generative AI, and the losses are structural, not cyclical.',
        'The digital answer failed. Noris Digital, Staedtler\'s own attempt to cross over, stayed too tentative to change the trajectory.',
        'Price pressure hits every category at once. Cheap manufacturing out of Asia keeps undercutting the Made in Germany premium, and customers who see no reason to pay more simply do not.',
        'The quietest problem is the most damaging: nobody can say what Staedtler stands for. The brand reads as traditional rather than contemporary, and its profile never leaves the classroom or the office desk. Heritage without a stance is just history.',
      ],
    },
    {
      label: '02 · What We Found',
      headline: 'What the future actually says about creativity.',
      paragraphs: [
        'Instead of guessing at trends, we read the trends other people are already paid to find. Eight global futures reports went into the synthesis, spanning brands, technology, geopolitics, society, identity, economy, and consumption.',
        'One image kept repeating across unrelated domains. Work becomes automated, always on, interchangeable. Identity fragments into isolation and burnout. The world splits into blocks that trade less and guard more. Every report describes a version of the same discomfort: people feel unheard, replaceable, and quietly exhausted by a life mediated through screens.',
        'Against that, a second pattern showed up just as consistently, usually in the same reports, a few pages later. A pull toward the handmade, the slow, the unplugged. People want to breathe, reflect, touch something real, be present without an audience. Not a rejection of technology so much as a correction to how much of life it has already taken.',
        'Put together, the two patterns describe the same person at two different moments of their day: efficient and outsourcing when it counts, deliberately slow and hands on when it does not. A brand built for only one of those moments is only half relevant.',
      ],
      inlineImages: [
        {
          afterParagraph: 2,
          image: {
            src: '/images/staedtler/ch02-discomfort-moodboard.png',
            alt: 'Moodboard of the automation-era discomfort: scenes labeled Replaceable, Always-On, Burnout, Unheard, Isolated, and Automated',
            aspectRatio: '1793/888',
            fullWidth: true,
          },
        },
        {
          afterParagraph: 3,
          image: {
            src: '/images/staedtler/ch02-counterpull-moodboard.png',
            alt: 'Moodboard of the counter-movement toward the handmade and present: scenes labeled Handmade, Pause, Breathe, Reflect, Unplug, Hands-on, Presence, and Touch',
            aspectRatio: '1792/889',
            fullWidth: true,
          },
        },
      ],
      callout: {
        title: 'Reports synthesized',
        body: 'McKinsey & Company, World Health Organization, Deloitte, World Economic Forum, Atlantic Council, Bruegel, IPCC, RANE.',
      },
    },
    {
      label: '03 · The Real Problem',
      headline: 'One brand core, two honest expressions.',
      paragraphs: [
        'The question stopped being what should Staedtler build and became what is Staedtler actually for. Every audit, every workshop, every trend cluster kept circling back to the same word: creativity.',
        'Creativity is not one thing, though. It splits into two opposite modes. One is goal-driven and output-oriented: ideas exist to solve a defined problem, fast, often with AI in the loop. The other is open and searching, with no fixed target: the point is the process, thinking through hand and material, not what comes out of it.',
        'Both are genuinely Staedtler, and neither one is a compromise. A brand that only serves goal-driven creativity abandons the half of its audience that draws, journals, and doodles for no reason at all. A brand that only serves open-ended creativity has nothing to say to a team shipping on a deadline.',
      ],
      inlineImages: [
        {
          afterParagraph: 2,
          image: {
            src: '/images/staedtler/ch03-brand-core-diagram.png',
            alt: 'Brand-core diagram: Creativity at the center, splitting into Outcome (Productivity, Goals, Tasks, Structure) and Experience (Mindfulness, Freedom, Possibilities, an end in itself)',
            aspectRatio: '1699/807',
          },
        },
      ],
      pullQuote: {
        text: 'How does Staedtler protect its analog identity and still open the markets of tomorrow?',
      },
    },
    {
      label: '04 · The Idea',
      headline: 'Two lanes, one origin, launching in 2042.',
      paragraphs: [
        'The concept is framed as a fictional Staedtler campaign launching in 2042: far enough out that the brand has had time to grow past pens and pencils, and to grow past its German-speaking home market into a global one.',
        'Fast Lane carries Intentional Creativity: efficient, structured, built for people who think in teams and deadlines. Slow Lane carries Explorative Creativity: unhurried, personal, built for people who think alone and without a clock running. Each lane gets its own product, its own typeface, its own color world, and its own reason to exist, but both trace back to the same brand core.',
        'Fast Lane grows outward, into new markets and new industries. Slow Lane grows inward, into a single person\'s daily rhythm. Staedtler does not have to choose which direction it expands in, because both directions start from the same place.',
      ],
    },
    {
      label: '05 · Fast Lane',
      headline: 'Mars Note: a wall\nthat thinks with the team.',
      paragraphs: [
        'Mars Note is built for teams that think analog and need to deliver digital. Small light units clip onto a wall. An infrared scan reads every sticky note in real time, and a pico laser projector throws the result back onto the wall, so remote colleagues see the same board live without anyone retyping a single line.',
        'The handwriting never becomes someone\'s job to transcribe. The wall stays a wall, the sticky note stays a sticky note, and only the result quietly travels into Miro, Word, or Notion in the background.',
        'Guided Workshops brings dozens of proven methods, from How Might We to Crazy 8s, directly onto the wall. Digital Capture keeps the board scrollable and searchable long after the sticky notes come down. Remote Co-Work lets a colleague who never entered the room point, comment, and move notes with the same authority as someone standing at the wall.',
        'Mars Note is designed to grow outward. Method packs can be built for whole industries, from automotive to fintech, opening up a software business Staedtler has never had before.',
      ],
      images: [
        {
          src: '/images/staedtler/ch05-fastlane-branding.png',
          alt: 'Fast Lane branding board for Mars Note: blue palette, GT America typeface, and product, mechanism, and packaging renders',
          aspectRatio: '1920/1080',
          fullWidth: true,
        },
      ],
    },
    {
      label: '06 · Slow Lane',
      headline: 'Mars Mind: built to not compete for attention.',
      paragraphs: [
        'Mars Mind is the opposite device on purpose. It does sketching, journaling, and guided meditation, nothing else, and nothing can be bought or added to change that. Where Mars Note grows outward into the market, Mars Mind grows inward into one person, learning their rhythm the longer they use it.',
        'Picture an evening after work. The door closes, and the reflex is the phone, the feed, the slow sinking into someone else\'s scroll. Mars Mind interrupts that reflex with one projected question: what moved you today. An hour later, the notebook is full and the phone was never touched.',
        'Every function is projected onto paper or a blank surface, so the hands stay busy and the eyes stay off a screen. Entries sync encrypted, and unlike Mars Note they stay private by default.',
      ],
      images: [
        {
          src: '/images/staedtler/ch06-slowlane-branding.png',
          alt: 'Slow Lane branding board for Mars Mind: ochre palette, GT Super typeface, and product, pencil-heritage, and packaging renders',
          aspectRatio: '1920/1080',
          fullWidth: true,
        },
      ],
    },
    {
      label: '07 · What Changed',
      headline: 'What has to be true for this to work.',
      paragraphs: [
        'The relevance case rests on capabilities Staedtler already has, just never pointed in this direction.',
      ],
      impactStats: [
        { number: '8', description: 'global futures reports synthesized into one throughline' },
        { number: '2', description: 'lanes, one shared brand core, no compromise between them' },
        { number: '3', description: 'roadmap horizons from 2026 to 2042' },
        { number: '2042', description: 'the fictional year Mars Note and Mars Mind launch' },
      ],
      impactText: [
        'Staedtler already has decades of material and manufacturing expertise and already serves students, professionals, and hobbyists at once. Until now that range was treated as heritage. Here it becomes strategy: the counter-movement to digitization, built the way only Staedtler can build it.',
        'The roadmap moves in three horizons. 2026 to 2032: the portfolio narrows and both lanes launch quietly, starting with workshop cases and journaling sets. 2032 to 2038: the campaign claim Embrace Ambivalence becomes the brand\'s single voice, and an app ecosystem gets tested. 2038 to 2042: Mars Note and Mars Mind launch, backed by a campaign film, and Staedtler stands as a global two lane brand.',
      ],
    },
    {
      label: '08 · What I Learned',
      headline: 'The answer to the question we started with.',
      paragraphs: [
        'The question we framed the project around was how Staedtler keeps its analog identity while still reaching the markets of tomorrow. The answer: it stops being either or. Fast and slow are not opposing bets, they are the same brand core pointed in two directions.',
        'The harder lesson was about restraint. It would have been easy to give Mars Mind more features, more integrations, more reasons to open an app. The device only works because it refuses all of that, and holding that restraint against every instinct to add value was the actual design work.',
        'This is one possible path, not the only one. What it shows is what becomes possible once Staedtler treats its range as strategy instead of heritage.',
      ],
      keyTakeaway: {
        title: 'Creativity is the part that survives every future.',
        body: 'Fast or slow, digital or analog, Staedtler does not have to choose. Both are genuinely the brand, and both are what carries it forward.',
      },
    },
  ],
}

const maya: CaseStudyContent = {
  slug: 'maya',
  heroImage: '/images/maya/mainvisualdashboard.jpg',
  opening: {
    paragraphs: [
      'Germany will be short 350,000 nursing staff by 2034. The country\'s response, by necessity, is international recruitment. Thousands of care trainees arrive each year from the Philippines, Vietnam, Mexico, and elsewhere — qualified, motivated, and holding language certificates that say they\'re ready.',
      'Most of them are not ready. Not because the certificates are wrong, but because the certificates measure the wrong thing. They measure classroom German. The workplace runs on something else: informal phrasing, shift handover shorthand, the exact words for a patient\'s pain level, small talk with a colleague at 6am.',
      'maya does not try to teach German faster. It tries to change where and when language learning happens. The key insight came early in our research: trainees who live with people from their home country speak their native language every evening, every morning, every weekend. By the time they arrive at work on Monday, German has had zero hours of exposure since Friday. The workplace inherits a deficit that started at home.',
      'maya intervenes upstream. It shapes the daily environment — the housing, the digital companion, the gradual linguistic shift — before the language problem becomes a dropout.',
    ],
  },
  csr: {
    challenge:
      'International care trainees arrive with valid language certificates but struggle with everyday communication — workplace phrasing, informal conversation, local knowledge. When staff spend their off-hours in native-language households, German gets no daily practice. Dropout rates are high. Each dropout costs Stiftung Liebenau €6,826 in direct costs alone. Germany is projected to be short 350,000 nursing staff by 2034.',
    strategy:
      'Designed a two-part system that addresses language at the source. First: a structured shared-living matching system that pairs international trainees with German-speaking housemates based on language level and experience — turning daily life into passive language exposure. Second: a single AI assistant that starts in the trainee\'s native language and shifts gradually toward German as confidence grows, covering onboarding, daily life, and workplace basics.',
    results:
      'Three linked prototypes delivered: shared-living matching dashboard, onboarding assistant (maya 1.0), and everyday assistant with adaptive language shift. System designed for Stiftung Liebenau\'s operational constraints: data privacy, cultural sensitivity, and adoption in a high-workload environment.',
  },
  chapters: [
    {
      label: '01 · The Situation',
      headline: 'A structural crisis with a solvable upstream cause.',
      paragraphs: [
        'Stiftung Liebenau is one of Germany\'s larger social welfare organizations — over 8,900 employees across care facilities, residential services, and social programs. Like most operators in the sector, they depend heavily on international recruitment to meet staffing demands that domestic supply cannot fill.',
        'The briefing was specific: design a KI-based system for multilingual communication in a sensitive care context. Data privacy, cultural sensitivity, and adoption from day one were the hard constraints. The system had to feel safe and respectful — not surveillance, not enforcement, not a workaround for a broken hiring pipeline.',
        'We went in expecting a translation problem. We found something more interesting: a timing problem.',
        'The language failures were not happening because trainees lacked capability. They were happening because capability that exists in a classroom does not automatically transfer to a care environment. Trainees knew the grammar. They did not know how to tell a colleague at shift handover that a patient had been agitated all night. They did not know how to navigate the bureaucracy of registering at the local Einwohnermeldeamt. These are not gaps you can close with a course. They close with time, exposure, and a daily environment that makes practice unavoidable.',
      ],
    },
    {
      label: '02 · What We Found',
      headline: 'What we heard in the hallways.',
      paragraphs: [
        'We conducted desk research, focus group interviews, on-site visits to Liebenau facilities, and interviews with HR leadership, care coordinators, practical supervisors, and care workers — both from Liebenau and one external operator.',
        'Trainees avoided asking questions. Not because they didn\'t have them — but because asking felt like admitting failure. "They get lost in daily life often," one care coordinator told us. "They don\'t know how processes here work, and they rarely dare to ask." The social cost of asking a question was too high. So gaps compounded silently.',
        'Staff carried the overhead. "You explain things again and again," another interviewee said. "It costs time and quickly leads to misunderstandings in the team." This was not occasional. It was structural — a recurring coordination tax that came with every new international arrival.',
        'The housing insight was the one that reoriented everything. "Many live only with people from their home country," one HR manager said. "So German simply stays out of daily life." The language that matters most — informal, everyday, low-stakes German — was getting zero practice during the hours when practice was most possible.',
      ],
      pullQuote: {
        text: 'On paper the language level often fits. But in the daily work reality, you notice it\'s not enough.',
        attribution: 'Interview, Stiftung Liebenau care coordinator',
      },
    },
    {
      label: '03 · The Real Problem',
      headline: 'Language is the upstream lever.',
      paragraphs: [
        'The problem map we built after research showed six distinct problem areas: staff overhead from repeated explanations, housing scarcity limiting recruitment capacity, missing local knowledge in daily life, onboarding overload from bureaucracy, dropout from repeated language test failures, and the core pattern of trainees reverting to their native language in off-hours.',
        'All six problems had language as a root cause or accelerant. Solve the language situation first — especially the off-hours language situation — and most of the other problems become smaller.',
        'This shaped our design direction completely. We were not designing a translation tool. We were designing an integration system whose entry point was daily life, not the workplace.',
        'Three principles guided every subsequent decision. First: mutual learning — peer exposure works better than instruction, and it costs nothing extra if the housing is already there. Second: help for self-help — the goal is independence, not dependency on a chatbot. The assistant should be working itself out of a job. Third: everyday independence as the foundation — if a trainee can navigate their daily life with confidence, the workplace becomes easier.',
      ],
      callout: {
        title: 'Trust is the feature.',
        body: 'In a care context, adoption depends entirely on whether the tool feels safe. Privacy constraints, cultural tone, and escalation logic were not UX considerations — they were product requirements. A tool that staff or trainees do not trust will not be used. A tool that is not used solves nothing.',
      },
    },
    {
      label: '04 · The Idea',
      headline: 'Shape the housing. Then shape the language.',
      beforeImage: {
        src: '/images/maya/ch04-matrix.png',
        alt: 'Language integration matrix and WG constellations. Left panel: six-level scale from Level 6 (German apprentice already in their second training year, dark green) to Level 1 (new apprentice just arrived in Germany, dark red). Right panel: example 4-, 5-, and 6-person flat configurations showing balanced mixes of levels across each household composition.',
        aspectRatio: '2736/1149',
        fullWidth: true,
      },
      paragraphs: [
        'maya is a two-part system. The parts are designed to work together, but each solves a distinct problem.',
        'The first is the shared-living matching system. Housing at Liebenau is managed centrally — this is both a constraint and a leverage point. By structuring who lives with whom, the organization can engineer daily language exposure without any additional program, class, or cost. A trainee who lives with a German-speaking second-year apprentice gets German practice at dinner, on the way to work, and in every small daily interaction. This is not language instruction. It is language immersion by design.',
        'The matching matrix works on two axes: time in Germany (experience with the context) and language level. Groups of three to six people are formed to balance the distribution — at least one person with stronger German capability in every unit. The HR dashboard manages this systematically, replacing the informal, ad-hoc housing assignments that currently happen without any matching logic.',
        'The second part is maya 1.0: an AI assistant that covers the first phase of a trainee\'s journey. It begins in the trainee\'s native language — because arriving in a foreign country is already overwhelming, and adding language pressure at that moment is counterproductive. Then, as the trainee gains confidence, the assistant gradually shifts toward German.',
        'In phase one, the assistant covers onboarding questions, local navigation, bureaucratic processes, and daily life basics. It is available before arrival, so a trainee can begin to understand their new context before they step off the plane. It is intentionally scoped away from medical and clinical content — trust must be established before scope can expand.',
      ],
    },
    {
      label: '05 · How It Works',
      headline: 'One assistant, two phases, a gradual shift.',
      headlineVideoSplit: true,
      beforeVideo: {
        src: '/videos/maya/cover.mp4',
        alt: 'Maya cover video',
      },
      paragraphs: [
        'The matching system and the assistant are connected by a shared logic: start where the person is, then shift gradually toward where they need to be. Neither system forces progress. Both systems make progress feel natural.',
        'The matching matrix runs on six levels, combining two dimensions — length of time in Germany and German language level. A Level 6 is a German-speaking apprentice in their second or third year who knows the routines, the local area, and the facility. A Level 1 is an international trainee who arrived last week. The matrix generates balanced household compositions: every group has at least one person who can informally answer the questions that don\'t get asked at work.',
        'The assistant\'s language shift works on the same principle. It does not tell the user "you should practice German now." It progressively introduces German words, then phrases, then responses — embedded in the natural flow of a conversation that remains comfortable and comprehensible. The goal is passive acquisition becoming active use, at a pace that builds confidence rather than pressure.',
        'The Liebenau provider dashboard gives HR teams visibility into matching quality, language progression signals, and recurring support patterns. This is not surveillance — it is aggregate signal. If many trainees in a given cohort are asking the same questions, that is information the organization can act on structurally rather than handling case by case.',
      ],
    },
    {
      label: '06 · The Result',
      headline: 'Three prototypes, three phases, one financial case.',
      paragraphs: [
        'The semester outcome is a three-phase rollout, costed end-to-end. Each phase is a working prototype with its own break-even logic — the deliverable is the case for why an organization should operate it, not just what it looks like.',
        'Phase 01 is WG-Matching: a provider-facing dashboard that generates balanced household compositions from a six-level matrix of language proficiency and time-in-Germany. Operable on day one, no AI required. Phase 02 is maya 1.0, the onboarding assistant scoped strictly to private-life context — supermarket, transit, bureaucracy — in the trainee\'s native language. Phase 03 is maya 2.0, where the assistant shifts language incrementally toward German and opens a scoped workplace path, separated cleanly from private-life context.',
        'The financial model resolves four inputs — 1h/week supervisory overhead per trainee, 45 effective working weeks, €35/h fully loaded care-worker cost, and BIBB\'s €6,826 direct cost per dropout — into a per-trainee monthly exposure of €160–€188. That is the price ceiling under which maya is economically additive.',
        'Market sizing followed the same discipline. TAM: 250,000–300,000 international care workers in Germany. SAM: 80,000–120,000 employed by large Träger where centralized housing and HR systems exist. SOM: 100–300 trainees for the Liebenau pilot. Each phase scales on the same architecture.',
        'The framing is a model, not a measured outcome. It exists to communicate order-of-magnitude — that the problem is large enough to justify investment at a defensible price point — not to overstate what a semester prototype can prove.',
      ],
      pullQuote: {
        text: 'Combined exposure per international trainee, per month: €160 (conservative) to €188 (normal). Anything maya costs to operate below that ceiling pays for itself in avoided cost alone — before any improvement in integration outcomes is counted.',
      },
      phoneRow: [
        { src: '/images/maya/onboarding1.jpg', alt: 'Onboarding screen 1 — language welcome', aspectRatio: '9/16' },
        { src: '/images/maya/onboarding2.jpg', alt: 'Onboarding screen 2 — topic selection', aspectRatio: '9/16' },
        { src: '/images/maya/onboarding3.jpg', alt: 'Onboarding screen 3 — language shift', aspectRatio: '9/16' },
      ],
    },
    {
      label: '07 · What Changed',
      headline: 'What changes if this works.',
      paragraphs: [
        'The expected impact operates on two levels.',
      ],
      impactStats: [
        { number: '€131', description: 'expected staff time savings per trainee / month' },
        { number: '3.75h', description: 'coordination time recovered per trainee per month' },
        { number: '10%', description: 'expected reduction in dropout rate (normal scenario)' },
        { number: '€6,826', description: 'direct net cost per apprenticeship dropout avoided' },
      ],
      impactText: [
        'For the individual trainee, maya reduces the social cost of not knowing something — the anxiety of asking, the embarrassment of confusion, the compounding isolation of navigating a new country alone. Less uncertainty in daily routines means more cognitive capacity available for work. More confidence at home means less avoidance behavior at work.',
        'For the organization, the benefit is structural. Reduced staff overhead from repeated explanations is the most direct effect — and the most measurable. Better housing matching also reduces interpersonal friction in shared living, which reduces a category of conflict and discomfort that currently has no systematic response.',
        'The economic framing is a simplified model, not a measured outcome. We used it to communicate order of magnitude — to show that the cost of the problem is large enough to justify investment in a solution, without overstating what we could prove in a semester prototype.',
      ],
    },
    {
      label: '08 · What I Learned',
      headline: 'What shifted in how I think about systems.',
      paragraphs: [
        'The biggest shift for me was understanding that fixing the downstream symptom — the language failure at work — required intervening upstream in the living situation. That is not an obvious design move. It requires stepping back far enough from the immediate problem to see what is feeding it.',
        'The trust constraint was the second major learning. In care contexts, every design decision carries a different weight than it does in a consumer product. The question is never just "does it work?" It is "will people use it, and will using it feel safe?" Privacy is not a legal checkbox. Cultural tone is not a UX detail. These are the features — the things that determine whether the system gets adopted at all.',
        'If I were building the next version, I would separate the private-life and workplace assistants explicitly. Right now they exist in one interface, and that ambiguity creates uncertainty about what the assistant knows and what it shares with the employer. A cleaner boundary would build more trust faster.',
      ],
      keyTakeaway: {
        title: 'Language is the upstream lever.',
        body: 'Solve it in daily life first and you unlock onboarding, retention, and trust simultaneously. The problem doesn\'t start at the workplace — and the solution shouldn\'t either.',
      },
    },
  ],
}

export const caseStudyContent: Record<string, CaseStudyContent> = {
  odo,
  staedtler,
  remarkt,
  maya,
}
