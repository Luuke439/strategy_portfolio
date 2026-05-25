import type { Metadata, Viewport } from 'next'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'
import PersistentHeader from '@/components/PersistentHeader'
import PageTransition from '@/components/PageTransition'
import { HoverInfoProvider } from '@/components/HoverInfoContext'
import { ChapterProvider } from '@/components/ChapterContext'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SITE_URL, AUTHOR, DESCRIPTION, SOCIAL } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Luke Caporelli — Strategic Design',
    template: '%s — Luke Caporelli',
  },
  description: DESCRIPTION,
  applicationName: 'Luke Caporelli',
  authors: [{ name: AUTHOR.name, url: SITE_URL }],
  creator: AUTHOR.name,
  publisher: AUTHOR.name,
  keywords: [
    'Strategic Design',
    'Product Strategy',
    'Interaction Design',
    'UX',
    'HMI',
    'HfG Schwäbisch Gmünd',
    'Luke Caporelli',
  ],
  alternates: { canonical: '/' },
  // app/icon.svg is the file-convention favicon. Specifying any key in
  // metadata.icons (e.g. just `apple`) OVERRIDES the auto-discovery for
  // the browser-tab <link rel="icon">, so we re-declare `icon` here to
  // keep both tags present.
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Luke Caporelli — Strategic Design',
    description: DESCRIPTION,
    type: 'website',
    url: SITE_URL,
    siteName: 'Luke Caporelli',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luke Caporelli — Strategic Design',
    description: DESCRIPTION,
    creator: '@lukecaporelli',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Allow user zoom — pinch-to-zoom is an a11y requirement.
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
  colorScheme: 'light',
}

// JSON-LD: Person + WebSite. Inlined as a stringified script so it ships
// with the initial HTML (crawlers don't run JS to discover schema).
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: AUTHOR.name,
  givenName: AUTHOR.givenName,
  familyName: AUTHOR.familyName,
  jobTitle: AUTHOR.jobTitle,
  email: AUTHOR.email,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  nationality: AUTHOR.nationality,
  address: { '@type': 'PostalAddress', addressCountry: 'DE' },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'HfG Schwäbisch Gmünd',
    url: 'https://www.hfg-gmuend.de/',
  },
  sameAs: [SOCIAL.linkedin, SOCIAL.gravelwerk, SOCIAL.resaga],
} as const

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Luke Caporelli',
  description: DESCRIPTION,
  inLanguage: 'en',
  publisher: { '@id': `${SITE_URL}/#person` },
} as const

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload the three most-used font weights to eliminate FOUT */}
        <link rel="preload" href="/fonts/TWKLausannePan 2/Web/TWKLausannePan-300.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/TWKLausannePan 2/Web/TWKLausannePan-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/TWKLausannePan 2/Web/TWKLausannePan-500.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Preload the HDRI used as the chrome reflection so the 3D hero is lit on first frame */}
        <link rel="preload" href="/day.jpg" as="image" fetchPriority="high" />
        {/* Preload the 3D font used by the hero text */}
        <link rel="preload" href="/fonts/Fredoka Expanded_Bold.json" as="fetch" crossOrigin="anonymous" />
        {/* Structured data — Person + WebSite. Crawlers (Google, Bing, LLMs)
            parse this without running JS, so it ships in the initial HTML. */}
        <script
          type="application/ld+json"
          // JSON.stringify is XSS-safe for our hand-authored constants here.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <LenisProvider>
          <HoverInfoProvider>
            <ChapterProvider>
              {/* Persistent across all routes — never remounts on navigation */}
              <PersistentHeader />
              <PageTransition>{children}</PageTransition>
            </ChapterProvider>
          </HoverInfoProvider>
        </LenisProvider>
        {/* Vercel Analytics — cookieless, GDPR-safe pageview counts.
            Speed Insights — Core Web Vitals (LCP / INP / CLS) reported via
            the same /_vercel/insights endpoint already in our connect-src. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
