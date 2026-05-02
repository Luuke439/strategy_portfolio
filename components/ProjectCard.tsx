'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { Project } from '@/data/projects'

export type TileHoverInfo = { color: string; x: number; y: number }

interface ProjectCardProps {
  project: Project
  onHoverChange?: (info: TileHoverInfo | null) => void
  revealIndex?: number
}

// Large cards get a gentler tilt so the effect doesn't look extreme
const TILT_LARGE  = 2.0
const TILT_NORMAL = 5.0
const SPRING = { stiffness: 180, damping: 24, mass: 0.55 }
const RADIUS = '8px'

// Some project accents are very dark (e.g. #00363A, #3D2F5C, #5A1A4F).
// Against the cover photography they read as "just a darker border"
// instead of identity color. We lift those to a readable lightness for
// the *stroke + 3D beam* only — editorial uses of accentColor on the
// white case-study page stay untouched.
//
// We only touch colors that need it (lightness < TRIGGER) and we mute
// saturation alongside the lift so a saturated dark color (#088559)
// doesn't snap to a neon mint. The result is a softer, jewel-toned
// stroke that reads as the same identity color, just brighter.
const STROKE_TRIGGER  = 0.45
const STROKE_LIGHTNESS = 0.55
const STROKE_MAX_SAT   = 0.55
function brightenForUI(hex: string): string {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!m) return hex
  const r = parseInt(m[1], 16) / 255
  const g = parseInt(m[2], 16) / 255
  const b = parseInt(m[3], 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  if (l >= STROKE_TRIGGER) return hex
  const newL = STROKE_LIGHTNESS
  const newS = Math.min(s, STROKE_MAX_SAT)
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  let r2: number, g2: number, b2: number
  if (newS === 0) { r2 = g2 = b2 = newL }
  else {
    const q = newL < 0.5 ? newL * (1 + newS) : newL + newS - newL * newS
    const p = 2 * newL - q
    r2 = hue2rgb(p, q, h + 1/3)
    g2 = hue2rgb(p, q, h)
    b2 = hue2rgb(p, q, h - 1/3)
  }
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0')
  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`
}

export default function ProjectCard({
  project,
  onHoverChange,
  revealIndex = 0,
}: ProjectCardProps) {
  const isPlaceholder = project.type === 'placeholder'
  const maxTilt = project.size === 'large' ? TILT_LARGE : TILT_NORMAL
  const strokeColor = useMemo(() => brightenForUI(project.accentColor), [project.accentColor])

  const [hovered, setHovered] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const videoRef  = useRef<HTMLVideoElement>(null)
  const cardRef   = useRef<HTMLDivElement>(null)
  const startTime = project.coverVideoStart ?? 0

  // ── Per-card scroll reveal ────────────────────────────────────────────────
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          obs.disconnect()
        }
      },
      { threshold: 0.07, rootMargin: '0px 0px -20px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // ── Tilt ──────────────────────────────────────────────────────────────────
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [maxTilt, -maxTilt]), SPRING)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-maxTilt, maxTilt]), SPRING)

  // ── Pointer coalescing ────────────────────────────────────────────────────
  // mousemove fires faster than the browser paints. We coalesce into a single
  // rAF so we never do more than one DOM write + motion-value update per frame.
  const pointerRef = useRef<{ nx: number; ny: number } | null>(null)
  const rafRef = useRef<number | null>(null)
  useEffect(() => () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
  }, [])

  // ── Video metadata & seek ─────────────────────────────────────────────────
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

  // ── Video play/pause ──────────────────────────────────────────────────────
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

  // ── Interaction handlers ──────────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    pointerRef.current = { nx, ny }
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const p = pointerRef.current
      if (!p) return
      mx.set(p.nx)
      my.set(p.ny)
      // Write CSS vars on the tilt wrapper so both the sheen overlay and
      // the metallic glint ring inherit them. Cheaper than re-parsing a
      // background-image string per frame.
      const sx = (p.nx + 0.5) * 100
      const sy = (p.ny + 0.5) * 100
      target.style.setProperty('--sx', `${sx}%`)
      target.style.setProperty('--sy', `${sy}%`)
    })
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setHovered(true)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    onHoverChange?.({
      color: strokeColor,
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    })
  }

  const handleMouseLeave = () => {
    setHovered(false)
    mx.set(0)
    my.set(0)
    onHoverChange?.(null)
  }

  const revealDelay = revealIndex * 0.12

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={revealed ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 55, scale: 0.97 },
        visible: {
          opacity: 1, y: 0, scale: 1,
          transition: { duration: 0.95, delay: revealDelay, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      style={{ height: '100%', borderRadius: RADIUS }}
    >
      {/* ── Tilt wrapper — also hosts the full-card hover stroke ── */}
      <motion.div
        style={{
          position: 'relative',
          height: '100%',
          rotateX,
          rotateY,
          transformPerspective: 900,
          transformOrigin: 'center center',
          willChange: 'transform',
          borderRadius: RADIUS,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >

        {isPlaceholder ? (

          /* ── Placeholder ────────────────────────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'default', borderRadius: RADIUS, overflow: 'hidden' }}>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0, borderRadius: `${RADIUS} ${RADIUS} 0 0` }}>
              <div style={{ position: 'absolute', inset: 0, backgroundColor: '#F0EDEA' }} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '0.45rem', padding: '1.5rem', textAlign: 'center',
              }}>
                <span style={{ fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif", fontWeight: 400, fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C0B8B0' }}>
                  Coming Soon
                </span>
                <span style={{ fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif", fontWeight: 400, fontSize: 'clamp(0.82rem, 1.1vw, 1rem)', letterSpacing: '-0.01em', color: '#908880', lineHeight: 1.3 }}>
                  {project.name}
                </span>
              </div>
            </div>
            <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFAFA', flexShrink: 0, padding: '0 8px', borderRadius: `0 0 ${RADIUS} ${RADIUS}` }}>
              <span style={{ fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif", fontWeight: 400, fontSize: '0.76rem', letterSpacing: '-0.01em', color: '#B8B0A8' }}>
                {project.shortName}
              </span>
              {project.tags && project.tags.length > 0 && (
                <span style={{ fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif", fontWeight: 400, fontSize: '0.76rem', letterSpacing: '-0.01em', color: '#C8C0B8', textAlign: 'right' }}>
                  {project.tags.join(' / ')}
                </span>
              )}
            </div>
          </div>

        ) : (

          /* ── Regular project card ──────────────────────────────── */
          (() => {
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
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%', borderRadius: RADIUS }}
              >
                {/* ── Image area — top corners rounded ─────────────── */}
                <div style={{
                  flex: 1, position: 'relative',
                  overflow: 'hidden', minHeight: 0,
                  borderRadius: RADIUS,
                }}>

                  {/* Accent fallback — hidden for contain mode */}
                  {project.coverFit !== 'contain' && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: strokeColor, opacity: 0.55 }} />
                  )}

                  {/* Media — subtle zoom on hover */}
                  <motion.div
                    animate={{ scale: hovered ? 1.008 : 1 }}
                    transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ position: 'absolute', inset: 0 }}
                  >
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundColor: project.coverFit === 'contain' ? '#FAFAFA' : undefined,
                      backgroundImage: `url(/images/${project.slug}/cover.jpg)`,
                      backgroundSize: project.coverFit ?? 'cover',
                      backgroundPosition: project.coverPosition ?? 'center',
                      backgroundRepeat: 'no-repeat',
                    }} />
                    {project.coverVideo && (
                      <motion.video
                        ref={videoRef}
                        src={`/videos/${project.slug}/${project.coverVideo}`}
                        muted loop playsInline
                        // metadata is enough to seek to the poster frame; the
                        // full payload streams on hover. Loading all 4 grid
                        // videos eagerly at mount was the single biggest source
                        // of first-load jank.
                        preload="metadata"
                        animate={{ opacity: videoReady ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: project.coverPosition ?? 'center', pointerEvents: 'none' }}
                      />
                    )}
                  </motion.div>

                  {/* Metallic glint ring — a bright chrome highlight on the
                      accent-colored hover stroke that follows the cursor. Only
                      the border ring is visible via mask-composite. */}
                  <div
                    className={`tile-glint-ring${hovered ? ' is-hovered' : ''}`}
                  />

                  {/* Image-only hover stroke */}
                  <motion.div
                    animate={{
                      boxShadow: hovered
                        ? `inset 0 0 0 2px ${strokeColor}`
                        : `inset 0 0 0 0px transparent`,
                    }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    style={{
                      position: 'absolute', inset: 0,
                      borderRadius: RADIUS,
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  />

                  {/* CTA label — snaps up quickly */}
                  <motion.div
                    animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
                    transition={{ duration: 0.13, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: 'absolute', bottom: 12, left: 12, zIndex: 3,
                      fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif",
                      fontWeight: 400, fontSize: '0.66rem', letterSpacing: '0.13em',
                      textTransform: 'uppercase' as const, color: '#FFFFFF',
                      backgroundColor: 'rgba(0,0,0,0.36)',
                      padding: '5px 10px', borderRadius: '2px', pointerEvents: 'none',
                    }}
                  >
                    {cta}
                  </motion.div>
                </div>

                {/* ── Label bar ────────────────────────────────────── */}
                <div style={{
                  height: '36px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', backgroundColor: '#FAFAFA',
                  flexShrink: 0, padding: '0 8px',
                  borderRadius: `0 0 ${RADIUS} ${RADIUS}`,
                }}>
                  <span style={{ fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif", fontWeight: 400, fontSize: '0.76rem', letterSpacing: '-0.01em', color: '#0A0A0A' }}>
                    {project.shortName}
                  </span>
                  {project.tags && project.tags.length > 0 && (
                    <span style={{ fontFamily: "'TWK Lausanne Pan', system-ui, sans-serif", fontWeight: 400, fontSize: '0.76rem', letterSpacing: '-0.01em', color: '#A8A8A8', textAlign: 'right' }}>
                      {project.tags.join(' / ')}
                    </span>
                  )}
                </div>
              </Link>
            )
          })()
        )}
      </motion.div>
    </motion.div>
  )
}
