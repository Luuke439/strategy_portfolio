'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, MotionValue, useMotionValue, useTransform } from 'framer-motion'

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

// Same gradient as NavLabel3D (GlassNav.tsx) — keeps the brand chrome
// language coherent across desktop top-pill and mobile bottom-sheet.
const CHROME_GRADIENT =
  'linear-gradient(352deg, #d8d8d8 0%, #a4a4a4 26%, #f0f0f0 46%, #747474 66%, #c4c4c4 100%)'

const NAV_LINKS = [
  { label: 'About',    href: '/about',                                       external: false },
  { label: 'CV',       href: '/Resume_Luke_Caporelli.pdf',                  external: true  },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/luke-caporelli',  external: true  },
]

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  /** Optional — exposed so the dock can read the drag position if it ever
   *  needs to coordinate (currently unused but kept for future tilt logic). */
  sheetY?: MotionValue<number>
  /** Chapter labels for case-study scroll-spy. */
  chapters?: string[]
  activeChapter?: number
  accentColor?: string
}

export default function BottomSheet({
  open,
  onClose,
  chapters,
  activeChapter = 0,
  accentColor = '#0A0A0A',
}: BottomSheetProps) {
  const hasChapters = Boolean(chapters && chapters.length > 0)
  const sheetRef = useRef<HTMLDivElement>(null)

  // ── Body scroll lock while sheet is open ─────────────────────────────────
  // Otherwise scrolling inside the sheet bleeds to the page (rubber-band on
  // iOS) and the page can scroll under your finger when you're trying to
  // tap a chapter.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // ── Escape key closes ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // ── Drag dismiss ─────────────────────────────────────────────────────────
  // Sheet uses its own motion value for the drag — backdrop fades with it
  // so the UI feels physically connected.
  const dragY = useMotionValue(0)
  const backdropOpacity = useTransform(dragY, [0, 240], [1, 0])

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number }; velocity: { y: number } },
  ) => {
    // Threshold: either far enough or fast enough downward, close it.
    if (info.offset.y > 120 || info.velocity.y > 600) {
      onClose()
    }
    // Snap back is handled by Framer when we don't dismiss.
  }

  // Smooth scroll a chapter into view, then close. We use the standard
  // browser scrollIntoView so this works whether or not Lenis is mounted.
  const jumpToChapter = (i: number) => {
    const el = document.getElementById(`chapter-${i}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // Defer the close so the scroll has begun before the sheet collapses —
    // visually it feels like the sheet got out of the way of the destination.
    setTimeout(onClose, 120)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(20,20,24,0.32)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
              // Backdrop dim fades with the drag, so dragging halfway gives
              // a sense of "the sheet is on its way out" without committing.
              opacity: backdropOpacity,
            }}
            aria-hidden
          />

          {/* ── Sheet panel ────────────────────────────────────────────── */}
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.45 }}
            onDragEnd={handleDragEnd}
            style={{
              y: dragY,
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 201,
              // Frosted glass — same blur/saturate recipe as the dock pill
              background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(250,250,250,0.96) 100%)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              borderTopLeftRadius: '26px',
              borderTopRightRadius: '26px',
              borderTop: '1px solid rgba(255,255,255,0.7)',
              boxShadow: [
                '0 -10px 40px rgba(0,0,0,0.18)',
                'inset 0 1.5px 0 rgba(255,255,255,0.80)',
              ].join(', '),
              paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.4rem)',
              maxHeight: '80vh',
              overflowY: 'auto',
              touchAction: 'pan-y',
            }}
          >
            {/* Drag handle */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '12px 0 4px',
              }}
              aria-hidden
            >
              <div
                style={{
                  width: '44px',
                  height: '4px',
                  borderRadius: '2px',
                  background: 'rgba(0,0,0,0.16)',
                }}
              />
            </div>

            {/* ── CHAPTERS section (case-study only) ─────────────────── */}
            {hasChapters && (
              <section style={{ padding: '1.25rem 1.75rem 0.5rem' }}>
                <SectionLabel>Chapters</SectionLabel>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem' }}>
                  {chapters!.map((chapter, i) => {
                    const isActive = i === activeChapter
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => jumpToChapter(i)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.85rem',
                            width: '100%',
                            background: 'none',
                            border: 'none',
                            padding: '0.85rem 0',
                            textAlign: 'left',
                            cursor: 'pointer',
                            // Subtle separator between chapter rows
                            borderBottom: i === chapters!.length - 1
                              ? 'none'
                              : '1px solid rgba(0,0,0,0.06)',
                          }}
                        >
                          {/* Index — uses accent color when active */}
                          <span
                            style={{
                              fontFamily: FONT,
                              fontWeight: 500,
                              fontSize: '0.65rem',
                              letterSpacing: '0.12em',
                              color: isActive ? accentColor : '#A0A0A0',
                              minWidth: '24px',
                              transition: 'color 0.2s ease',
                            }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {/* Chapter label */}
                          <span
                            style={{
                              fontFamily: FONT,
                              fontWeight: isActive ? 500 : 400,
                              fontSize: '0.95rem',
                              color: isActive ? '#0A0A0A' : '#6B6B6B',
                              transition: 'color 0.2s ease, font-weight 0.2s ease',
                              flex: 1,
                            }}
                          >
                            {chapter}
                          </span>
                          {/* Active indicator dot */}
                          {isActive && (
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: accentColor,
                              }}
                              aria-hidden
                            />
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}

            {/* ── Navigate section ──────────────────────────────────── */}
            <section style={{ padding: '1.25rem 1.75rem 0.5rem' }}>
              {hasChapters && <SectionLabel>Navigate</SectionLabel>}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        style={navItemStyle}
                      >
                        <ChromeLabel>{link.label}</ChromeLabel>
                        <ExternalArrow />
                      </a>
                    ) : (
                      <Link href={link.href} onClick={onClose} style={navItemStyle}>
                        <ChromeLabel>{link.label}</ChromeLabel>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* ── Foot signature ───────────────────────────────────── */}
            <div
              style={{
                padding: '1.5rem 1.75rem 0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 300,
                  fontSize: '0.72rem',
                  color: '#A0A0A0',
                  letterSpacing: '0.04em',
                }}
              >
                © 2025 Luke Caporelli
              </span>
              <a
                href="mailto:hello@lukecaporelli.com"
                style={{
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: '0.78rem',
                  color: '#0A0A0A',
                  textDecoration: 'none',
                }}
              >
                hello@lukecaporelli.com
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────

const navItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.05rem 0',
  textDecoration: 'none',
  color: '#0A0A0A',
  borderBottom: '1px solid rgba(0,0,0,0.06)',
  fontFamily: FONT,
  fontWeight: 500,
  fontSize: '1.4rem',
  letterSpacing: '-0.01em',
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: '0.62rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: '#A0A0A0',
        marginBottom: '0.5rem',
      }}
    >
      {children}
    </div>
  )
}

function ChromeLabel({ children }: { children: string }) {
  return (
    <span
      // chrome-label-mobile-paint trims the 3-layer text-shadow to 2 layers
      // on viewports < 640px — saves real paint cost on tile-deferred GPUs.
      className="chrome-label-mobile-paint"
      style={{
        display: 'inline-block',
        color: 'transparent',
        background: CHROME_GRADIENT,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        textShadow: [
          '0px -0.5px 0 rgba(0,0,0,0.28)',
          '0px -1.5px 0 rgba(0,0,0,0.10)',
          '0px -2px   4px rgba(0,0,0,0.11)',
        ].join(', '),
        filter: 'drop-shadow(0 0.5px 0 rgba(255,255,255,0.58))',
        fontFamily: FONT,
      }}
    >
      {children}
    </span>
  )
}

function ExternalArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M4 4 H10 V10 M10 4 L4 10"
        stroke="#A0A0A0"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
