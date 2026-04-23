'use client'

import { useScroll, useTransform, motion } from 'framer-motion'
import ProjectGrid from '@/components/ProjectGrid'
import { useHoverInfo } from '@/components/HoverInfoContext'

export default function Home() {
  const { setHoverInfo } = useHoverInfo()
  const { scrollY } = useScroll()

  // Scroll arrow fades out as the user leaves the hero.
  const arrowOpacity = useTransform(scrollY, [0, 80], [1, 0])

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
