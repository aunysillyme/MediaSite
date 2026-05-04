import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useVenueStore } from '../../store.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const RAW_CLIPS = [
  'open skies.mp4',
  'neonify cyan.mp4',
  'open seas.mp4',
  'fried circuits 2.mp4',
  'neonify orange.mp4',
  'purple thunder.mp4',
  'blue thunder.mp4',
  'desk lamp.mp4',
  'but stop.mp4',
  'stillness.mp4',
  'unsent messages.mp4',
  'intersection.mp4',
  '111AM.mp4',
  'ocean pkwy.mp4',
  'skipped exit.mp4',
  'stop sign.mp4',
  'streetlights.mp4',
  'rearview mirror.mp4',
  'latte art.mp4',
  'page turner.mp4',
  'light.mp4',
  'softie.mp4',
  'morning buffer.mp4',
  'commute.mp4',
  'water bodies.mp4',
  'focus mode.mp4',
  "you're late.mp4",
  'bright AF.mp4',
  'lo finance.mp4',
  'silence.mp4',
  'morning buffer 2.mp4',
  'page turner 2.mp4',
  'latte art 2.mp4',
]

const CLIPS = shuffle(RAW_CLIPS).map(f => '/video/' + encodeURIComponent(f))

const PANEL_COUNT = 12
const SPHERE_R = 3.5

// Alternating portrait/landscape sizes for collage variety
const PANEL_SIZES = [
  [1.55, 1.0],
  [1.0,  1.55],
  [1.4,  0.9],
  [0.9,  1.4],
  [1.5,  1.05],
  [1.05, 1.5],
  [1.35, 0.9],
  [0.9,  1.35],
  [1.45, 1.0],
  [1.0,  1.45],
  [1.3,  0.85],
  [0.85, 1.3],
]

// Fibonacci sphere distribution — evenly spaces N points across a sphere
function buildLayout() {
  const phi = Math.PI * (3 - Math.sqrt(5))
  const zAxis = new THREE.Vector3(0, 0, 1)
  const panels = []

  for (let i = 0; i < PANEL_COUNT; i++) {
    const y  = 1 - (i / (PANEL_COUNT - 1)) * 2
    const r  = Math.sqrt(Math.max(0, 1 - y * y))
    const th = phi * i
    const nx = r * Math.cos(th)
    const nz = r * Math.sin(th)

    // Rotate plane so its face points outward from sphere center
    const q = new THREE.Quaternion().setFromUnitVectors(
      zAxis,
      new THREE.Vector3(nx, y, nz).normalize()
    )
    const euler = new THREE.Euler().setFromQuaternion(q)

    panels.push({
      pos: [nx * SPHERE_R, y * SPHERE_R, nz * SPHERE_R],
      rot: [euler.x, euler.y, euler.z + (Math.random() - 0.5) * 0.55],
      w: PANEL_SIZES[i][0],
      h: PANEL_SIZES[i][1],
    })
  }
  return panels
}

const LAYOUT  = buildLayout()
const SELECTED = CLIPS.slice(0, PANEL_COUNT)

function VideoPanel({ src, width, height, position, rotation }) {
  const matRef = useRef()

  useEffect(() => {
    const video = document.createElement('video')
    video.src      = src
    video.loop     = true
    video.muted    = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'

    const onReady = () => {
      video.play().catch(() => {})
      if (!matRef.current) return
      const tex = new THREE.VideoTexture(video)
      tex.colorSpace = THREE.SRGBColorSpace
      matRef.current.map = tex
      matRef.current.needsUpdate = true
    }

    video.addEventListener('loadeddata', onReady)
    video.load()

    return () => {
      video.removeEventListener('loadeddata', onReady)
      video.pause()
      video.src = ''
      if (matRef.current?.map instanceof THREE.VideoTexture) {
        matRef.current.map.dispose()
      }
    }
  }, [src])

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial ref={matRef} color="#2a0050" side={THREE.DoubleSide} />
    </mesh>
  )
}

export default function SphereStage() {
  const spinRef         = useRef()
  const wireframeMeshRef = useRef()
  const wireframeMatRef  = useRef()
  const glassMeshRef     = useRef()
  const glassMatRef      = useRef()
  const portalProgress   = useRef(0)

  const portalOpen    = useVenueStore((s) => s.portalOpen)
  const portalOpenRef = useRef(false)
  portalOpenRef.current = portalOpen

  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += 0.0015

    const target = portalOpenRef.current ? 1 : 0
    const factor = 1 - Math.pow(0.018, delta)
    portalProgress.current += (target - portalProgress.current) * factor
    const p = portalProgress.current

    if (wireframeMeshRef.current) wireframeMeshRef.current.scale.setScalar(1 + p * 0.35)
    if (wireframeMatRef.current)  wireframeMatRef.current.opacity = Math.max(0, 0.07 * (1 - p))
    if (glassMeshRef.current)     glassMeshRef.current.scale.setScalar(1 + p * 0.6)
    if (glassMatRef.current)      glassMatRef.current.opacity = Math.max(0, 0.04 * (1 - p))
  })

  return (
    <group position={[0, 5, 0]}>
      {/* Spinning collage */}
      <group ref={spinRef}>
        {/* Dark base sphere fills gaps between panels */}
        <mesh>
          <sphereGeometry args={[3.48, 48, 32]} />
          <meshStandardMaterial color="#0d0020" />
        </mesh>

        {/* Video panels distributed across sphere surface */}
        {LAYOUT.map((panel, i) => (
          <VideoPanel
            key={i}
            src={SELECTED[i]}
            width={panel.w}
            height={panel.h}
            position={panel.pos}
            rotation={panel.rot}
          />
        ))}
      </group>

      {/* LED wireframe — stays still */}
      <mesh ref={wireframeMeshRef}>
        <sphereGeometry args={[3.57, 18, 12]} />
        <meshStandardMaterial ref={wireframeMatRef} wireframe color="#ffffff" transparent opacity={0.07} />
      </mesh>

      {/* Outer glass shell */}
      <mesh ref={glassMeshRef}>
        <sphereGeometry args={[3.85, 32, 32]} />
        <meshStandardMaterial
          ref={glassMatRef}
          color="#9966ff"
          transparent
          opacity={0.04}
          roughness={0}
          metalness={0.8}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Stage pillar */}
      <mesh position={[0, -5.5, 0]}>
        <cylinderGeometry args={[1.4, 1.9, 4, 32]} />
        <meshStandardMaterial color="#0D0010" metalness={0.9} roughness={0.1} />
      </mesh>

      <pointLight color="#FF6B00" intensity={5} distance={32} position={[0, 0, 0]} />
      <pointLight color="#7B00FF" intensity={2} distance={22} position={[0, 2, 3]} />
    </group>
  )
}
