'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import GlassNav from './GlassNav'

const Hero3D = dynamic(() => import('@/components/Hero3D'), { ssr: false })

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

export default function StaticHeader() {
  return (
    <>
      <Hero3D navOnly />

      <header
        style={{
          position:       'fixed',
          top:            0,
          left:           0,
          right:          0,
          zIndex:         50,
          padding:        '1.4rem 2rem',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          pointerEvents:  'none',
        }}
      >
        <div
          style={{
            display:              'flex',
            alignItems:           'center',
            padding:              '0 0 0 24px',
            borderRadius:         '100px',
            background:           'linear-gradient(175deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.11) 100%)',
            backdropFilter:       'blur(26px) saturate(180%)',
            WebkitBackdropFilter: 'blur(26px) saturate(180%)',
            border:               '1px solid rgba(255,255,255,0.30)',
            boxShadow: [
              'inset 0 1.5px 0 rgba(255,255,255,0.70)',
              'inset 0 -1px 0 rgba(0,0,0,0.05)',
              '0 8px 32px rgba(0,0,0,0.09)',
              '0 2px 6px rgba(0,0,0,0.06)',
            ].join(', '),
          }}
        >
          {/* Invisible click target — 3D name renders on top via canvas z:110 */}
          <Link
            href="/"
            id="nav-name-span"
            style={{
              fontFamily:     FONT,
              fontWeight:     500,
              fontSize:       '0.95rem',
              whiteSpace:     'nowrap',
              opacity:        0,
              userSelect:     'none',
              color:          '#0A0A0A',
              textDecoration: 'none',
              cursor:         'pointer',
              padding:        '10px 20px 10px 0',
              minWidth:       '350px',
              pointerEvents:  'auto',
            }}
          >
            Luke Caporelli
          </Link>

          <div style={{ width: '1px', height: '14px', background: 'rgba(0,0,0,0.10)', flexShrink: 0 }} />

          <div style={{ pointerEvents: 'auto' }}>
            <GlassNav />
          </div>
        </div>
      </header>
    </>
  )
}
