'use client'

import { projects } from '@/data/projects'
import ProjectCard, { type TileHoverInfo } from './ProjectCard'
import { useViewport } from '@/lib/useViewport'

interface ProjectGridProps {
  onProjectHover?: (info: TileHoverInfo | null) => void
}

// ── Row height formula ────────────────────────────────────────────────────────
const ROW = 'calc(20vw)'

export default function ProjectGrid({ onProjectHover }: ProjectGridProps) {
  const bp = useViewport()
  const find = (slug: string) => projects.find((p) => p.slug === slug)!

  // ── Mobile: single-column stack ────────────────────────────────────────────
  // The grid leads the page on mobile (no hero), so top padding only needs
  // to clear the iOS notch/status-bar safe area + a small breathing margin.
  // Bottom padding leaves room for the BottomDock to float above content.
  // Cards use aspect-ratio instead of a fixed 220px height so they scale
  // with viewport width — feels right on 360px Galaxy as well as 430px Pro Max.
  if (bp === 'mobile') {
    const order = [
      'odo', 'packyourride', 'spotify-dashboard', 'maya',
      'expressive-messaging', 'blend-it', 'resaga', 'remarkt',
    ]
    return (
      <div
        style={{
          padding: 'calc(env(safe-area-inset-top, 0px) + 1.25rem) 1rem 7rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {order.map((slug, i) => (
          <div key={slug} style={{ aspectRatio: '4 / 5' }}>
            <ProjectCard
              project={find(slug)}
              onHoverChange={onProjectHover}
              revealIndex={i}
            />
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
            <ProjectCard project={find('odo')} onHoverChange={onProjectHover} revealIndex={0} />
          </div>
          {['packyourride', 'spotify-dashboard'].map((slug, i) => (
            <div key={slug} style={{ height: '180px' }}>
              <ProjectCard project={find(slug)} onHoverChange={onProjectHover} revealIndex={i + 1} />
            </div>
          ))}
          <div style={{ gridColumn: '1 / 3', height: '280px' }}>
            <ProjectCard project={find('maya')} onHoverChange={onProjectHover} revealIndex={0} />
          </div>
          {['expressive-messaging', 'blend-it'].map((slug, i) => (
            <div key={slug} style={{ height: '180px' }}>
              <ProjectCard project={find(slug)} onHoverChange={onProjectHover} revealIndex={i + 1} />
            </div>
          ))}
          <div style={{ gridColumn: '1 / 3', height: '180px' }}>
            <ProjectCard project={find('resaga')} onHoverChange={onProjectHover} revealIndex={2} />
          </div>
          <div style={{ gridColumn: '1 / 3', height: '320px' }}>
            <ProjectCard project={find('remarkt')} onHoverChange={onProjectHover} revealIndex={0} />
          </div>
        </div>
      </div>
    )
  }

  // ── Desktop ────────────────────────────────────────────────────────────────
  //
  //  Stagger order is chosen for visual balance across the masonry layout.
  //  Top half:    odo(0) → packyourride(1) → maya(2) → spotify(3)
  //  Bottom half: expressive(0) → blend-it(1) → remarkt(2) → brand-comm(3)
  //
  const colGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridTemplateRows: `repeat(2, ${ROW})`,
    gap: '8px',
  }

  return (
    <div style={{ padding: '4.5rem 8px 0' }}>

      {/* ── TOP HALF ─────────────────────────────────────────────────────── */}
      <div style={{ ...colGrid, marginBottom: '8px' }}>

        <div style={{ gridColumn: '1 / 7', gridRow: '1 / 3' }}>
          <ProjectCard project={find('odo')} onHoverChange={onProjectHover} revealIndex={0} />
        </div>

        <div style={{ gridColumn: '7 / 10', gridRow: '1 / 2' }}>
          <ProjectCard project={find('packyourride')} onHoverChange={onProjectHover} revealIndex={1} />
        </div>

        <div style={{ gridColumn: '7 / 10', gridRow: '2 / 3' }}>
          <ProjectCard project={find('spotify-dashboard')} onHoverChange={onProjectHover} revealIndex={3} />
        </div>

        <div style={{ gridColumn: '10 / 13', gridRow: '1 / 3' }}>
          <ProjectCard project={find('maya')} onHoverChange={onProjectHover} revealIndex={2} />
        </div>
      </div>

      {/* ── BOTTOM HALF ──────────────────────────────────────────────────── */}
      <div style={{ paddingBottom: '8px' }}>
        <div style={colGrid}>

          <div style={{ gridColumn: '1 / 4', gridRow: '1 / 3' }}>
            <ProjectCard project={find('expressive-messaging')} onHoverChange={onProjectHover} revealIndex={0} />
          </div>

          <div style={{ gridColumn: '4 / 7', gridRow: '1 / 2' }}>
            <ProjectCard project={find('blend-it')} onHoverChange={onProjectHover} revealIndex={1} />
          </div>

          <div style={{ gridColumn: '4 / 7', gridRow: '2 / 3' }}>
            <ProjectCard project={find('resaga')} onHoverChange={onProjectHover} revealIndex={3} />
          </div>

          <div style={{ gridColumn: '7 / 13', gridRow: '1 / 3' }}>
            <ProjectCard project={find('remarkt')} onHoverChange={onProjectHover} revealIndex={2} />
          </div>
        </div>
      </div>

    </div>
  )
}
