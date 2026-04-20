'use client'

import { useState, useEffect, useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import ProjectGrid from '@/components/ProjectGrid'
import GlassNav from '@/components/GlassNav'
import type { TileHoverInfo } from '@/components/ProjectCard'

// Hero3D is WebGL — client only, no SSR
const Hero3D = dynamic(() => import('@/components/Hero3D'), { ssr: false })


export default function Home() {
  const [hoverInfo, setHoverInfo] = useState<TileHoverInfo | null>(null)
  const [vh, setVh] = useState(800)
  const { scrollY } = useScroll()
  const mousePosRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => { setVh(window.innerHeight) }, [])

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
  const navOpacity  = useTransform(scrollY, [vh * 0.8, vh], [0, 1])
  const arrowOpacity = useTransform(scrollY, [0, 80], [1, 0])

  return (
    <>
      {/* ── Permanent fixed header — transparent, name floats ───────────────── */}
      <header
        style={{
          position:       'fixed',
          top:            0,
          left:           0,
          right:          0,
          zIndex:         100,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '1.4rem 2rem',
          pointerEvents:  'none',
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

        <motion.div style={{ opacity: navOpacity, pointerEvents: 'auto' }}>
          <GlassNav />
        </motion.div>
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

