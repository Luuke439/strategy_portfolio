'use client'

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

function ImageEnv({ intensity }: { intensity: number }) {
  const { scene, gl } = useThree()

  useEffect(() => {
    // Apply neutral studio env synchronously — guarantees the chrome is lit
    // from frame 0, so we never render black while day.jpg is downloading.
    const neutral = buildNeutralEnv(gl)
    scene.environment = neutral

    let hdriMap: THREE.Texture | null = null
    let cancelled = false

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
      },
      undefined,
      () => { /* keep neutral — day.jpg failed to load */ },
    )

    return () => {
      cancelled = true
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
// ScrollArrow — geometric V-chevron at screen bottom, floats + fades on scroll
// ─────────────────────────────────────────────────────────────────────────────
function ScrollArrow({ scrollRef, mat }: {
  scrollRef: React.MutableRefObject<number>
  mat: Record<string, unknown>
}) {
  const groupRef = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const p = scrollRef.current
    const visibility = Math.max(0, 1 - p / 0.15)
    const floatY = Math.sin((clock.elapsedTime / 1.8) * Math.PI * 2) * 0.06
    groupRef.current.scale.setScalar(visibility)
    groupRef.current.position.y = -2.3 + floatY
  })

  const armProps = {
    color: mat.color as string,
    metalness: mat.metalness as number,
    roughness: mat.roughness as number,
    clearcoat: mat.clearcoat as number,
    clearcoatRoughness: mat.clearcoatRoughness as number,
    reflectivity: mat.reflectivity as number,
    envMapIntensity: mat.envMapIntensity as number,
  }

  return (
    <group ref={groupRef} position={[0, -2.3, 0]}>
      {/* Shaft */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.045, 0.38, 0.03]} />
        <meshPhysicalMaterial {...armProps} />
      </mesh>
      {/* Arrowhead left */}
      <mesh position={[-0.13, -0.08, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.045, 0.32, 0.03]} />
        <meshPhysicalMaterial {...armProps} />
      </mesh>
      {/* Arrowhead right */}
      <mesh position={[0.13, -0.08, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.045, 0.32, 0.03]} />
        <meshPhysicalMaterial {...armProps} />
      </mesh>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
interface TileHover { color: string; x: number; y: number }

interface SceneProps {
  scrollRef: React.MutableRefObject<number>
  navRef: React.MutableRefObject<{ x: number; y: number } | null>
  accentHoverRef: React.MutableRefObject<TileHover | null>
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>
  onReady: () => void
  /** When true: text is always at nav position, regardless of scroll.
   *  NameMesh also snaps on every flip of this flag. */
  navOnly: boolean
}

export function SceneBody({
  scrollRef, navRef, accentHoverRef, mousePosRef, onReady, navOnly,
  geo, mat, lights, anim,
}: SceneProps & {
  geo: typeof DEFAULT_GEO | Record<string, number>
  mat: typeof DEFAULT_MAT | Record<string, number | string>
  lights: typeof DEFAULT_LIGHTS | Record<string, number>
  anim: typeof DEFAULT_ANIM | Record<string, number>
}) {
  return (
    <>
      <directionalLight color="#FFE4C0" intensity={lights.key as number} position={[6, 4, 2.5]} />
      <directionalLight color="#C8D8FF" intensity={lights.fill as number} position={[-5, -2, 1.5]} />
      <directionalLight color="#FFFFFF" intensity={lights.rim as number} position={[0, 1.5, -6]} />
      <directionalLight color="#FFD0A0" intensity={lights.kicker as number} position={[3, -2, -4]} />
      <ambientLight intensity={lights.ambient as number} />
      <ImageEnv intensity={lights.envIntensity as number} />

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
        />
      </Suspense>
    </>
  )
}

function SceneContent(props: SceneProps) {
  return (
    <SceneBody
      {...props}
      geo={DEFAULT_GEO}
      mat={DEFAULT_MAT}
      lights={DEFAULT_LIGHTS}
      anim={DEFAULT_ANIM}
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
}

function NameMesh({ scrollRef, navRef, accentHoverRef, mousePosRef, onReady, geo, mat, anim, navOnly }: NameMeshProps) {
  const groupRef = useRef<THREE.Group>(null!)
  // Snaps only on the very first frame (once the nav target is measurable)
  // to avoid the initial flash from the default position to the real target.
  // Route changes after that just lerp, so the text smoothly continues from
  // wherever it was — same behaviour as if the user had kept scrolling.
  const hasSnapped = useRef(false)
  const textWidthRef = useRef<number>(0)
  const recomputeNavRef = useRef<() => void>(() => { })
  // Sun beam light + material emissive for tile color
  const lAccent = useRef<THREE.PointLight>(null!)
  const matRef  = useRef<THREE.MeshPhysicalMaterial>(null!)
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
  // text left-aligns correctly at every viewport size without a manual correction.
  useEffect(() => {
    const compute = () => {
      const span = document.getElementById('nav-name-span')
      if (!span || !textWidthRef.current) return
      const r = span.getBoundingClientRect()
      // Unproject the LEFT edge of the span (not its centre)
      const ndcX = (r.left / size.width) * 2 - 1
      const ndcY = -(((r.top + r.height * 0.5) / size.height) * 2 - 1)
      const v = new THREE.Vector3(ndcX, ndcY, 0.5)
        .unproject(camera as THREE.PerspectiveCamera)
      const dir = v.sub(camera.position).normalize()
      const t = -camera.position.z / dir.z
      const wp = camera.position.clone().addScaledVector(dir, t)
      // Shift center right so the text's left edge lands at the span's left edge
      const halfW = (textWidthRef.current * effectiveNavScale) / 2
      navRef.current = { x: wp.x + halfW, y: wp.y }
    }
    recomputeNavRef.current = compute
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [size, camera, navRef, effectiveNavScale])

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
    if (matRef.current) {
      matRef.current.emissive.copy(curEmissive.current)
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(matRef.current.emissiveIntensity, tgtEmissiveInt.current, ls)
    }
  })

  return (
    <group ref={groupRef} position={[anim.heroX, anim.heroY, 0]}>
      {/* Surround accent rig — front, back, left, right, top, bottom */}
      <pointLight ref={lAccent} position={[0, 0, 8]} intensity={14} distance={35} color="#ffffff" />
      <Center onCentered={({ width }) => {
        textWidthRef.current = width
        recomputeNavRef.current()
      }}>
        <Text3D
          font={FONT}
          size={geo.textSize}
          height={geo.depth}
          curveSegments={geo.curveSegments}
          letterSpacing={0.08}
          bevelEnabled
          bevelThickness={geo.bevelThickness}
          bevelSize={geo.bevelSize}
          bevelSegments={geo.bevelSegments}
        >
          LUKE CAPORELLI
          <meshPhysicalMaterial
            ref={matRef}
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
        </Text3D>
      </Center>
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
}

export default function Hero3D({ hoverInfo, navOnly }: Hero3DProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [fontLoaded, setFontLoaded] = useState(false)

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
          opacity: fontLoaded ? 1 : 0,
          transition: 'opacity 0.9s ease',
        }}
      >
        <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
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
              navOnly={!!navOnly}
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
          />
        )}
        </Canvas>
      </div>
    </>
  )
}
