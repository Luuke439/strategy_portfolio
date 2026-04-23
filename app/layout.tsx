import type { Metadata } from 'next'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'
import PersistentHeader from '@/components/PersistentHeader'
import PageTransition from '@/components/PageTransition'
import { HoverInfoProvider } from '@/components/HoverInfoContext'

export const metadata: Metadata = {
  title: 'Luke Caporelli — Strategic Design',
  description:
    'M.A. Strategic Design student at HfG Schwäbisch Gmünd. Product strategy and interaction design.',
  openGraph: {
    title: 'Luke Caporelli',
    description: 'Strategic Design · Product Strategy · Interaction Design',
    type: 'website',
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
            {/* Persistent across all routes — never remounts on navigation */}
            <PersistentHeader />
            <PageTransition>{children}</PageTransition>
          </HoverInfoProvider>
        </LenisProvider>
      </body>
    </html>
  )
}
