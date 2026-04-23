'use client'

import { useRef, useEffect, useState } from 'react'

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
      className={`stagger-reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ display: 'inline', ...style }}
      aria-label={children}
    >
      {children.split('').map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="stagger-char"
          style={{
            whiteSpace: char === ' ' ? 'pre' : 'normal',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ['--i' as any]: i,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
