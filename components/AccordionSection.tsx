'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AccordionSectionProps {
  number: string
  title: string
  children: React.ReactNode
  accentColor?: string
}

export default function AccordionSection({
  number,
  title,
  children,
  accentColor = '#0A0A0A',
}: AccordionSectionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        borderTop: '1px solid #E5E5E5',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '1.25rem 0',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          gap: '1.5rem',
        }}
      >
        <span
          style={{
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            color: accentColor,
            minWidth: '2ch',
          }}
        >
          {number}
        </span>
        <span
          style={{
            flex: 1,
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: '0.85rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#0A0A0A',
          }}
        >
          ———— {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          style={{
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontSize: '1.25rem',
            color: '#6B6B6B',
            display: 'block',
          }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                paddingBottom: '1.5rem',
                paddingLeft: 'calc(2ch + 1.5rem)',
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
