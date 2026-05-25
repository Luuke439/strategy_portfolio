'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, MotionValue, useMotionValue, useTransform } from 'framer-motion'
import { AUTHOR } from '@/lib/site'

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
}

export default function BottomSheet({
  open,
  onClose,
}: BottomSheetProps) {
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

            {/* ── Nav links ─────────────────────────────────────────────
                 Identical on every route — visitors get the same brand
                 affordances whether they're on the landing page or deep
                 in a case study. (Chapter navigation lives in the
                 case-study body itself, not the global dock.) */}
            <section style={{ padding: '1.25rem 1.75rem 0.5rem' }}>
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
                href={AUTHOR.emailHref}
                style={{
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: '0.78rem',
                  color: '#0A0A0A',
                  textDecoration: 'none',
                }}
              >
                {AUTHOR.email}
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
