'use client'

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

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

// Centered Bauhaus-style label: thin rule · LABEL · thin rule.
function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        display:       'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems:    'center',
        gap:           '1.25rem',
        marginBottom:  '2rem',
      }}
    >
      <div style={{ height: '1px', background: '#E5E5E5' }} />
      <span style={{
        fontFamily:    FONT,
        fontWeight:    500,
        fontSize:      '0.68rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        color:         '#0A0A0A',
      }}>
        {children}
      </span>
      <div style={{ height: '1px', background: '#E5E5E5' }} />
    </div>
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
          paddingLeft:   '2rem',
          paddingRight:  '2rem',
        }}
      >
        <div
          style={{
            maxWidth: '640px',
            margin:   '0 auto',
          }}
        >

          {/* ── Portrait (centered) ───────────────────────────────────── */}
          <div
            style={{
              width:           '220px',
              aspectRatio:     '3 / 4',
              backgroundColor: '#E0E0E0',
              margin:          '0 auto 3.5rem',
            }}
          />

          {/* ── Title + subtitle + meta (centered) ────────────────────── */}
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h1 style={{
              fontFamily:    FONT,
              fontWeight:    500,
              fontSize:      'clamp(2.8rem, 6vw, 5.5rem)',
              lineHeight:    0.95,
              letterSpacing: '-0.03em',
              color:         '#0A0A0A',
              margin:        '0 0 1.5rem',
            }}>
              Strategic Designer
            </h1>
            <h2 style={{
              fontFamily:    FONT,
              fontWeight:    300,
              fontSize:      'clamp(1.1rem, 1.8vw, 1.5rem)',
              lineHeight:    1.45,
              letterSpacing: '-0.01em',
              color:         '#6B6B6B',
              margin:        '0 auto 1.75rem',
              maxWidth:      '28ch',
            }}>
              I lead disruptive transformation across industrial systems.
            </h2>
            <div style={{
              fontFamily:    FONT,
              fontWeight:    400,
              fontSize:      '0.78rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color:         '#A0A0A0',
            }}>
              Germany · US Citizen · Open to relocate
            </div>
          </div>

          {/* ── Experience ────────────────────────────────────────────── */}
          <section style={{ marginBottom: '4rem' }}>
            <SectionLabel>Experience</SectionLabel>
            {EXPERIENCE.map((item, i) => (
              <TimelineRow key={i} {...item} />
            ))}
          </section>

          {/* ── Education ─────────────────────────────────────────────── */}
          <section style={{ marginBottom: '4rem' }}>
            <SectionLabel>Education</SectionLabel>
            {EDUCATION.map((item, i) => (
              <TimelineRow key={i} {...item} />
            ))}
          </section>

          {/* ── Collaborations (single centered line) ────────────────── */}
          <section style={{ marginBottom: '4rem' }}>
            <SectionLabel>Collaborations</SectionLabel>
            <p style={{
              fontFamily: FONT,
              fontWeight: 300,
              fontSize:   '0.88rem',
              color:      '#6B6B6B',
              lineHeight: 1.7,
              textAlign:  'center',
              margin:     0,
            }}>
              Stiftung Liebenau · Paul Bauder · Festool · Staedtler · Lebenshilfe Österreich
            </p>
          </section>

          {/* ── Outside Work ──────────────────────────────────────────── */}
          <section style={{ marginBottom: '5rem' }}>
            <SectionLabel>Outside Work</SectionLabel>
            <p style={{
              fontFamily: FONT,
              fontWeight: 300,
              fontSize:   '0.95rem',
              color:      '#0A0A0A',
              lineHeight: 1.8,
              maxWidth:   '52ch',
              margin:     '0 auto',
              textAlign:  'center',
            }}>
              Long-distance cycling is where I do some of my best thinking —
              planning a 200km route the night before and executing it alone
              requires the same combination of system logic and improvisation
              I try to bring to design. I also read a lot of history, which
              is mostly just studying how systems fail over long time horizons.
            </p>
          </section>

          {/* ── Contact (centered) ────────────────────────────────────── */}
          <section style={{ textAlign: 'center' }}>
            <a
              href="mailto:hello@lukecaporelli.com"
              style={{
                fontFamily:     FONT,
                fontWeight:     400,
                fontSize:       '1.1rem',
                color:          '#0A0A0A',
                textDecoration: 'none',
                display:        'inline-block',
                marginBottom:   '1.5rem',
              }}
            >
              hello@lukecaporelli.com
            </a>
            <div style={{
              display:        'flex',
              gap:            '2rem',
              justifyContent: 'center',
            }}>
              <a
                href="https://www.linkedin.com/in/luke-caporelli"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily:     FONT,
                  fontWeight:     400,
                  fontSize:       '0.72rem',
                  letterSpacing:  '0.08em',
                  textTransform:  'uppercase',
                  color:          '#0A0A0A',
                  textDecoration: 'none',
                }}
              >
                LinkedIn ↗
              </a>
              <a
                href="/Resume_Luke_Caporelli.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily:     FONT,
                  fontWeight:     400,
                  fontSize:       '0.72rem',
                  letterSpacing:  '0.08em',
                  textTransform:  'uppercase',
                  color:          '#0A0A0A',
                  textDecoration: 'none',
                }}
              >
                CV ↗
              </a>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
