'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { useHoverCapable } from '@/lib/useViewport'

const springConfig = { stiffness: 400, damping: 28 }

export default function CustomCursor() {
  const hoverCapable = useHoverCapable()
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  // Track visibility with a ref so the mousemove effect never needs to re-register
  const isVisibleRef = useRef(false)

  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)

  useEffect(() => {
    if (!hoverCapable) return // touch device — no cursor to track
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisibleRef.current) {
        isVisibleRef.current = true
        setIsVisible(true)
      }
    }

    const handleEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.dataset?.cursor === 'hover'
      ) {
        setIsHovering(true)
      }
    }

    const handleLeave = () => setIsHovering(false)

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', handleEnter, { passive: true })
    document.addEventListener('mouseout', handleLeave, { passive: true })

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', handleEnter)
      document.removeEventListener('mouseout', handleLeave)
    }
  }, [cursorX, cursorY, hoverCapable]) // isVisible removed — tracked via ref to avoid re-registration

  // Touch / coarse-pointer devices have no cursor — render nothing at all so
  // the DOM stays clean and the fixed-position div doesn't sit dead in the tree.
  if (!hoverCapable) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference rounded-full"
      animate={{
        width: isHovering ? 32 : 8,
        height: isHovering ? 32 : 8,
        backgroundColor: '#0A0A0A',
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        width: { type: 'spring', stiffness: 400, damping: 28 },
        height: { type: 'spring', stiffness: 400, damping: 28 },
        opacity: { duration: 0.2 },
      }}
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  )
}
