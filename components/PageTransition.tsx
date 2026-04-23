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
        // Opacity only — any translate/scale/filter would make this div a
        // containing block and break `position: fixed` descendants (e.g. the
        // CaseStudyNav chapter rail).
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
