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
    // Mobile-specific order: the three case studies lead, smaller projects
    // follow. (Desktop keeps its masonry order — that's tuned for the
    // 12-col grid's visual balance, not for the linear flow of a phone.)
    const order = [
      'remarkt', 'staedtler',
      'odo', 'expressive-messaging',
      'vera', 'maya', 'thesis',
      'tourewerk',
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
        {order.map((slug, i) => {
          const project = find(slug)
          // Aspect-ratio 5/4 matches the desktop card aspect (ROW = 20vw,
          // each card spans 3 cols × 1 row → 25vw × 20vw = 5:4). Using the
          // same shape on mobile means cover positioning the designer
          // tuned on desktop continues to frame the subject correctly —
          // 4/5 portrait was clipping landscape photography from the sides.
          // Per-project `mobileAspect` overrides the default for covers
          // that were shot vertically.
          const aspect = project.mobileAspect ?? '5 / 4'
          return (
            <div key={slug} style={{ aspectRatio: aspect }}>
              <ProjectCard
                project={project}
                onHoverChange={onProjectHover}
                revealIndex={i}
              />
            </div>
          )
        })}
      </div>
    )
  }

  // ── Tablet: 2-column grid ──────────────────────────────────────────────────
  if (bp === 'tablet') {
    return (
      <div style={{ padding: '4.5rem 1.5rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <div style={{ gridColumn: '1 / 3', height: '320px' }}>
            <ProjectCard project={find('remarkt')} onHoverChange={onProjectHover} revealIndex={0} />
          </div>
          <div style={{ gridColumn: '1 / 3', height: '280px' }}>
            <ProjectCard project={find('staedtler')} onHoverChange={onProjectHover} revealIndex={0} />
          </div>
          {['odo', 'expressive-messaging'].map((slug, i) => (
            <div key={slug} style={{ height: '180px' }}>
              <ProjectCard project={find(slug)} onHoverChange={onProjectHover} revealIndex={i + 1} />
            </div>
          ))}
          {['vera', 'tourewerk'].map((slug, i) => (
            <div key={slug} style={{ height: '180px' }}>
              <ProjectCard project={find(slug)} onHoverChange={onProjectHover} revealIndex={i + 1} />
            </div>
          ))}
          {['maya', 'thesis'].map((slug, i) => (
            <div key={slug} style={{ height: '180px' }}>
              <ProjectCard project={find(slug)} onHoverChange={onProjectHover} revealIndex={i + 1} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Desktop ────────────────────────────────────────────────────────────────
  //
  //  Stagger order is chosen for visual balance across the masonry layout.
  //  Top half:    remarkt(0 anchor) → tourewerk(1) → expressive(3) → staedtler(2)
  //  Bottom half: maya(0) → vera(1) → thesis(3) → odo(2 wide)
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
          <ProjectCard project={find('remarkt')} onHoverChange={onProjectHover} revealIndex={0} />
        </div>

        <div style={{ gridColumn: '7 / 10', gridRow: '1 / 2' }}>
          <ProjectCard project={find('tourewerk')} onHoverChange={onProjectHover} revealIndex={1} />
        </div>

        <div style={{ gridColumn: '7 / 10', gridRow: '2 / 3' }}>
          <ProjectCard project={find('expressive-messaging')} onHoverChange={onProjectHover} revealIndex={3} />
        </div>

        <div style={{ gridColumn: '10 / 13', gridRow: '1 / 3' }}>
          <ProjectCard project={find('staedtler')} onHoverChange={onProjectHover} revealIndex={2} />
        </div>
      </div>

      {/* ── BOTTOM HALF ──────────────────────────────────────────────────── */}
      <div style={{ paddingBottom: '8px' }}>
        <div style={colGrid}>

          <div style={{ gridColumn: '1 / 4', gridRow: '1 / 3' }}>
            <ProjectCard project={find('maya')} onHoverChange={onProjectHover} revealIndex={0} />
          </div>

          <div style={{ gridColumn: '4 / 7', gridRow: '1 / 2' }}>
            <ProjectCard project={find('vera')} onHoverChange={onProjectHover} revealIndex={1} />
          </div>

          <div style={{ gridColumn: '4 / 7', gridRow: '2 / 3' }}>
            <ProjectCard project={find('thesis')} onHoverChange={onProjectHover} revealIndex={3} />
          </div>

          <div style={{ gridColumn: '7 / 13', gridRow: '1 / 3' }}>
            <ProjectCard project={find('odo')} onHoverChange={onProjectHover} revealIndex={2} />
          </div>
        </div>
      </div>

    </div>
  )
}
