import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

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
      tex.rotation = Math.PI / 2
      tex.center.set(0.5, 0.5)
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
      <sphereGeometry args={[3, 48, 32]} />
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
  const [clipIndex, setClipIndex] = useState(() =>
    Math.floor(Math.random() * CLIPS.length)
  )

  useEffect(() => {
    const t = setInterval(
      () => setClipIndex(i => (i + 1) % CLIPS.length),
      25000
    )
    return () => clearInterval(t)
  }, [])

  useFrame(() => {
    if (spinRef.current) spinRef.current.rotation.y += 0.0015
  })

  return (
    <group position={[0, 4, 0]}>
      {/* Spinning video sphere */}
      <group ref={spinRef}>
        <VideoSphere key={clipIndex} src={CLIPS[clipIndex]} />
      </group>

      {/* LED wireframe grid */}
      <mesh>
        <sphereGeometry args={[3.06, 18, 12]} />
        <meshStandardMaterial wireframe color="#ffffff" transparent opacity={0.07} />
      </mesh>

      {/* Outer glass shell */}
      <mesh>
        <sphereGeometry args={[3.28, 32, 32]} />
        <meshStandardMaterial
          color="#9966ff"
          transparent
          opacity={0.04}
          roughness={0}
          metalness={0.8}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Pedestal */}
      <mesh position={[0, -3.6, 0]}>
        <cylinderGeometry args={[1.2, 1.65, 1.2, 32]} />
        <meshStandardMaterial color="#0D0010" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Sphere glow lights */}
      <pointLight color="#FF6B00" intensity={5} distance={28} position={[0, 0, 0]} />
      <pointLight color="#7B00FF" intensity={2} distance={18} position={[0, 2, 3]} />
    </group>
  )
}
