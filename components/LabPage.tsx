'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import type { Project } from '@/data/projects'

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

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

  // Any lab project with a cover video (e.g. Vera) gets a looping, muted hero
  // video instead of the static cover image. Poster falls back to the still.
  if (project.coverVideo) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ width: '100%', marginBottom: '3rem', overflow: 'hidden' }}
      >
        <video
          src={`/videos/${project.slug}/${project.coverVideo}`}
          poster={`/images/${project.slug}/cover.jpg`}
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
        <Image
          src={`/images/${project.slug}/cover.jpg`}
          alt={project.name}
          width={1920}
          height={1080}
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
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
            {`Primary visual · ${project.name}`}
          </span>
        </div>
      )}
    </motion.div>
  )
}

// Slugs that have a real /images/<slug>/closeup.jpg in /public.
// Anything else: skip the secondary visual entirely (no 404, no empty box).
const SLUGS_WITH_CLOSEUP = new Set<string>([])

function SecondaryVisual({ project }: { project: Project }) {
  if (!SLUGS_WITH_CLOSEUP.has(project.slug)) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ width: '100%', marginBottom: '3rem', overflow: 'hidden' }}
    >
      <Image
        src={`/images/${project.slug}/closeup.jpg`}
        alt={`${project.name} closeup`}
        width={2536}
        height={1108}
        sizes="(max-width: 768px) 100vw, 1200px"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </motion.div>
  )
}

const EMOTION_STUDIES = [
  {
    slug: 'romance',
    label: 'Romance',
    description: 'Two users hold their screens at the same time. Their fingerprints merge into a shared trace.',
  },
  {
    slug: 'anger',
    label: 'Anger',
    description: 'Shaking the device transforms the message bubble, turning physical tension into visible intensity.',
  },
  {
    slug: 'joy',
    label: 'Joy',
    description: 'A real-world object, captured and gifted. The effort is the emotion.',
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
      className="emotion-card"
      style={{ backgroundColor: '#FAFAFA', cursor: 'default' }}
    >
      <video
        ref={videoRef}
        src={`/videos/expressive-messaging/${study.slug}.mp4`}
        loop
        muted
        playsInline
        preload="metadata"
        autoPlay={typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches}
        className="emotion-card__video"
        style={{ display: 'block' }}
      />
      <div
        className="emotion-card__text"
        style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}
      >
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

      <main style={{ paddingTop: 'var(--page-top)', paddingBottom: 'var(--page-bottom)' }}>
        <div
          className="editorial-width"
          style={{ paddingLeft: 'var(--editorial-px)', paddingRight: 'var(--editorial-px)' }}
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
                marginBottom: '1rem',
              }}
            >
              Lab · {project.label}
            </span>

            {/* Project name. Mobile floor bumped from 2.8rem → 4rem so the
                title reads as a proper hero on a phone; desktop ceiling
                unchanged. */}
            <h1
              style={{
                fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(4rem, 7vw, 5.5rem)',
                lineHeight: 0.95,
                color: '#0A0A0A',
                letterSpacing: '-0.03em',
                marginBottom: '1.75rem',
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '4rem' }}>
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

          {/* Podium — vera only, small closing image */}
          {project.slug === 'vera' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={{ width: '100%', maxWidth: '440px' }}>
                <Image
                  src="/images/vera/podium.jpg"
                  alt="The Vera team on the winners' podium at the CodeTheState hackathon in Heilbronn"
                  width={800}
                  height={533}
                  sizes="(max-width: 768px) 100vw, 440px"
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '6px' }}
                />
                <span
                  style={{
                    fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: '0.72rem',
                    letterSpacing: '0.04em',
                    color: '#A0A0A0',
                    display: 'block',
                    marginTop: '0.75rem',
                    textAlign: 'center',
                  }}
                >
                  1st place · CodeTheState, Heilbronn
                </span>
              </div>
            </motion.div>
          )}

          {/* Collaborators */}
          <div
            style={{
              paddingTop: '3rem',
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
                marginTop: '0.75rem',
              }}
            >
              {project.team}
            </p>
          </div>
        </div>
      </main>

      <footer
        style={{
          padding: '1.75rem var(--editorial-px)',
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
