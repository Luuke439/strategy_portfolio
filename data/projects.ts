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
  year: string
  tags?: string[]
  label: string
  accentColor: string
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
    team: 'Luke Caporelli, Luca M. Ziegler, Félix',
    tools: 'Figma · Next.js · OpenRouteService · Shademap API',
    scope: 'B.A. Thesis · HfG Schwäbisch Gmünd · 2025',
    challenge:
      "Cyclists don't want the fastest route — they want the right one. Existing tools treat preference as a filter on top of distance optimization. The result is routes that look similar and feel generic.",
    strategy:
      'Designed a preference-to-route translation system: rider intent (scenery, surface, wind, shade, safety) is converted into weighted API constraints, producing genuinely different loop routes — not the same route with slight variations. Two flows: Quick Start and Custom Ride. Validated against 100+ real cyclists before a single screen was designed.',
    results:
      'A functional vertical slice prototype using live routing, surface, and environmental APIs — proving the system works with real data, not synthetic inputs.',
    keyInsight:
      "Riders don't want automation. They want control they can trust. The interface has to show its reasoning, or it loses the rider.",
    impactStats: [
      { label: 'Cyclists surveyed', number: '100+', description: 'Before designing a single screen' },
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
      "95% of German supermarkets shut down within 4 hours of a power outage. There's no standardized crisis mode — no defined distribution logic, no allocation rules, no plan for when normal operations collapse. The result is improvisation under pressure, which means chaos.",
    strategy:
      'Designed a dual-mode operating system built into the store from the start. Normal mode: standard retail. Crisis mode: floor converts to storage and distribution, a token-based issuance system replaces queuing, and a standardized re:box unit travels unchanged from producer to household across 5 distribution channels.',
    results:
      'Selected for HfG exhibition. Invited to present at the Baden-Württemberg Ministry of Food, Rural Affairs and Consumer Protection — a direct policy context.',
    keyInsight:
      "In a crisis, the interface isn't the screen. It's the rules. UX here means operational governance — clear modes, enforceable logic, communication that holds under stress.",
    impactStats: [
      { label: 'Energy demand reduction', number: '80%', description: 'In crisis mode vs. normal operation' },
      { label: 'kWh reduction', number: '4,000→800', description: 'Per day in crisis mode' },
      { label: 'Distribution channels', number: '5', description: 'Designed end to end' },
      { label: 'Ministry presentation', number: '1', description: 'Baden-Württemberg policy context' },
    ],
  },
  {
    slug: 'maya',
    name: 'maya',
    shortName: 'maya',
    type: 'case-study',
    coverVideo: 'cover.mov',
    coverVideoStart: 0,
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
      "Emojis translate emotion into symbols. This translates emotion into behavior. Shake your phone to send anger — the bubble distorts on impact. Hold the screen together with someone for romance — your fingerprints merge into a shared mark. Photograph something real for joy — it becomes a collectible sticker you gift. Tilt a bubble to signal sarcasm. No new interface. Just the physics of how you hold your phone, put to work.",
    impactStats: [],
  },
  {
    slug: 'spotify-dashboard',
    name: 'Spotify Dashboard',
    shortName: 'Spotify Dashboard',
    type: 'lab',
    year: '2023',
    tags: ['Data Visualization', 'Information Design'],
    label: 'Data Visualization',
    accentColor: '#2B6CB0',
    category: 'Lab',
    gridArea: 'spotify',
    size: 'small',
    problemStatement: 'A century of music, made legible.',
    headline: 'A century of music, made legible.',
    team: 'Luke Caporelli, Selamawit Gegziabher',
    tools: 'Figma',
    scope: 'Data Visualization · HfG Schwäbisch Gmünd · 2023',
    description:
      "Real Spotify data mapped across time — speechiness, positivity, instrumentalness, and acousticness from 1925 to 2021. Subscriber growth, global artist distribution, revenue, and workforce composition. Built to reveal patterns that feel obvious in hindsight and weren't visible before.",
    impactStats: [],
  },
  {
    slug: 'packyourride',
    name: 'packyourride',
    shortName: 'packyourride',
    type: 'external',
    externalUrl: 'https://packyourride.de',
    coverVideo: 'cover.mp4',
    coverVideoStart: 3,
    year: '2024',
    tags: ['Live Product', 'E-Commerce', 'Solo Built'],
    label: 'Live Product',
    accentColor: '#B45309',
    category: 'External',
    gridArea: 'packyourride',
    size: 'small',
    problemStatement: 'The packing list for every ride.',
    team: 'Luke Caporelli',
    tools: 'Next.js',
    scope: 'Live product · 2024',
    impactStats: [],
  },
  {
    slug: 'blend-it',
    name: 'blend it!',
    shortName: 'blend it!',
    type: 'lab',
    year: '2023',
    tags: ['Hardware', 'IoT', 'Prototyping'],
    label: 'Physical + Digital',
    accentColor: '#5A1A4F',
    category: 'Lab',
    gridArea: 'blend',
    size: 'small',
    problemStatement: 'A cocktail machine that actually works.',
    headline: 'A cocktail machine that actually works.',
    team: 'Luke Caporelli, Anton Pelezki, Tim Niedermeier',
    tools: 'ESP32 · MQTT · Next.js · AI (3D visualization)',
    scope: 'Physical + Digital · HfG Schwäbisch Gmünd · 2023',
    description:
      'ESP32 microcontroller driving 8 relay-controlled pumps, communicating via MQTT with a Next.js application. Select a recipe, trigger dispensing, get a drink. The 3D render of the machine was generated with AI — designed and visualized entirely without a 3D artist. Fully functional prototype built from scratch with two collaborators.',
    impactStats: [],
  },
  {
    slug: 'brand-communication',
    name: 'Brand Communication Project',
    shortName: 'Brand Comm. Project',
    type: 'placeholder',
    year: '2026',
    tags: [],
    label: 'Coming Soon',
    accentColor: '#8B7355',
    category: '',
    gridArea: 'placeholder',
    size: 'medium',
    team: '',
    tools: '',
    problemStatement: '',
    impactStats: [],
  },
]

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug)

export const caseStudies = projects.filter((p) => p.type === 'case-study')
export const labProjects = projects.filter((p) => p.type === 'lab')
