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
  // Lazy init: read window.innerHeight directly on first client render so we
  // never have to setState inside an effect just to seed the value. 800 is
  // the SSR fallback — overwritten on the first paint when the resize effect
  // (below) syncs in.
  const [vh, setVh] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800,
  )

  // Keep vh in sync with the viewport when the user resizes/rotates.
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Tracks whether the user has scrolled past the threshold ON HOME. Lazy
  // init reads the current scroll position once on first render — so when
  // someone lands on the page mid-scroll (e.g. via a hash anchor or scroll
  // restoration), the nav is correctly shown without needing a setState in
  // useEffect.
  const [scrolledPastThreshold, setScrolledPastThreshold] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.scrollY > window.innerHeight * 0.8
  })

  // Once shown, the nav stays shown for the rest of the session. Off-home
  // routes always show the nav; on home, visibility is gated on the scroll
  // threshold. Both conditions resolve at render time — no effect needed.
  const navVisible = !isHome || scrolledPastThreshold

  // Home-page pill opacity animates with scroll; off-home is a flat 1.
  const homeOpacity = useTransform(scrollY, [vh * 0.8, vh], [0, 1])

  useMotionValueEvent(scrollY, 'change', (v) => {
    if (!isHome) return
    if (!scrolledPastThreshold && v > vh * 0.8) setScrolledPastThreshold(true)
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
          {/* Invisible name target — the 3D text renders on top via canvas z:110.
              Pointer events mirror navVisible so the pill is not clickable
              while it is faded out above the hero. */}
          <Link
            href="/"
            id="nav-name-span"
            onClick={handleNameClick}
            tabIndex={navVisible ? 0 : -1}
            aria-hidden={!navVisible}
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
              pointerEvents:  navVisible ? 'auto' : 'none',
              textDecoration: 'none',
              color:          '#0A0A0A',
            }}
          >
            Luke Caporelli
          </Link>

          <div style={{ width: '1px', height: '14px', background: 'rgba(0,0,0,0.10)', flexShrink: 0 }} />

          <div
            aria-hidden={!navVisible}
            style={{ pointerEvents: navVisible ? 'auto' : 'none' }}
          >
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
