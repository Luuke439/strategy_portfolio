'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'

/**
 * ChapterContext
 *
 * Tracks "what chapter is the user currently reading?" across the app shell.
 * Empty/null on routes that don't have chapters (home, about, lab). Populated
 * by CaseStudyPage via <ChapterTracker>.
 *
 * Why a context (vs. each component re-implementing scroll-spy):
 *   - The desktop `CaseStudyNav` (left rail) and the mobile `BottomDock` both
 *     need the same active-chapter index. Sharing the source of truth keeps
 *     them in sync without two scroll listeners fighting each other.
 *   - The dock lives in the persistent shell (above the routed children), so
 *     it can't reach into CaseStudyPage's local state directly.
 */

export interface ChapterState {
  chapters: string[]
  activeChapter: number
  accentColor: string
}

interface Ctx {
  state: ChapterState | null
  set: (s: ChapterState | null) => void
  setActive: (i: number) => void
}

const ChapterCtx = createContext<Ctx>({
  state: null,
  set: () => { },
  setActive: () => { },
})

export function ChapterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ChapterState | null>(null)

  // Stable identity — these callbacks don't rebuild on every render so
  // consumers using them in deps arrays don't loop.
  const set = useCallback((s: ChapterState | null) => setState(s), [])
  const setActive = useCallback((i: number) => {
    setState((prev) => (prev && prev.activeChapter !== i ? { ...prev, activeChapter: i } : prev))
  }, [])

  const value = useMemo(() => ({ state, set, setActive }), [state, set, setActive])
  return <ChapterCtx.Provider value={value}>{children}</ChapterCtx.Provider>
}

export function useChapterContext() {
  return useContext(ChapterCtx)
}

// ─────────────────────────────────────────────────────────────────────────────
// ChapterTracker — drop-in component that pushes chapter state into the
// context AND runs the scroll-spy. CaseStudyPage renders one of these
// next to the desktop sidebar nav; consumers (BottomDock, CaseStudyNav)
// read activeChapter back from the context.
// ─────────────────────────────────────────────────────────────────────────────

interface TrackerProps {
  chapters: string[]
  accentColor: string
}

export function ChapterTracker({ chapters, accentColor }: TrackerProps) {
  const { set, setActive } = useChapterContext()
  const refs = useRef<(HTMLElement | null)[]>([])

  // Initial push + cleanup on unmount.
  useEffect(() => {
    set({ chapters, activeChapter: 0, accentColor })
    return () => set(null)
  }, [chapters, accentColor, set])

  // Scroll spy — same logic that lived in CaseStudyNav, hoisted so both the
  // desktop rail and mobile dock get the same activeChapter without each
  // running their own listener.
  useEffect(() => {
    refs.current = chapters.map((_, i) => document.getElementById(`chapter-${i}`))
    const handle = () => {
      let current = 0
      const threshold = window.innerHeight * 0.4
      for (let i = 0; i < refs.current.length; i++) {
        const el = refs.current[i]
        if (el && el.getBoundingClientRect().top <= threshold) current = i
      }
      setActive(current)
    }
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [chapters, setActive])

  return null
}
