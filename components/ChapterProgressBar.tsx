'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useChapterContext } from './ChapterContext'

/**
 * ChapterProgressBar
 *
 * 2px hairline pinned to the very top of the viewport on mobile case-study
 * routes. Fills left → right in the page's accent color as the user scrolls.
 *
 * Replaces the desktop sticky-rail wayfinding so mobile readers can still
 * sense how deep they are into the article without burning vertical space.
 *
 * Renders nothing when ChapterContext is empty (home, about, lab routes).
 */
export default function ChapterProgressBar() {
  const { state } = useChapterContext()
  const { scrollYProgress } = useScroll()

  // Spring the progress so the bar trails the user's scroll instead of
  // snapping pixel-for-pixel — feels smoother and disguises the imprecise
  // pageheight measurement on iOS during address-bar collapse.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
  })

  if (!state) return null

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: state.accentColor,
        transformOrigin: '0% 50%',
        scaleX,
        zIndex: 105,           // above content, below the WebGL canvas (110)
        pointerEvents: 'none',
        // Subtle glow that picks up the accent color
        boxShadow: `0 0 8px ${state.accentColor}66`,
      }}
    />
  )
}
