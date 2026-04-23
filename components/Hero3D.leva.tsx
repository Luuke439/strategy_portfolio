'use client'

/**
 * Hero3D.leva.tsx — opt-in Leva controls for the 3D hero.
 *
 * This file is only loaded when the URL contains ?leva. Keeping Leva out of
 * the default bundle saves ~45kb and eliminates its per-render store updates
 * for normal visitors.
 */

import { useRef } from 'react'
import { Leva, useControls, button } from 'leva'
import { SceneBody } from './Hero3D'

interface TileHover { color: string; x: number; y: number }
interface Props {
  scrollRef: React.MutableRefObject<number>
  navRef: React.MutableRefObject<{ x: number; y: number } | null>
  accentHoverRef: React.MutableRefObject<TileHover | null>
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>
  onReady: () => void
  navOnly: boolean
}

export function LevaPanel() {
  return <Leva />
}

export function SceneLeva(props: Props) {
  const latest = useRef<Record<string, unknown>>({})

  const geo = useControls('Geometry', {
    textSize: { value: 0.36, min: 0.1, max: 1.5, step: 0.01 },
    depth: { value: 0.025, min: 0.005, max: 0.15, step: 0.005 },
    bevelSize: { value: 0.045, min: 0.005, max: 0.20, step: 0.005 },
    bevelThickness: { value: 0.060, min: 0.01, max: 0.20, step: 0.005 },
    bevelSegments: { value: 8, min: 2, max: 64, step: 1 },
    curveSegments: { value: 32, min: 8, max: 128, step: 4 },
  })

  const mat = useControls('Material', {
    color: '#c8c8c8',
    metalness: { value: 1.00, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0.05, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 1.00, min: 0, max: 1, step: 0.01 },
    clearcoatRoughness: { value: 0.05, min: 0, max: 1, step: 0.01 },
    reflectivity: { value: 1.00, min: 0, max: 1, step: 0.01 },
    envMapIntensity: { value: 6.00, min: 0, max: 12, step: 0.1 },
  })

  const lights = useControls('Lights', {
    key: { value: 2.0, min: 0, max: 10, step: 0.1, label: 'Key (warm)' },
    fill: { value: 0.80, min: 0, max: 5, step: 0.1, label: 'Fill (cool)' },
    rim: { value: 3.5, min: 0, max: 10, step: 0.1, label: 'Rim (back)' },
    kicker: { value: 1.50, min: 0, max: 5, step: 0.1, label: 'Kicker' },
    ambient: { value: 0.10, min: 0, max: 2, step: 0.01, label: 'Ambient' },
    envIntensity: { value: 2.00, min: 0, max: 6, step: 0.05, label: 'Env map' },
  })

  const anim = useControls('Animation', {
    heroX: { value: 0.0, min: -4, max: 4, step: 0.05 },
    heroY: { value: 0.0, min: -2, max: 2, step: 0.05 },
    navScale: { value: 0.28, min: 0.05, max: 0.5, step: 0.005 },
    flipX: { value: 1, min: 0, max: 3, step: 0.5, label: 'Coin flip (X)' },
    flipSpins: { value: 0, min: 0, max: 4, step: 0.5, label: 'Y spin' },
    floatAmp: { value: 0.04, min: 0, max: 0.2, step: 0.005 },
    sunIntensity:    { value: 14, min: 0, max: 40, step: 0.5, label: 'Sun beam' },
    accentIntensity: { value: 32, min: 0, max: 60, step: 0.5, label: 'Tile glow' },
  })

  useControls('Save', {
    '📋 Copy settings to clipboard': button(() => {
      navigator.clipboard.writeText(JSON.stringify(latest.current, null, 2))
        .then(() => alert('Settings copied! Paste them to Claude.'))
        .catch(() => console.log('Settings:', JSON.stringify(latest.current, null, 2)))
    }),
  })

  latest.current = { geo, mat, lights, anim }

  return <SceneBody {...props} geo={geo} mat={mat} lights={lights} anim={anim} />
}
