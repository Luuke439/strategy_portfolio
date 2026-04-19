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
const ROW = 'calc(18.5vw - 1rem)'

export default function ProjectGrid({ onProjectHover }: ProjectGridProps) {
  const bp = useBreakpoint()
  const find = (slug: string) => projects.find((p) => p.slug === slug)!

  // ── Reveal state ───────────────────────────────────────────────────────────
  const topRef    = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [topRevealed,    setTopRevealed]    = useState(false)
  const [bottomRevealed, setBottomRevealed] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (e.target === topRef.current)    setTopRevealed(true)
            if (e.target === bottomRef.current) setBottomRevealed(true)
          }
        })
      },
      { threshold: 0.04, rootMargin: '0px 0px -40px 0px' },
    )
    if (topRef.current)    obs.observe(topRef.current)
    if (bottomRef.current) obs.observe(bottomRef.current)
    return () => obs.disconnect()
  }, [bp]) // re-attach when layout switches (topRef moves to a new element)

  // ── Mobile: single-column stack ────────────────────────────────────────────
  if (bp === 'mobile') {
    const order = [
      'odo', 'packyourride', 'spotify-dashboard', 'maya',
      'expressive-messaging', 'blend-it', 'brand-communication', 'remarkt',
    ]
    return (
      <div ref={topRef} style={{ padding: '4.5rem 1rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {order.map((slug, i) => (
          <div key={slug} style={{ height: '220px' }}>
            <ProjectCard
              project={find(slug)}
              onHoverChange={onProjectHover}
              revealIndex={i}
              isRevealed={topRevealed}
            />
          </div>
        ))}
      </div>
    )
  }

  // ── Tablet: 2-column grid ──────────────────────────────────────────────────
  if (bp === 'tablet') {
    const order = [
      'odo', 'packyourride', 'spotify-dashboard', 'maya',
      'expressive-messaging', 'blend-it', 'brand-communication', 'remarkt',
    ]
    return (
      <div ref={topRef} style={{ padding: '4.5rem 1.5rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <div style={{ gridColumn: '1 / 3', height: '320px' }}>
            <ProjectCard project={find('odo')} onHoverChange={onProjectHover} revealIndex={0} isRevealed={topRevealed} />
          </div>
          {['packyourride', 'spotify-dashboard'].map((slug, i) => (
            <div key={slug} style={{ height: '180px' }}>
              <ProjectCard project={find(slug)} onHoverChange={onProjectHover} revealIndex={i + 1} isRevealed={topRevealed} />
            </div>
          ))}
          <div style={{ gridColumn: '1 / 3', height: '280px' }}>
            <ProjectCard project={find('maya')} onHoverChange={onProjectHover} revealIndex={3} isRevealed={topRevealed} />
          </div>
          {['expressive-messaging', 'blend-it'].map((slug, i) => (
            <div key={slug} style={{ height: '180px' }}>
              <ProjectCard project={find(slug)} onHoverChange={onProjectHover} revealIndex={i + 4} isRevealed={topRevealed} />
            </div>
          ))}
          <div style={{ gridColumn: '1 / 3', height: '180px' }}>
            <ProjectCard project={find('brand-communication')} onHoverChange={onProjectHover} revealIndex={6} isRevealed={topRevealed} />
          </div>
          <div style={{ gridColumn: '1 / 3', height: '320px' }}>
            <ProjectCard project={find('remarkt')} onHoverChange={onProjectHover} revealIndex={7} isRevealed={topRevealed} />
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
    <div style={{ padding: '4.5rem 2rem 0' }}>

      {/* ── TOP HALF ─────────────────────────────────────────────────────── */}
      <div ref={topRef} style={{ ...colGrid, marginBottom: '8px' }}>

        <div style={{ gridColumn: '1 / 7', gridRow: '1 / 3' }}>
          <ProjectCard project={find('odo')} onHoverChange={onProjectHover} revealIndex={0} isRevealed={topRevealed} />
        </div>

        <div style={{ gridColumn: '7 / 10', gridRow: '1 / 2' }}>
          <ProjectCard project={find('packyourride')} onHoverChange={onProjectHover} revealIndex={1} isRevealed={topRevealed} />
        </div>

        <div style={{ gridColumn: '7 / 10', gridRow: '2 / 3' }}>
          <ProjectCard project={find('spotify-dashboard')} onHoverChange={onProjectHover} revealIndex={3} isRevealed={topRevealed} />
        </div>

        <div style={{ gridColumn: '10 / 13', gridRow: '1 / 3' }}>
          <ProjectCard project={find('maya')} onHoverChange={onProjectHover} revealIndex={2} isRevealed={topRevealed} />
        </div>
      </div>

      {/* ── BOTTOM HALF ──────────────────────────────────────────────────── */}
      <div style={{ paddingBottom: '1.4rem' }}>
        <div ref={bottomRef} style={colGrid}>

          <div style={{ gridColumn: '1 / 4', gridRow: '1 / 3' }}>
            <ProjectCard project={find('expressive-messaging')} onHoverChange={onProjectHover} revealIndex={0} isRevealed={bottomRevealed} />
          </div>

          <div style={{ gridColumn: '4 / 7', gridRow: '1 / 2' }}>
            <ProjectCard project={find('blend-it')} onHoverChange={onProjectHover} revealIndex={1} isRevealed={bottomRevealed} />
          </div>

          <div style={{ gridColumn: '4 / 7', gridRow: '2 / 3' }}>
            <ProjectCard project={find('brand-communication')} onHoverChange={onProjectHover} revealIndex={3} isRevealed={bottomRevealed} />
          </div>

          <div style={{ gridColumn: '7 / 13', gridRow: '1 / 3' }}>
            <ProjectCard project={find('remarkt')} onHoverChange={onProjectHover} revealIndex={2} isRevealed={bottomRevealed} />
          </div>
        </div>
      </div>

    </div>
  )
}
