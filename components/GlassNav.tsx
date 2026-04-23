'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

const NAV_LINKS = [
  { label: 'About',    href: '/about',                                external: false },
  { label: 'CV',       href: '/Resume_Luke_Caporelli.pdf',           external: true  },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/luke-caporelli', external: true  },
]

// Chrome-metallic 3D text — matches the visual language of the Three.js name mesh
function NavLabel3D({ children }: { children: string }) {
  return (
    <span
      style={{
        display:              'inline-block',
        color:                'transparent',
        background:           'linear-gradient(352deg, #d8d8d8 0%, #a4a4a4 26%, #f0f0f0 46%, #747474 66%, #c4c4c4 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip:       'text',
        textShadow: [
          '0px -0.5px 0 rgba(0,0,0,0.28)',
          '0px -1px   0 rgba(0,0,0,0.18)',
          '0px -1.5px 0 rgba(0,0,0,0.10)',
          '0px -2px   4px rgba(0,0,0,0.11)',
        ].join(', '),
        filter: 'drop-shadow(0 0.5px 0 rgba(255,255,255,0.58))',
      }}
    >
      {children}
    </span>
  )
}

interface GlassNavProps {
  isVisible?: boolean
  /** When false, the isVisible flip is instant (no stagger entrance). Used on
   *  non-home routes so the nav is simply present without replaying the
   *  hero→nav animation every navigation. */
  animated?: boolean
}

export default function GlassNav({ isVisible = true, animated = true }: GlassNavProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {NAV_LINKS.map((link, i) => (
        <div key={link.label} style={{ display: 'flex', alignItems: 'center' }}>
          {/* Thin divider before each item */}
          <div style={{ width: '1px', height: '13px', background: 'rgba(0,0,0,0.09)', flexShrink: 0 }} />

          <motion.div
            // `initial={false}` skips the mount animation — when the header is
            // already meant to be visible (any non-home route), items render in
            // place instantly instead of re-staggering in.
            initial={false}
            animate={isVisible ? { y: 0, opacity: 1 } : { y: -14, opacity: 0 }}
            transition={
              animated
                ? {
                    y:       { duration: 0.68, delay: i * 0.10, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.55, delay: i * 0.10, ease: [0.22, 1, 0.36, 1] },
                    scale:   { type: 'spring', stiffness: 320, damping: 22 },
                    filter:  { duration: 0.20, ease: 'easeOut' },
                  }
                : { duration: 0 }
            }
            whileHover={{
              scale:  1.08,
              filter: 'drop-shadow(0 2px 10px rgba(155,160,180,0.44))',
            }}
            whileTap={{ scale: 0.96 }}
          >
            {link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                <NavLabel3D>{link.label}</NavLabel3D>
              </a>
            ) : (
              <Link href={link.href} style={linkStyle}>
                <NavLabel3D>{link.label}</NavLabel3D>
              </Link>
            )}
          </motion.div>
        </div>
      ))}
    </div>
  )
}

const linkStyle: React.CSSProperties = {
  fontFamily:     FONT,
  fontWeight:     500,
  fontSize:       '0.72rem',
  letterSpacing:  '0.08em',
  textTransform:  'uppercase',
  textDecoration: 'none',
  padding:        '10px 16px',
  display:        'block',
  whiteSpace:     'nowrap',
}
