'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface NavBarProps {
  visible: boolean
}

export default function NavBar({ visible }: NavBarProps) {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <Link
        href="/"
        className="text-[#0A0A0A] no-underline"
        style={{
          fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
          fontWeight: 500,
          fontSize: '0.95rem',
          letterSpacing: '-0.01em',
        }}
      >
        {/* id used by Hero3D to measure target position for 3D handoff */}
        <span id="nav-name-span">Luke Caporelli</span>
      </Link>

      <div
        className="flex items-center gap-6"
        style={{
          fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
          fontWeight: 400,
          fontSize: '0.75rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#0A0A0A',
        }}
      >
        <Link href="/about" className="hover:opacity-60 transition-opacity duration-200 no-underline">
          About
        </Link>
        <a
          href="/Resume_Luke_Caporelli.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-60 transition-opacity duration-200 no-underline"
        >
          CV
        </a>
        <a
          href="https://linkedin.com/in/lukecaporelli"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-60 transition-opacity duration-200 no-underline"
        >
          LinkedIn
        </a>
      </div>
    </motion.nav>
  )
}
