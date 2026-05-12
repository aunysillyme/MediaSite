import { useRef, useEffect, useMemo } from 'react'
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
  'open skies.mp4', 'neonify cyan.mp4', 'open seas.mp4',
  'fried circuits 2.mp4', 'neonify orange.mp4', 'purple thunder.mp4',
  'blue thunder.mp4', 'desk lamp.mp4', 'but stop.mp4',
  'stillness.mp4', 'unsent messages.mp4', 'intersection.mp4',
  '111AM.mp4', 'ocean pkwy.mp4', 'skipped exit.mp4',
  'stop sign.mp4', 'streetlights.mp4', 'rearview mirror.mp4',
  'latte art.mp4', 'page turner.mp4', 'light.mp4',
  'softie.mp4', 'morning buffer.mp4', 'commute.mp4',
  'water bodies.mp4', 'focus mode.mp4', "you're late.mp4",
  'bright AF.mp4', 'lo finance.mp4', 'silence.mp4',
  'morning buffer 2.mp4', 'page turner 2.mp4', 'latte art 2.mp4',
]

const SHUFFLED = shuffle(RAW_CLIPS).map(f => '/video/' + encodeURIComponent(f))
const SPHERE_R = 3.6

// Preload all videos eagerly into a shared pool
const videoPool = new Map()
function getVideo(src) {
  if (videoPool.has(src)) return videoPool.get(src)
  const video = document.createElement('video')
  video.src = src
  video.loop = true
  video.muted = true
  video.playsInline = true
  video.crossOrigin = 'anonymous'
  video.preload = 'auto'
  video.currentTime = Math.random() * 10
  video.load()
  videoPool.set(src, video)
  return video
}
// Kick off preloading immediately at module load
SHUFFLED.forEach(getVideo)

const BANDS = [
  { latStart: 0.08, latEnd: 0.28, cols: 8, speed: 0.12 },
  { latStart: 0.28, latEnd: 0.45, cols: 10, speed: -0.08 },
  { latStart: 0.45, latEnd: 0.62, cols: 12, speed: 0.06 },
  { latStart: 0.62, latEnd: 0.75, cols: 10, speed: -0.10 },
  { latStart: 0.75, latEnd: 0.92, cols: 8, speed: 0.14 },
]

function buildBandGeometry(latStart, latEnd, cols, clipOffset) {
  const phiStart = latStart * Math.PI
  const phiEnd = latEnd * Math.PI
  const thetaLen = (2 * Math.PI) / cols

  const panels = []
  for (let c = 0; c < cols; c++) {
    const clipIdx = (clipOffset + c) % SHUFFLED.length
    panels.push({
      phiStart,
      phiEnd,
      thetaStart: c * thetaLen,
      thetaEnd: (c + 1) * thetaLen,
      clipSrc: SHUFFLED[clipIdx],
    })
  }
  return panels
}

function createPanelGeometry(phiStart, phiEnd, thetaStart, thetaEnd, radius) {
  const phiSegs = 6
  const thetaSegs = 8
  const positions = []
  const uvs = []
  const indices = []

  for (let p = 0; p <= phiSegs; p++) {
    const phi = phiStart + (p / phiSegs) * (phiEnd - phiStart)
    for (let t = 0; t <= thetaSegs; t++) {
      const theta = thetaStart + (t / thetaSegs) * (thetaEnd - thetaStart)
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi)
      const z = radius * Math.sin(phi) * Math.sin(theta)
      positions.push(x, y, z)
      uvs.push(t / thetaSegs, 1 - p / phiSegs)
    }
  }

  for (let p = 0; p < phiSegs; p++) {
    for (let t = 0; t < thetaSegs; t++) {
      const a = p * (thetaSegs + 1) + t
      const b = a + 1
      const c = a + thetaSegs + 1
      const d = c + 1
      indices.push(a, c, b, b, c, d)
    }
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  return geom
}

function LEDPanel({ phiStart, phiEnd, thetaStart, thetaEnd, clipSrc }) {
  const matRef = useRef()
  const geom = useMemo(
    () => createPanelGeometry(phiStart, phiEnd, thetaStart, thetaEnd, SPHERE_R),
    [phiStart, phiEnd, thetaStart, thetaEnd]
  )

  useEffect(() => {
    const video = getVideo(clipSrc)

    const attachTexture = () => {
      video.play().catch(() => {})
      if (!matRef.current) return
      const tex = new THREE.VideoTexture(video)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      matRef.current.map = tex
      matRef.current.emissiveMap = tex
      matRef.current.needsUpdate = true
    }

    if (video.readyState >= 2) {
      attachTexture()
    } else {
      video.addEventListener('loadeddata', attachTexture, { once: true })
    }

    return () => {
      video.removeEventListener('loadeddata', attachTexture)
      if (matRef.current?.map instanceof THREE.VideoTexture) {
        matRef.current.map.dispose()
      }
    }
  }, [clipSrc])

  return (
    <mesh geometry={geom}>
      <meshStandardMaterial
        ref={matRef}
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.4}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  )
}

function Band({ config, clipOffset }) {
  const groupRef = useRef()
  const panels = useMemo(
    () => buildBandGeometry(config.latStart, config.latEnd, config.cols, clipOffset),
    [config, clipOffset]
  )

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += config.speed * delta
    }
  })

  return (
    <group ref={groupRef}>
      {panels.map((p, i) => (
        <LEDPanel key={i} {...p} />
      ))}
    </group>
  )
}

function SeparatorRing({ lat, color = '#7B00FF', opacity = 0.5 }) {
  const phi = lat * Math.PI
  const r = SPHERE_R * Math.sin(phi) + 0.02
  const y = SPHERE_R * Math.cos(phi)

  return (
    <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[r, 0.012, 8, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </mesh>
  )
}

function PolarCap({ isTop }) {
  const phi = isTop ? 0.08 * Math.PI : 0.92 * Math.PI
  const r = SPHERE_R * Math.sin(phi)
  const y = SPHERE_R * Math.cos(phi)

  return (
    <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <circleGeometry args={[r, 32]} />
      <meshStandardMaterial
        color="#0D0010"
        emissive="#1a0030"
        emissiveIntensity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function SphereStage() {
  const wireframeMeshRef = useRef()
  const wireframeMatRef  = useRef()
  const glassMeshRef     = useRef()
  const glassMatRef      = useRef()
  const portalProgress   = useRef(0)

  const portalOpen = useVenueStore((s) => s.portalOpen)
  const portalOpenRef = useRef(false)
  portalOpenRef.current = portalOpen

  const clipOffsets = useMemo(() => {
    let offset = 0
    return BANDS.map(b => {
      const o = offset
      offset += b.cols
      return o
    })
  }, [])

  useFrame((_, delta) => {
    const target = portalOpenRef.current ? 1 : 0
    const factor = 1 - Math.pow(0.018, delta)
    portalProgress.current += (target - portalProgress.current) * factor
    const p = portalProgress.current

    if (wireframeMeshRef.current) wireframeMeshRef.current.scale.setScalar(1 + p * 0.35)
    if (wireframeMatRef.current) wireframeMatRef.current.opacity = Math.max(0, 0.07 * (1 - p))
    if (glassMeshRef.current) glassMeshRef.current.scale.setScalar(1 + p * 0.6)
    if (glassMatRef.current) glassMatRef.current.opacity = Math.max(0, 0.04 * (1 - p))
  })

  const separatorLats = BANDS.map(b => b.latStart).concat([BANDS[BANDS.length - 1].latEnd])

  return (
    <group position={[0, 5, 0]}>
      {BANDS.map((band, i) => (
        <Band key={i} config={band} clipOffset={clipOffsets[i]} />
      ))}

      {separatorLats.map((lat, i) => (
        <SeparatorRing
          key={i}
          lat={lat}
          color={i % 2 === 0 ? '#7B00FF' : '#FF6B00'}
          opacity={0.4}
        />
      ))}

      <PolarCap isTop />
      <PolarCap isTop={false} />

      <mesh ref={wireframeMeshRef}>
        <sphereGeometry args={[3.57, 18, 12]} />
        <meshStandardMaterial ref={wireframeMatRef} wireframe color="#ffffff" transparent opacity={0.07} />
      </mesh>

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

      <mesh position={[0, -5.5, 0]}>
        <cylinderGeometry args={[1.4, 1.9, 4, 32]} />
        <meshStandardMaterial color="#0D0010" metalness={0.9} roughness={0.1} />
      </mesh>

      <pointLight color="#FF6B00" intensity={5} distance={32} position={[0, 0, 0]} />
      <pointLight color="#7B00FF" intensity={2} distance={22} position={[0, 2, 3]} />
    </group>
  )
}
