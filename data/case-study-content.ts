// ── Image slot type ───────────────────────────────────────────────────────────
export interface CsImage {
  src: string
  alt: string
  aspectRatio?: string          // CSS aspect-ratio value, defaults to '16/9'
  layout?: 'default' | 'phone' | 'wide'  // phone = 320px centered; wide = scrollable on mobile
  fullWidth?: boolean           // breaks out of editorial-width to span full container
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

export interface CsChapter {
  label: string
  headline: string
  paragraphs: string[]         // [0] always visible, rest in expandable
  beforeImage?: CsImage        // shown before the expand toggle (max 1 per chapter)
  pullQuote?: CsPullQuote      // inside expandable
  callout?: CsCallout          // inside expandable
  expandImages?: CsImage[]     // inside expandable, fade in on open
  // Impact chapter only
  impactStats?: CsImpactStat[]
  impactText?: string[]        // inside expandable
  // Reflection chapter only — always visible
  keyTakeaway?: CsCallout
}

export interface CaseStudyContent {
  slug: string
  heroImage: string                        // right-column hero visual
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
      'Every major route planning tool works the same way. You enter a start point, a distance, maybe a bike type. The algorithm finds the most efficient path between the constraints. Then it offers you three variations of essentially the same route.',
      'The problem is not the technology. The problem is the model. These tools treat personalization as a filter applied on top of distance optimization — a layer you add after the route exists. odo inverts this. Rider intent is not a constraint on the route. It is the origin of the route. Scenery, surface, shade, wind, safety — these are not preferences you toggle. They are the inputs from which the route is generated.',
      'This changes what the system has to do. It is not a routing problem. It is a data translation problem: how do you take a rider\'s intent and convert it into API parameters, weighted signals, and explainable output that a cyclist can actually trust? How do you build something that shows its reasoning — so that when the app says "this is your scenic loop," the rider understands why, and agrees?',
      'The design challenge was not the interface. It was the pipeline behind the interface — and making that pipeline legible enough to feel like a recommendation, not a black box.',
    ],
  },
  csr: {
    challenge:
      'Cyclists don\'t want the fastest route. They want the right one for the kind of ride they\'re in the mood for. Existing tools — Komoot, Strava, Outdooractive, Wikiloc — are technically robust but treat personalization as secondary. None generate genuinely differentiated routes based on rider intent. The output of most planners is minor path variations, not meaningfully different ride experiences.',
    strategy:
      'Designed an intent-to-route translation system: rider preferences (scenery, surface, shade, wind, safety) are converted into weighted routing constraints and processed through real environmental APIs. The result is a set of named route profiles, each representing a distinct ride intent, that produce genuinely different loops — not the same route with slight variations. Validated the system with 100+ real cyclists before a single screen was designed.',
    results:
      'A functional vertical slice prototype using live APIs — OpenRouteService for routing and surface data, Shademap for time-based shade analysis, elevation processing for gradient metrics — proving the pipeline works with real data, not synthetic inputs. Competitive differentiation confirmed through blue ocean strategy analysis against five major tools.',
  },
  chapters: [
    {
      label: '01 · Context',
      headline: 'A market full of tools, none of them personal.',
      paragraphs: [
        'Cyclists plan rides in two distinct settings. For familiar areas, they rely on memory and habit. For unfamiliar terrain — a new region, a travel destination, a route longer than their usual range — they turn to digital tools. This is where the planning gap lives.',
        'The tools that exist are built primarily for two use cases: athletic performance tracking and navigation during a ride. Neither is designed for the planning phase, and neither takes the rider\'s intent as a primary input. Komoot offers terrain-type filtering. Strava provides segment data for athletes. Outdooractive aggregates trail information. Wikiloc crowdsources routes from other users. All of them default to the same underlying model: optimize for distance and time, then let the rider filter the results.',
        'The result is a particular kind of frustration that cyclists describe consistently in our research: the tools give you options, but the options feel arbitrary. You don\'t know why the app chose this route over another. You don\'t know if the "scenic" option is actually scenic, or just labeled that way. You don\'t know how the gradient compares between routes, or which one has the most shade at 10am, or whether the gravel sections are rideable on a road bike.',
        'Trust requires explanation. The current generation of route planners does not explain.',
      ],
    },
    {
      label: '02 · Discover',
      headline: 'What 100 cyclists actually told us.',
      paragraphs: [
        'We ran a survey of over 100 cyclists before sketching a single screen. This was not a formality. The survey results fundamentally shaped the direction of the project — and in one case, overturned an assumption we had walked in with.',
        'We assumed cyclists would be roughly split between loop routes and point-to-point. The survey showed a strong preference for loops — routes that return to the start — across all rider types. This is not a small detail. It means the entire routing model needs to generate loops, not paths. Existing tools are built around paths. odo had to be built around loops from the foundation.',
        'The survey also showed clear hierarchy in what cyclists prioritize: scenery and safety were consistently the top two factors, well above surface type and distance. This held across casual riders, regular athletes, and touring cyclists. The insight was that scenery — something almost no existing tool addresses meaningfully — is not a nice-to-have for cyclists. It is often the reason they ride.',
        'The nine in-depth interviews added texture to the numbers. Friction points clustered around three moments: before the ride (uncertainty about route quality, gradient, and conditions), during planning (inability to compare routes on the dimensions that actually matter), and route switching (the inability to quickly see how a different intent would change the output without reconfiguring everything from scratch).',
      ],
      beforeImage: {
        src: '/images/odo/ch02-survey.jpg',
        alt: 'Loop vs. point-to-point preference survey results',
        aspectRatio: '3/2',
      },
      expandImages: [
        {
          src: '/images/odo/ch02-brainstorm.jpg',
          alt: 'Concept brainstorming session',
          aspectRatio: '4/3',
        },
      ],
    },
    {
      label: '03 · Define',
      headline: 'Profiles over parameters.',
      paragraphs: [
        'After research, the question was not "what features should we build?" It was "what model of personalization would actually work for this context?"',
        'We explored three directions. The first was adventure-driven routing — routes selected based on novelty, unexplored territory, discovery. The second was safety-first — routes that explicitly minimize traffic exposure, avoid main roads, and prioritize protected infrastructure. The third was inspiration-driven — routes curated by community input, editorial selection, or social signals.',
        'All three had appeal. None of them alone captured the dimension that our research consistently surfaced: the ride intent that changes day to day. The same cyclist wants a challenging mountain loop on Saturday and a flat scenic loop after work on Tuesday. A system built around a single persona or a single intent cannot serve them both.',
        'Route profiles emerged as the strongest answer. A profile is not a set of filters. It is a named intent — Scenic, Safe, Challenging, Balanced — that maps to a specific combination of weighted signals, routing constraints, and avoidance criteria. Switching profiles does not reconfigure a form. It generates a different route from a different premise. The cognitive load stays low. The output stays meaningfully different.',
        'The key tradeoff we made deliberately: explainability over sophistication. We could have built an opaque scoring system that processed dozens of signals and produced a ranked list. We chose not to. If a rider cannot understand why the app recommended this route, they will not trust it on an unfamiliar ride. The signals we used — shade at a given time, surface type per segment, gradient tier, wind direction — are ones a cyclist can verify. That verifiability is the trust mechanism.',
      ],
    },
    {
      label: '04 · System',
      headline: 'The pipeline behind the profile.',
      paragraphs: [
        'The interface is simple. The system behind it is not. The design work that matters here is not the UI — it is the data architecture.',
        'A route profile is a specification. When a rider selects "Scenic," odo translates that intent into a set of weighted API parameters: maximize shade coverage, prioritize unpaved surface where available, minimize main road exposure, optimize for continuous elevation change rather than flat terrain. These parameters are sent to OpenRouteService, which generates candidate routes against the constraints.',
        'The raw routing output is then enriched. Shademap processes the route geometry against the current time and date to calculate actual shade coverage — not estimated, but computed from topographic and building data. Elevation data is processed to produce gradient metrics per segment, categorized into four tiers that match how cyclists actually think about climbs. Surface type is extracted from OpenStreetMap data via OpenRouteService and mapped to intelligible labels: paved, gravel, compacted dirt, technical trail.',
        'Wind is the most behaviorally interesting signal. Cyclists care about wind direction relative to their route, not absolute wind speed. A strong tailwind on the outbound leg and a headwind on the return is a very different experience than the reverse. odo processes wind direction and route geometry together to produce a per-segment visualization: green above the axis for tailwind assistance, red below for headwind resistance. A rider can see, before starting, which sections will feel easy and which will be hard.',
        'The output of all this processing is not a score. It is a set of labeled, segmented data that the interface displays in plain terms. The system is explaining itself continuously — not as a disclaimer, but as the product.',
      ],
      beforeImage: {
        src: '/images/odo/ch04-shademap.jpg',
        alt: 'Shademap API — shade coverage on real route geometry',
        aspectRatio: '16/9',
      },
      callout: {
        title: 'Stack',
        body: 'Next.js · React-Leaflet / Leaflet · OpenRouteService (routing, surface) · Shademap (time-based shade) · Custom elevation processing (gradient, segment classification)',
      },
      expandImages: [
        {
          src: '/images/odo/ch04-wind.jpg',
          alt: 'Wind direction visualization — tailwind green, headwind red',
          aspectRatio: '16/9',
        },
        {
          src: '/images/odo/ch04-terrain.jpg',
          alt: 'Surface type breakdown per segment',
          aspectRatio: '4/3',
        },
      ],
    },
    {
      label: '05 · Prototype',
      headline: 'Two flows, real data, live APIs.',
      paragraphs: [
        'We designed two entry flows based on a consistent finding in the interviews: the difference between a rider who has 15 minutes and a rider who wants to spend an hour planning.',
        'Quick Start generates a loop immediately from the rider\'s saved profile and current location. It surfaces the three most differentiated options for today — based on conditions at the current time, not generic recommendations — and allows comparison without reconfiguration. For the commuter cyclist who wants to ride after work and has five minutes to decide, this is the flow.',
        'Custom Ride offers full preference control. Onboarding in this flow captures rider type, bike type, specific preferences and avoidances, a time window, and a starting point. From these inputs, odo generates profiles and allows deep comparison before committing. For a cyclist planning a long weekend route in an unfamiliar region, this is the flow.',
        'The functional prototype validated both flows using live API calls. We were not mocking data or using placeholder responses. Routes were generated from real OpenRouteService queries. Shade coverage was computed by Shademap against real topographic data for the query time. The prototype behaved as a real product would — including edge cases where API constraints produced unexpected route geometries that we had to design around.',
        'This was the most important form of validation: the pipeline works with real signals, in real places, with real environmental variation. The concept is not theoretical.',
      ],
      expandImages: [
        {
          src: '/images/odo/ch05-elevation.jpg',
          alt: 'Elevation profile — segment analysis breakdown',
          aspectRatio: '3/1',
          layout: 'wide',
        },
      ],
    },
    {
      label: '06 · Deliver',
      headline: 'Plan. Navigate. Improve.',
      paragraphs: [
        'The final product loop has three phases, designed as a continuous cycle rather than a one-shot experience.',
        'In the plan phase, the rider selects a profile and reviews the route in detail before starting. The detail view presents the key metrics a cyclist uses to make the go/no-go decision: difficulty rating, total distance, elevation gain, estimated duration, and start time. The preview divides the route into segments with per-segment data — weather, surface, gradient — and highlights each segment on the map as the rider scrolls.',
        'The navigate phase is designed for bike computer handoff. odo is a planning tool, not a turn-by-turn navigation tool — a deliberate scope decision. Cyclists navigate with dedicated devices. odo generates the route; the device runs the ride. This keeps odo focused on what it does well and avoids competing with the hardware category where Garmin and Wahoo have deep advantages.',
        'The feedback phase is the long-term value driver. Post-ride, the rider can rate segments and adjust preferences. Over time, the profile learns — not through opaque machine learning, but through explicit preference signals that the rider understands and controls. A rider who consistently rates gravel sections poorly will see those sections appear less in future scenic routes. The system shows its reasoning at every step, including in how it updates.',
      ],
      beforeImage: {
        src: '/images/odo/ch06-profiles.jpg',
        alt: 'Four route profiles — Scenic, Safe, Challenging, Balanced — side by side',
        aspectRatio: '3/1',
        fullWidth: true,
        layout: 'wide',
      },
      expandImages: [
        {
          src: '/images/odo/ch06-flow.jpg',
          alt: 'Main user flow — profile selection → detail view → segment preview',
          aspectRatio: '16/7',
          layout: 'wide',
        },
        {
          src: '/images/odo/ch06-prepare.jpg',
          alt: 'Prepare screen — packing suggestion',
          aspectRatio: '9/16',
          layout: 'phone',
        },
      ],
    },
    {
      label: '07 · Impact',
      headline: 'What we validated.',
      paragraphs: [
        'The most important thing we validated was not the interface. It was the feasibility of the underlying system.',
      ],
      impactStats: [
        { number: '100+', description: 'cyclists surveyed before any screen was designed' },
        { number: '9', description: 'in-depth interviews shaping the core concept' },
        { number: '4', description: 'differentiated route profiles validated with real API data' },
        { number: '3', description: 'live environmental APIs integrated in the functional prototype' },
      ],
      impactText: [
        'Environmental signals — shade at a given time, surface type per segment, gradient per section, wind direction relative to route geometry — can be sourced from existing APIs, processed without proprietary data, and translated into labels that feel trustworthy in a planning context.',
        'This matters because the core claim of odo is not "we designed a nicer route planner." It is "we proved that intent-based routing is possible with available data, at consumer scale, without requiring a proprietary data moat." The competitive differentiation is the architecture, not the visual design.',
      ],
      callout: {
        title: 'Blue Ocean differentiation',
        body: 'odo differentiates on four dimensions that no existing tool addresses simultaneously: intent-based routing (not filter-based), explainability (visible signals, not opaque scores), loop specialization (built around circular routes, not paths), and adaptive profile logic (the system updates based on rider feedback over time).',
      },
    },
    {
      label: '08 · Reflection',
      headline: 'Control beats automation every time.',
      paragraphs: [
        'The clearest finding from our research — confirmed repeatedly through interviews — was that cyclists do not want the system to decide for them. They want to understand what the system is doing, adjust it, and trust the output because they can trace it back to their own preferences.',
        'This pushed us toward explainability as a design principle, not just a feature. Every signal the system uses is visible. Every label is defined. Every recommendation comes with the reasoning behind it. This made the product harder to build — it is technically easier to produce an opaque score — but meaningfully more trustworthy.',
        'The second reflection is about scope. We made a deliberate decision to build a vertical slice rather than a broad prototype. One city, four profiles, two flows — but with real data, real APIs, and real edge cases. That depth of validation is more useful than a wide prototype that fakes its data.',
      ],
      expandImages: [
        {
          src: '/images/odo/ch08-blueocean.jpg',
          alt: 'Blue Ocean Strategy Canvas — competitive differentiation',
          aspectRatio: '16/9',
          fullWidth: true,
        },
      ],
      keyTakeaway: {
        title: 'Explainability is the feature.',
        body: 'Personalization only works when users understand why the system made its recommendation. The pipeline is the product — the interface is how you make the pipeline legible.',
      },
    },
  ],
}

// ── maya ──────────────────────────────────────────────────────────────────────

const maya: CaseStudyContent = {
  slug: 'maya',
  heroImage: '/images/maya/cover.jpg',
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
      label: '01 · Context',
      headline: 'A structural crisis with a solvable upstream cause.',
      paragraphs: [
        'Stiftung Liebenau is one of Germany\'s larger social welfare organizations — over 8,900 employees across care facilities, residential services, and social programs. Like most operators in the sector, they depend heavily on international recruitment to meet staffing demands that domestic supply cannot fill.',
        'The briefing was specific: design a KI-based system for multilingual communication in a sensitive care context. Data privacy, cultural sensitivity, and adoption from day one were the hard constraints. The system had to feel safe and respectful — not surveillance, not enforcement, not a workaround for a broken hiring pipeline.',
        'We went in expecting a translation problem. We found something more interesting: a timing problem.',
        'The language failures were not happening because trainees lacked capability. They were happening because capability that exists in a classroom does not automatically transfer to a care environment. Trainees knew the grammar. They did not know how to tell a colleague at shift handover that a patient had been agitated all night. They did not know how to navigate the bureaucracy of registering at the local Einwohnermeldeamt. These are not gaps you can close with a course. They close with time, exposure, and a daily environment that makes practice unavoidable.',
      ],
    },
    {
      label: '02 · Discover',
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
      label: '03 · Define',
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
      label: '04 · Concept',
      headline: 'Shape the housing. Then shape the language.',
      paragraphs: [
        'maya is a two-part system. The parts are designed to work together, but each solves a distinct problem.',
        'The first is the shared-living matching system. Housing at Liebenau is managed centrally — this is both a constraint and a leverage point. By structuring who lives with whom, the organization can engineer daily language exposure without any additional program, class, or cost. A trainee who lives with a German-speaking second-year apprentice gets German practice at dinner, on the way to work, and in every small daily interaction. This is not language instruction. It is language immersion by design.',
        'The matching matrix works on two axes: time in Germany (experience with the context) and language level. Groups of three to six people are formed to balance the distribution — at least one person with stronger German capability in every unit. The HR dashboard manages this systematically, replacing the informal, ad-hoc housing assignments that currently happen without any matching logic.',
        'The second part is maya 1.0: an AI assistant that covers the first phase of a trainee\'s journey. It begins in the trainee\'s native language — because arriving in a foreign country is already overwhelming, and adding language pressure at that moment is counterproductive. Then, as the trainee gains confidence, the assistant gradually shifts toward German.',
        'In phase one, the assistant covers onboarding questions, local navigation, bureaucratic processes, and daily life basics. It is available before arrival, so a trainee can begin to understand their new context before they step off the plane. It is intentionally scoped away from medical and clinical content — trust must be established before scope can expand.',
      ],
      beforeImage: {
        src: '/images/maya/ch04-marygrace.jpg',
        alt: '"HI MARY GRACE!" — maya 1.0 onboarding screen in Tagalog',
        aspectRatio: '9/16',
        layout: 'phone',
      },
      expandImages: [
        {
          src: '/images/maya/ch04-matrix.jpg',
          alt: 'Language integration matrix — Level 1–6 (time in Germany × language level)',
          aspectRatio: '4/3',
        },
        {
          src: '/images/maya/ch04-wg.jpg',
          alt: 'WG constellation sizes — 3, 4, 5, and 6-person household compositions',
          aspectRatio: '4/3',
        },
      ],
    },
    {
      label: '05 · System',
      headline: 'One assistant, two phases, a gradual shift.',
      paragraphs: [
        'The matching system and the assistant are connected by a shared logic: start where the person is, then shift gradually toward where they need to be. Neither system forces progress. Both systems make progress feel natural.',
        'The matching matrix runs on six levels, combining two dimensions — length of time in Germany and German language level. A Level 6 is a German-speaking apprentice in their second or third year who knows the routines, the local area, and the facility. A Level 1 is an international trainee who arrived last week. The matrix generates balanced household compositions: every group has at least one person who can informally answer the questions that don\'t get asked at work.',
        'The assistant\'s language shift works on the same principle. It does not tell the user "you should practice German now." It progressively introduces German words, then phrases, then responses — embedded in the natural flow of a conversation that remains comfortable and comprehensible. The goal is passive acquisition becoming active use, at a pace that builds confidence rather than pressure.',
        'The Liebenau provider dashboard gives HR teams visibility into matching quality, language progression signals, and recurring support patterns. This is not surveillance — it is aggregate signal. If many trainees in a given cohort are asking the same questions, that is information the organization can act on structurally rather than handling case by case.',
      ],
    },
    {
      label: '06 · Deliver',
      headline: 'Three prototypes, one coherent system.',
      paragraphs: [
        'We delivered three linked prototypes as the semester outcome.',
        'The shared-living matching dashboard is a provider-facing tool for HR. It visualizes current housing compositions, flags imbalances, and surfaces the matching questionnaire flow for incoming trainees. The questionnaire captures language level, country of origin, time already spent in Germany, and a small number of compatibility preferences. From these inputs, the system generates balanced household proposals.',
        'The maya 1.0 onboarding assistant handles the first phase of a trainee\'s journey — from the period before arrival through the first months of daily life and work. It greets the user by name, in their language. It offers suggested topics based on likely questions at that stage. It handles bureaucratic navigation without requiring the trainee to formulate the question in German.',
        'The everyday assistant prototype shows the adaptive language shift in practice. The interface language changes incrementally — a German word here, a phrase there — embedded in responses that the user can already understand. The shift is smooth enough that it is never jarring, but deliberate enough that progress accumulates.',
        'All three prototypes were designed with Liebenau\'s operational constraints as primary constraints, not secondary considerations. Privacy scope is limited to the trainee\'s private context in phase one. The assistant does not touch clinical data, patient information, or medical workflows. Escalation paths to a human are always visible.',
      ],
      beforeImage: {
        src: '/images/maya/ch06-matching-flow.jpg',
        alt: 'Matching questionnaire flow — mobile form sequence',
        aspectRatio: '9/16',
        layout: 'phone',
      },
      expandImages: [
        {
          src: '/images/maya/ch06-daily.jpg',
          alt: 'Daily helper flow — everyday assistant interaction',
          aspectRatio: '9/16',
          layout: 'phone',
        },
        {
          src: '/images/maya/ch06-composite.jpg',
          alt: 'Full prototype composite — matching dashboard and daily helper side by side',
          aspectRatio: '16/9',
          fullWidth: true,
        },
        {
          src: '/images/maya/ch06-dashboard.jpg',
          alt: 'Liebenau Matching Übersicht — full dashboard',
          aspectRatio: '16/9',
          fullWidth: true,
        },
      ],
    },
    {
      label: '07 · Impact',
      headline: 'What changes if this works.',
      paragraphs: [
        'The expected impact operates on two levels.',
      ],
      impactStats: [
        { number: '€131', description: 'expected staff time savings per trainee / month' },
        { number: '3.75h', description: 'coordination time recovered per trainee per month' },
        { number: '10%', description: 'expected reduction in dropout rate (conservative assumption)' },
        { number: '€6,826', description: 'direct net cost per apprenticeship dropout avoided' },
      ],
      impactText: [
        'For the individual trainee, maya reduces the social cost of not knowing something — the anxiety of asking, the embarrassment of confusion, the compounding isolation of navigating a new country alone. Less uncertainty in daily routines means more cognitive capacity available for work. More confidence at home means less avoidance behavior at work.',
        'For the organization, the benefit is structural. Reduced staff overhead from repeated explanations is the most direct effect — and the most measurable. Better housing matching also reduces interpersonal friction in shared living, which reduces a category of conflict and discomfort that currently has no systematic response.',
        'The economic framing is a simplified model, not a measured outcome. We used it to communicate order of magnitude — to show that the cost of the problem is large enough to justify investment in a solution, without overstating what we could prove in a semester prototype.',
      ],
    },
    {
      label: '08 · Reflection',
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

// ── re:markt ──────────────────────────────────────────────────────────────────

const remarkt: CaseStudyContent = {
  slug: 'remarkt',
  heroImage: '/images/remarkt/cover.jpg',
  opening: {
    paragraphs: [
      'This is not a product design project. It is an operating system for a building that most people have never thought of as a system at all. The supermarket is critical infrastructure — but it was never designed to fail gracefully. re:markt asks a different question: what if it was?',
      'The design challenge was not visual. It was operational: how do you build a store that stays legible and enforceable under stress — for staff, for customers, for logistics partners — when the usual infrastructure is gone? How do you make "fair distribution" not just an intention but a rule that holds when there is no power, no internet, and a crowd that is scared?',
      'The answer is not a generator. It is a prepared switch — a second operating mode baked into the store from the start.',
    ],
  },
  csr: {
    challenge:
      '95% of German supermarkets can only operate for 2–4 hours during a power outage. Only 5% have backup generators. There is no standardized crisis mode — no distribution logic, no allocation rules, no plan for when normal operations collapse. The result is improvisation under pressure, which means chaos.',
    strategy:
      'Designed a dual-mode operating system built into the store from the start. Normal mode: standard retail. Crisis mode: floor converts to storage and distribution, a token-based issuance system replaces queuing, and a standardized re:box unit travels unchanged from producer to household across five distribution channels.',
    results:
      'Presented at HfG exhibition. Invited to present at the Baden-Württemberg Ministry of Food, Rural Affairs and Consumer Protection — a direct policy context. Ministry endorsed the work in writing.',
  },
  ministryQuoteBlock: {
    text: 'The projects arrived at extremely compelling, practically relevant results. The works have given us valuable impulses and opened fresh perspectives for our thinking and action with regard to strengthening societal resilience.',
    attribution: 'Baden-Württemberg Ministry of Food, Rural Affairs and Consumer Protection',
  },
  chapters: [
    {
      label: '01 · Context',
      headline: 'A system optimized for stability, not resilience.',
      paragraphs: [
        'Supermarkets are essential infrastructure but not designed for failure. In normal conditions, they are extraordinarily efficient — lean inventory, just-in-time logistics, optimized shelf space. That efficiency is the problem. It leaves no slack for disruption.',
        'Power loss, supply chain interruption, or panic purchasing can break operations within hours. In Germany, 89% of households rely on supermarkets as their primary food source. When those stores stop functioning — even temporarily — the social consequences are immediate and disproportionate.',
        'The gap is not a supply problem. It is a governance problem. There are no pre-defined crisis modes. There is no standardized logic for how goods should be allocated under scarcity. Without clear rules, staff improvise. Without improvisation, chaos. Without a plan, trust collapses.',
      ],
    },
    {
      label: '02 · Discover',
      headline: 'Where the current system breaks.',
      paragraphs: [
        'We analyzed failure cascades across four dimensions: energy, cold chain, logistics, and human behavior. Each revealed a different layer of the same problem.',
        'Energy failure is the most visible, but it is the trigger, not the cause. When power goes out, refrigeration fails first, then point-of-sale systems, then communication. Staff lose the tools they need to manage demand. Customers, uncertain about what will be available or for how long, default to panic behavior — buying more than they need, arriving earlier than usual, staying longer than is useful.',
        'The cold chain failure compounds this. Perishables become unsellable within hours. A store that enters a crisis event with a full inventory quickly has less usable product than it appears to have. The visible abundance is a liability, not an asset.',
        'The human behavior dimension is the one most easily overlooked in system design. People behave predictably under scarcity — they hoard, they queue, they compete. A store without predefined allocation rules has no mechanism to counter this. "First come, first served" is not a distribution strategy. It is the absence of one.',
      ],
      pullQuote: {
        text: 'Resilience is not improvisation. It is pre-defined operations that stay legible when infrastructure becomes unstable.',
      },
    },
    {
      label: '03 · Define',
      headline: 'Three things that had to be true at once.',
      paragraphs: [
        'The design requirements were unusually constrained. The concept had to work in three simultaneously difficult conditions: limited energy, high and unpredictable demand, and a staff that would be under significant stress. Any solution that required extensive training, complex technology, or additional infrastructure to activate was not a solution — it was a dependency.',
        'Three non-negotiables shaped every subsequent decision. First: fair distribution must be explainable. Allocation rules need to be simple enough that a customer can understand them before they enter the store. If the rules require interpretation, they will be contested. Contested rules, under stress, create conflict.',
        'Second: the system must work without full digital infrastructure. QR codes work without internet. NFC tokens work without a network connection. Paper fallbacks must exist for everything digital.',
        'Third: the concept must be compatible with existing logistics standards. A solution that requires custom packaging, new supplier relationships, or rebuilt distribution infrastructure is not deployable at scale. The re:box had to fit into what already existed.',
      ],
      callout: {
        title: 'Infrastructure branding.',
        body: 'The visual system for re:markt is not designed for marketing — it is designed for orientation and trust. Signage, zoning, and communication in crisis mode must function like public infrastructure: legible at a distance, interpretable under stress, authoritative without being aggressive.',
      },
    },
    {
      label: '04 · Concept',
      headline: 'A store that operates in two modes.',
      paragraphs: [
        'The core idea is a prepared switch. re:markt is designed as a normal supermarket that contains, within its existing footprint, a fully operational crisis distribution system. Activating crisis mode does not require external resources or emergency decisions. It requires executing a plan that was already made.',
        'In normal mode, the store functions like any supermarket: open shelving, free movement, standard checkout. The floor plan is optimized for browsing and purchase.',
        'In crisis mode, the transformation is physical and operational simultaneously. The sales floor reconfigures: community and waiting areas expand at the perimeter, the sales floor shrinks toward the center, and storage space expands to accommodate incoming re:boxes. Communication shifts from promotional to operational — signage switches from advertising to orientation, providing clear information about what is available, in what quantities, and how it will be distributed.',
        'The transition is not an emergency response. It is a mode change — like a building switching between normal and fire evacuation protocols. Except this one can sustain for days, not minutes.',
      ],
      beforeImage: {
        src: '/images/remarkt/ch04-floorplan.jpg',
        alt: 'Normal → Crisis mode floor plan — community expands, sales floor shrinks, storage grows',
        aspectRatio: '16/9',
        fullWidth: true,
      },
    },
    {
      label: '05 · System',
      headline: 'Three mechanisms that make it enforceable.',
      paragraphs: [
        'A good concept is not enough. The system has to be operable by real staff, under real stress, without specialized equipment. Three mechanisms form the operational core of re:markt.',
        'The re:box is a standardized unit that stays consistent from producer to household. The box dimensions, weight, and contents are fixed — producer packs it, warehouse stores it, store receives it, customer takes it home. By keeping the unit stable across every handoff, the system removes the failure points that typically appear when packaging changes between stages. Staff can count boxes without opening them. Customers receive a predictable quantity.',
        'Token-based issuance replaces "first come, first served." Each household receives a QR or NFC token and a time window for pickup. This converts the store from a place where speed determines access to a place where everyone with a token has guaranteed access during their window. Queue dynamics collapse — there is no advantage to arriving early. Staff can control throughput predictably.',
        'Store zoning divides the space into four operational zones — entry, waiting, handoff, and exit — with controlled transitions between them. This protects staff by separating them from the full crowd pressure, allows throughput to be measured and managed, and prevents the compression that leads to conflict. Zoning is marked physically with tape and signage that can be deployed in under thirty minutes.',
      ],
      beforeImage: {
        src: '/images/remarkt/ch05-flow.jpg',
        alt: 'End-to-end distribution flow — Farmer → Warehouse → re:markt → five channels → Customer',
        aspectRatio: '21/9',
        layout: 'wide',
      },
    },
    {
      label: '06 · Deliver',
      headline: 'Five ways to reach a household.',
      paragraphs: [
        'A single store cannot serve an entire neighborhood under crisis conditions. re:markt is not a point of distribution — it is the anchor of a multi-channel distribution network that uses existing infrastructure wherever possible.',
        're:markt Hub is the central operational unit: a store that functions as normal retail while coordinating distribution across the other channels. It receives re:boxes, manages inventory, and dispatches to the satellite channels. Click & Collect allows households to pre-order re:boxes and pick them up directly at the store during a specific time window, bypassing the full in-store experience.',
        'Delivery routes re:boxes via mobile vehicles directly to households. Priority goes to residents with limited mobility, elderly individuals, and families with small children — the populations least equipped to navigate a busy store in a crisis. Pop-Up distribution deploys a vehicle-based station to serve neighborhoods without a re:markt hub nearby.',
        'DHL Station integration uses existing Packstation infrastructure — Germany\'s network of automated parcel pickup points — to distribute re:boxes without additional staffing or new physical infrastructure. A household can pick up a re:box the same way they pick up any parcel.',
        'The five channels are designed to be activated selectively, not simultaneously. A localized power outage might only require Hub + Click & Collect. A regional infrastructure failure would activate all five.',
      ],
      beforeImage: {
        src: '/images/remarkt/ch06-channels.jpg',
        alt: 'Five distribution channels — Hub, Click & Collect, Delivery, Pop-Up, DHL Station',
        aspectRatio: '3/2',
        fullWidth: true,
      },
    },
    {
      label: '07 · Impact',
      headline: 'What the numbers say.',
      paragraphs: [
        'The expected impact is predictability.',
      ],
      impactStats: [
        { number: 'Up to 80%', description: 'energy demand reduction in crisis mode' },
        { number: '4,000→800', description: 'kWh stepped down while staying operational' },
        { number: '5', description: 'distribution channels designed and specified' },
        { number: '89%', description: 'of households currently have no alternative to supermarkets' },
      ],
      impactText: [
        'Clear allocation rules reduce conflict. Energy prioritization keeps critical systems running. Standardized logistics removes dependency on fragile handoffs that break when packaging or process changes between stages.',
        'The behavioral effect matters as much as the operational one. When people understand what they can get, in what quantity, and when — panic behavior shifts to planning behavior. This stabilizes crowds, reduces pressure on staff, and maintains trust in the supply system at exactly the moment when trust is most at risk.',
      ],
    },
    {
      label: '08 · Reflection',
      headline: 'What this changed for me.',
      paragraphs: [
        'I came into this project expecting to design an interface. I left it having designed a governance system.',
        'The insight that landed hardest: in a crisis, the interface is not the screen. It is the rules. UX in this context means operational governance — how decisions are made, by whom, under what authority, and with what fallback. The most important design work we did was not visual. It was the logic behind the token system, the zoning protocol, the re:box specification. Getting those right meant that the visual layer had something real to communicate.',
        'The AI-generated concept film was a secondary lesson. We used generative tools to compress complex system logic into a narrative that worked for a public exhibition context. That required understanding the story well enough to author it deliberately — the tool did not find the narrative, it executed one we had already built.',
      ],
      keyTakeaway: {
        title: 'Rule clarity is UX.',
        body: 'In crises, the interface isn\'t the screen. It\'s the rules behind it. re:markt reframed UX as operational governance: clear modes, minimal constraints, communication that holds under stress.',
      },
    },
  ],
}

export const caseStudyContent: Record<string, CaseStudyContent> = {
  odo,
  maya,
  remarkt,
}
