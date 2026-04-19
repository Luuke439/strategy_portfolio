'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface HeroPlaceholderProps {
  onNavVisible: (visible: boolean) => void
  navNameRef: React.RefObject<HTMLSpanElement | null>
}

export default function HeroPlaceholder({ onNavVisible, navNameRef }: HeroPlaceholderProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const [hasEntered, setHasEntered] = useState(false)

  const { scrollY } = useScroll()

  // Tagline words for stagger animation
  const line1 = 'Thinking in systems.'.split(' ')
  const line2 = 'Moving on intuition.'.split(' ')
  const allWords = [...line1, ...line2]

  // Scroll-linked transforms — name moves from center to nav position
  const nameScale = useTransform(scrollY, [0, 400], [1, 0.13])
  const nameY = useTransform(scrollY, [0, 400], [0, -220])
  const nameX = useTransform(scrollY, [0, 400], [0, -380])
  const taglineOpacity = useTransform(scrollY, [0, 200], [1, 0])
  const navOpacity = useTransform(scrollY, [300, 420], [0, 1])

  // Spring-smoothed transforms
  const smoothScale = useSpring(nameScale, { stiffness: 200, damping: 30 })
  const smoothY = useSpring(nameY, { stiffness: 200, damping: 30 })
  const smoothX = useSpring(nameX, { stiffness: 200, damping: 30 })

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const unsubscribe = navOpacity.on('change', (v) => {
      onNavVisible(v > 0.1)
    })
    return unsubscribe
  }, [navOpacity, onNavVisible])

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div
      ref={heroRef}
      className="relative flex flex-col items-center justify-center"
      style={{ height: '100dvh', overflow: 'hidden' }}
    >
      {/* Name */}
      <motion.h1
        ref={nameRef}
        className="text-display text-[#0A0A0A] whitespace-nowrap select-none"
        style={
          isMobile
            ? { fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif" }
            : {
                fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                scale: smoothScale,
                y: smoothY,
                x: smoothX,
                transformOrigin: 'center center',
              }
        }
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: hasEntered ? 1 : 0, y: hasEntered ? 0 : 20 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        Luke Caporelli
      </motion.h1>

      {/* Tagline */}
      <motion.div
        className="mt-8 flex flex-col items-center gap-1"
        style={{ opacity: taglineOpacity }}
      >
        {[line1, line2].map((line, lineIdx) => (
          <div key={lineIdx} className="flex gap-[0.35em]">
            {line.map((word, wordIdx) => {
              const globalIdx = lineIdx === 0 ? wordIdx : line1.length + wordIdx
              return (
                <motion.span
                  key={wordIdx}
                  style={{
                    fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                    fontWeight: 300,
                    fontStyle: 'italic',
                    fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
                    color: '#6B6B6B',
                    lineHeight: 1.4,
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: hasEntered ? 1 : 0,
                    y: hasEntered ? 0 : 8,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeOut',
                    delay: 0.6 + globalIdx * 0.08,
                  }}
                >
                  {word}
                </motion.span>
              )
            })}
          </div>
        ))}
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        style={{ opacity: taglineOpacity }}
      >
        <motion.div
          className="w-px bg-[#A0A0A0]"
          animate={{ height: [16, 32, 16] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  )
}
