'use client'

import { useState } from 'react'

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

// Portrait path — drop the actual file at this location in public/
const PORTRAIT_SRC = '/images/about/portrait.jpg'

const EXPERIENCE = [
  {
    years: '2025 – now',
    org: 'Paul Bauder GmbH',
    role: 'Working Student UX + Master\'s Thesis',
    detail: 'Drones + AI for automated roof inspection',
  },
  {
    years: '2024 – 2025',
    org: 'Mercedes-Benz AG',
    role: 'Working Student UX — HMI & in-car interfaces',
    detail: null,
  },
  {
    years: '2024',
    org: 'Mercedes-Benz AG',
    role: 'Intern — UI Design, safety-critical automotive context',
    detail: null,
  },
  {
    years: '2020 – 2021',
    org: 'Camphill Föhrenbühl',
    role: 'Voluntary Social Year — residential care,',
    detail: 'young people with developmental needs',
  },
]

const EDUCATION = [
  {
    years: '2025 – now',
    org: 'M.A. Strategic Design',
    role: 'HfG Schwäbisch Gmünd',
    detail: null,
  },
  {
    years: '2021 – 2025',
    org: 'B.A. Digital Product Design & Development',
    role: 'HfG Schwäbisch Gmünd · Thesis grade: A',
    detail: null,
  },
]

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <span style={{
        fontFamily:    FONT,
        fontWeight:    500,
        fontSize:      '0.68rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color:         '#0A0A0A',
      }}>
        {children}
      </span>
      <div style={{ height: '1px', background: '#E5E5E5', marginTop: '0.5rem' }} />
    </div>
  )
}

function Portrait() {
  const [failed, setFailed] = useState(false)
  const frame: React.CSSProperties = {
    width:       '160px',
    aspectRatio: '3 / 4',
    flexShrink:  0,
    objectFit:   'cover',
    display:     'block',
  }
  if (failed) {
    return <div style={{ ...frame, backgroundColor: '#E0E0E0' }} aria-hidden />
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={PORTRAIT_SRC}
      alt="Luke Caporelli"
      onError={() => setFailed(true)}
      style={frame}
    />
  )
}

function TimelineRow({ years, org, role, detail }: {
  years: string
  org: string
  role: string
  detail: string | null
}) {
  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: '110px 1fr',
      gap:                 '0 1.5rem',
      marginBottom:        '1.5rem',
    }}>
      <span style={{
        fontFamily: FONT,
        fontWeight: 300,
        fontSize:   '0.78rem',
        color:      '#A0A0A0',
        paddingTop: '2px',
        lineHeight: 1.5,
      }}>
        {years}
      </span>
      <div>
        <div style={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize:   '0.88rem',
          color:      '#0A0A0A',
          lineHeight: 1.5,
        }}>
          {org}
        </div>
        <div style={{
          fontFamily: FONT,
          fontWeight: 300,
          fontSize:   '0.82rem',
          color:      '#6B6B6B',
          lineHeight: 1.5,
        }}>
          {role}
        </div>
        {detail && (
          <div style={{
            fontFamily: FONT,
            fontWeight: 300,
            fontSize:   '0.82rem',
            color:      '#6B6B6B',
            lineHeight: 1.5,
          }}>
            {detail}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <main
        style={{
          paddingTop:    '9rem',
          paddingBottom: '8rem',
        }}
      >
        <div
          className="editorial-width"
          style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
        >

          {/* ── Header row: heading block (left) + portrait (right) ───── */}
          <div
            style={{
              display:      'flex',
              alignItems:   'flex-start',
              gap:          '3rem',
              marginBottom: '4rem',
            }}
          >
            {/* Left: compact heading block */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{
                fontFamily:    FONT,
                fontWeight:    500,
                fontSize:      'clamp(2rem, 3.5vw, 3.5rem)',
                lineHeight:    1.05,
                letterSpacing: '-0.02em',
                color:         '#0A0A0A',
                margin:        '0 0 1rem',
              }}>
                Strategic Designer
              </h1>
              <h2 style={{
                fontFamily:    FONT,
                fontWeight:    300,
                fontSize:      'clamp(1rem, 1.4vw, 1.2rem)',
                lineHeight:    1.5,
                letterSpacing: '-0.01em',
                color:         '#6B6B6B',
                margin:        '0 0 1.25rem',
              }}>
                I lead disruptive transformation across industrial systems.
              </h2>
              <div style={{
                fontFamily:    FONT,
                fontWeight:    400,
                fontSize:      '0.72rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color:         '#A0A0A0',
              }}>
                Germany · US Citizen · Open to relocate
              </div>
            </div>

            {/* Right: portrait */}
            <Portrait />
          </div>

          {/* ── Experience ────────────────────────────────────────────── */}
          <section style={{ marginBottom: '3.5rem' }}>
            <SectionLabel>Experience</SectionLabel>
            {EXPERIENCE.map((item, i) => (
              <TimelineRow key={i} {...item} />
            ))}
          </section>

          {/* ── Education ─────────────────────────────────────────────── */}
          <section style={{ marginBottom: '3.5rem' }}>
            <SectionLabel>Education</SectionLabel>
            {EDUCATION.map((item, i) => (
              <TimelineRow key={i} {...item} />
            ))}
          </section>

          {/* ── Collaborations ────────────────────────────────────────── */}
          <section style={{ marginBottom: '3.5rem' }}>
            <SectionLabel>Collaborations</SectionLabel>
            <p style={{
              fontFamily: FONT,
              fontWeight: 300,
              fontSize:   '0.88rem',
              color:      '#6B6B6B',
              lineHeight: 1.7,
              margin:     0,
            }}>
              Stiftung Liebenau · Paul Bauder · Festool · Staedtler · Lebenshilfe Österreich
            </p>
          </section>

          {/* ── Outside Work ──────────────────────────────────────────── */}
          <section style={{ marginBottom: '4rem' }}>
            <SectionLabel>Outside Work</SectionLabel>
            <p style={{
              fontFamily: FONT,
              fontWeight: 300,
              fontSize:   '0.95rem',
              color:      '#0A0A0A',
              lineHeight: 1.8,
              maxWidth:   '52ch',
              margin:     0,
            }}>
              Long-distance cycling is where I do some of my best thinking —
              planning a 200km route the night before and executing it alone
              requires the same combination of system logic and improvisation
              I try to bring to design. I also read a lot of history, which
              is mostly just studying how systems fail over long time horizons.
            </p>
          </section>

          {/* ── Contact — LinkedIn + CV live in the header ───────────── */}
          <section>
            <SectionLabel>Contact</SectionLabel>
            <a
              href="mailto:hello@lukecaporelli.com"
              style={{
                fontFamily:     FONT,
                fontWeight:     400,
                fontSize:       '1.1rem',
                color:          '#0A0A0A',
                textDecoration: 'none',
              }}
            >
              hello@lukecaporelli.com
            </a>
          </section>

        </div>
      </main>
    </div>
  )
}
