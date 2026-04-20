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
    const onResize = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(update, 150)
    }
    update()
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return bp
}

// ── Row height formula ────────────────────────────────────────────────────────
const ROW = 'calc(20vw)'

export default function ProjectGrid({ onProjectHover }: ProjectGridProps) {
  const bp = useBreakpoint()
  const find = (slug: string) => projects.find((p) => p.slug === slug)!

  // ── Mobile: single-column stack ────────────────────────────────────────────
  if (bp === 'mobile') {
    const order = [
      'odo', 'packyourride', 'spotify-dashboard', 'maya',
      'expressive-messaging', 'blend-it', 'brand-communication', 'remarkt',
    ]
    return (
      <div style={{ padding: '4.5rem 1rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {order.map((slug, i) => (
          <div key={slug} style={{ height: '220px' }}>
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
            <ProjectCard project={find('brand-communication')} onHoverChange={onProjectHover} revealIndex={2} />
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
            <ProjectCard project={find('brand-communication')} onHoverChange={onProjectHover} revealIndex={3} />
          </div>

          <div style={{ gridColumn: '7 / 13', gridRow: '1 / 3' }}>
            <ProjectCard project={find('remarkt')} onHoverChange={onProjectHover} revealIndex={2} />
          </div>
        </div>
      </div>

    </div>
  )
}
