'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * Fades route content in/out on navigation while the PersistentHeader (and
 * its WebGL canvas) stay mounted behind it. `mode="wait"` so the outgoing
 * page finishes its exit before the incoming page runs its enter — avoids
 * a moment where both pages overlap and fight for layout.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
