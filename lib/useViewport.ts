'use client'

import { useRef, useSyncExternalStore } from 'react'

// ── Breakpoints ───────────────────────────────────────────────────────────────
// One source of truth for the whole app. Tailwind's defaults are kept (640/1024)
// so utility classes like `lg:` align with what JS sees.
//   - mobile : < 640px  (phones, small tablets in portrait)
//   - tablet : < 1024px (large tablets, narrow desktops)
//   - desktop: ≥ 1024px
export const BREAKPOINTS = { mobile: 640, tablet: 1024 } as const

export type Viewport = 'mobile' | 'tablet' | 'desktop'

function readViewport(): Viewport {
  if (typeof window === 'undefined') return 'desktop'
  const w = window.innerWidth
  return w < BREAKPOINTS.mobile ? 'mobile' : w < BREAKPOINTS.tablet ? 'tablet' : 'desktop'
}

/**
 * Subscribe to the current viewport bucket. Returns 'desktop' during SSR so
 * the desktop layout is the initial paint (no mobile flash on wide screens).
 *
 * Debounced 150ms — matches the ProjectGrid behavior that this hook replaces.
 * On mobile, rotation triggers a resize event; we don't want to thrash the
 * tree mid-rotation.
 *
 * Implemented with a useSyncExternalStore + debounce ref so the listener
 * lifecycle is cleanly tied to React's subscription mechanism — no
 * setState-in-effect cascades, no SSR hydration mismatches.
 */
export function useViewport(): Viewport {
  // Debounced subscribe — the listener registered with useSyncExternalStore
  // forwards resize events through a 150ms trailing-edge timer so we don't
  // re-render the tree mid-drag.
  const lastValueRef = useRef<Viewport>(readViewport())

  const subscribe = (notify: () => void) => {
    let timer: ReturnType<typeof setTimeout> | null = null
    const onResize = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        const next = readViewport()
        if (next !== lastValueRef.current) {
          lastValueRef.current = next
          notify()
        }
      }, 150)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      if (timer) clearTimeout(timer)
    }
  }

  return useSyncExternalStore(
    subscribe,
    () => {
      const v = readViewport()
      // Cache hit so getSnapshot returns the same identity when nothing changed
      // (useSyncExternalStore requires referential equality for "no change").
      if (v !== lastValueRef.current) lastValueRef.current = v
      return lastValueRef.current
    },
    () => 'desktop' as Viewport,
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic media-query subscription, expressed as useSyncExternalStore.
// Both useHoverCapable and useReducedMotion route through this so we don't
// duplicate the listener wiring.
// ─────────────────────────────────────────────────────────────────────────────
function useMediaQuery(query: string, ssrFallback: boolean): boolean {
  const subscribe = (notify: () => void) => {
    const mql = window.matchMedia(query)
    mql.addEventListener('change', notify)
    return () => mql.removeEventListener('change', notify)
  }
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => ssrFallback,
  )
}

/**
 * Returns true when the device has a fine pointer that can hover — i.e.
 * a real mouse. False on touch-only devices.
 *
 * Drives:
 *  - Custom-cursor mount gating
 *  - Hover-only interactions (tilt, cursor-driven glint, etc.)
 *  - Lenis smooth-scroll opt-out (native scroll feels better on touch)
 *
 * SSR-safe: returns true during SSR so desktop hydration matches.
 */
export function useHoverCapable(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)', true)
}

/**
 * Returns true when the user has requested reduced motion. Drives
 * spring → CSS-transition fallbacks for animation-heavy components.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)', false)
}

// ─────────────────────────────────────────────────────────────────────────────
// Low-power-device detection
// ─────────────────────────────────────────────────────────────────────────────
// Connection's optional API (NetworkInformation) is not in lib.dom yet — type
// the bits we touch locally so we don't reach for `any`.
interface NetworkInformationLike {
  saveData?: boolean
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g'
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformationLike
  deviceMemory?: number
}

function detectLowPower(): boolean {
  if (typeof window === 'undefined') return false

  const nav = navigator as NavigatorWithConnection

  // 1. User explicitly turned on Data Saver — respect that.
  if (nav.connection?.saveData === true) return true

  // 2. Slow effective connection — 3D hero + HDRI is a luxury we skip.
  const et = nav.connection?.effectiveType
  if (et === 'slow-2g' || et === '2g') return true

  // 3. Few logical cores — likely a budget phone where WebGL will judder.
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4) {
    return true
  }

  // 4. Low device memory (Chrome only) — same reasoning.
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) {
    return true
  }

  // 5. Reduced-motion is a philosophical opt-out from the spinning animation.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true

  return false
}

/**
 * One-shot low-power detection. Doesn't subscribe to changes — the answer is
 * stable for the session (a user doesn't gain a core during a page view).
 *
 * Returns false on the server so the desktop-heavy WebGL hero is the default,
 * then flips to the real value on first client render. Components that mount
 * Hero3D should branch on this before importing it.
 *
 * Implemented with useSyncExternalStore + a never-firing subscribe so the
 * value is read once on mount via getSnapshot without ever triggering
 * setState-in-effect (the React 19 hooks lint catches the naive useEffect
 * version of this and rejects it).
 */
const noopSubscribe = () => () => { }
export function useLowPowerDevice(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    detectLowPower,
    () => false,
  )
}

