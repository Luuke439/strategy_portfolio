'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMotionValue } from 'framer-motion'
import { useLenis } from 'lenis/react'
import BottomSheet from './BottomSheet'
import { useChapterContext } from './ChapterContext'

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

// ── Pill geometry ───────────────────────────────────────────────────────────
// Visible CSS chrome-gradient text (not a WebGL anchor). The font size +
// stacked layout match the desktop header pill's visual register so the brand
// reads identically across breakpoints.
const NAME_FONT_SIZE = '0.7rem'
const NAME_LINE_HEIGHT = 1.0

const PILL_BG = 'linear-gradient(175deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.14) 100%)'

// Chrome gradient — same color story as the hero name (HeroNameFallback).
// Darker than the desktop NavLabel3D version because the CSS chrome treatment
// needs more contrast to read against the pill's translucent glass backdrop
// without the WebGL lighting that the desktop chrome relies on.
const CHROME_GRADIENT =
  'linear-gradient(178deg, #5e5e5e 0%, #2a2a2a 22%, #6c6c6c 48%, #1a1a1a 72%, #4a4a4a 100%)'

export default function BottomDock() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const lenis = useLenis()

  // ── Chapter data (case-study only) ───────────────────────────────────────
  // Populated by <ChapterTracker> inside CaseStudyPage. On other routes
  // state is null and the dock degrades to a plain nav menu.
  const { state: chapterState } = useChapterContext()
  const chapters = chapterState?.chapters
  const activeChapter = chapterState?.activeChapter ?? 0
  const accentColor = chapterState?.accentColor

  // Dock is always visible on mobile — there's no hero stage to defer to,
  // so the brand pill and the open-nav affordance lead the page from the
  // first paint.
  const dockVisible = true

  // ── Pill scroll-to-top behaviour ─────────────────────────────────────────
  const handleNameClick = useCallback((e: React.MouseEvent) => {
    if (!isHome) return
    e.preventDefault()
    if (lenis) lenis.scrollTo(0, { duration: 1.1 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [isHome, lenis])

  // ── Sheet state ──────────────────────────────────────────────────────────
  // Keyed by pathname so a route change resets the sheet without a
  // setState-in-effect — useState lazy-init reads the current pathname on
  // mount, and we reset via a tracking ref below.
  const [sheetOpen, setSheetOpen] = useState(false)
  const closeSheet = useCallback(() => setSheetOpen(false), [])
  const openSheet = useCallback(() => setSheetOpen(true), [])

  // Close the sheet on route change — if you tap a link, the new route
  // shouldn't render with the sheet still expanded. We check during render
  // (cheap, idempotent) instead of with useEffect — React 19's hooks rules
  // flag setState-in-effect, and this is exactly the pattern they want us to
  // use instead (see https://react.dev/learn/you-might-not-need-an-effect).
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    if (sheetOpen) setSheetOpen(false)
  }

  // ── Drag-to-dismiss handoff ──────────────────────────────────────────────
  // Sheet owns its own drag; we just pass its motion value through so the
  // dock pill stays anchored visually during the drag.
  const sheetY = useMotionValue(0)

  // ── Press-state for the expand button (touch tactile feedback) ───────────
  const [pressed, setPressed] = useState(false)

  return (
    <>
      {/* ── Pill (always-on) ─────────────────────────────────────────────── */}
      {/* Mobile has no hero stage to defer to, so the dock leads the page
          from first paint — no scroll-to-reveal animation. `.nav-pill` /
          `.is-visible` remain in the class list so the transition machinery
          stays available for future use, but with `is-visible` always
          applied the pill is statically at opacity 1. */}
      <div
        className={`nav-pill${dockVisible ? ' is-visible' : ''}`}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          // Bottom anchor sits above the iOS home-indicator safe area
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.9rem)',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            padding: '0 0 0 18px',
            borderRadius: '100px',
            background: PILL_BG,
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.32)',
            boxShadow: [
              'inset 0 1.5px 0 rgba(255,255,255,0.70)',
              'inset 0 -1px 0 rgba(0,0,0,0.05)',
              '0 10px 32px rgba(0,0,0,0.14)',
              '0 2px 6px rgba(0,0,0,0.08)',
            ].join(', '),
            pointerEvents: dockVisible ? 'auto' : 'none',
          }}
        >
          {/* Brand label inside the pill — visible CSS chrome text, stacked
              over two lines to match the HeroNameFallback's layout language. */}
          <Link
            href="/"
            onClick={handleNameClick}
            tabIndex={dockVisible ? 0 : -1}
            aria-hidden={!dockVisible}
            aria-label="Luke Caporelli — home"
            className="chrome-label-mobile-paint"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '10px 18px 10px 0',
              cursor: 'pointer',
              userSelect: 'none',
              pointerEvents: dockVisible ? 'auto' : 'none',
              textDecoration: 'none',
              // ↓ Chrome gradient text — matches desktop NavLabel3D
              color: 'transparent',
              background: CHROME_GRADIENT,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: NAME_FONT_SIZE,
              lineHeight: NAME_LINE_HEIGHT,
              letterSpacing: '0.02em',
              textShadow: [
                '0px -0.5px 0 rgba(0,0,0,0.28)',
                '0px -2px 4px rgba(0,0,0,0.11)',
              ].join(', '),
              filter: 'drop-shadow(0 0.5px 0 rgba(255,255,255,0.58))',
            }}
          >
            <span>LUKE</span>
            <span>CAPORELLI</span>
          </Link>

          {/* Vertical divider */}
          <div
            style={{
              alignSelf: 'center',
              width: '1px',
              height: '20px',
              background: 'rgba(0,0,0,0.10)',
              flexShrink: 0,
            }}
          />

          {/* Expand button — opens the sheet (Task 5) */}
          <button
            type="button"
            onClick={openSheet}
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => setPressed(false)}
            onPointerLeave={() => setPressed(false)}
            tabIndex={dockVisible ? 0 : -1}
            aria-hidden={!dockVisible}
            aria-label="Open navigation"
            aria-expanded={sheetOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 18px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              pointerEvents: dockVisible ? 'auto' : 'none',
              transform: pressed ? 'scale(0.92)' : 'scale(1)',
              transition: 'transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <ExpandChevron open={sheetOpen} />
          </button>
        </div>
      </div>

      {/* ── Sheet (State C + D) ──────────────────────────────────────────── */}
      <BottomSheet
        open={sheetOpen}
        onClose={closeSheet}
        sheetY={sheetY}
        chapters={chapters}
        activeChapter={activeChapter}
        accentColor={accentColor}
      />
    </>
  )
}

/* ── Expand chevron ─────────────────────────────────────────────────────────
   Animates between a ↑ (closed → "tap to open") and ✕ (open → "tap to close"),
   matching the visual register of the sheet's drag-handle.            */
function ExpandChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      aria-hidden
    >
      <path
        d="M3 9 L7 5 L11 9"
        stroke="#0A0A0A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
