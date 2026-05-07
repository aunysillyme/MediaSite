import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 300 }) {
  const mesh = useRef()

  const { positions, colors, sizes, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const speeds = new Float32Array(count)
    const offsets = new Float32Array(count)

    const palette = [
      new THREE.Color('#6633cc'),
      new THREE.Color('#4400aa'),
      new THREE.Color('#2200ff'),
      new THREE.Color('#ff6600'),
      new THREE.Color('#331166'),
      new THREE.Color('#ffffff'),
    ]

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 15 + Math.random() * 50
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      sizes[i] = 0.03 + Math.random() * 0.08
      speeds[i] = 0.1 + Math.random() * 0.4
      offsets[i] = Math.random() * Math.PI * 2
    }

    return { positions, colors, sizes, speeds, offsets }
  }, [count])

  const positionAttr = useRef(new THREE.BufferAttribute(positions.slice(), 3))

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    const pos = positionAttr.current.array

    for (let i = 0; i < count; i++) {
      pos[i * 3] += Math.sin(t * 0.15 + offsets[i]) * 0.004
      pos[i * 3 + 1] += Math.cos(t * 0.1 + offsets[i] * 1.3) * 0.003
      pos[i * 3 + 2] += Math.sin(t * 0.12 + offsets[i] * 0.7) * 0.004
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
        size={0.05}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  )
}
