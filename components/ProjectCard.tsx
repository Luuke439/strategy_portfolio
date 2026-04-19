'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Project } from '@/data/projects'

export type TileHoverInfo = { color: string; x: number; y: number }

interface ProjectCardProps {
  project: Project
  onHoverChange?: (info: TileHoverInfo | null) => void
}

// ── Placeholder tile ──────────────────────────────────────────────────────────

function PlaceholderCard({ project, onHoverChange }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'default' }}
      onMouseEnter={(e) => {
        setHovered(true)
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        onHoverChange?.({
          color: project.accentColor,
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        })
      }}
      onMouseLeave={() => { setHovered(false); onHoverChange?.(null) }}
    >
      {/* Image area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#F0EDEA' }} />

        {/* Centered text */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '0.45rem',
          padding: '1.5rem',
          textAlign: 'center',
        }}>
          <span style={{
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: '0.6rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#C0B8B0',
          }}>
            Coming Soon
          </span>
          <span style={{
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: 'clamp(0.82rem, 1.1vw, 1rem)',
            letterSpacing: '-0.01em',
            color: '#908880',
            lineHeight: 1.3,
          }}>
            {project.name}
          </span>
        </div>

        {/* Hover border — accent color only on hover */}
        <motion.div
          animate={{
            boxShadow: hovered
              ? `inset 0 0 0 2px ${project.accentColor}`
              : `inset 0 0 0 0px transparent`,
          }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />
      </div>

      {/* Label bar */}
      <div style={{
        height: '36px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FAFAFA', flexShrink: 0, padding: '0 1px',
      }}>
        <span style={{
          fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
          fontWeight: 400, fontSize: '0.76rem', letterSpacing: '-0.01em', color: '#B8B0A8',
        }}>
          {project.shortName}
        </span>
        <span style={{
          fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
          fontWeight: 300, fontSize: '0.70rem', color: '#C8C0B8', letterSpacing: '0.02em',
        }}>
          {project.year}
        </span>
      </div>
    </div>
  )
}

// ── Regular project tile ──────────────────────────────────────────────────────

export default function ProjectCard({ project, onHoverChange }: ProjectCardProps) {
  const isPlaceholder = project.type === 'placeholder'

  // All hooks must be called unconditionally — before any early returns
  const [hovered, setHovered] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const startTime = project.coverVideoStart ?? 0

  useEffect(() => {
    if (isPlaceholder) return
    const vid = videoRef.current
    if (!vid || !project.coverVideo) return
    const onLoadedMetadata = () => { vid.currentTime = startTime }
    const onSeeked = () => { setVideoReady(true) }
    vid.addEventListener('loadedmetadata', onLoadedMetadata, { once: true })
    vid.addEventListener('seeked', onSeeked, { once: true })
    return () => {
      vid.removeEventListener('loadedmetadata', onLoadedMetadata)
      vid.removeEventListener('seeked', onSeeked)
    }
  }, [project.coverVideo, startTime, isPlaceholder])

  useEffect(() => {
    if (isPlaceholder) return
    const vid = videoRef.current
    if (!vid) return
    if (hovered) {
      vid.currentTime = startTime
      vid.play().catch(() => {})
    } else {
      vid.pause()
      vid.currentTime = startTime
    }
  }, [hovered, startTime, isPlaceholder])

  if (isPlaceholder) {
    return <PlaceholderCard project={project} onHoverChange={onHoverChange} />
  }

  const cta =
    project.type === 'case-study' ? 'View Case Study' :
    project.type === 'external'   ? 'View Website' :
                                    'View Case Glimpse'

  const href = project.type === 'external' && project.externalUrl
    ? project.externalUrl
    : `/projects/${project.slug}`

  const isExternal = project.type === 'external'

  return (
    <Link
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}
      onMouseEnter={(e) => {
        setHovered(true)
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        onHoverChange?.({
          color: project.accentColor,
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        })
      }}
      onMouseLeave={() => { setHovered(false); onHoverChange?.(null) }}
    >
      {/* ── Image area ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>

        {/* Accent fallback — shows until cover image loads */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: project.accentColor,
          opacity: 0.55,
        }} />

        {/* Media container — zooms subtly on hover */}
        <motion.div
          animate={{ scale: hovered ? 1.008 : 1 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {/* Hero image */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(/images/${project.slug}/cover.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: project.coverPosition ?? 'center',
          }} />

          {/* Cover video — freeze frame at rest, plays on hover */}
          {project.coverVideo && (
            <motion.video
              ref={videoRef}
              src={`/videos/${project.slug}/${project.coverVideo}`}
              muted
              loop
              playsInline
              preload={project.coverVideoStart !== undefined ? 'auto' : 'none'}
              animate={{ opacity: videoReady ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
              }}
            />
          )}
        </motion.div>

        {/* Hover border — accent color, invisible at rest */}
        <motion.div
          animate={{
            boxShadow: hovered
              ? `inset 0 0 0 2px ${project.accentColor}`
              : `inset 0 0 0 0px transparent`,
          }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        />

        {/* CTA label — fades up on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute', bottom: 12, left: 12,
            fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: '0.66rem',
            letterSpacing: '0.13em',
            textTransform: 'uppercase' as const,
            color: '#FFFFFF',
            backgroundColor: 'rgba(0,0,0,0.36)',
            padding: '5px 10px',
            borderRadius: '2px',
            pointerEvents: 'none',
          }}
        >
          {cta}
        </motion.div>
      </div>

      {/* ── Label bar ────────────────────────────────────────────────── */}
      <div style={{
        height: '36px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FAFAFA', flexShrink: 0, padding: '0 1px',
      }}>
        <span style={{
          fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
          fontWeight: 400, fontSize: '0.76rem', letterSpacing: '-0.01em', color: '#0A0A0A',
        }}>
          {project.shortName}
        </span>
        <span style={{
          fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
          fontWeight: 300, fontSize: '0.70rem', color: '#A8A8A8', letterSpacing: '0.02em',
        }}>
          {project.year}
        </span>
      </div>
    </Link>
  )
}
