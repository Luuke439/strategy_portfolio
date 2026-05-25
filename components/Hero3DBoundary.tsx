'use client'

import { Component, ReactNode } from 'react'
import HeroNameFallback from './HeroNameFallback'

// React Error Boundary specifically wrapping the WebGL hero. If any of
// these break — three.js init, env-map decode, GL context creation, a
// runtime exception inside useFrame — we swap to the CSS chrome fallback
// permanently. The rest of the page (header, nav, content) stays alive.
// Boundaries must be class components; that's the only reason this isn't
// a hook.

interface Props {
  children: ReactNode
  /** When true, render HeroNameFallback as the permanent visual after a
   *  catch. When false (i.e. off the home page where the hero name sits
   *  in the nav pill) we render nothing so the page chrome isn't doubled. */
  fallbackVisible: boolean
}

interface State {
  hasError: boolean
}

export default class Hero3DBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error('[Hero3D] caught, falling back to CSS chrome:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallbackVisible ? <HeroNameFallback permanent /> : null
    }
    return this.props.children
  }
}
