'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { ImpactStat } from '@/data/projects'

interface ImpactNumbersProps {
  stats: ImpactStat[]
  accentColor: string
}

export default function ImpactNumbers({ stats, accentColor }: ImpactNumbersProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
        gap: '1px',
        backgroundColor: '#E5E5E5',
        border: '1px solid #E5E5E5',
      }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
          style={{
            backgroundColor: '#FAFAFA',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: accentColor,
            }}
          >
            {stat.label}
          </span>
          <span
            className="text-number"
            style={{
              fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(2rem, 3.5vw, 4rem)',
              color: '#0A0A0A',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {stat.number}
          </span>
          <span
            style={{
              fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: '0.8rem',
              color: '#6B6B6B',
              lineHeight: 1.4,
            }}
          >
            {stat.description}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
