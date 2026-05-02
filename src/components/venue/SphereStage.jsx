import { useRef, useState, useEffect } from 'react'
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

function VideoSphere({ src }) {
  const matRef = useRef()

  useEffect(() => {
    const video = document.createElement('video')
    video.src = src
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'

    const onReady = () => {
      video.play().catch(() => {})
      if (!matRef.current) return
      const tex = new THREE.VideoTexture(video)
      tex.colorSpace = THREE.SRGBColorSpace
      matRef.current.map = tex
      matRef.current.emissiveMap = tex
      matRef.current.color.set('#ffffff')
      matRef.current.emissive.set('#444444')
      matRef.current.emissiveIntensity = 0.6
      matRef.current.needsUpdate = true
    }

    video.addEventListener('loadeddata', onReady)
    video.addEventListener('error', () => {})
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
    <mesh>
      <sphereGeometry args={[3.5, 48, 32]} />
      <meshStandardMaterial
        ref={matRef}
        color="#0d0020"
        emissive="#6600cc"
        emissiveIntensity={0.7}
      />
    </mesh>
  )
}

export default function SphereStage() {
  const spinRef = useRef()
  const wireframeMeshRef = useRef()
  const wireframeMatRef = useRef()
  const glassMeshRef = useRef()
  const glassMatRef = useRef()
  const portalProgress = useRef(0)

  const [clipIndex, setClipIndex] = useState(() =>
    Math.floor(Math.random() * CLIPS.length)
  )

  const portalOpen = useVenueStore((s) => s.portalOpen)
  const portalOpenRef = useRef(false)
  portalOpenRef.current = portalOpen

  useEffect(() => {
    const t = setInterval(
      () => setClipIndex(i => (i + 1) % CLIPS.length),
      25000
    )
    return () => clearInterval(t)
  }, [])

  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += 0.0015

    const target = portalOpenRef.current ? 1 : 0
    const factor = 1 - Math.pow(0.018, delta)
    portalProgress.current += (target - portalProgress.current) * factor
    const p = portalProgress.current

    if (wireframeMeshRef.current) wireframeMeshRef.current.scale.setScalar(1 + p * 0.35)
    if (wireframeMatRef.current)  wireframeMatRef.current.opacity = Math.max(0, 0.07 * (1 - p))

    if (glassMeshRef.current) glassMeshRef.current.scale.setScalar(1 + p * 0.6)
    if (glassMatRef.current)  glassMatRef.current.opacity = Math.max(0, 0.04 * (1 - p))
  })

  return (
    <group position={[0, 5, 0]}>
      {/* Spinning video sphere */}
      <group ref={spinRef}>
        <VideoSphere key={clipIndex} src={CLIPS[clipIndex]} />
      </group>

      {/* LED wireframe grid */}
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

      {/* Pillar from floor to sphere bottom */}
      <mesh position={[0, -5.5, 0]}>
        <cylinderGeometry args={[1.4, 1.9, 4, 32]} />
        <meshStandardMaterial color="#0D0010" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Sphere glow lights */}
      <pointLight color="#FF6B00" intensity={5} distance={32} position={[0, 0, 0]} />
      <pointLight color="#7B00FF" intensity={2} distance={22} position={[0, 2, 3]} />
    </group>
  )
}
