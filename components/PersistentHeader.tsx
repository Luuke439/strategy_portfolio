'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { useLenis } from 'lenis/react'
import GlassNav from './GlassNav'
import { useHoverInfo } from './HoverInfoContext'

// Hero3D is WebGL — client only, no SSR. Lives in the persistent shell so the
// <Canvas> and its PMREM env map are built once and reused across routes.
const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false })

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

const PILL: React.CSSProperties = {
  display:              'flex',
  alignItems:           'center',
  padding:              '0 0 0 24px',
  borderRadius:         '100px',
  background:           'linear-gradient(175deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.11) 100%)',
  backdropFilter:       'blur(26px) saturate(180%)',
  WebkitBackdropFilter: 'blur(26px) saturate(180%)',
  border:               '1px solid rgba(255,255,255,0.30)',
  boxShadow: [
    'inset 0 1.5px 0 rgba(255,255,255,0.70)',
    'inset 0 -1px 0 rgba(0,0,0,0.05)',
    '0 8px 32px rgba(0,0,0,0.09)',
    '0 2px 6px rgba(0,0,0,0.06)',
  ].join(', '),
}

export default function PersistentHeader() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const { hoverInfo } = useHoverInfo()
  const { scrollY } = useScroll()
  const lenis = useLenis()

  // Viewport height drives the "nav fades in during the last 20% of the hero
  // scroll" transition on home. Other routes bypass this logic entirely.
  const [vh, setVh] = useState(800)
  // Once the nav has been shown (either by scrolling on home or by visiting a
  // non-home route), it stays shown for the rest of the session. Route changes
  // never flip this back to hidden, so the nav never replays its entrance.
  const [navVisible, setNavVisible] = useState(false)

  useEffect(() => {
    setVh(window.innerHeight)
    if (!isHome) {
      setNavVisible(true)
      return
    }
    if (window.scrollY > window.innerHeight * 0.8) setNavVisible(true)
  }, [isHome])

  // Home-page pill opacity animates with scroll; off-home is a flat 1.
  const homeOpacity = useTransform(scrollY, [vh * 0.8, vh], [0, 1])

  useMotionValueEvent(scrollY, 'change', (v) => {
    if (!isHome) return
    if (!navVisible && v > vh * 0.8) setNavVisible(true)
  })

  // Clicking the name: on home we Lenis-scroll back to the hero; off-home the
  // <Link> navigates to /.
  const handleNameClick = (e: React.MouseEvent) => {
    if (!isHome) return
    e.preventDefault()
    if (lenis) lenis.scrollTo(0, { duration: 1.1 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <header
        style={{
          position:       'fixed',
          top:            0,
          left:           0,
          right:          0,
          zIndex:         100,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          padding:        '1.4rem 2rem',
          pointerEvents:  'none',
        }}
      >
        <motion.div style={{ ...PILL, opacity: isHome ? homeOpacity : 1 }}>
          {/* Invisible name target — the 3D text renders on top via canvas z:110 */}
          <Link
            href="/"
            id="nav-name-span"
            onClick={handleNameClick}
            style={{
              fontFamily:     FONT,
              fontWeight:     500,
              fontSize:       '0.95rem',
              whiteSpace:     'nowrap',
              opacity:        0,
              background:     'none',
              border:         'none',
              padding:        '10px 20px 10px 0',
              minWidth:       '330px',
              cursor:         'pointer',
              userSelect:     'none',
              pointerEvents:  'auto',
              textDecoration: 'none',
              color:          '#0A0A0A',
            }}
          >
            Luke Caporelli
          </Link>

          <div style={{ width: '1px', height: '14px', background: 'rgba(0,0,0,0.10)', flexShrink: 0 }} />

          <div style={{ pointerEvents: 'auto' }}>
            {/* `animated` only on home, so off-home nav flips snap instantly
                — no re-staggering of items when switching between routes. */}
            <GlassNav isVisible={navVisible} animated={isHome} />
          </div>
        </motion.div>
      </header>

      <Hero3D hoverInfo={hoverInfo} navOnly={!isHome} />
    </>
  )
}
