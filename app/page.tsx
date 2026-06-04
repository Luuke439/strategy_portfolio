'use client'

import { useEffect, useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import ProjectGrid from '@/components/ProjectGrid'
import { useHoverInfo } from '@/components/HoverInfoContext'

const SCROLL_KEY = 'home-scroll-y'

export default function Home() {
  const { setHoverInfo } = useHoverInfo()
  const { scrollY } = useScroll()
  const lenis = useLenis()

  // Scroll arrow fades out as the user leaves the hero.
  const arrowOpacity = useTransform(scrollY, [0, 80], [1, 0])

  // ── Scroll restoration ─────────────────────────────────────────────────
  // When a visitor opens a case study and comes back (browser back, logo
  // click, or new navigation), they expect to land roughly where they were
  // — usually mid-grid — not at the top of the hero. We persist scroll
  // position on every scroll (debounced) and restore it on mount.
  const restoredRef = useRef(false)
  useEffect(() => {
    if (restoredRef.current) return
    if (typeof window === 'undefined') return
    const stored = window.sessionStorage.getItem(SCROLL_KEY)
    const y = stored ? parseInt(stored, 10) : 0
    if (!Number.isFinite(y) || y <= 0) {
      restoredRef.current = true
      return
    }
    // Lenis must be ready; until then, retry on next paint.
    if (lenis) {
      lenis.scrollTo(y, { immediate: true, force: true })
      restoredRef.current = true
    } else {
      // Plain window scroll as a fallback so refresh-with-no-lenis still works.
      window.scrollTo(0, y)
    }
  }, [lenis])

  useEffect(() => {
    if (typeof window === 'undefined') return
    let timer: ReturnType<typeof setTimeout> | null = null
    const save = () => {
      try { window.sessionStorage.setItem(SCROLL_KEY, String(window.scrollY)) }
      catch { /* storage might be disabled — silently skip */ }
    }
    const onScroll = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(save, 120)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('beforeunload', save)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('beforeunload', save)
      if (timer) clearTimeout(timer)
      // Also save on unmount (route change).
      save()
    }
  }, [])

  return (
    <>
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
          // Gentle float + opacity "breathing" so the cue is easy to spot
          // without feeling busy. Both tracks share the loop duration, so the
          // arrow is brightest right as it reaches the bottom of its dip.
          animate={{ y: [0, 9, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 300,
            fontSize:   '1.6rem',
            color:      'rgba(0,0,0,0.6)',
            lineHeight: 1,
            willChange: 'transform, opacity',
          }}
        >
          ↓
        </motion.span>
      </motion.div>

      {/* ── Page flow ────────────────────────────────────────────────────── */}
      {/* Hero spacer: desktop wants 115vh of breathing room above the grid;
          mobile uses 100svh (small-viewport-height, immune to the iOS Safari
          address-bar collapse double-count). The actual values live in
          globals.css so we don't ship a second JS render on resize. */}
      <main>
        <div className="hero-spacer" />
        <div className="projects-section">
          <ProjectGrid onProjectHover={setHoverInfo} />
        </div>
      </main>
    </>
  )
}
