'use client'

import { motion } from 'framer-motion'
import { useChapterContext } from './ChapterContext'

interface CaseStudyNavProps {
  chapters: string[]
  accentColor: string
}

/**
 * CaseStudyNav — desktop sticky chapter rail.
 *
 * Hidden on viewports < lg (Tailwind 1024px) — mobile/tablet readers see the
 * same chapter list inside the BottomDock sheet instead.
 *
 * Reads the active-chapter index from ChapterContext (populated by
 * <ChapterTracker> in CaseStudyPage) so the desktop rail, the mobile sheet,
 * and the top progress bar all share one scroll listener instead of three.
 */
export default function CaseStudyNav({ chapters, accentColor }: CaseStudyNavProps) {
  const { state } = useChapterContext()
  const activeChapter = state?.activeChapter ?? 0

  const scrollToChapter = (index: number) => {
    const el = document.getElementById(`chapter-${index}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      className="hidden lg:flex flex-col gap-3"
      style={{
        position: 'fixed',
        left: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
      }}
    >
      {chapters.map((chapter, i) => (
        <button
          key={i}
          onClick={() => scrollToChapter(i)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'none',
            border: 'none',
            padding: 0,
            textAlign: 'left',
          }}
        >
          <motion.div
            animate={{
              width: activeChapter === i ? 24 : 8,
              backgroundColor: activeChapter === i ? accentColor : '#A0A0A0',
            }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ height: 1 }}
          />
          <motion.span
            animate={{
              color: activeChapter === i ? accentColor : '#A0A0A0',
              opacity: activeChapter === i ? 1 : 0.65,
            }}
            transition={{ duration: 0.25 }}
            style={{
              fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: '0.78rem',
              letterSpacing: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {chapter}
          </motion.span>
        </button>
      ))}
    </nav>
  )
}
