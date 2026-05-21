'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { caseStudies, type Project } from '@/data/projects'
import { caseStudyContent, type CaseStudyContent, type CsImage, type CsVideo, type CsBarChart } from '@/data/case-study-content'
import CaseStudyNav from './CaseStudyNav'
import ChallengeBlock from './ChallengeBlock'
import MetaRow from './MetaRow'

// ── Shared style constants ────────────────────────────────────────────────────
const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

// ── Image slot — Next.js Image with fallback placeholder ─────────────────────

function CsImageSlot({
  image,
  accentColor,
  fadeIn = false,
  isVisible = true,
}: {
  image: CsImage
  accentColor: string
  fadeIn?: boolean
  isVisible?: boolean
}) {
  const [failed, setFailed] = useState(false)

  const ar = image.aspectRatio ?? '16/9'
  const isPhone = image.layout === 'phone'
  const isWide = image.layout === 'wide'

  const outerStyle: React.CSSProperties = {
    margin: '2rem 0',
    ...(isPhone ? { display: 'flex', justifyContent: 'center' } : {}),
    ...(fadeIn
      ? {
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 200ms ease',
          transitionDelay: isVisible ? '150ms' : '0ms',
        }
      : {}),
  }

  const containerStyle: React.CSSProperties = isPhone
    ? { width: 320, position: 'relative', aspectRatio: ar, borderRadius: 18, overflow: 'hidden' }
    : isWide
    ? { position: 'relative', aspectRatio: ar, overflowX: 'auto', overflowY: 'hidden' }
    : { position: 'relative', aspectRatio: ar, overflow: 'hidden' }

  if (failed) {
    return (
      <div style={outerStyle}>
        <div
          style={{
            ...containerStyle,
            backgroundColor: '#EBEBEB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#A0A0A0',
              textAlign: 'center',
              padding: '0 1rem',
            }}
          >
            {image.alt}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div style={outerStyle}>
      <div style={containerStyle}>
        <Image
          src={image.src}
          fill
          alt={image.alt}
          loading={fadeIn ? 'lazy' : 'eager'}
          sizes={isPhone ? '320px' : '(max-width: 760px) 100vw, 760px'}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  )
}

// ── Full-width image (breaks out of editorial column) ─────────────────────────

function FullWidthImageSlot({
  image,
  accentColor,
  fadeIn = false,
  isVisible = true,
}: {
  image: CsImage
  accentColor: string
  fadeIn?: boolean
  isVisible?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const ar = image.aspectRatio ?? '16/9'

  const wrapStyle: React.CSSProperties = {
    margin: '2.5rem -2rem',
    position: 'relative',
    aspectRatio: ar,
    overflow: 'hidden',
    ...(fadeIn
      ? {
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 200ms ease',
          transitionDelay: isVisible ? '150ms' : '0ms',
        }
      : {}),
  }

  if (failed) {
    return (
      <div
        style={{
          ...wrapStyle,
          backgroundColor: '#EBEBEB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#A0A0A0',
            textAlign: 'center',
            padding: '0 2rem',
          }}
        >
          {image.alt}
        </span>
      </div>
    )
  }

  return (
    <div style={wrapStyle}>
      <Image
        src={image.src}
        fill
        alt={image.alt}
        loading={fadeIn ? 'lazy' : 'eager'}
        sizes="(max-width: 760px) 100vw, 760px"
        // contain (not cover) for full-width media so charts and diagrams
        // with content flush against the canvas edge are never clipped.
        // Aspect ratio is declared per-image, so matching aspects display
        // edge-to-edge; mismatches letterbox into the page bg instead of
        // cropping content.
        style={{ objectFit: 'contain' }}
        onError={() => setFailed(true)}
      />
    </div>
  )
}

// ── Typography primitives ─────────────────────────────────────────────────────

function Para({ children }: { children: string }) {
  return (
    <p
      style={{
        fontFamily: FONT,
        fontWeight: 300,
        fontSize: '0.95rem',
        lineHeight: 1.75,
        color: '#0A0A0A',
        margin: '0 0 1.25rem',
      }}
    >
      {children}
    </p>
  )
}

function ChapterLabel({ label }: { label: string; accentColor: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: '0.68rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#A0A0A0',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E5E5' }} />
    </div>
  )
}

function ChapterHeadline({ children }: { children: string }) {
  return (
    <h3
      style={{
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)',
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
        color: '#0A0A0A',
        margin: '0 0 1.1rem',
      }}
    >
      {children}
    </h3>
  )
}

function PullQuote({ text, attribution, accentColor }: { text: string; attribution?: string; accentColor: string }) {
  return (
    <blockquote style={{ borderLeft: `2px solid ${accentColor}`, paddingLeft: '1.5rem', margin: '1.75rem 0' }}>
      <p style={{ fontFamily: FONT, fontWeight: 300, fontStyle: 'italic', fontSize: '0.95rem', lineHeight: 1.65, color: '#0A0A0A', margin: 0 }}>
        "{text}"
      </p>
      {attribution && (
        <p style={{ fontFamily: FONT, fontWeight: 400, fontSize: '0.68rem', letterSpacing: '0.06em', color: '#6B6B6B', margin: '0.4rem 0 0' }}>
          — {attribution}
        </p>
      )}
    </blockquote>
  )
}

function Callout({ title, body, accentColor }: { title: string; body: string; accentColor: string }) {
  return (
    <div
      style={{
        backgroundColor: `${accentColor}0D`,
        borderLeft: `2px solid ${accentColor}`,
        padding: '1rem 1.25rem',
        margin: '1.75rem 0',
      }}
    >
      <p style={{ fontFamily: FONT, fontWeight: 500, fontSize: '0.8rem', color: accentColor, margin: '0 0 0.3rem' }}>
        {title}
      </p>
      <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: '0.82rem', lineHeight: 1.65, color: '#3A3A3A', margin: 0 }}>
        {body}
      </p>
    </div>
  )
}

function KeyTakeaway({ title, body, accentColor }: { title: string; body: string; accentColor: string }) {
  return (
    <div style={{ backgroundColor: accentColor, padding: '1.4rem 1.6rem', margin: '2.25rem 0 0' }}>
      <p style={{ fontFamily: FONT, fontWeight: 500, fontSize: '0.85rem', color: '#FAFAFA', margin: '0 0 0.3rem' }}>
        {title}
      </p>
      <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: '0.82rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
        {body}
      </p>
    </div>
  )
}

// ── Expandable section — CSS grid height animation ────────────────────────────

function ExpandableSection({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: 'grid-template-rows 300ms ease',
      }}
    >
      <div style={{ overflow: 'hidden' }}>
        <div style={{ paddingTop: '0.25rem' }}>{children}</div>
      </div>
    </div>
  )
}

// ── Toggle button ─────────────────────────────────────────────────────────────

function ToggleButton({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? 'Collapse' : 'Expand'}
      style={{
        fontFamily: FONT,
        fontWeight: 300,
        fontSize: '1.4rem',
        lineHeight: 1,
        color: '#A0A0A0',
        background: 'none',
        border: 'none',
        padding: '1.25rem 0 0',
        cursor: 'pointer',
        display: 'block',
      }}
    >
      {isOpen ? '−' : '+'}
    </button>
  )
}

// ── Impact grid ───────────────────────────────────────────────────────────────

function ImpactGrid({ stats, accentColor }: { stats: { number: string; description: string }[]; accentColor: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1px',
        backgroundColor: '#E5E5E5',
        margin: '1.75rem 0',
      }}
    >
      {stats.map((s, i) => (
        <div key={i} style={{ backgroundColor: '#FAFAFA', padding: '1.1rem 1rem' }}>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: accentColor,
              marginBottom: '0.35rem',
            }}
          >
            {s.number}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 300, fontSize: '0.73rem', lineHeight: 1.5, color: '#6B6B6B' }}>
            {s.description}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Phone row — 3 screens side by side with accent border ────────────────────

function PhoneRowSlot({ images, accentColor }: { images: CsImage[]; accentColor: string }) {
  const [failedMap, setFailedMap] = useState<Record<number, boolean>>({})
  const count = images.length
  return (
    <div
      style={{
        display: 'flex',
        gap: '14px',
        margin: '2.25rem 0',
        overflowX: 'auto',
        paddingBottom: '2px',
      }}
    >
      {images.map((img, i) => {
        const ar = img.aspectRatio ?? '9/16'
        return (
          <div
            key={i}
            style={{
              flex: `0 0 calc((100% - ${(count - 1) * 14}px) / ${count})`,
              minWidth: '100px',
              position: 'relative',
              aspectRatio: ar,
              borderRadius: '10px',
              overflow: 'hidden',
              border: `2px solid ${accentColor}`,
            }}
          >
            {failedMap[i] ? (
              <div
                style={{
                  position: 'absolute', inset: 0,
                  backgroundColor: '#EBEBEB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <span style={{ fontFamily: FONT, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A0A0A0', textAlign: 'center', padding: '0 0.5rem' }}>
                  {img.alt}
                </span>
              </div>
            ) : (
              <Image
                src={img.src}
                fill
                alt={img.alt}
                sizes="(max-width: 720px) 33vw, 232px"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                onError={() => setFailedMap((prev) => ({ ...prev, [i]: true }))}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Inline editorial bar chart ────────────────────────────────────────────────
// Horizontal bars rendered as CSS using the site typography and project accent
// color. Animates in on scroll. Replaces the previous PNG export approach so
// the chart inherits site fonts, scales crisply, and remains accessible.

function ChapterBarChart({
  chart,
  accentColor,
}: {
  chart: CsBarChart
  accentColor: string
}) {
  const max = Math.max(...chart.data.map((d) => d.value))

  return (
    <figure
      style={{
        margin: '2.5rem 0 2rem',
        fontFamily: FONT,
      }}
      aria-label={
        chart.title
          ? `${chart.title}${chart.subtitle ? ' — ' + chart.subtitle : ''}: ` +
            chart.data.map((d) => `${d.label} ${d.value}`).join(', ')
          : undefined
      }
    >
      {(chart.title || chart.subtitle) && (
        <figcaption style={{ marginBottom: '2rem' }}>
          {chart.title && (
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: '1.05rem',
                lineHeight: 1.35,
                color: '#0A0A0A',
                letterSpacing: '-0.005em',
              }}
            >
              {chart.title}
            </div>
          )}
          {chart.subtitle && (
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: '0.88rem',
                lineHeight: 1.4,
                color: '#6B6B6B',
                marginTop: '0.3rem',
              }}
            >
              {chart.subtitle}
            </div>
          )}
        </figcaption>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {chart.data.map((d, i) => {
          const pct = (d.value / max) * 100
          return (
            <div
              key={d.label}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(96px, 150px) 1fr auto',
                gap: '1.25rem',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  color: '#0A0A0A',
                  textAlign: 'right',
                  lineHeight: 1.3,
                }}
              >
                {d.label}
              </div>
              <div
                style={{
                  position: 'relative',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                    delay: i * 0.08,
                  }}
                  style={{
                    height: '100%',
                    backgroundColor: accentColor,
                    borderRadius: 2,
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: '1.45rem',
                  fontWeight: 300,
                  color: '#0A0A0A',
                  minWidth: '2.5rem',
                  lineHeight: 1,
                }}
              >
                {d.value}
              </div>
            </div>
          )
        })}
      </div>
    </figure>
  )
}

// ── Chapter media split (Para 1 + phone-layout media side-by-side) ────────────
// Activates automatically for chapters with phone-layout beforeVideo or
// beforeImage so vertical media gets an editorial layout instead of
// dominating the column. Toggle + expanded content render normally below.

function ChapterMediaSplit({
  paragraphs,
  video,
  image,
}: {
  paragraphs: string[]
  video?: CsVideo
  image?: CsImage
}) {
  const media = video ? (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: video.aspectRatio ?? '9/16',
        borderRadius: 18,
        overflow: 'hidden',
      }}
    >
      <video
        src={video.src}
        autoPlay
        muted
        loop
        playsInline
        aria-label={video.alt}
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
      />
    </div>
  ) : image ? (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: image.aspectRatio ?? '9/16',
        borderRadius: 18,
        overflow: 'hidden',
      }}
    >
      <Image
        src={image.src}
        fill
        alt={image.alt}
        style={{ objectFit: 'cover', objectPosition: 'center top' }}
        sizes="280px"
      />
    </div>
  ) : null

  return (
    <div className="chapter-media-split">
      <div className="chapter-media-split__text">
        {paragraphs.map((p, i) => (
          <Para key={i}>{p}</Para>
        ))}
      </div>
      <div className="chapter-media-split__media">{media}</div>
    </div>
  )
}

// ── Chapter video slot ────────────────────────────────────────────────────────
// Mirrors CsImageSlot's layout semantics so vertical videos get the same
// editorial treatment as vertical screenshots: layout='phone' caps at 320px
// and centers (instead of letting a tall video dominate the column).

function ChapterVideoSlot({ video }: { video: CsVideo }) {
  const isPhone = video.layout === 'phone'
  const isWide = video.layout === 'wide'
  const ar = video.aspectRatio

  const outerStyle: React.CSSProperties = {
    margin: '1.5rem 0',
    ...(isPhone ? { display: 'flex', justifyContent: 'center' } : {}),
  }

  const containerStyle: React.CSSProperties = isPhone
    ? { width: 320, position: 'relative', aspectRatio: ar ?? '9/16', borderRadius: 18, overflow: 'hidden' }
    : isWide
    ? { position: 'relative', aspectRatio: ar, overflowX: 'auto', overflowY: 'hidden' }
    : { position: 'relative', aspectRatio: ar, overflow: 'hidden', borderRadius: 4 }

  // For non-phone, non-wide cases without aspectRatio, fall back to natural sizing
  // to preserve the original behavior for any existing horizontal videos.
  const useNaturalSizing = !isPhone && !isWide && !ar

  if (useNaturalSizing) {
    return (
      <div style={outerStyle}>
        <video
          src={video.src}
          autoPlay
          muted
          loop
          playsInline
          aria-label={video.alt}
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
        />
      </div>
    )
  }

  return (
    <div style={outerStyle}>
      <div style={containerStyle}>
        <video
          src={video.src}
          autoPlay
          muted
          loop
          playsInline
          aria-label={video.alt}
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
        />
      </div>
    </div>
  )
}

// ── Section fade-in wrapper ───────────────────────────────────────────────────

function FadeSection({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ paddingTop: '4.5rem', paddingBottom: 0 }}
    >
      {children}
    </motion.section>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface CaseStudyPageProps {
  project: Project
}

export default function CaseStudyPage({ project }: CaseStudyPageProps) {
  const accent = project.accentColor
  const content: CaseStudyContent | undefined = caseStudyContent[project.slug]

  // Set<number> — -1 = opening, 0-7 = chapters
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const isOpen = (n: number) => expanded.has(n)
  const toggle = (n: number) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })

  // Always start at top of page — use Lenis API so smooth scroll doesn't fight us
  const didScroll = useRef(false)
  const lenis = useLenis()
  useEffect(() => {
    if (!didScroll.current && lenis) {
      didScroll.current = true
      lenis.scrollTo(0, { immediate: true })
    }
  }, [lenis])

  // Disable page-level scroll snap while on case study
  useEffect(() => {
    document.documentElement.classList.add('no-snap')
    document.body.classList.add('no-snap')
    return () => {
      document.documentElement.classList.remove('no-snap')
      document.body.classList.remove('no-snap')
    }
  }, [])

  const navChapters = useMemo(
    () => content
      ? content.chapters.map((ch) => ch.label.split(' · ')[1] ?? ch.label)
      : ['Context', 'Discover', 'Define', 'Concept', 'System', 'Deliver', 'Impact', 'Reflection'],
    [content]
  )

  const meta = useMemo(
    () => [
      project.role  && { label: 'Role',  value: project.role  },
      project.scope && { label: 'Scope', value: project.scope },
      { label: 'Team', value: project.team },
    ].filter(Boolean) as { label: string; value: string }[],
    [project.role, project.scope, project.team]
  )

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>

      {/* ── Side chapter nav ──────────────────────────────────────────── */}
      <CaseStudyNav chapters={navChapters} accentColor={accent} />

      {/* ── Hero — same editorial column as body, image below ───────────── */}
      <section style={{ paddingTop: 'clamp(10rem, 20vh, 16rem)' }}>
        <div className="editorial-width" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>

          {/* Label */}
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: '0.78rem',
              color: '#6B6B6B',
              display: 'block',
              marginBottom: '1rem',
            }}
          >
            {project.label}
          </span>

          {/* Project name */}
          <h1
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: '#0A0A0A',
              margin: '0 0 1.75rem',
            }}
          >
            {project.name}
          </h1>

          {/* Problem statement */}
          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 300,
              fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
              lineHeight: 1.45,
              letterSpacing: '-0.01em',
              color: '#6B6B6B',
              margin: '0 0 2.5rem',
            }}
          >
            {project.problemStatement}
          </h2>

          {/* Metadata */}
          <div style={{ marginBottom: '4rem' }}>
            {meta.map((m) => (
              <MetaRow key={m.label} label={m.label} value={m.value} accentColor={accent} />
            ))}
          </div>

          {/* Hero image — natural aspect ratio */}
          {content && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={content.heroImage}
              alt={project.name}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          )}

        </div>
      </section>

      {/* ── re:markt ministry quote block — editorial width, dark bg ────── */}
      {/* Bottom margin is 0 because <main> paddingTop + FadeSection paddingTop
          already provide the same 80–96px transition that odo/maya have between
          hero image and opening — keeps all three case studies visually aligned. */}
      {content?.ministryQuoteBlock && (
        <div style={{ padding: '0 2rem', margin: 'clamp(3rem, 8vw, 5rem) 0 0' }}>
          <div
            style={{
              maxWidth: '760px',
              margin: '0 auto',
              backgroundColor: accent,
              padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)',
            }}
          >
            <p
              style={{
                fontFamily: FONT,
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: 'clamp(1rem, 1.5vw, 1.4rem)',
                lineHeight: 1.65,
                color: '#FAFAFA',
                margin: '0 0 1.25rem',
              }}
            >
              "{content.ministryQuoteBlock.text}"
            </p>
            <p
              style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(250,250,250,0.55)',
                margin: 0,
              }}
            >
              — {content.ministryQuoteBlock.attribution}
            </p>
          </div>
        </div>
      )}

      {/* ── Body content ──────────────────────────────────────────────── */}
      <main style={{ paddingTop: 'clamp(1.5rem, 3vh, 2.5rem)', paddingBottom: '8rem' }}>
        <div className="editorial-width" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>

          {/* Opening — "What this project is really about" */}
          {content && (
            <FadeSection id="opening">
              <h2
                style={{
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: '0.68rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#6B6B6B',
                  margin: '0 0 1.5rem',
                }}
              >
                What this project is really about
              </h2>
              <Para>{content.opening.paragraphs[0]}</Para>

              {content.opening.paragraphs.length > 1 && (
                <>
                  <ExpandableSection isOpen={isOpen(-1)}>
                    {content.opening.paragraphs.slice(1).map((p, i) => (
                      <Para key={i}>{p}</Para>
                    ))}
                  </ExpandableSection>
                  <ToggleButton isOpen={isOpen(-1)} onToggle={() => toggle(-1)} />
                </>
              )}
            </FadeSection>
          )}

          {/* Challenge / Strategy / Results */}
          {content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ChallengeBlock
                challenge={content.csr.challenge}
                strategy={content.csr.strategy}
                results={content.csr.results}
                accentColor={accent}
              />
            </motion.div>
          )}

          {/* Chapters */}
          {content?.chapters.map((chapter, i) => {
            const isImpact = i === 6
            const isReflection = i === 7
            const open = isOpen(i)

            const visibleCount = Math.max(1, chapter.visibleParagraphs ?? 1)
            const hasExpandContent =
              chapter.paragraphs.length > visibleCount ||
              chapter.pullQuote ||
              chapter.callout ||
              (chapter.expandImages && chapter.expandImages.length > 0) ||
              (isImpact && chapter.impactText && chapter.impactText.length > 0)

            // Phone-layout media gets a side-by-side split with Para 1 instead
            // of stacking below it. Rules:
            //  - phone-layout beforeVideo always triggers the split
            //  - phone-layout beforeImage triggers the split ONLY when there
            //    is no other non-phone beforeVideo competing for the slot
            //    (otherwise the cover video would be hidden by the split)
            const splitVideo = chapter.beforeVideo?.layout === 'phone' ? chapter.beforeVideo : undefined
            const hasNonPhoneVideo =
              !!chapter.beforeVideo && chapter.beforeVideo.layout !== 'phone'
            const splitImage =
              !splitVideo && !hasNonPhoneVideo && chapter.beforeImage?.layout === 'phone'
                ? chapter.beforeImage
                : undefined
            const isSplit = Boolean(splitVideo || splitImage)

            return (
              <FadeSection key={i} id={`chapter-${i}`}>
                <ChapterLabel label={chapter.label} accentColor={accent} />
                <ChapterHeadline>{chapter.headline}</ChapterHeadline>

                {/* Split layout: visible paragraphs stack in the text column
                    next to the phone-layout media. Keeps the prose-and-video
                    pair tightly bound instead of letting the second paragraph
                    drift below the whole split. */}
                {isSplit ? (
                  <ChapterMediaSplit
                    paragraphs={chapter.paragraphs.slice(0, visibleCount)}
                    video={splitVideo}
                    image={splitImage}
                  />
                ) : (
                  <>
                    {/* First paragraph — always visible */}
                    <Para>{chapter.paragraphs[0]}</Para>

                    {/* Before-expand video — always visible */}
                    {chapter.beforeVideo && (
                      <ChapterVideoSlot video={chapter.beforeVideo} />
                    )}

                    {/* Additional visible paragraphs render after the media
                        when we're NOT in split mode. */}
                    {visibleCount > 1 &&
                      chapter.paragraphs.slice(1, visibleCount).map((p, j) => (
                        <Para key={`vis-${j}`}>{p}</Para>
                      ))}
                  </>
                )}

                {/* Before-expand image — always visible, max 1 */}
                {/* (Skipped when image is the one consumed by the split) */}
                {chapter.beforeImage && chapter.beforeImage !== splitImage && (
                  chapter.beforeImage.fullWidth ? (
                    <FullWidthImageSlot image={chapter.beforeImage} accentColor={accent} />
                  ) : (
                    <CsImageSlot image={chapter.beforeImage} accentColor={accent} />
                  )
                )}

                {/* Inline editorial bar chart — always visible */}
                {chapter.beforeChart && (
                  <ChapterBarChart chart={chapter.beforeChart} accentColor={accent} />
                )}

                {/* Phone row — always visible, side-by-side with accent border */}
                {chapter.phoneRow && chapter.phoneRow.length > 0 && (
                  <PhoneRowSlot images={chapter.phoneRow} accentColor={accent} />
                )}

                {/* Impact stats — always visible */}
                {isImpact && chapter.impactStats && (
                  <ImpactGrid stats={chapter.impactStats} accentColor={accent} />
                )}

                {/* Key takeaway — always visible in reflection */}
                {isReflection && chapter.keyTakeaway && (
                  <KeyTakeaway
                    title={chapter.keyTakeaway.title}
                    body={chapter.keyTakeaway.body}
                    accentColor={accent}
                  />
                )}

                {/* Expandable content */}
                {hasExpandContent && (
                  <ExpandableSection isOpen={open}>
                    {chapter.paragraphs.slice(1).map((p, j) => (
                      <Para key={j}>{p}</Para>
                    ))}
                    {chapter.pullQuote && (
                      <PullQuote
                        text={chapter.pullQuote.text}
                        attribution={chapter.pullQuote.attribution}
                        accentColor={accent}
                      />
                    )}
                    {chapter.callout && (
                      <Callout
                        title={chapter.callout.title}
                        body={chapter.callout.body}
                        accentColor={accent}
                      />
                    )}
                    {isImpact && chapter.impactText?.map((p, j) => (
                      <Para key={`it-${j}`}>{p}</Para>
                    ))}
                    {/* Expand images — fade in */}
                    {chapter.expandImages?.map((img, j) =>
                      img.fullWidth ? (
                        <FullWidthImageSlot
                          key={j}
                          image={img}
                          accentColor={accent}
                          fadeIn
                          isVisible={open}
                        />
                      ) : (
                        <CsImageSlot
                          key={j}
                          image={img}
                          accentColor={accent}
                          fadeIn
                          isVisible={open}
                        />
                      )
                    )}
                  </ExpandableSection>
                )}

                {/* Toggle button — always below expandable content */}
                {hasExpandContent && (
                  <ToggleButton isOpen={open} onToggle={() => toggle(i)} />
                )}
              </FadeSection>
            )
          })}
        </div>
      </main>

      {/* ── Next case study ──────────────────────────────────────────── */}
      {(() => {
        const idx = caseStudies.findIndex((p) => p.slug === project.slug)
        if (idx === -1) return null
        const next = caseStudies[(idx + 1) % caseStudies.length]
        if (!next || next.slug === project.slug) return null
        return <NextCaseBlock next={next} currentAccent={accent} />
      })()}

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer
        style={{
          padding: '1.75rem 2rem',
        }}
      >
        <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: '0.78rem', color: '#A0A0A0' }}>
          © 2025 Luke Caporelli
        </span>
      </footer>
    </div>
  )
}

// ── Next case block ──────────────────────────────────────────────────────────
function NextCaseBlock({ next, currentAccent }: { next: Project; currentAccent: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={`/projects/${next.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          padding: 'clamp(2.5rem, 6vw, 4rem) 2rem',
          maxWidth: '760px',
          margin: '0 auto',
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: '0.68rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: currentAccent,
            display: 'block',
            marginBottom: '1rem',
          }}
        >
          Next case
        </span>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <h3
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: '#0A0A0A',
              margin: 0,
            }}
          >
            {next.name}
          </h3>
          <motion.span
            animate={{ x: hovered ? 6 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: FONT,
              fontWeight: 300,
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              lineHeight: 1,
              color: '#0A0A0A',
            }}
          >
            →
          </motion.span>
        </div>

        {next.problemStatement && (
          <p
            style={{
              fontFamily: FONT,
              fontWeight: 300,
              fontSize: '0.95rem',
              lineHeight: 1.55,
              color: '#6B6B6B',
              margin: '0.85rem 0 0',
              maxWidth: '52ch',
            }}
          >
            {next.problemStatement}
          </p>
        )}
      </div>
    </Link>
  )
}
