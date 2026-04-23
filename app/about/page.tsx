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

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
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

function TimelineRow({ years, org, role, detail }: {
  years: string
  org: string
  role: string
  detail: string | null
}) {
  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: '100px 1fr',
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
      <main style={{
        paddingTop:    '7rem',
        paddingBottom: '8rem',
        paddingLeft:   '2rem',
        paddingRight:  '2rem',
      }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="about-grid">

            {/* ── Left column: photo + contact ─────────────────────────── */}
            <div>
              {/* Photo — replace div with <Image> once photo is available */}
              <div style={{
                width:           '100%',
                maxWidth:        '420px',
                aspectRatio:     '3 / 4',
                backgroundColor: '#E0E0E0',
              }} />
            </div>

            {/* ── Right column: all text ───────────────────────────────── */}
            <div>

              {/* Name + title */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{
                  fontFamily:   FONT,
                  fontWeight:   500,
                  fontSize:     '2rem',
                  color:        '#0A0A0A',
                  lineHeight:   1.15,
                  marginBottom: '0.5rem',
                }}>
                  Luke Caporelli
                </div>
                <div style={{
                  fontFamily:    FONT,
                  fontWeight:    400,
                  fontSize:      '0.78rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color:         '#6B6B6B',
                  lineHeight:    1.6,
                }}>
                  Strategic Designer
                </div>
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

              {/* Opening paragraph */}
              <p style={{
                fontFamily:   FONT,
                fontWeight:   300,
                fontSize:     '1rem',
                lineHeight:   1.8,
                color:        '#0A0A0A',
                marginBottom: '3rem',
                maxWidth:     '52ch',
              }}>
                I work at the start of things — before the brief is right,
                before the technology is certain, before anyone knows what
                to build. My background is in UX and interaction design.
                Where I&apos;m headed is concept and strategy. I&apos;m most useful
                in the room where the problem is still being defined.
              </p>

              {/* Experience */}
              <div style={{ marginBottom: '2.5rem' }}>
                <SectionLabel>Experience</SectionLabel>
                {EXPERIENCE.map((item, i) => (
                  <TimelineRow key={i} {...item} />
                ))}
              </div>

              {/* Education */}
              <div style={{ marginBottom: '2.5rem' }}>
                <SectionLabel>Education</SectionLabel>
                {EDUCATION.map((item, i) => (
                  <TimelineRow key={i} {...item} />
                ))}
              </div>

              {/* Collaborations */}
              <div style={{ marginBottom: '2.5rem' }}>
                <SectionLabel>Collaborations</SectionLabel>
                <p style={{
                  fontFamily: FONT,
                  fontWeight: 300,
                  fontSize:   '0.85rem',
                  color:      '#6B6B6B',
                  lineHeight: 1.7,
                }}>
                  Stiftung Liebenau · Paul Bauder · Festool · Staedtler · Lebenshilfe Österreich
                </p>
              </div>

              {/* Outside Work — extra breathing room signals register shift */}
              <div style={{ marginTop: '3.5rem', marginBottom: '3.5rem' }}>
                <SectionLabel>Outside Work</SectionLabel>
                <p style={{
                  fontFamily: FONT,
                  fontWeight: 300,
                  fontSize:   '0.92rem',
                  color:      '#0A0A0A',
                  lineHeight: 1.85,
                  maxWidth:   '52ch',
                }}>
                  Long-distance cycling is where I do some of my best thinking —
                  planning a 200km route the night before and executing it alone
                  requires the same combination of system logic and improvisation
                  I try to bring to design. I also read a lot of history, which
                  is mostly just studying how systems fail over long time horizons.
                </p>
              </div>

              {/* Contact */}
              <div>
                <a
                  href="mailto:hello@lukecaporelli.com"
                  style={{
                    fontFamily:     FONT,
                    fontWeight:     400,
                    fontSize:       '1.1rem',
                    color:          '#0A0A0A',
                    textDecoration: 'none',
                    display:        'block',
                    marginBottom:   '1.25rem',
                  }}
                >
                  hello@lukecaporelli.com
                </a>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <a
                    href="https://www.linkedin.com/in/luke-caporelli"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily:    FONT,
                      fontWeight:    400,
                      fontSize:      '0.72rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color:         '#0A0A0A',
                      textDecoration:'none',
                    }}
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href="/Luke_Caporelli_CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily:    FONT,
                      fontWeight:    400,
                      fontSize:      '0.72rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color:         '#0A0A0A',
                      textDecoration:'none',
                    }}
                  >
                    CV ↗
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
