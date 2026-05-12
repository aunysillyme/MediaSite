import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useVenueStore } from '../../store.js'

export default function PlatformBooth({ platform, orbitPosition, orbitRotationY = 0 }) {
  const { id, name, color, icon, isPlaceholder } = platform
  const position = orbitPosition

  const [hovered, setHovered] = useState(false)
  const setActivePlatform = useVenueStore((s) => s.setActivePlatform)
  const activePlatform = useVenueStore((s) => s.activePlatform)
  const isActive = activePlatform?.id === id

  const groupRef = useRef()
  const edgeMatRef = useRef()
  const faceMatRef = useRef()

  const W = 2.4
  const H = 4.2
  const D = 0.18

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    const floatY = Math.sin(t * 0.8 + orbitRotationY) * 0.12
    groupRef.current.position.y = position[1] + floatY

    const pulse = 1 + Math.sin(t * 1.5 + orbitRotationY) * 0.01
    const targetScale = hovered ? 1.06 : isActive ? 1.04 : pulse
    groupRef.current.scale.setScalar(
      groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * 0.08
    )

    if (edgeMatRef.current) {
      edgeMatRef.current.emissiveIntensity = hovered ? 6 : 2 + Math.sin(t * 2 + orbitRotationY) * 0.5
    }
    if (faceMatRef.current) {
      faceMatRef.current.emissiveIntensity = hovered ? 0.15 : 0.04 + Math.sin(t * 1.2 + orbitRotationY) * 0.02
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, orbitRotationY, 0]}
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default' }}
      onClick={(e) => { e.stopPropagation(); setActivePlatform(platform) }}
    >
      {/* ── Main slab body ── */}
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial
          ref={faceMatRef}
          color="#040010"
          emissive={color}
          emissiveIntensity={0.04}
          roughness={0.15}
          metalness={0.95}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* ── Edge glow - left ── */}
      <mesh position={[-W / 2, H / 2, 0]}>
        <boxGeometry args={[0.02, H + 0.02, D + 0.04]} />
        <meshStandardMaterial
          ref={edgeMatRef}
          color={color}
          emissive={color}
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      {/* ── Edge glow - right ── */}
      <mesh position={[W / 2, H / 2, 0]}>
        <boxGeometry args={[0.02, H + 0.02, D + 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      {/* ── Edge glow - top ── */}
      <mesh position={[0, H, 0]}>
        <boxGeometry args={[W + 0.04, 0.02, D + 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      {/* ── Edge glow - bottom ── */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[W + 0.04, 0.02, D + 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </mesh>

      {/* ── Accent line across face ── */}
      <mesh position={[0, H * 0.62, D / 2 + 0.005]}>
        <boxGeometry args={[W - 0.3, 0.008, 0.008]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.6} toneMapped={false} />
      </mesh>

      {/* ── Icon ── */}
      <Text
        font="/font.ttf"
        fontSize={0.75}
        position={[0, H * 0.42, D / 2 + 0.02]}
        anchorX="center"
        anchorY="middle"
      >
        {icon}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 6 : 3.5}
          toneMapped={false}
        />
      </Text>

      {/* ── Platform name ── */}
      <Text
        font="/font.ttf"
        fontSize={0.32}
        position={[0, H * 0.75, D / 2 + 0.02]}
        anchorX="center"
        anchorY="middle"
        maxWidth={W - 0.4}
        textAlign="center"
        lineHeight={1.2}
      >
        {name.toUpperCase()}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 4 : 2}
          toneMapped={false}
        />
      </Text>

      {/* ── Subtitle ── */}
      <Text
        font="/font.ttf"
        fontSize={0.14}
        position={[0, H * 0.22, D / 2 + 0.02]}
        anchorX="center"
        anchorY="middle"
        maxWidth={W - 0.4}
        textAlign="center"
      >
        {isPlaceholder ? 'COMING SOON' : 'CLICK TO ENTER'}
        <meshStandardMaterial
          color={hovered ? color : '#555555'}
          emissive={hovered ? color : '#333333'}
          emissiveIntensity={hovered ? 2.5 : 0.4}
          transparent
          opacity={hovered ? 1 : 0.5}
        />
      </Text>

      {/* ── Light cast ── */}
      <pointLight
        color={color}
        intensity={hovered ? 5 : 2}
        distance={10}
        position={[0, H / 2, 1.5]}
      />
    </group>
  )
}
