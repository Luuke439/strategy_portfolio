'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AUTHOR } from '@/lib/site'

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

// Portrait path — drop the actual file at this location in public/
const PORTRAIT_SRC = '/images/about/portrait.jpg'

const EXPERIENCE = [
  {
    years: 'from Sep 2026',
    org: 'Paul Bauder GmbH',
    role: 'Master\'s Thesis Cooperation',
    detail: null,
  },
  {
    years: '2025 – now',
    org: 'Paul Bauder GmbH',
    role: 'Working Student Digital Products',
    detail: null,
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

// Hero portrait — fills the right column of the two-column hero, cropped to a
// consistent 4:5 frame. object-position lifts the crop toward the subject so
// the tall analog frame keeps the face in view instead of centring on the table.
function HeroPortrait() {
  const [failed, setFailed] = useState(false)
  return (
    <div className="about-hero__portrait-frame">
      {failed ? (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#E5E5E5' }} aria-hidden />
      ) : (
        <Image
          src={PORTRAIT_SRC}
          alt="Luke Caporelli"
          fill
          sizes="(max-width: 700px) 240px, 240px"
          onError={() => setFailed(true)}
          style={{ objectFit: 'cover', objectPosition: '50% 34%' }}
          priority
        />
      )}
    </div>
  )
}

// One career/education entry — org left, years right-aligned on the same
// baseline (classic résumé line), role + optional detail beneath.
function EntryRow({ years, org, role, detail }: {
  years: string
  org: string
  role: string
  detail: string | null
}) {
  return (
    <div style={{ marginBottom: '1.35rem' }}>
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'baseline',
        gap:            '1rem',
      }}>
        <span style={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize:   '0.9rem',
          color:      '#0A0A0A',
          lineHeight: 1.45,
        }}>
          {org}
        </span>
        <span style={{
          fontFamily: FONT,
          fontWeight: 300,
          fontSize:   '0.72rem',
          color:      '#A0A0A0',
          whiteSpace: 'nowrap',
          lineHeight: 1.45,
        }}>
          {years}
        </span>
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
  )
}

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <main
        style={{
          paddingTop:    'var(--page-top)',
          paddingBottom: 'var(--page-bottom)',
        }}
      >

        {/* ── One editorial column: hero + CV share the same spine ────── */}
        <div
          className="editorial-width"
          style={{
            paddingLeft:  'var(--editorial-px)',
            paddingRight: 'var(--editorial-px)',
          }}
        >

          {/* Hero — portrait sits in the spine column, statement in content */}
          <section className="about-hero">

            <HeroPortrait />

            <div>
              <h1 style={{
                fontFamily:    FONT,
                fontWeight:    300,
                fontSize:      'clamp(1.5rem, 2.5vw, 2.05rem)',
                lineHeight:    1.22,
                letterSpacing: '-0.02em',
                color:         '#0A0A0A',
                margin:        0,
              }}>
                I&apos;m Luke,<br />
                a <strong style={{ fontWeight: 500 }}>Strategic Designer</strong><br />
                guiding transformation across<br />
                Brands, Systems and Products
              </h1>
              <p style={{
                fontFamily:    FONT,
                fontWeight:    300,
                fontSize:      'clamp(0.92rem, 1.3vw, 1.02rem)',
                lineHeight:    1.6,
                color:         '#6B6B6B',
                maxWidth:      '44ch',
                margin:        'clamp(1.1rem, 2.2vw, 1.5rem) 0 0',
              }}>
                Service and transformation design, with a focus on AI-enabled
                services for complex, regulated organizations.
              </p>
            </div>

          </section>

          {/* ── Experience ────────────────────────────────────────────── */}
          <section className="about-section">
            <div className="about-section__label">Experience</div>
            <div>
              {EXPERIENCE.map((item, i) => (
                <EntryRow key={i} {...item} />
              ))}
            </div>
          </section>

          {/* ── Education ─────────────────────────────────────────────── */}
          <section className="about-section">
            <div className="about-section__label">Education</div>
            <div>
              {EDUCATION.map((item, i) => (
                <EntryRow key={i} {...item} />
              ))}
            </div>
          </section>

          {/* ── Recognition ───────────────────────────────────────────── */}
          <section className="about-section">
            <div className="about-section__label">Recognition</div>
            <p style={{
              fontFamily: FONT,
              fontWeight: 300,
              fontSize:   '0.9rem',
              color:      '#0A0A0A',
              lineHeight: 1.7,
              margin:     0,
            }}>
              <span style={{ fontWeight: 500 }}>1st place, CodeTheState hackathon 2026</span>{' '}
              (Heilbronn), out of 40 builders across four public-sector use
              cases. Hosted by Komm.ONE, Public Makers, and the IPAI
              Foundation.
            </p>
          </section>

          {/* ── Collaborations ────────────────────────────────────────── */}
          <section className="about-section">
            <div className="about-section__label">Projects with</div>
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

          {/* ── Contact ───────────────────────────────────────────────── */}
          <section className="about-section">
            <div className="about-section__label">Contact</div>
            <a
              href={AUTHOR.emailHref}
              style={{
                fontFamily:     FONT,
                fontWeight:     400,
                fontSize:       '1rem',
                color:          '#0A0A0A',
                textDecoration: 'none',
              }}
            >
              {AUTHOR.email}
            </a>
          </section>

        </div>
      </main>
    </div>
  )
}
