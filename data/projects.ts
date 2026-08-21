export type ProjectType = 'case-study' | 'lab' | 'external' | 'placeholder'

export interface ImpactStat {
  label: string
  number: string
  description: string
}

export interface Project {
  slug: string
  name: string
  shortName: string
  type: ProjectType
  externalUrl?: string
  coverVideo?: string
  coverVideoStart?: number
  coverPosition?: string
  coverFit?: 'cover' | 'contain'
  /** Optional aspect-ratio override for the mobile project grid card.
   *  Defaults to '5 / 4' (landscape, matching the desktop card aspect).
   *  Set to a portrait value like '4 / 5' for projects whose cover
   *  content was framed vertically. */
  mobileAspect?: string
  year: string
  tags?: string[]
  label: string
  accentColor: string
  /** placeholder tiles only: CSS gradient painted as the tile fill + ring.
   *  Falls back to a neutral tone when unset. */
  gradient?: string
  /** placeholder tiles only: kicker text shown instead of "Coming Soon"
   *  (e.g. "Currently under NDA"). */
  statusNote?: string
  category: string
  problemStatement: string
  headline?: string
  role?: string
  team: string
  tools: string
  scope?: string
  challenge?: string
  strategy?: string
  results?: string
  description?: string
  keyInsight?: string
  impactStats: ImpactStat[]
  gridArea: string
  size: 'large' | 'medium' | 'small'
}

export const projects: Project[] = [
  {
    slug: 'odo',
    name: 'odo',
    shortName: 'odo',
    type: 'case-study',
    coverPosition: '50% 30%',
    year: '2025',
    tags: ['Routing Systems', 'Personalization', '0→1'],
    label: 'B.A. Thesis',
    accentColor: '#088559',
    category: 'Case Study',
    gridArea: 'odo',
    size: 'large',
    problemStatement:
      "Every route planner gives you a path. None of them know what kind of ride you're in the mood for.",
    role: 'Product design · Research · Prototype engineering',
    team: 'Luke Caporelli, Luca M. Ziegler Félix',
    tools: 'Figma · Next.js · OpenRouteService · Shademap API',
    scope: 'B.A. Thesis · HfG Schwäbisch Gmünd · 2025',
    challenge:
      "Cyclists don't want the fastest route, they want the right one. Existing tools treat preference as a filter on top of distance optimization. The result is routes that look similar and feel generic.",
    strategy:
      'Designed an intent-to-route translation system: rider intent (scenery, surface, wind, shade, safety) is converted into weighted API constraints, producing genuinely different loop routes instead of one route with slight variations. Two flows: Quick Start and Custom Ride. Grounded in research with 116 cyclists before a single screen was designed.',
    results:
      'A functional vertical slice prototype using live routing, surface, and environmental APIs, proving the system works with real data, not synthetic inputs.',
    keyInsight:
      "Riders don't want automation. They want control they can trust. The interface has to show its reasoning, or it loses the rider.",
    impactStats: [
      { label: 'Cyclists surveyed', number: '116', description: 'Before designing a single screen' },
      { label: 'In-depth interviews', number: '9', description: 'Deep qualitative research' },
      { label: 'Live API integrations', number: '3', description: 'Routing, surface, and environmental' },
      { label: 'Route profiles', number: '4', description: 'Genuinely differentiated ride types' },
    ],
  },
  {
    slug: 'remarkt',
    name: 're:markt',
    shortName: 're:markt',
    type: 'case-study',
    coverVideo: 'cover.mp4',
    coverVideoStart: 7,
    coverPosition: '38% center',
    year: '2025',
    tags: ['Crisis Infrastructure', 'Service Design', 'Systems Thinking'],
    label: 'Ministry Presentation',
    accentColor: '#00363A',
    category: 'Case Study',
    gridArea: 'remarkt',
    size: 'large',
    problemStatement: 'Designing a supermarket that stays operational when the power goes out.',
    role: 'Concept · Systems design · Research · Visual communication',
    team: 'Luke Caporelli, Peter Schneider, Finn Sommerhoff, Annika Weber',
    tools: 'Figma · Runway · Generative AI (concept film)',
    scope: 'HfG Schwäbisch Gmünd · Presented at Baden-Württemberg Ministry · 2025',
    challenge:
      "95% of German supermarkets shut down within 4 hours of a power outage. There's no standardized crisis mode: no defined distribution logic, no allocation rules, no plan for when normal operations collapse. The result is improvisation under pressure, which means chaos.",
    strategy:
      'Designed a dual-mode operating system built into the store from the start. Normal mode: standard retail. Crisis mode: floor converts to storage and distribution, a token-based issuance system replaces queuing, and a standardized re:box unit travels unchanged from producer to household across 5 distribution channels.',
    results:
      'Selected for the HfG exhibition. Invited to present at the Baden-Württemberg Ministry of Food, Rural Affairs and Consumer Protection, a direct policy context.',
    keyInsight:
      "In a crisis, the interface isn't the screen. It's the rules. UX here means operational governance: clear modes, enforceable logic, communication that holds under stress.",
    impactStats: [
      { label: 'Energy demand reduction', number: '80%', description: 'In crisis mode vs. normal operation' },
      { label: 'kWh reduction', number: '4,000→800', description: 'Per day in crisis mode' },
      { label: 'Distribution channels', number: '5', description: 'Designed end to end' },
      { label: 'Ministry presentation', number: '1', description: 'Baden-Württemberg policy context' },
    ],
  },
  {
    slug: 'staedtler',
    name: 'Embrace Ambivalence',
    shortName: 'Embrace Ambivalence',
    type: 'case-study',
    // Grid tile is a still frame grabbed from hero.mp4 (~77.8s, the centred
    // Staedtler device product shot) into public/images/staedtler/cover.jpg —
    // no hover playback, just the image.
    year: '2026',
    tags: ['Brand Strategy', 'Futuring'],
    label: 'Partner: Staedtler',
    accentColor: '#1B4B91',
    category: 'Case Study',
    gridArea: 'staedtler',
    size: 'medium',
    problemStatement:
      'Fast or slow. Digital or analog. Usually a brand has to pick one.',
    role: 'Brand strategy · Futures research · Product concept · Systems design',
    team: 'Luke Caporelli, Lukas Predan, Peter Schneider',
    tools: 'Figma · Generative AI (concept visualization)',
    scope: 'M.A. Strategic Design · HfG Schwäbisch Gmünd · Partner: Staedtler · 2026',
    challenge:
      "Staedtler's core business is shrinking as pen and paper lose ground to tablets, apps, and AI, while its own digital push, Noris Digital, never found its footing. Price pressure from cheap Asian manufacturers squeezes every category at once. The brand cannot say clearly what it stands for, and its heritage reads as traditional rather than contemporary: a strong profile that never leaves school and office.",
    strategy:
      'Reframed the crisis as a question of range, not survival: how does Staedtler protect its analog identity while still opening the markets of tomorrow. A synthesis of global futures reports pointed to one throughline: AI absorbs routine work, the world fractures into isolated blocks, and in parallel a hunger grows for things that are real and made by hand. The brand core is creativity itself, expressed in two opposite registers: goal-driven Fast Lane creativity and process-driven Slow Lane creativity. Both are genuinely Staedtler.',
    results:
      'A dual product concept framed as a fictional Staedtler campaign launching in 2042: Mars Note, a Fast Lane device that turns a sticky note wall into a live, shared workspace, and Mars Mind, a Slow Lane device built to hold sketching, journaling, and meditation with nothing else competing for attention. A three horizon roadmap carries both lanes from a 2026 portfolio reset to a 2042 global launch.',
    keyInsight:
      "Authenticity is becoming the hardest currency a brand can hold. People are no longer buying a pen, they're buying a reason to choose this exact one, and creativity is the one part of Staedtler that survives into every version of the future.",
    impactStats: [
      { label: 'Futures reports synthesized', number: '8', description: 'McKinsey, WEF, WHO, Deloitte, Atlantic Council and others' },
      { label: 'Product lanes', number: '2', description: 'Fast Lane and Slow Lane, one shared brand core' },
      { label: 'Roadmap horizons', number: '3', description: 'From portfolio reset to global two lane brand' },
      { label: 'Campaign framing', number: '2042', description: 'Fictional launch year for Mars Note and Mars Mind' },
    ],
  },
  {
    slug: 'maya',
    name: 'maya',
    shortName: 'maya',
    type: 'case-study',
    coverVideo: 'cover.mp4',
    coverVideoStart: 0,
    // Cover video is framed vertically (phone in portrait centred against
    // a dark backdrop). The default 5/4 landscape mobile card showed too
    // much bezel — switch to portrait so the phone screen reads at size.
    mobileAspect: '4 / 5',
    year: '2025',
    tags: ['AI Integration', 'Enterprise', 'Language & Inclusion'],
    label: 'Partner: Stiftung Liebenau',
    accentColor: '#EB684E',
    category: 'Case Study',
    gridArea: 'maya',
    size: 'medium',
    problemStatement:
      "The language gap in German care facilities doesn't start on the ward. It starts at home, months before the first shift.",
    role: 'Concept · Research · Systems design · Interaction prototyping',
    team: 'Luke Caporelli, Jan Lonardoni, Lukas Predan, Danlei Fu, Peter Schneider',
    tools: 'Figma · Claude Code',
    scope: 'Partner: Stiftung Liebenau · HfG Schwäbisch Gmünd · 2025',
    challenge:
      "Germany will be short 350,000 nursing staff by 2034. The gap is partly filled by international trainees who arrive with language certificates but struggle with everyday phrasing, workplace small talk, and shared living — creating silent friction that compounds until someone drops out. Each dropout costs €6,826 directly.",
    strategy:
      "The language problem is upstream of everything else. Fix it there. maya pairs international trainees with German-speaking housemates (matched by language level), and deploys a single AI assistant that starts in the trainee's native language and shifts toward German as confidence grows — passive exposure becoming active practice without forcing it.",
    results:
      'Three linked prototypes: onboarding assistant, adaptive everyday assistant, shared-living group matching flow. Operational constraints (privacy, cultural tone, care context) shaped every interaction decision.',
    keyInsight:
      'Language is the upstream lever. Solve it in daily life first and you unlock onboarding, retention, and trust simultaneously.',
    impactStats: [
      { label: 'Cost per dropout', number: '€6,826', description: 'Direct cost of each trainee who leaves' },
      { label: 'Nursing staff shortage', number: '350K', description: 'Projected shortage by 2034' },
      { label: 'Expected savings', number: '€131', description: 'Per trainee/month' },
      { label: 'Staff time saved', number: '3.75h', description: 'Per trainee/month' },
    ],
  },
  {
    slug: 'expressive-messaging',
    name: 'Expressive Messaging',
    shortName: 'expressive msg.',
    type: 'lab',
    coverVideo: 'cover.mp4',
    coverPosition: '53% center',
    year: '2025',
    tags: ['Interaction Design', 'Motion', 'Speculative'],
    label: 'Interaction Study',
    accentColor: '#3D2F5C',
    category: 'Lab',
    gridArea: 'expressive',
    size: 'medium',
    problemStatement: 'What if sending a message felt like something?',
    headline: 'What if sending a message felt like something?',
    team: 'Luke Caporelli, Jannes Daur, Leon Burg',
    tools: 'Figma · Protopie',
    scope: 'Interaction Study · HfG Schwäbisch Gmünd · 2025',
    description:
      "Emojis translate emotion into symbols. This study translates it into behavior. Shake your phone to send anger: the bubble distorts on impact. Hold the screen together with someone for romance: your fingerprints merge into a shared mark. Photograph something real for joy: it becomes a collectible sticker you gift. Tilt a bubble to signal sarcasm. No new interface. Just the physics of how you hold your phone, put to work.",
    impactStats: [],
  },
  {
    // Master thesis — shown as a non-clickable placeholder tile while the
    // work is under NDA. No project page, no case content. The gradient +
    // statusNote drive the tile's look (see ProjectCard placeholder branch).
    slug: 'thesis',
    name: 'Master Thesis',
    shortName: 'Master Thesis',
    type: 'placeholder',
    year: '2026',
    tags: ['NDA'],
    label: 'M.A. Thesis',
    accentColor: '#B9A5CA',
    gradient:
      'linear-gradient(90deg, hsla(211, 66%, 87%, 1) 0%, hsla(348, 67%, 88%, 1) 50%, hsla(272, 26%, 72%, 1) 100%)',
    statusNote: 'Still in progress',
    category: 'Case Study',
    gridArea: 'thesis',
    size: 'small',
    problemStatement: 'Drone-captured roof inspection, read and classified by AI.',
    team: 'Luke Caporelli',
    tools: '',
    impactStats: [],
  },
  {
    // Live GPX-enrichment product. Replaces gravelwerk as the external/live
    // entry. Cover assets go under /images/tourewerk/ + /videos/tourewerk/.
    slug: 'tourewerk',
    name: 'Tourewerk',
    shortName: 'Tourewerk',
    type: 'external',
    externalUrl: 'https://tourewerk.gravelwerk.de/planen',
    // Cover = enriched-route satellite screenshot, left-aligned crop.
    coverPosition: 'left center',
    year: '2026',
    tags: ['Live Product', 'GPX', 'Solo Built'],
    label: 'Live Product',
    accentColor: '#B45309',
    category: 'External',
    gridArea: 'tourewerk',
    size: 'small',
    problemStatement: 'A bare GPX track, enriched into a ride you can plan around.',
    team: 'Luke Caporelli',
    tools: 'Next.js',
    scope: 'Live product · 2026',
    impactStats: [],
  },
  {
    // Vera (formerly Codewehr) — case glimpse rendered by LabPage. Slightly
    // fuller description than a standard lab so the concept reads properly.
    slug: 'vera',
    name: 'Vera',
    shortName: 'Vera',
    type: 'lab',
    // Tile cover is left-aligned so the crop keeps the left of the frame.
    coverPosition: 'left center',
    // Tile plays the cockpit video on hover; the still poster
    // (/images/vera/cover.jpg) is grabbed from the same frame the video
    // seeks to (t=3s), so the fade-in has no visible jump.
    coverVideo: 'cover.mp4',
    coverVideoStart: 3,
    year: '2026',
    tags: ['Civil Protection', 'Verification', 'AI Cockpit'],
    label: 'Hackathon Winner · In Build',
    accentColor: '#B23A48',
    category: 'Glimpse',
    gridArea: 'vera',
    size: 'medium',
    problemStatement: 'A verification cockpit for disaster response.',
    headline: "We didn't ask what AI can do. We asked where the human stays irreplaceable.",
    team: 'Luke Caporelli, Lukas Predan, Habiba Khalil, Ahmed Harb, Abdullah Dinc',
    tools: 'Fully Functional · Backend · AI Integration',
    scope: 'CodeTheState Hackathon · 1st place · Heilbronn · 2026',
    description:
      'Vera, short for Verified Real-Time Risk Assessment, is a decision cockpit for crisis management. It pulls live signals from social media, weather services, water levels, and fire data, then clusters them into single coherent events instead of a raw, noisy feed. Every eyewitness report is cross-checked against official DWD weather-service data and given a transparent credibility score, so an operator sees not only what is being claimed but how far to trust it. The build held three hard constraints: a zero-training interface, full traceability of every signal, and a human in the loop on every call. The principle underneath is simple. AI prepares, the human decides, crisis management acts, because responsibility cannot be automated away. Built as a working prototype in two days, Vera won first place at the CodeTheState hackathon against 40 builders across four public-sector use cases, developed with Komm.ONE, Public Makers, and the IPAI Foundation in Heilbronn. It is now being taken into real implementation with a dedicated team.',
    impactStats: [],
  },
]

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug)

export const caseStudies = projects.filter((p) => p.type === 'case-study')
export const labProjects = projects.filter((p) => p.type === 'lab')
