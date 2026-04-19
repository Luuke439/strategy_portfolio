'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const Hero3D = dynamic(() => import('@/components/Hero3D'), { ssr: false })

const experience = [
  {
    org: 'Mercedes-Benz',
    role: 'UX Design — HMI & in-car interfaces',
    link: null,
  },
  {
    org: 'Paul Bauder',
    role: 'UX Design — B2B product & prototyping',
    link: null,
  },
  {
    org: 'packyourride.de',
    role: 'Solo — live bikepacking configurator, built in Next.js',
    link: 'https://packyourride.de',
  },
  {
    org: 'HfG Schwäbisch Gmünd',
    role: 'B.A. Digital Product Design + Development\nM.A. Strategic Design — graduating 2027',
    link: null,
  },
]

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      {/* ── 3D name — always in nav position ─── */}
      <Hero3D navOnly />

      {/* Nav */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '1.4rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(250,250,250,0.94)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E5E5E5',
        }}
      >
        {/* Invisible click target — 3D name (z:110, pointerEvents:none) renders on top.
            paddingRight extends the hit area to cover the full width of the 3D text. */}
        <Link
          href="/"
          id="nav-name-span"
          style={{
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 500,
            fontSize: '0.95rem',
            whiteSpace: 'nowrap',
            opacity: 0,
            userSelect: 'none',
            textDecoration: 'none',
            cursor: 'pointer',
            paddingRight: '7rem',
          }}
        >
          Luke Caporelli
        </Link>
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <Link
            href="/about"
            style={{ color: '#0A0A0A', textDecoration: 'none' }}
          >
            About
          </Link>
          <a
            href="/Luke_Caporelli_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0A0A0A', textDecoration: 'none' }}
          >
            CV
          </a>
          <a
            href="https://linkedin.com/in/lukecaporelli"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0A0A0A', textDecoration: 'none' }}
          >
            LinkedIn
          </a>
        </div>
      </div>

      <main
        style={{
          paddingTop: '7rem',
          paddingBottom: '8rem',
          paddingLeft: '2rem',
          paddingRight: '2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          {/* Page label */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'block',
              fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#A0A0A0',
              marginBottom: '3rem',
            }}
          >
            About
          </motion.span>

          {/* Two-column layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6rem',
              alignItems: 'start',
            }}
          >
            {/* Left — Bio */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                style={{
                  fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: '1.1rem',
                  lineHeight: 1.75,
                  color: '#0A0A0A',
                  textAlign: 'justify',
                  marginBottom: '2rem',
                }}
              >
                Before design school, I spent a year doing social service work with young people.
                That's where I understood what it means to solve a real problem for a real person
                — and why I've been skeptical of design that optimizes for consumption ever since.
                I work at the start of things: research, framing, systems, the concept before
                anyone knows how to build it. Currently finishing my M.A. in Strategic Design at
                HfG Schwäbisch Gmünd. US citizen, based between Germany and wherever I land next.
              </p>

              <a
                href="mailto:hello@lukecaporelli.com"
                style={{
                  fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: '0.9rem',
                  color: '#0A0A0A',
                  textDecoration: 'none',
                  borderBottom: '1px solid #0A0A0A',
                  paddingBottom: '2px',
                }}
              >
                hello@lukecaporelli.com
              </a>
            </motion.div>

            {/* Right — Experience */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {experience.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '1.5rem 0',
                      borderBottom: '1px solid #E5E5E5',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          color: '#0A0A0A',
                        }}
                      >
                        {item.org}
                      </span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                            fontWeight: 400,
                            fontSize: '0.75rem',
                            color: '#6B6B6B',
                            textDecoration: 'none',
                          }}
                        >
                          ↗
                        </a>
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                        fontWeight: 300,
                        fontSize: '0.85rem',
                        color: '#6B6B6B',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {item.role}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer
        style={{
          borderTop: '1px solid #E5E5E5',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.85rem',
            color: '#6B6B6B',
          }}
        >
          © 2025 Luke Caporelli
        </span>
        <Link
          href="/"
          style={{
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#6B6B6B',
            textDecoration: 'none',
          }}
        >
          ← Work
        </Link>
      </footer>
    </div>
  )
}
