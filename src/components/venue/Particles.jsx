import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 600 }) {
  const mesh = useRef()

  const { positions, colors, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const offsets = new Float32Array(count)

    const palette = [
      new THREE.Color('#FF6B00'),
      new THREE.Color('#7B00FF'),
      new THREE.Color('#FFD700'),
      new THREE.Color('#FF3399'),
      new THREE.Color('#00FFFF'),
    ]

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = Math.random() * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40

      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      speeds[i] = 0.3 + Math.random() * 0.7
      offsets[i] = Math.random() * Math.PI * 2
    }

    return { positions, colors, speeds, offsets }
  }, [count])

  const positionAttr = useRef(new THREE.BufferAttribute(positions.slice(), 3))

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    const pos = positionAttr.current.array

    for (let i = 0; i < count; i++) {
      pos[i * 3] += Math.sin(t * 0.3 + offsets[i]) * 0.003
      pos[i * 3 + 1] += speeds[i] * 0.005
      pos[i * 3 + 2] += Math.cos(t * 0.2 + offsets[i]) * 0.002

      if (pos[i * 3 + 1] > 8.5) {
        pos[i * 3 + 1] = 0
        pos[i * 3] = (Math.random() - 0.5) * 30
        pos[i * 3 + 2] = (Math.random() - 0.5) * 40
      }
    }
    positionAttr.current.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          ref={positionAttr}
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  )
}
