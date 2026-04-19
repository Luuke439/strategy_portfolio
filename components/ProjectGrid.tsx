'use client'

import { useState, useEffect, useRef } from 'react'
import { projects } from '@/data/projects'
import ProjectCard, { type TileHoverInfo } from './ProjectCard'

interface ProjectGridProps {
  onProjectHover?: (info: TileHoverInfo | null) => void
}

// ── Responsive breakpoints ────────────────────────────────────────────────────
type Breakpoint = 'desktop' | 'tablet' | 'mobile'

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>('desktop')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setBp(w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop')
    }

    // Debounced resize — only re-renders when the user stops resizing (150 ms)
    const onResize = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(update, 150)
    }

    update() // set immediately on mount
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return bp
}

// ── Row height formula ────────────────────────────────────────────────────────
//
//  odo occupies 6 of 12 columns ≈ 50% of the available grid width.
//  Target: odo height = 75% of odo width.
//
//  odo width  ≈ 50vw − 2rem − 4px  (50% of content area minus gap correction)
//  odo height = 75% × odo width ≈ 37.5vw − 1.5rem
//  odo spans 2 rows + 1 gap (8px):  row height = (odo height − 8px) / 2
//             ≈ (37.5vw − 1.5rem − 8px) / 2
//             ≈ 18.75vw − 0.75rem − 4px
//
//  Simplified: calc(18.5vw - 1rem)  — verified at 1280px: ≈ 221px
//  → odo: 2×221 + 8 = 450px tall, 604px wide → 74.5% ≈ 75% ✓

const ROW = 'calc(18.5vw - 1rem)'

// ── Grid layout ───────────────────────────────────────────────────────────────
//
//  12-col · 2 rows per half · gap 8px · freely scrollable
//
//  TOP HALF (normal flow):
//  [ odo · 6c × 2r ] [ packyourride · 3c ] [ maya · 3c × 2r ]
//                    [ spotify      · 3c ]
//
//  BOTTOM HALF (position: sticky; bottom: 0 — sticks to viewport
//               bottom as the top half scrolls away):
//  [ expressive · 3c × 2r ] [ blend-it    · 3c ] [ remarkt · 6c × 2r ]
//                            [ placeholder · 3c ]

export default function ProjectGrid({ onProjectHover }: ProjectGridProps) {
  const bp = useBreakpoint()
  const find = (slug: string) => projects.find((p) => p.slug === slug)!

  // ── Mobile: single-column stack ────────────────────────────────────────────
  if (bp === 'mobile') {
    return (
      <div style={{ padding: '4.5rem 1rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          'odo', 'packyourride', 'spotify-dashboard', 'maya',
          'expressive-messaging', 'blend-it', 'brand-communication', 'remarkt',
        ].map((slug) => (
          <div key={slug} style={{ height: '220px' }}>
            <ProjectCard project={find(slug)} onHoverChange={onProjectHover} />
          </div>
        ))}
      </div>
    )
  }

  // ── Tablet: 2-column grid ──────────────────────────────────────────────────
  if (bp === 'tablet') {
    return (
      <div style={{ padding: '4.5rem 1.5rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <div style={{ gridColumn: '1 / 3', height: '320px' }}>
            <ProjectCard project={find('odo')} onHoverChange={onProjectHover} />
          </div>
          {['packyourride', 'spotify-dashboard'].map((slug) => (
            <div key={slug} style={{ height: '180px' }}>
              <ProjectCard project={find(slug)} onHoverChange={onProjectHover} />
            </div>
          ))}
          <div style={{ gridColumn: '1 / 3', height: '280px' }}>
            <ProjectCard project={find('maya')} onHoverChange={onProjectHover} />
          </div>
          {['expressive-messaging', 'blend-it'].map((slug) => (
            <div key={slug} style={{ height: '180px' }}>
              <ProjectCard project={find(slug)} onHoverChange={onProjectHover} />
            </div>
          ))}
          <div style={{ gridColumn: '1 / 3', height: '180px' }}>
            <ProjectCard project={find('brand-communication')} onHoverChange={onProjectHover} />
          </div>
          <div style={{ gridColumn: '1 / 3', height: '320px' }}>
            <ProjectCard project={find('remarkt')} onHoverChange={onProjectHover} />
          </div>
        </div>
      </div>
    )
  }

  // ── Desktop ────────────────────────────────────────────────────────────────
  const colGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridTemplateRows: `repeat(2, ${ROW})`,
    gap: '8px',
  }

  return (
    <div style={{ padding: '4.5rem 2rem 0' }}>

      {/* ── TOP HALF — scrolls normally ──────────────────────────────── */}
      <div style={{ ...colGrid, marginBottom: '8px' }}>

        {/* odo — 6c × 2r (featured, landscape) */}
        <div style={{ gridColumn: '1 / 7', gridRow: '1 / 3' }}>
          <ProjectCard project={find('odo')} onHoverChange={onProjectHover} />
        </div>

        {/* packyourride — 3c × 1r (top of middle stack) */}
        <div style={{ gridColumn: '7 / 10', gridRow: '1 / 2' }}>
          <ProjectCard project={find('packyourride')} onHoverChange={onProjectHover} />
        </div>

        {/* spotify — 3c × 1r (bottom of middle stack) */}
        <div style={{ gridColumn: '7 / 10', gridRow: '2 / 3' }}>
          <ProjectCard project={find('spotify-dashboard')} onHoverChange={onProjectHover} />
        </div>

        {/* maya — 3c × 2r (portrait, right — ideal for iPhone mockup) */}
        <div style={{ gridColumn: '10 / 13', gridRow: '1 / 3' }}>
          <ProjectCard project={find('maya')} onHoverChange={onProjectHover} />
        </div>
      </div>

      {/* ── BOTTOM HALF — flows naturally after top half ──────────────── */}
      <div style={{ paddingBottom: '1.4rem' }}>
        <div style={colGrid}>

          {/* expressive — 3c × 2r (portrait, left — mirror of maya) */}
          <div style={{ gridColumn: '1 / 4', gridRow: '1 / 3' }}>
            <ProjectCard project={find('expressive-messaging')} onHoverChange={onProjectHover} />
          </div>

          {/* blend it! — 3c × 1r (top of middle stack) */}
          <div style={{ gridColumn: '4 / 7', gridRow: '1 / 2' }}>
            <ProjectCard project={find('blend-it')} onHoverChange={onProjectHover} />
          </div>

          {/* placeholder — 3c × 1r (bottom of middle stack) */}
          <div style={{ gridColumn: '4 / 7', gridRow: '2 / 3' }}>
            <ProjectCard project={find('brand-communication')} onHoverChange={onProjectHover} />
          </div>

          {/* remarkt — 6c × 2r (featured, landscape — mirror of odo) */}
          <div style={{ gridColumn: '7 / 13', gridRow: '1 / 3' }}>
            <ProjectCard project={find('remarkt')} onHoverChange={onProjectHover} />
          </div>
        </div>
      </div>

    </div>
  )
}
