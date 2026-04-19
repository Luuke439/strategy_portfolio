'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface StaggerTextProps {
  children: string
  className?: string
  style?: React.CSSProperties
  threshold?: number
}

export default function StaggerText({
  children,
  className = '',
  style,
  threshold = 0.3,
}: StaggerTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
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
      { threshold }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <span
      ref={ref}
      className={`stagger-reveal ${className}`}
      style={{ display: 'inline', ...style }}
      aria-label={children}
    >
      {children.split('').map((char, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.015 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}
