'use client'

/**
 * Hero3D.tsx
 *
 * Fixed transparent canvas. 3D name starts in the hero, then on scroll
 * shrinks + spins into the header top-left and STAYS there.
 *
 * All visual knobs are live-tweakable via the Leva panel (top-right).
 */

import { useRef, useState, useEffect, Suspense, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center, Text3D } from '@react-three/drei'
import { Leva, useControls, button } from 'leva'
import * as THREE from 'three'

const FONT = '/fonts/Fredoka Expanded_Bold.json'

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
// ImageEnv — loads day.jpg (06:00–20:00 Berlin) or night.jpeg otherwise as an
// equirectangular PMREM environment map for the chrome reflections.
// Falls back to a neutral chrome gradient if neither file loads.
// ─────────────────────────────────────────────────────────────────────────────
function getBerlinIsDay(): boolean {
  const hour = parseInt(
    new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Berlin',
      hour: 'numeric',
      hour12: false,
    }),
    10,
  )
  return hour >= 6 && hour < 20
}

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
    let envMap: THREE.Texture | null = null

    const apply = (map: THREE.Texture) => {
      envMap = map
      scene.environment = map
    }

    const isDay = getBerlinIsDay()
    const path  = isDay ? '/day.jpg' : '/night.jpeg'

    const loader = new THREE.TextureLoader()
    loader.load(
      path,
      (texture) => {
        const img = texture.image as HTMLImageElement
        const W   = img.naturalWidth  || img.width
        const H   = img.naturalHeight || img.height
        const c   = document.createElement('canvas')
        c.width = W; c.height = H
        const ctx = c.getContext('2d')!

        if (isDay) {
          // Flip vertically (sun to zenith) + gentle exposure boost
          ctx.filter = 'brightness(130%) saturate(110%)'
          ctx.translate(0, H)
          ctx.scale(1, -1)
          ctx.drawImage(img, 0, 0)
        } else {
          // Night images tend to be very dark — boost heavily for chrome
          ctx.filter = 'brightness(280%) contrast(115%) saturate(120%)'
          ctx.drawImage(img, 0, 0)
        }

        texture.dispose()
        const processed      = new THREE.CanvasTexture(c)
        processed.mapping    = THREE.EquirectangularReflectionMapping
        processed.colorSpace = THREE.SRGBColorSpace
        const pmrem = new THREE.PMREMGenerator(gl)
        pmrem.compileEquirectangularShader()
        apply(pmrem.fromEquirectangular(processed).texture)
        processed.dispose(); pmrem.dispose()
      },
      undefined,
      () => { apply(buildNeutralEnv(gl)) },
    )

    return () => {
      if (envMap) { envMap.dispose(); if (scene.environment === envMap) scene.environment = null }
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
}

function SceneContent({ scrollRef, navRef, accentHoverRef, mousePosRef, onReady }: SceneProps) {
  // Ref always holds latest values so the copy button callback isn't stale
  const latest = useRef<Record<string, unknown>>({})

  // ── Leva controls ──────────────────────────────────────────────────────────
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

  // Keep latest ref in sync each render
  latest.current = { geo, mat, lights, anim }

  // ── Lights ─────────────────────────────────────────────────────────────────
  return (
    <>
      <directionalLight color="#FFE4C0" intensity={lights.key} position={[6, 4, 2.5]} />
      <directionalLight color="#C8D8FF" intensity={lights.fill} position={[-5, -2, 1.5]} />
      <directionalLight color="#FFFFFF" intensity={lights.rim} position={[0, 1.5, -6]} />
      <directionalLight color="#FFD0A0" intensity={lights.kicker} position={[3, -2, -4]} />
      <ambientLight intensity={lights.ambient} />
      <ImageEnv intensity={lights.envIntensity} />

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
        />
      </Suspense>
    </>
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
}

function NameMesh({ scrollRef, navRef, accentHoverRef, mousePosRef, onReady, geo, mat, anim }: NameMeshProps) {
  const groupRef = useRef<THREE.Group>(null!)
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
      const halfW = (textWidthRef.current * anim.navScale) / 2
      navRef.current = { x: wp.x + halfW, y: wp.y }
    }
    recomputeNavRef.current = compute
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [size, camera, navRef, anim.navScale])

  useEffect(() => { onReady() }, [onReady])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const p = Math.min(Math.max(scrollRef.current, 0), 1)
    const nav = navRef.current
    const time = clock.elapsedTime
    const ease = 1 - p

    // On first frame where nav target is known: if already scrolled to the end
    // (e.g. page refresh while at the bottom) snap directly to final pose so
    // the text never visibly lerps from the hero center to the header.
    if (!hasSnapped.current && nav) {
      if (p >= 1) {
        groupRef.current.position.set(nav.x, nav.y, 0)
        groupRef.current.scale.setScalar(anim.navScale)
        groupRef.current.rotation.x = Math.PI * 2 * anim.flipX
        groupRef.current.rotation.y = Math.PI * 2 * anim.flipSpins
        groupRef.current.rotation.z = 0
      }
      hasSnapped.current = true
    }

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
    const tS = 1 + (anim.navScale - 1) * p

    const s = 0.075
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, tX, s)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, tY, s)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, flipRotX, s)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, idleRotY + flipRotY, s)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, s)
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, tS, s))

    // Sun beam — always follows mouse, turns tile-colored on hover
    const hover = accentHoverRef.current
    const mp = mousePosRef.current

    // Offset from the text's current world position so it works in
    // both hero (center) and nav (top-left) positions
    const tx = groupRef.current.position.x
    const ty = groupRef.current.position.y
    tgtLightPos.current.set(
      tx + (mp.x * 2 - 1) * 10,   // orbit left/right of text
      ty - (mp.y * 2 - 1) * 7,    // orbit above/below text
      8
    )

    if (hover) {
      tgtColor.current.set(hover.color)
      tgtIntensity.current = anim.accentIntensity
      tgtEmissive.current.set(hover.color)
      tgtEmissiveInt.current = 0.45
    } else {
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
  mousePosRef?: React.MutableRefObject<{ x: number; y: number }>
  /** When true: skip hero animation, always render in nav position */
  navOnly?: boolean
}

export default function Hero3D({ hoverInfo, mousePosRef, navOnly }: Hero3DProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [fontLoaded, setFontLoaded] = useState(false)

  const scrollRef = useRef<number>(navOnly ? 1 : 0)
  const navRef = useRef<{ x: number; y: number } | null>(null)
  const accentHoverRef = useRef<TileHover | null>(null)
  const internalMouseRef = useRef({ x: 0.5, y: 0.5 })
  const effectiveMouseRef = mousePosRef ?? internalMouseRef

  useEffect(() => { accentHoverRef.current = hoverInfo ?? null }, [hoverInfo])

  useEffect(() => {
    if (navOnly) {
      scrollRef.current = 1
      return
    }
    const calcP = () => Math.min(window.scrollY / window.innerHeight, 1)
    // Initialise immediately so refresh-at-bottom gets the right p from frame 1
    scrollRef.current = calcP()
    const onScroll = () => { scrollRef.current = calcP() }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [navOnly])

  useEffect(() => { setIsMounted(true) }, [])

  const handleReady = useCallback(() => setFontLoaded(true), [])

  if (!isMounted) return null

  return (
    <>
      {/* Leva panel — top-right, collapsed by default */}
      <Leva hidden />

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
          <SceneContent
            scrollRef={scrollRef}
            navRef={navRef}
            accentHoverRef={accentHoverRef}
            mousePosRef={effectiveMouseRef}
            onReady={handleReady}
          />
        </Canvas>
      </div>
    </>
  )
}
