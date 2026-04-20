'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

const NAV_LINKS = [
  { label: 'About',    href: '/about',                                 external: false },
  { label: 'CV',       href: '/Luke_Caporelli_CV.pdf',                external: true  },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/lukecaporelli', external: true  },
]

// 3D metallic label — gradient face + layered extrusion shadows
function Label3D({ children }: { children: string }) {
  return (
    <span
      style={{
        display:              'inline-block',
        color:                'transparent',
        background:           'linear-gradient(168deg, #4a4a4a 0%, #888 38%, #1a1a1a 68%, #555 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip:       'text',
        textShadow: [
          '0px 0.5px 0 rgba(0,0,0,0.32)',
          '0px 1px   0 rgba(0,0,0,0.22)',
          '0px 1.5px 0 rgba(0,0,0,0.13)',
          '0px 2px   3px rgba(0,0,0,0.14)',
        ].join(', '),
        // Tiny highlight on top edge
        filter: 'drop-shadow(0 -0.5px 0 rgba(255,255,255,0.55))',
      }}
    >
      {children}
    </span>
  )
}

export default function GlassNav() {
  const barRef = useRef<HTMLDivElement>(null)
  const [glow, setGlow] = useState<{ x: number; y: number } | null>(null)

  const onMove = (e: React.MouseEvent) => {
    const r = barRef.current?.getBoundingClientRect()
    if (!r) return
    setGlow({
      x: ((e.clientX - r.left) / r.width)  * 100,
      y: ((e.clientY - r.top)  / r.height) * 100,
    })
  }

  return (
    <div
      ref={barRef}
      onMouseMove={onMove}
      onMouseLeave={() => setGlow(null)}
      style={{
        position:             'relative',
        display:              'flex',
        alignItems:           'center',
        borderRadius:         '100px',
        overflow:             'hidden',
        background:           'linear-gradient(175deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.11) 100%)',
        backdropFilter:       'blur(22px) saturate(200%)',
        WebkitBackdropFilter: 'blur(22px) saturate(200%)',
        border:               '1px solid rgba(255,255,255,0.32)',
        boxShadow: [
          'inset 0 1.5px 0 rgba(255,255,255,0.72)',
          'inset 0 -1px 0 rgba(0,0,0,0.07)',
          '0 8px 32px rgba(0,0,0,0.11)',
          '0 2px 6px rgba(0,0,0,0.08)',
        ].join(', '),
      }}
    >
      {/* Mouse-light glow */}
      <div
        style={{
          position:      'absolute',
          inset:         0,
          pointerEvents: 'none',
          borderRadius:  '100px',
          zIndex:        1,
          transition:    'opacity 0.15s ease',
          opacity:       glow ? 1 : 0,
          background:    glow
            ? `radial-gradient(ellipse 90px 46px at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.42) 0%, transparent 72%)`
            : 'none',
        }}
      />

      {NAV_LINKS.map((link, i) => (
        <div
          key={link.label}
          style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}
        >
          {i > 0 && (
            <div style={{ width: '1px', height: '13px', background: 'rgba(0,0,0,0.09)', flexShrink: 0 }} />
          )}
          {link.external ? (
            <a href={link.href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              <Label3D>{link.label}</Label3D>
            </a>
          ) : (
            <Link href={link.href} style={linkStyle}>
              <Label3D>{link.label}</Label3D>
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}

const linkStyle: React.CSSProperties = {
  fontFamily:     FONT,
  fontWeight:     500,
  fontSize:       '0.72rem',
  letterSpacing:  '0.06em',
  textTransform:  'uppercase',
  textDecoration: 'none',
  padding:        '6px 16px',
  display:        'block',
  whiteSpace:     'nowrap',
}
