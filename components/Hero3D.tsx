'use client'

/* eslint-disable react-hooks/refs, react-hooks/immutability */
// React 19's experimental react-hooks rules flag two patterns that
// are *intentional* throughout this file:
//   1. Mutating Three.js objects (scene, gl, materials, geometries) we got
//      from useThree()/useFrame() — that's how @react-three/fiber bridges
//      React state into the imperative Three.js scene graph. There is no
//      declarative alternative for things like `scene.background = null`.
//   2. Mirroring props into refs synchronously during render (e.g.
//      `navOnlyRef.current = navOnly`) so the next useFrame tick — which
//      runs outside React's commit phase — sees the latest value without
//      a one-frame lag. Moving the assignment into useEffect re-introduces
//      the visible jitter we're explicitly trying to prevent.
// The rule is disabled file-wide rather than line-by-line because the same
// pattern repeats in many places and the per-line noise would obscure the
// code more than it would clarify.

/**
 * Hero3D.tsx
 *
 * Fixed transparent canvas. 3D name starts in the hero, then on scroll
 * shrinks + spins into the header top-left and STAYS there.
 *
 * All visual knobs are live-tweakable via the Leva panel (top-right).
 */

import { useRef, useState, useEffect, Suspense, useCallback, useMemo, lazy } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center, Text3D } from '@react-three/drei'
import * as THREE from 'three'
import { useViewport } from '@/lib/useViewport'

const FONT = '/fonts/Fredoka Expanded_Bold.json'

// ─── Static scene defaults ──────────────────────────────────────────────────
// These are the values the Leva panel used to expose. They're hoisted into
// plain constants so the Leva runtime (~45kb + React store updates) is only
// paid when the designer opts in via ?leva.
const DEFAULT_GEO = {
  textSize:       0.36,
  depth:          0.025,
  bevelSize:      0.045,
  bevelThickness: 0.060,
  bevelSegments:  8,
  curveSegments:  32,
} as const

const DEFAULT_MAT = {
  color:              '#c8c8c8',
  metalness:          1.00,
  roughness:          0.05,
  clearcoat:          1.00,
  clearcoatRoughness: 0.05,
  reflectivity:       1.00,
  envMapIntensity:    6.00,
} as const

const DEFAULT_LIGHTS = {
  key:          2.0,
  fill:         0.80,
  rim:          3.5,
  kicker:       1.50,
  ambient:      0.10,
  envIntensity: 2.00,
} as const

const DEFAULT_ANIM = {
  heroX:           0.0,
  heroY:           0.0,
  navScale:        0.28,
  flipX:           1,
  flipSpins:       0,
  floatAmp:        0.04,
  sunIntensity:    14,
  accentIntensity: 32,
} as const

// ─── Mobile overrides ───────────────────────────────────────────────────────
// On phones the text needs to be bigger (closer camera FOV), stacked over
// two lines for portrait, and lerp toward a bottom-dock target instead of
// the top header. The geo/anim values diverge enough from desktop that we
// keep them in dedicated tables instead of branching mid-render.
const MOBILE_GEO = {
  // Same geometry tuning as desktop (verified to render correctly); the
  // stacked layout itself shrinks visual size by splitting one wide
  // "LUKE CAPORELLI" line into two shorter ones, so we don't need to
  // also shrink the per-glyph size.
  textSize:       DEFAULT_GEO.textSize,
  depth:          DEFAULT_GEO.depth,
  bevelSize:      DEFAULT_GEO.bevelSize,
  bevelThickness: DEFAULT_GEO.bevelThickness,
  bevelSegments:  5,      // fewer than desktop's 8 — meaningful GPU win on tile-deferred mobile GPUs
  curveSegments:  DEFAULT_GEO.curveSegments,
} as const

const MOBILE_ANIM = {
  heroX:           0.0,
  heroY:           0.0,
  navScale:        0.16,  // smaller — fits inside the bottom-dock pill
  flipX:           1,
  flipSpins:       0,
  floatAmp:        0.05,
  sunIntensity:    14,
  accentIntensity: 32,
  // Vertical spacing between LUKE and CAPORELLI (world units, scaled by textSize)
  stackedLineGap:  0.65,
} as const

// Leva is only imported on demand (see SceneLeva below).
const SceneLeva = lazy(() => import('./Hero3D.leva').then(m => ({ default: m.SceneLeva })))
const LevaPanel = lazy(() => import('./Hero3D.leva').then(m => ({ default: m.LevaPanel })))

// ─────────────────────────────────────────────────────────────────────────────
// Sets up transparent bg AND disables pointer events on the canvas DOM element.
// R3F sets touch-action/pointer-events directly on gl.domElement (the <canvas>),
// which overrides CSS on parent divs. We must override it here too.
// ─────────────────────────────────────────────────────────────────────────────
function CanvasSetup() {
  const { scene, gl } = useThree()
  useEffect(() => {
    scene.background = null
    try { gl.setClearAlpha(0) } catch { /* not ready */ }
    // Kill pointer events on the actual <canvas> element so the OS cursor
    // and page interactivity work normally underneath
    gl.domElement.style.pointerEvents = 'none'
    gl.domElement.style.touchAction = 'none'
  }, [scene, gl])
  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// ImageEnv — loads day.jpg as an equirectangular PMREM environment map for the
// chrome reflections. A neutral studio gradient is applied synchronously on
// mount so the chrome never flashes black while day.jpg is downloading.
// ─────────────────────────────────────────────────────────────────────────────
function buildNeutralEnv(gl: THREE.WebGLRenderer): THREE.Texture {
  // Three-point studio setup: bright white sky, warm key light, cool fill,
  // sharp rim at the horizon — gives chrome the contrast it needs to shine.
  const W = 512, H = 256
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Base gradient — bright white top, neutral mid, very dark floor
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0,    '#f8f8f8')
  grad.addColorStop(0.28, '#e4e8f2')
  grad.addColorStop(0.48, '#b8bcc8')
  grad.addColorStop(0.54, '#707078')
  grad.addColorStop(1,    '#141418')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // Key light — warm bright spot upper-right
  const key = ctx.createRadialGradient(W * 0.73, H * 0.10, 0, W * 0.73, H * 0.10, W * 0.30)
  key.addColorStop(0,   'rgba(255,252,235,0.98)')
  key.addColorStop(0.4, 'rgba(255,248,225,0.55)')
  key.addColorStop(1,   'rgba(255,248,225,0)')
  ctx.fillStyle = key; ctx.fillRect(0, 0, W, H)

  // Fill light — cool blue-white upper-left
  const fill = ctx.createRadialGradient(W * 0.11, H * 0.16, 0, W * 0.11, H * 0.16, W * 0.24)
  fill.addColorStop(0,   'rgba(205,220,255,0.90)')
  fill.addColorStop(0.4, 'rgba(205,220,255,0.40)')
  fill.addColorStop(1,   'rgba(205,220,255,0)')
  ctx.fillStyle = fill; ctx.fillRect(0, 0, W, H)

  // Rim light — pure white strip at the back horizon
  const rim = ctx.createRadialGradient(W * 0.50, H * 0.50, 0, W * 0.50, H * 0.50, W * 0.16)
  rim.addColorStop(0,   'rgba(255,255,255,0.80)')
  rim.addColorStop(0.6, 'rgba(255,255,255,0.20)')
  rim.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = rim; ctx.fillRect(0, 0, W, H)

  const tex = new THREE.CanvasTexture(canvas)
  tex.mapping    = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.SRGBColorSpace
  const pmrem = new THREE.PMREMGenerator(gl)
  pmrem.compileEquirectangularShader()
  const envMap = pmrem.fromEquirectangular(tex).texture
  tex.dispose(); pmrem.dispose()
  return envMap
}

function ImageEnv({ intensity, onReady }: { intensity: number; onReady?: () => void }) {
  const { scene, gl } = useThree()
  // Latest callback in a ref — keeps the load effect dependency-stable so we
  // don't re-trigger PMREM generation when the parent re-renders.
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    // Apply neutral studio env synchronously — guarantees the chrome is lit
    // from frame 0, so we never render black while day.jpg is downloading.
    const neutral = buildNeutralEnv(gl)
    scene.environment = neutral

    let hdriMap: THREE.Texture | null = null
    let cancelled = false
    let fired = false
    const fireReady = () => {
      if (fired || cancelled) return
      fired = true
      onReadyRef.current?.()
    }

    const loader = new THREE.TextureLoader()
    loader.load(
      '/day.jpg',
      (texture) => {
        if (cancelled) { texture.dispose(); return }
        const img = texture.image as HTMLImageElement
        const W   = img.naturalWidth  || img.width
        const H   = img.naturalHeight || img.height
        const c   = document.createElement('canvas')
        c.width = W; c.height = H
        const ctx = c.getContext('2d')!

        // Flip vertically (sun to zenith) + gentle exposure boost
        ctx.filter = 'brightness(130%) saturate(110%)'
        ctx.translate(0, H)
        ctx.scale(1, -1)
        ctx.drawImage(img, 0, 0)

        texture.dispose()
        const processed      = new THREE.CanvasTexture(c)
        processed.mapping    = THREE.EquirectangularReflectionMapping
        processed.colorSpace = THREE.SRGBColorSpace
        const pmrem = new THREE.PMREMGenerator(gl)
        pmrem.compileEquirectangularShader()
        hdriMap = pmrem.fromEquirectangular(processed).texture
        processed.dispose(); pmrem.dispose()
        if (cancelled) { hdriMap.dispose(); hdriMap = null; return }
        scene.environment = hdriMap
        neutral.dispose()
        // Wait two frames before signalling ready: one for R3F to render
        // with the new envMap, one for the browser to paint it. Then the
        // canvas opacity gate flips and the user's first visible frame
        // already shows the cloud reflection — no gray flash.
        requestAnimationFrame(() => requestAnimationFrame(fireReady))
      },
      undefined,
      // Network failure / 404 — keep the neutral env (chrome still lit) and
      // signal ready so the canvas doesn't sit hidden forever.
      () => fireReady(),
    )

    // Last-resort safety: if loader never resolves (e.g. browser cache hung),
    // still lift the gate after 4s so the user sees *something*.
    const safety = window.setTimeout(fireReady, 4000)

    return () => {
      cancelled = true
      window.clearTimeout(safety)
      if (hdriMap) { hdriMap.dispose(); if (scene.environment === hdriMap) scene.environment = null }
      else { neutral.dispose(); if (scene.environment === neutral) scene.environment = null }
    }
  }, [scene, gl])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ; (scene as any).environmentIntensity = intensity
  }, [scene, intensity])

  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// SceneContent — all Leva controls live here so they share one Canvas context
// ─────────────────────────────────────────────────────────────────────────────
interface TileHover { color: string; x: number; y: number }

interface SceneProps {
  scrollRef: React.MutableRefObject<number>
  navRef: React.MutableRefObject<{ x: number; y: number } | null>
  accentHoverRef: React.MutableRefObject<TileHover | null>
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>
  onReady: () => void
  /** Fires once the day.jpg HDRI has been applied as the scene env map
   *  (or after a load failure / safety timeout). The parent uses this
   *  together with `onReady` to gate the canvas fade-in so the first
   *  visible frame already shows the cloud reflection. */
  onEnvReady: () => void
  /** When true: text is always at nav position, regardless of scroll.
   *  NameMesh also snaps on every flip of this flag. */
  navOnly: boolean
}

export function SceneBody({
  scrollRef, navRef, accentHoverRef, mousePosRef, onReady, onEnvReady, navOnly,
  geo, mat, lights, anim, stacked,
}: SceneProps & {
  geo: typeof DEFAULT_GEO | Record<string, number>
  mat: typeof DEFAULT_MAT | Record<string, number | string>
  lights: typeof DEFAULT_LIGHTS | Record<string, number>
  anim: typeof DEFAULT_ANIM | Record<string, number>
  /** Two-line stacked layout (LUKE over CAPORELLI). Used on mobile. */
  stacked: boolean
}) {
  return (
    <>
      <directionalLight color="#FFE4C0" intensity={lights.key as number} position={[6, 4, 2.5]} />
      <directionalLight color="#C8D8FF" intensity={lights.fill as number} position={[-5, -2, 1.5]} />
      <directionalLight color="#FFFFFF" intensity={lights.rim as number} position={[0, 1.5, -6]} />
      <directionalLight color="#FFD0A0" intensity={lights.kicker as number} position={[3, -2, -4]} />
      <ambientLight intensity={lights.ambient as number} />
      <ImageEnv intensity={lights.envIntensity as number} onReady={onEnvReady} />

      <Suspense fallback={null}>
        <NameMesh
          scrollRef={scrollRef}
          navRef={navRef}
          accentHoverRef={accentHoverRef}
          mousePosRef={mousePosRef}
          onReady={onReady}
          geo={geo}
          mat={mat}
          anim={anim}
          navOnly={navOnly}
          stacked={stacked}
        />
      </Suspense>
    </>
  )
}

interface SceneContentProps extends SceneProps {
  stacked: boolean
}

function SceneContent({ stacked, ...rest }: SceneContentProps) {
  return (
    <SceneBody
      {...rest}
      stacked={stacked}
      geo={stacked ? MOBILE_GEO : DEFAULT_GEO}
      mat={DEFAULT_MAT}
      lights={DEFAULT_LIGHTS}
      anim={stacked ? MOBILE_ANIM : DEFAULT_ANIM}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NameMesh
// ─────────────────────────────────────────────────────────────────────────────
interface NameMeshProps {
  scrollRef: React.MutableRefObject<number>
  navRef: React.MutableRefObject<{ x: number; y: number } | null>
  accentHoverRef: React.MutableRefObject<TileHover | null>
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>
  onReady: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geo: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mat: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anim: Record<string, any>
  navOnly: boolean
  /** Two-line stacked layout (LUKE over CAPORELLI). Used on mobile. */
  stacked: boolean
}

function NameMesh({ scrollRef, navRef, accentHoverRef, mousePosRef, onReady, geo, mat, anim, navOnly, stacked }: NameMeshProps) {
  const groupRef = useRef<THREE.Group>(null!)
  // Snaps only on the very first frame (once the nav target is measurable)
  // to avoid the initial flash from the default position to the real target.
  // Route changes after that just lerp, so the text smoothly continues from
  // wherever it was — same behaviour as if the user had kept scrolling.
  const hasSnapped = useRef(false)
  // Stacked layout tracks per-word widths so the nav-target halfW uses the
  // wider of the two; inline layout uses the single composite width.
  const word1WidthRef = useRef<number>(0)
  const word2WidthRef = useRef<number>(0)
  const textWidth = () => stacked
    ? Math.max(word1WidthRef.current, word2WidthRef.current)
    : word1WidthRef.current
  const recomputeNavRef = useRef<() => void>(() => { })
  // Sun beam light + materials (one per Text3D mesh — sharing a single
  // material across two meshes works in Three.js but R3F's primitive
  // child reconciliation is finicky, so we keep them separate and
  // update both in lockstep each frame).
  const lAccent = useRef<THREE.PointLight>(null!)
  const matRefs = useRef<(THREE.MeshPhysicalMaterial | null)[]>([])
  // Stable ref callbacks — React calls a ref callback with null then the new
  // element whenever the callback's identity changes. Inline-creating these
  // on every render would thrash matRefs at 60fps. Memoised to mount-once.
  const setMat0 = useCallback((el: THREE.MeshPhysicalMaterial | null) => {
    matRefs.current[0] = el
  }, [])
  const setMat1 = useCallback((el: THREE.MeshPhysicalMaterial | null) => {
    matRefs.current[1] = el
  }, [])
  const curColor = useRef(new THREE.Color('#ffffff'))
  const tgtColor = useRef(new THREE.Color('#ffffff'))
  const tgtIntensity = useRef<number>(14)
  const tgtLightPos = useRef(new THREE.Vector3(0, 0, 8))
  const curEmissive = useRef(new THREE.Color(0, 0, 0))
  const tgtEmissive = useRef(new THREE.Color(0, 0, 0))
  const tgtEmissiveInt = useRef(0)
  const curLightPos = useRef(new THREE.Vector3(0, 0, 8))
  const { size, camera } = useThree()

  // ── Viewport-invariant nav scale ─────────────────────────────────────────
  // The perspective camera maps world units to canvas height, so a fixed world
  // size renders at different pixel sizes on different displays. Invert that:
  // scale the nav-pose size inversely with viewport height, calibrated on a
  // MacBook Air M1 fullscreen (~800 CSS px). Clamped so very small/large
  // viewports don't explode.
  const NAV_SCALE_REFERENCE_VH = 800
  const navScaleFactor = Math.min(
    1.25,
    Math.max(0.45, NAV_SCALE_REFERENCE_VH / Math.max(size.height, 1)),
  )
  const effectiveNavScale = anim.navScale * navScaleFactor

  // Nav target from DOM span — uses LEFT edge of span + half text width so the
  // text left-aligns correctly at every viewport size without a manual
  // correction. Only the desktop top-pill span carries this id; mobile uses
  // its own CSS chrome text in the BottomDock (no WebGL anchor needed).
  useEffect(() => {
    const compute = () => {
      const span = document.getElementById('nav-name-span')
      const w = textWidth()
      if (!span || !w) return
      const r = span.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) return // desktop pill hidden (mobile vp)
      // Unproject the LEFT edge of the span (not its centre)
      const ndcX = (r.left / size.width) * 2 - 1
      const ndcY = -(((r.top + r.height * 0.5) / size.height) * 2 - 1)
      const v = new THREE.Vector3(ndcX, ndcY, 0.5)
        .unproject(camera as THREE.PerspectiveCamera)
      const dir = v.sub(camera.position).normalize()
      const t = -camera.position.z / dir.z
      const wp = camera.position.clone().addScaledVector(dir, t)
      // Shift center right so the text's left edge lands at the span's left edge
      const halfW = (w * effectiveNavScale) / 2
      navRef.current = { x: wp.x + halfW, y: wp.y }
    }
    recomputeNavRef.current = compute
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
    // textWidth is read inside compute via the ref closure — no need in deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, camera, navRef, effectiveNavScale, stacked])

  useEffect(() => { onReady() }, [onReady])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    // navOnly ALWAYS pins to p=1 regardless of scrollRef. This avoids a
    // race where a scroll event (from Next.js restoration / Lenis) would
    // reset scrollRef to 0 in the tiny window before our effect tears the
    // listener down, briefly lerping the text toward the hero.
    const p = navOnly ? 1 : Math.min(Math.max(scrollRef.current, 0), 1)
    const nav = navRef.current
    const time = clock.elapsedTime
    const ease = 1 - p

    // Idle float (fades to zero as text leaves hero)
    const floatY = Math.sin((time / 4.5) * Math.PI * 2) * anim.floatAmp * ease
    const idleRotY = Math.sin((time / 7.0) * Math.PI * 2) * (3.2 * Math.PI / 180) * ease

    // Coin flip — X rotation (toward viewer) + optional Y spin
    // Both use full 360° multiples so start/end orientation is identical
    const flipRotX = p * Math.PI * 2 * anim.flipX
    const flipRotY = p * Math.PI * 2 * anim.flipSpins

    const navX = nav?.x ?? anim.heroX
    const tX = anim.heroX + (navX - anim.heroX) * p
    const tY = anim.heroY + ((nav?.y ?? anim.heroY) - anim.heroY) * p + floatY
    const tS = 1 + (effectiveNavScale - 1) * p

    // Initial-mount snap: once nav target exists (or we're in hero mode),
    // set the transform directly so the text doesn't flash from (0,0) to
    // its real target in the first frame. Subsequent frames always lerp —
    // including route changes, which then smoothly continue from wherever
    // the text currently is to the new target.
    const canSnap = p === 0 || nav !== null

    if (!hasSnapped.current && canSnap) {
      groupRef.current.position.x = tX
      groupRef.current.position.y = tY
      groupRef.current.rotation.x = flipRotX
      groupRef.current.rotation.y = idleRotY + flipRotY
      groupRef.current.rotation.z = 0
      groupRef.current.scale.setScalar(tS)
      hasSnapped.current = true
    } else if (hasSnapped.current) {
      const s = 0.075
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, tX, s)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, tY, s)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, flipRotX, s)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, idleRotY + flipRotY, s)
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, s)
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, tS, s))
    }
    // else: first frame without a nav target yet — hold position and retry.

    // Sun beam — parked at a stable upper-right offset when no tile is
    // hovered (the chrome surface is busy enough thanks to the env map +
    // idle float — chasing the cursor on top of that read as a flicker
    // when the mouse crossed the text's horizontal axis). Only follows
    // the cursor while a tile is actually hovered, where the colored
    // beam effect is the whole point.
    const hover = accentHoverRef.current
    const mp = mousePosRef.current
    const tx = groupRef.current.position.x
    const ty = groupRef.current.position.y

    if (hover) {
      tgtLightPos.current.set(
        tx + (mp.x * 2 - 1) * 10,
        ty - (mp.y * 2 - 1) * 7,
        8,
      )
      tgtColor.current.set(hover.color)
      tgtIntensity.current = anim.accentIntensity
      tgtEmissive.current.set(hover.color)
      tgtEmissiveInt.current = 0.45
    } else {
      // Stable parked position — slight upper-right, gives chrome a
      // consistent highlight without reacting to cursor movement.
      tgtLightPos.current.set(tx + 3, ty + 2, 8)
      tgtColor.current.set('#ffffff')
      tgtIntensity.current = anim.sunIntensity
      tgtEmissiveInt.current = 0
    }

    const ls = 0.08
    curLightPos.current.lerp(tgtLightPos.current, 0.18)
    curColor.current.lerp(tgtColor.current, ls)
    curEmissive.current.lerp(tgtEmissive.current, ls)

    if (lAccent.current) {
      lAccent.current.position.copy(curLightPos.current)
      lAccent.current.color.copy(curColor.current)
      lAccent.current.intensity = THREE.MathUtils.lerp(lAccent.current.intensity, tgtIntensity.current, ls)
    }
    // Update every word-material in lockstep (1 mesh inline, 2 stacked).
    for (let i = 0; i < matRefs.current.length; i++) {
      const m = matRefs.current[i]
      if (!m) continue
      m.emissive.copy(curEmissive.current)
      m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, tgtEmissiveInt.current, ls)
    }
  })

  // Shared Text3D + material props — extracted so the inline-vs-stacked
  // branches don't drift apart over time.
  const text3dProps = {
    font: FONT,
    size: geo.textSize,
    height: geo.depth,
    curveSegments: geo.curveSegments,
    letterSpacing: 0.08,
    bevelEnabled: true,
    bevelThickness: geo.bevelThickness,
    bevelSize: geo.bevelSize,
    bevelSegments: geo.bevelSegments,
  } as const

  const chromeMaterial = (idx: 0 | 1) => (
    <meshPhysicalMaterial
      ref={idx === 0 ? setMat0 : setMat1}
      color={mat.color}
      metalness={mat.metalness}
      roughness={mat.roughness}
      clearcoat={mat.clearcoat}
      clearcoatRoughness={mat.clearcoatRoughness}
      reflectivity={mat.reflectivity}
      envMapIntensity={mat.envMapIntensity}
      emissive="#000000"
      emissiveIntensity={0}
    />
  )

  // Line gap scales with textSize so the stacked baseline distance
  // stays visually consistent across mobile breakpoints.
  const lineGap = (anim.stackedLineGap ?? 0.65) * (geo.textSize as number)

  return (
    <group ref={groupRef} position={[anim.heroX, anim.heroY, 0]}>
      {/* Surround accent rig — front, back, left, right, top, bottom */}
      <pointLight ref={lAccent} position={[0, 0, 8]} intensity={14} distance={35} color="#ffffff" />

      {stacked ? (
        <>
          {/* LUKE — top line. disableY so each Center only centers horizontally;
              vertical position comes from the manual y offset. */}
          <Center
            disableY
            position={[0, lineGap, 0]}
            onCentered={({ width }) => {
              word1WidthRef.current = width
              recomputeNavRef.current()
            }}
          >
            <Text3D {...text3dProps}>
              LUKE
              {chromeMaterial(0)}
            </Text3D>
          </Center>

          {/* CAPORELLI — bottom line */}
          <Center
            disableY
            position={[0, -lineGap, 0]}
            onCentered={({ width }) => {
              word2WidthRef.current = width
              recomputeNavRef.current()
            }}
          >
            <Text3D {...text3dProps}>
              CAPORELLI
              {chromeMaterial(1)}
            </Text3D>
          </Center>
        </>
      ) : (
        <Center onCentered={({ width }) => {
          word1WidthRef.current = width
          recomputeNavRef.current()
        }}>
          <Text3D {...text3dProps}>
            LUKE CAPORELLI
            {chromeMaterial(0)}
          </Text3D>
        </Center>
      )}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero3D — exported
// ─────────────────────────────────────────────────────────────────────────────
interface Hero3DProps {
  hoverInfo?: { color: string; x: number; y: number } | null
  /** When true: skip hero animation, always render in nav position */
  navOnly?: boolean
  /** Fires the moment the canvas becomes visible (font + env both ready) —
   *  used by parents to cross-fade out a CSS chrome-text fallback so the
   *  hero never paints empty during WebGL boot. */
  onVisualReady?: () => void
}

export default function Hero3D({ hoverInfo, navOnly, onVisualReady }: Hero3DProps) {
  const vp = useViewport()
  const stacked = vp === 'mobile'
  const [isMounted, setIsMounted] = useState(false)
  const [fontLoaded, setFontLoaded] = useState(false)
  // The envMap (day.jpg → PMREM cube) takes a tick or two to be applied
  // after mount. Without gating on this, the first painted frame shows
  // a metallic-but-unreflective gray, then pops to chrome once the env
  // texture is wired up. We fade the canvas in only once both font AND
  // env are ready so the chrome is fully formed on the first visible
  // frame — no gray flash.
  const [envReady, setEnvReady] = useState(false)

  const scrollRef = useRef<number>(navOnly ? 1 : 0)
  const navRef = useRef<{ x: number; y: number } | null>(null)
  const accentHoverRef = useRef<TileHover | null>(null)
  const mousePosRef = useRef({ x: 0.5, y: 0.5 })

  // Mirror navOnly into a ref so the scroll listener (and useFrame) sees the
  // pathname change SYNCHRONOUSLY during render — before the scroll events
  // that Next.js/Lenis fire as part of the route transition. Prevents the
  // text from briefly lerping toward the hero when the scroll resets to 0.
  const navOnlyRef = useRef(navOnly)
  navOnlyRef.current = navOnly

  // Track pointer for the sun-beam orbit. Owned here so the hero is fully
  // self-contained and doesn't need a prop drilled through a route-level shell.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePosRef.current.x = e.clientX / window.innerWidth
      mousePosRef.current.y = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── Device-orientation tilt (mobile) ────────────────────────────────────
  // Phones have no cursor — but they have a gyroscope. Map device tilt onto
  // the same mousePosRef the hover-beam code reads from, so the chrome
  // highlight tracks how the user holds the phone. Subtle, brand-coherent,
  // and the kind of micro-interaction that justifies the cost of WebGL on
  // mobile.
  //
  // iOS 13+ requires an explicit user-gesture permission grant before the
  // gyroscope events fire. We don't ask preemptively (annoying); instead the
  // first touch on the page triggers requestPermission() once.
  useEffect(() => {
    if (!stacked) return // only wired up on mobile pose
    if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') return

    let removed = false
    let off: (() => void) | null = null

    const handle = (e: DeviceOrientationEvent) => {
      // gamma: left/right tilt (-90 to 90), beta: front/back tilt (-180 to 180).
      // Clamp to a calm range and normalise into the 0..1 space the beam reads.
      const g = Math.max(-30, Math.min(30, e.gamma ?? 0)) / 60 + 0.5
      const b = Math.max(-30, Math.min(30, (e.beta ?? 0) - 45)) / 60 + 0.5
      mousePosRef.current.x = g
      mousePosRef.current.y = b
    }

    const attach = () => {
      if (removed) return
      window.addEventListener('deviceorientation', handle, { passive: true })
      off = () => window.removeEventListener('deviceorientation', handle)
    }

    // iOS Safari (and some Android variants): permission gate via DeviceOrientationEvent.requestPermission.
    interface DOEWithPermission {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }
    const DOE = DeviceOrientationEvent as unknown as DOEWithPermission

    if (typeof DOE.requestPermission === 'function') {
      const askOnce = () => {
        window.removeEventListener('touchend', askOnce)
        DOE.requestPermission!()
          .then((state) => { if (state === 'granted') attach() })
          .catch(() => { /* user denied or browser blocked — silent fail */ })
      }
      window.addEventListener('touchend', askOnce, { once: true, passive: true })
      return () => {
        removed = true
        window.removeEventListener('touchend', askOnce)
        off?.()
      }
    }

    // Android / non-permission browsers: attach immediately.
    attach()
    return () => { removed = true; off?.() }
  }, [stacked])

  // Leva is an opt-in design tool — only loads when ?leva is in the URL.
  // This keeps the leva bundle (and its per-render store updates) out of
  // normal visitor traffic.
  const levaEnabled = useMemo(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).has('leva')
  }, [])

  useEffect(() => { accentHoverRef.current = hoverInfo ?? null }, [hoverInfo])

  useEffect(() => {
    if (navOnly) {
      scrollRef.current = 1
      return
    }
    const calcP = () => Math.min(window.scrollY / window.innerHeight, 1)
    // Initialise immediately so refresh-at-bottom gets the right p from frame 1
    scrollRef.current = calcP()
    const onScroll = () => {
      // Guard: if navOnly has just flipped true in a new render but this
      // listener hasn't been torn down yet, ignore scrolls so a stray
      // scrollTo(0,0) can't snap scrollRef back to the hero position.
      if (navOnlyRef.current) return
      scrollRef.current = calcP()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [navOnly])

  useEffect(() => { setIsMounted(true) }, [])

  const handleReady = useCallback(() => setFontLoaded(true), [])
  const handleEnvReady = useCallback(() => setEnvReady(true), [])

  // Fire the cross-fade hook the moment both flips are true. Latest callback
  // held in a ref so re-renders don't double-fire on parent re-renders.
  const onVisualReadyRef = useRef(onVisualReady)
  onVisualReadyRef.current = onVisualReady
  const visualReadyFiredRef = useRef(false)
  useEffect(() => {
    if (fontLoaded && envReady && !visualReadyFiredRef.current) {
      visualReadyFiredRef.current = true
      // Wait two paints so the opacity transition is well underway before we
      // tell the fallback to fade out — gives the two layers a brief overlap
      // and no perceptible gap.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        onVisualReadyRef.current?.()
      }))
    }
  }, [fontLoaded, envReady])

  if (!isMounted) return null

  return (
    <>
      {levaEnabled && (
        <Suspense fallback={null}>
          <LevaPanel />
        </Suspense>
      )}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 110,  // above header (z:100) so 3D name stays visible
          pointerEvents: 'none',
          opacity: (fontLoaded && envReady) ? 1 : 0,
          transition: 'opacity 0.9s ease',
        }}
      >
        <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        // Mobile clamps DPR tighter — chrome detail is forgiving and the
        // shader cost on tile-deferred GPUs scales linearly with pixel count.
        dpr={stacked ? [1, 1.25] : [1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <CanvasSetup />
        {levaEnabled ? (
          <Suspense fallback={null}>
            <SceneLeva
              scrollRef={scrollRef}
              navRef={navRef}
              accentHoverRef={accentHoverRef}
              mousePosRef={mousePosRef}
              onReady={handleReady}
              onEnvReady={handleEnvReady}
              navOnly={!!navOnly}
              stacked={stacked}
            />
          </Suspense>
        ) : (
          <SceneContent
            scrollRef={scrollRef}
            navRef={navRef}
            accentHoverRef={accentHoverRef}
            mousePosRef={mousePosRef}
            navOnly={!!navOnly}
            onReady={handleReady}
            onEnvReady={handleEnvReady}
            stacked={stacked}
          />
        )}
        </Canvas>
      </div>
    </>
  )
}
