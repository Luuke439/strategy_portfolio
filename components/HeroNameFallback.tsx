'use client'

import { CSSProperties, useEffect, useRef, useState } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

/**
 * HeroNameFallback
 *
 * Pure CSS chrome-gradient rendering of "LUKE CAPORELLI". Serves two roles:
 *
 *  1. **Pre-WebGL paint** — visible immediately on first frame, before the
 *     Hero3D <Canvas> finishes initialising its env map. Without this, the
 *     hero is empty for ~1s on slow networks; with it, the chrome name is
 *     up instantly and the 3D version fades in on top once ready.
 *
 *  2. **Low-power fallback** — on devices that can't afford the WebGL hero
 *     (low concurrency, save-data, or reduced motion), Hero3D skips mounting
 *     entirely and this static name stays as the final hero visual.
 *
 * The gradient stops match `NavLabel3D` (in GlassNav.tsx) so the visual
 * language is identical whether the visitor sees CSS chrome or real chrome.
 *
 * Mobile uses a stacked two-line layout — "LUKE" over "CAPORELLI" — to
 * read large in portrait without spilling outside the viewport.
 */
interface HeroNameFallbackProps {
  /** When true, the fallback is the FINAL visual (no Hero3D on top).
   *  Renders at full opacity. When false, it's a pre-paint and is meant
   *  to fade out as Hero3D fades in. */
  permanent?: boolean
  /** True while Hero3D is invisible (still loading / not ready). When the
   *  3D canvas comes online, the parent flips this false to fade us out. */
  visible?: boolean
}

const FONT = "'Fredoka Expanded', 'TWK Lausanne Pan', system-ui, sans-serif"

// Chrome gradient — same color story as the desktop WebGL mesh (chrome with
// highlights), but the stops are pushed darker so the CSS rendering reads
// against the #FAFAFA page background instead of disappearing into it.
// (The desktop WebGL version gets its contrast from real reflective lighting
// on top of an HDRI envmap — flat CSS doesn't have that crutch.)
const CHROME: CSSProperties = {
  color: 'transparent',
  background: 'linear-gradient(178deg, #5e5e5e 0%, #2a2a2a 22%, #6c6c6c 48%, #1a1a1a 72%, #4a4a4a 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  textShadow: [
    '0px 1px 0 rgba(255,255,255,0.55)',     // top highlight
    '0px -1px 0 rgba(0,0,0,0.35)',          // bottom shadow lip
    '0px 0.5px 1.5px rgba(255,255,255,0.4)',// soft highlight bleed
    '0px 3px 8px rgba(0,0,0,0.15)',         // ground shadow
  ].join(', '),
  filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.20))',
  fontFamily: FONT,
  fontWeight: 700,
  letterSpacing: '0.02em',
  lineHeight: 0.92,
  WebkitFontSmoothing: 'antialiased',
}

// Safety-net fade: if Hero3D's onVisualReady callback never fires (strict-mode
// double-mount, env-load failure beyond the 4s loader timeout, or any wiring
// regression), the fallback would otherwise stay forever and stack with the
// WebGL chrome. After 2.5s we fade it out unconditionally — long enough for the
// canvas to be visible on any reasonable connection, short enough that a stuck
// fallback doesn't dominate the page.
const SAFETY_FADE_MS = 2500

export default function HeroNameFallback({
  permanent = false,
  visible = true,
}: HeroNameFallbackProps) {
  // Both layouts render to the DOM; CSS (`.desktop-only` / `.mobile-only`)
  // hides the wrong one per viewport. That way SSR and client first paint
  // match exactly — no hydration mismatch when the server defaults to
  // desktop and the client turns out to be on a phone.

  // Safety-net auto-fade — see SAFETY_FADE_MS comment above. Skipped when
  // permanent (low-power devices have no WebGL hero to defer to).
  const [safetyExpired, setSafetyExpired] = useState(false)
  useEffect(() => {
    if (permanent) return
    const t = setTimeout(() => setSafetyExpired(true), SAFETY_FADE_MS)
    return () => clearTimeout(t)
  }, [permanent])

  // Scroll-driven fade. The fallback is `position: fixed` (so it acts as the
  // hero without disrupting layout), so without this it would float over the
  // content as the user scrolls past the hero. We map scrollY ∈ [0, 60% vh]
  // → opacity ∈ [1, 0], applied imperatively via a ref so the per-frame
  // change never re-renders the React tree.
  const { scrollY } = useScroll()
  const fadeRef = useRef<HTMLDivElement>(null)
  const [vh, setVh] = useState(() =>
    typeof window === 'undefined' ? 800 : window.innerHeight,
  )
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const scrollOpacity = useTransform(scrollY, [0, vh * 0.6], [1, 0])
  useMotionValueEvent(scrollOpacity, 'change', (v) => {
    if (fadeRef.current) fadeRef.current.style.opacity = String(v)
  })

  const showFallback = permanent ? true : (visible && !safetyExpired)

  return (
    <div
      ref={fadeRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 109, // one below Hero3D's canvas (110)
        opacity: showFallback ? 1 : 0,
        transition: 'opacity 0.6s ease',
        userSelect: 'none',
        // permanent keeps it pinned even after page mount; non-permanent fades.
        willChange: permanent ? 'opacity' : 'auto',
      }}
    >
      {/* Desktop / tablet only — mobile skips the hero name entirely and
          leads with the project grid. The wrapper still mounts so the
          scroll-driven fade machinery doesn't need a viewport branch. */}
      <div
        className="desktop-only"
        style={{ ...CHROME, fontSize: 'clamp(2rem, 5.5vw, 4.5rem)', whiteSpace: 'nowrap' }}
      >
        LUKE CAPORELLI
      </div>
    </div>
  )
}
