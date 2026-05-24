import type { Metadata } from 'next'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'
import PersistentHeader from '@/components/PersistentHeader'
import PageTransition from '@/components/PageTransition'
import { HoverInfoProvider } from '@/components/HoverInfoContext'
import { ChapterProvider } from '@/components/ChapterContext'

// Production URL — override via NEXT_PUBLIC_SITE_URL at deploy time. Used
// to resolve relative URLs in OpenGraph / Twitter card metadata (the auto-
// generated /opengraph-image needs an absolute URL for social crawlers).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lukecaporelli.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Luke Caporelli — Strategic Design',
  description:
    'M.A. Strategic Design student at HfG Schwäbisch Gmünd. Product strategy and interaction design.',
  // app/icon.svg is the file-convention favicon. Specifying any key in
  // metadata.icons (e.g. just `apple`) OVERRIDES the auto-discovery for
  // the browser-tab <link rel="icon">, so we re-declare `icon` here to
  // keep both tags present. Apple home-screen also uses the same SVG —
  // recent iOS Safari renders it, older iOS falls back to a screenshot.
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Luke Caporelli',
    description: 'Strategic Design · Product Strategy · Interaction Design',
    type: 'website',
    url: SITE_URL,
    siteName: 'Luke Caporelli',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luke Caporelli',
    description: 'Strategic Design · Product Strategy · Interaction Design',
  },
}

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
      </body>
    </html>
  )
}
