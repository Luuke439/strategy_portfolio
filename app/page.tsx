'use client'

import { useState, useEffect, useRef } from 'react'
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion'
import { useLenis } from 'lenis/react'
import dynamic from 'next/dynamic'
import ProjectGrid from '@/components/ProjectGrid'
import GlassNav from '@/components/GlassNav'
import type { TileHoverInfo } from '@/components/ProjectCard'

// Hero3D is WebGL — client only, no SSR
const Hero3D = dynamic(() => import('@/components/Hero3D'), { ssr: false })


export default function Home() {
  const [hoverInfo, setHoverInfo] = useState<TileHoverInfo | null>(null)
  const [vh, setVh] = useState(800)
  const [navVisible, setNavVisible] = useState(false)
  const { scrollY } = useScroll()
  const mousePosRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const h = window.innerHeight
    setVh(h)
    // Handle page refresh while already scrolled past the threshold
    if (window.scrollY > h * 0.8) setNavVisible(true)
  }, [])

  const lenis = useLenis()

  // ── Name-click scrolls back to hero ──────────────────────────────────────
  const snapToHeroRef = useRef<() => void>(() => {})

  useEffect(() => {
    if (!lenis) return
    snapToHeroRef.current = () => {
      lenis.scrollTo(0, { duration: 1.1 })
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
  const navOpacity   = useTransform(scrollY, [vh * 0.8, vh], [0, 1])
  const arrowOpacity = useTransform(scrollY, [0, 80], [1, 0])

  // Trigger staggered entry animation the first time nav becomes visible
  useMotionValueEvent(scrollY, 'change', (v) => {
    if (!navVisible && v > vh * 0.8) setNavVisible(true)
  })

  return (
    <>
      {/* ── Fixed centered header ───────────────────────────────────────────── */}
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
        {/* Unified frosted-glass pill — fades in with scroll, IS the container */}
        <motion.div
          style={{
            opacity:              navOpacity,
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
          }}
        >
          {/* Name side — invisible click target, 3D name renders on top via canvas z:110.
              minWidth must be wide enough for the 3D text at navScale so it doesn't
              bleed over the divider into the nav items. */}
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
              padding:       '10px 20px 10px 0',
              minWidth:      '350px',
              cursor:        'pointer',
              userSelect:    'none',
              pointerEvents: 'auto',
            }}
          >
            Luke Caporelli
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '14px', background: 'rgba(0,0,0,0.10)', flexShrink: 0 }} />

          {/* Nav items */}
          <div style={{ pointerEvents: 'auto' }}>
            <GlassNav isVisible={navVisible} />
          </div>
        </motion.div>
      </header>

      {/* 3D canvas — fixed, transparent, z:110 */}
      <Hero3D hoverInfo={hoverInfo} mousePosRef={mousePosRef} />

      {/* Scroll arrow */}
      <motion.div
        style={{
          position:       'fixed',
          bottom:         '2.5rem',
          left:           0,
          right:          0,
          display:        'flex',
          justifyContent: 'center',
          zIndex:         20,
          opacity:        arrowOpacity,
          pointerEvents:  'none',
        }}
      >
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 300,
            fontSize:   '1.4rem',
            color:      'rgba(0,0,0,0.35)',
            lineHeight: 1,
          }}
        >
          ↓
        </motion.span>
      </motion.div>

      {/* ── Page flow ────────────────────────────────────────────────────── */}
      <main>
        <div style={{ height: '115vh' }} />
        <div className="projects-section">
          <ProjectGrid onProjectHover={setHoverInfo} />
        </div>
      </main>
    </>
  )
}
