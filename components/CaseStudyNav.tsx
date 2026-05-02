'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface CaseStudyNavProps {
  chapters: string[]
  accentColor: string
}

export default function CaseStudyNav({ chapters, accentColor }: CaseStudyNavProps) {
  const [activeChapter, setActiveChapter] = useState(0)
  // Cache section elements once — avoids 8× getElementById on every scroll frame
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    // Populate cache after mount (elements exist in DOM by then)
    sectionRefs.current = chapters.map((_, i) => document.getElementById(`chapter-${i}`))

    const handleScroll = () => {
      let current = 0
      const threshold = window.innerHeight * 0.4
      for (let i = 0; i < sectionRefs.current.length; i++) {
        const el = sectionRefs.current[i]
        if (el && el.getBoundingClientRect().top <= threshold) current = i
      }
      setActiveChapter(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [chapters])

  const scrollToChapter = (index: number) => {
    const el = sectionRefs.current[index] ?? document.getElementById(`chapter-${index}`)
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
