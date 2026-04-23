'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useLenis } from 'lenis/react'
import type { Project } from '@/data/projects'
import MetaRow from './MetaRow'

const Hero3D = dynamic(() => import('@/components/Hero3D'), { ssr: false })

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

const labNavLink: React.CSSProperties = {
  fontFamily:     FONT,
  fontWeight:     400,
  fontSize:       '0.75rem',
  letterSpacing:  '0.06em',
  textTransform:  'uppercase',
  color:          '#0A0A0A',
  textDecoration: 'none',
}

function PrimaryVisual({ project }: { project: Project }) {
  const [imgError, setImgError] = useState(false)

  if (project.slug === 'expressive-messaging') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ width: '100%', marginBottom: '3rem', overflow: 'hidden' }}
      >
        <video
          src="/videos/expressive-messaging/cover.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      style={{
        width: '100%',
        marginBottom: '3rem',
        overflow: 'hidden',
      }}
    >
      {!imgError ? (
        <img
          src={`/images/${project.slug}/cover.jpg`}
          alt={project.name}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onError={() => setImgError(true)}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.75rem',
            color: '#A0A0A0',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            {`Primary visual — ${project.name}`}
          </span>
        </div>
      )}
    </motion.div>
  )
}

function SecondaryVisual({ project }: { project: Project }) {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ width: '100%', marginBottom: '3rem', overflow: 'hidden' }}
    >
      {!imgError ? (
        <img
          src={`/images/${project.slug}/closeup.jpg`}
          alt={`${project.name} closeup`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onError={() => setImgError(true)}
        />
      ) : null}
    </motion.div>
  )
}

const EMOTION_STUDIES = [
  {
    slug: 'romance',
    label: 'Romance',
    description: 'Two users hold their screens simultaneously — their fingerprints merge into a shared trace.',
  },
  {
    slug: 'anger',
    label: 'Anger',
    description: 'Shaking the device transforms the message bubble, turning physical tension into visible intensity.',
  },
  {
    slug: 'joy',
    label: 'Joy',
    description: 'A real-world object, captured and gifted — the effort is the emotion.',
  },
  {
    slug: 'sarcasm',
    label: 'Sarcasm',
    description: "A subtle shift in the bubble's behavior signals ironic intent before it gets lost in translation.",
  },
]

function EmotionVideoCard({
  study,
  accentColor,
}: {
  study: typeof EMOTION_STUDIES[number]
  accentColor: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    videoRef.current?.play()
  }
  const handleMouseLeave = () => {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  return (
    <div
      key={study.slug}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ backgroundColor: '#FAFAFA', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', cursor: 'default' }}
    >
      <video
        ref={videoRef}
        src={`/videos/expressive-messaging/${study.slug}.mp4`}
        loop
        muted
        playsInline
        preload="metadata"
        style={{ flex: '0 0 auto', width: '60%', height: 'auto', display: 'block' }}
      />
      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
        <span
          style={{
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 500,
            fontSize: '0.78rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: accentColor,
            display: 'block',
            marginBottom: '0.4rem',
          }}
        >
          {study.label}
        </span>
        <p
          style={{
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '0.85rem',
            lineHeight: 1.55,
            color: '#6B6B6B',
            margin: 0,
          }}
        >
          {study.description}
        </p>
      </div>
    </div>
  )
}

function EmotionStudies({ accentColor }: { accentColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ marginBottom: '3rem' }}
    >
      <span
        style={{
          fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
          fontWeight: 400,
          fontSize: '0.72rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#A0A0A0',
          display: 'block',
          marginBottom: '1.5rem',
        }}
      >
        Motion studies
      </span>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1px',
          backgroundColor: '#E5E5E5',
        }}
      >
        {EMOTION_STUDIES.map((study) => (
          <EmotionVideoCard key={study.slug} study={study} accentColor={accentColor} />
        ))}
      </div>
    </motion.div>
  )
}

interface LabPageProps {
  project: Project
}

export default function LabPage({ project }: LabPageProps) {
  const accent = project.accentColor

  // Always start at top of page — use Lenis API so smooth scroll doesn't fight us
  const didScroll = useRef(false)
  const lenis = useLenis()
  useEffect(() => {
    if (!didScroll.current && lenis) {
      didScroll.current = true
      lenis.scrollTo(0, { immediate: true })
    }
  }, [lenis])

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>

      {/* ── Fixed top nav ─────────────────────────────────────────────── */}
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
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
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: '0.95rem',
            whiteSpace: 'nowrap',
            opacity: 0,
            userSelect: 'none',
            color: '#0A0A0A',
            textDecoration: 'none',
            cursor: 'pointer',
            paddingRight: '7rem',
          }}
        >
          Luke Caporelli
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/about" style={labNavLink}>About</Link>
          <a href="/Luke_Caporelli_CV.pdf" target="_blank" rel="noopener noreferrer" style={labNavLink}>CV</a>
          <a href="https://linkedin.com/in/lukecaporelli" target="_blank" rel="noopener noreferrer" style={labNavLink}>LinkedIn</a>
        </nav>
      </header>

      {/* ── 3D name — always in nav position ─────────────────────────── */}
      <Hero3D navOnly />

      <main style={{ paddingTop: '7rem', paddingBottom: '8rem' }}>
        <div
          className="editorial-width"
          style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              style={{
                fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: accent,
                display: 'block',
                marginBottom: '1.5rem',
              }}
            >
              Lab — {project.label}
            </span>

            <h1
              style={{
                fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(2.5rem, 6vw, 6rem)',
                lineHeight: 0.95,
                color: '#0A0A0A',
                letterSpacing: '-0.03em',
                marginBottom: '1.5rem',
              }}
            >
              {project.name}
            </h1>

            <p
              style={{
                fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(1rem, 1.5vw, 1.35rem)',
                color: '#6B6B6B',
                lineHeight: 1.5,
                marginBottom: '2.5rem',
              }}
            >
              {project.headline || project.problemStatement}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '3rem' }}>
              {project.tools.split(' · ').map((tool) => (
                <span
                  key={tool}
                  style={{
                    fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: '0.72rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#6B6B6B',
                    border: '1px solid #E5E5E5',
                    borderRadius: '4px',
                    padding: '4px 10px',
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Primary visual — full width */}
          <PrimaryVisual project={project} />

          {/* Description */}
          {project.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: '3rem' }}
            >
              {project.description.split('. ').reduce<string[][]>((acc, sentence, i) => {
                const paraIdx = Math.floor(i / 2)
                if (!acc[paraIdx]) acc[paraIdx] = []
                acc[paraIdx].push(sentence)
                return acc
              }, []).map((sentences, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                    fontWeight: 300,
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: '#0A0A0A',
                    textAlign: 'justify',
                    marginBottom: '1.25rem',
                  }}
                >
                  {sentences.join('. ')}
                  {sentences[sentences.length - 1]?.endsWith('.') ? '' : '.'}
                </p>
              ))}
            </motion.div>
          )}

          {/* Emotion studies — expressive messaging only */}
          {project.slug === 'expressive-messaging' && (
            <EmotionStudies accentColor={project.accentColor} />
          )}

          {/* Secondary visual */}
          <SecondaryVisual project={project} />

          {/* Prototype duo — blend it only */}
          {project.slug === 'blend-it' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: '3rem' }}
            >
              <span
                style={{
                  fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#A0A0A0',
                  display: 'block',
                  marginBottom: '1rem',
                }}
              >
                Technical prototype
              </span>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'stretch', height: '420px' }}>
                <img
                  src="/images/blend-it/prototype.jpg"
                  alt="Blend it prototype"
                  style={{ width: '68%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <img
                  src="/images/blend-it/prototype2.jpg"
                  alt="Blend it prototype detail"
                  style={{ width: '32%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </motion.div>
          )}

          {/* Collaborators */}
          <div
            style={{
              paddingTop: '2rem',
              borderTop: '1px solid #E5E5E5',
            }}
          >
            <span
              style={{
                fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#A0A0A0',
              }}
            >
              Team
            </span>
            <p
              style={{
                fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: '0.9rem',
                color: '#6B6B6B',
                marginTop: '0.5rem',
              }}
            >
              {project.team}
            </p>
          </div>
        </div>
      </main>

      <footer
        style={{
          borderTop: '1px solid #E5E5E5',
          padding: '2rem',
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 300,
            fontSize: '0.85rem',
            color: '#6B6B6B',
          }}
        >
          © 2025 Luke Caporelli
        </span>
      </footer>
    </div>
  )
}
