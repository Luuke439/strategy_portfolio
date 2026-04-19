'use client'

import { useState, useEffect, useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import ProjectGrid from '@/components/ProjectGrid'
import type { TileHoverInfo } from '@/components/ProjectCard'

// Hero3D is WebGL — client only, no SSR
const Hero3D = dynamic(() => import('@/components/Hero3D'), { ssr: false })

// Easing for snap animations — expo-out with fast initial velocity
const snapEase = (t: number) => 1 - Math.pow(2, -10 * t)

export default function Home() {
  const [hoverInfo, setHoverInfo] = useState<TileHoverInfo | null>(null)
  const [vh, setVh] = useState(800)
  const { scrollY } = useScroll()
  const mousePosRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => { setVh(window.innerHeight) }, [])

  // ── Snap-style navigation powered by Lenis ────────────────────────────────
  //
  //  Phases:
  //  'hero'      resting at y≈0
  //  'snap-down' Lenis animating to vh (locked — wheel events ignored)
  //  'tiles'     free scroll in tile section
  //  'parked'    sitting at y=vh, waiting for 2nd upward gesture
  //  'snap-up'   Lenis animating back to y=0 (locked)
  //
  //  WHEEL events → intent detection (hero→tiles, parked→hero)
  //  SCROLL events → position-based transitions (tiles↔parked)
  //  lock:true → prevents user from overriding the snap animation
  //  reset() inside Lenis automatically releases the lock on animation complete
  //  onComplete → phase transition after animation ends

  type Phase = 'hero' | 'snap-down' | 'tiles' | 'parked' | 'snap-up'
  const phaseRef    = useRef<Phase>('hero')
  const parkTimeRef = useRef(0)

  const lenis = useLenis()

  // ── Name-click home button ────────────────────────────────────────────────
  // Stored in a ref so the button always calls the version that closes over
  // the *current* lenis instance, not the one captured at first render.
  const snapToHeroRef = useRef<() => void>(() => {})

  useEffect(() => {
    if (!lenis) return

    // Initialise phase if page loads already scrolled
    if (window.scrollY >= window.innerHeight) phaseRef.current = 'tiles'

    // Keep the ref up-to-date every time lenis changes
    snapToHeroRef.current = () => {
      if (window.scrollY < 5) return                             // already at hero
      if (phaseRef.current === 'snap-down' ||
          phaseRef.current === 'snap-up') return                 // animation running
      phaseRef.current = 'snap-up'
      lenis.stop()
      const startY = window.scrollY
      const t0     = performance.now()
      const SNAP_UP_MS = 1100
      const frame = (now: number) => {
        const t = Math.min((now - t0) / SNAP_UP_MS, 1)
        document.documentElement.scrollTop = startY + (0 - startY) * snapEase(t)
        if (t < 1) requestAnimationFrame(frame)
        else { phaseRef.current = 'hero'; lenis.start() }
      }
      requestAnimationFrame(frame)
    }

    const onWheel = (e: WheelEvent) => {
      const vh = window.innerHeight

      if (phaseRef.current === 'hero' && e.deltaY > 0) {
        // ── Downward scroll from hero → direct-RAF snap to tiles ──────
        // Capture phase fires before Lenis. stop() is synchronous and
        // prevents Lenis from touching the scroll during the animation.
        // We drive scrollTop ourselves so there is zero Lenis overhead
        // or mid-flight animatedScroll resets that could cause jitter.
        phaseRef.current = 'snap-down'
        lenis.stop()
        const startY = window.scrollY
        const endY   = vh
        const t0     = performance.now()
        const SNAP_DOWN_MS = 900
        const frame = (now: number) => {
          const t = Math.min((now - t0) / SNAP_DOWN_MS, 1)
          document.documentElement.scrollTop = startY + (endY - startY) * snapEase(t)
          if (t < 1) requestAnimationFrame(frame)
          else { phaseRef.current = 'tiles'; lenis.start() }
        }
        requestAnimationFrame(frame)
      }

      if (phaseRef.current === 'parked' && e.deltaY < 0 && Date.now() - parkTimeRef.current > 300) {
        // ── 2nd upward gesture from parked → direct-RAF snap to hero ──
        phaseRef.current = 'snap-up'
        lenis.stop()
        const startY = window.scrollY
        const t0     = performance.now()
        const SNAP_UP_MS = 1100
        const frame = (now: number) => {
          const t = Math.min((now - t0) / SNAP_UP_MS, 1)
          document.documentElement.scrollTop = startY + (0 - startY) * snapEase(t)
          if (t < 1) requestAnimationFrame(frame)
          else { phaseRef.current = 'hero'; lenis.start() }
        }
        requestAnimationFrame(frame)
      }
    }

    const onScroll = () => {
      const y  = window.scrollY
      const vh = window.innerHeight

      if (phaseRef.current === 'tiles' && y < vh) {
        // ── Upward cross of section boundary → park immediately ────────
        phaseRef.current = 'parked'
        parkTimeRef.current = Date.now()
        lenis.scrollTo(vh, { immediate: true })

      } else if (phaseRef.current === 'parked' && y > vh + 40) {
        // ── Scrolled back down from parked → re-enter tiles ───────────
        phaseRef.current = 'tiles'
      }
    }

    // capture: true → fires before Lenis's bubble-phase wheel handler,
    // so stop() can prevent any movement before the snap animation begins.
    window.addEventListener('wheel',  onWheel,  { capture: true, passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel',  onWheel,  { capture: true })
      window.removeEventListener('scroll', onScroll)
    }
  }, [lenis])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Nav fades in as scroll handoff completes (last 20% of hero scroll)
  const navOpacity  = useTransform(scrollY, [vh * 0.8, vh], [0, 1])
  const arrowOpacity = useTransform(scrollY, [0, 80], [1, 0])

  return (
    <>
      {/* ── Permanent fixed header — always visible ───────────────────────── */}
      <header
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          right:           0,
          zIndex:          100,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          padding:         '1.4rem 2rem',
          backgroundColor: '#FAFAFA',
          pointerEvents:   'none',
        }}
      >
        {/* Invisible click target — 3D name renders on top via canvas z:110.
            Canvas has pointerEvents:none so clicks fall through to this button. */}
        <button
          id="nav-name-span"
          onClick={() => snapToHeroRef.current()}
          style={{
            fontFamily:    "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight:    500,
            fontSize:      '0.95rem',
            whiteSpace:    'nowrap',
            opacity:       0,
            background:    'none',
            border:        'none',
            padding:       0,
            cursor:        'pointer',
            userSelect:    'none',
            pointerEvents: 'auto',
          }}
        >
          Luke Caporelli
        </button>

        <motion.nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            opacity: navOpacity,
            pointerEvents: 'auto',
          }}
        >
          <Link href="/about" style={navLink}>About</Link>
          <a href="/Luke_Caporelli_CV.pdf" target="_blank" rel="noopener noreferrer" style={navLink}>CV</a>
          <a href="https://linkedin.com/in/lukecaporelli" target="_blank" rel="noopener noreferrer" style={navLink}>LinkedIn</a>
        </motion.nav>
      </header>

      {/* 3D canvas — fixed, transparent, z:10 */}
      <Hero3D hoverInfo={hoverInfo} mousePosRef={mousePosRef} />

      {/* Scroll arrow */}
      <motion.div
        style={{
          position: 'fixed',
          bottom: '2.5rem',
          left: 0, right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 20,
          opacity: arrowOpacity,
          pointerEvents: 'none',
        }}
      >
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '1.4rem',
            color: 'rgba(0,0,0,0.35)',
            lineHeight: 1,
          }}
        >
          ↓
        </motion.span>
      </motion.div>

      {/* ── Page flow ────────────────────────────────────────────────────── */}
      <main>
        <div style={{ height: '100vh' }} />
        <div className="projects-section">
          <ProjectGrid onProjectHover={setHoverInfo} />
        </div>
      </main>
    </>
  )
}

const navLink: React.CSSProperties = {
  fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
  fontWeight: 400,
  fontSize: '0.75rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#0A0A0A',
  textDecoration: 'none',
}
