import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useVenueStore } from '../../store.js'
import NeonText from './NeonText.jsx'

export default function PlatformBooth({ platform, orbitPosition, orbitRotationY = 0 }) {
  const { id, name, color, position: platformPos, icon, isPlaceholder } = platform
  const position = orbitPosition || platformPos

  const [hovered, setHovered] = useState(false)
  const setActivePlatform = useVenueStore((s) => s.setActivePlatform)
  const activePlatform = useVenueStore((s) => s.activePlatform)
  const isActive = activePlatform?.id === id

  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 2 + position[0]) * 0.015
    const targetScale = hovered ? 1.08 : isActive ? 1.05 : pulse
    groupRef.current.scale.setScalar(
      groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * 0.1
    )
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
      {/* Base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[3.2, 0.3, 2.2]} />
        <meshStandardMaterial color="#0D0010" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Back panel */}
      <mesh position={[0, 1.8, -1]}>
        <boxGeometry args={[3.2, 3.3, 0.12]} />
        <meshStandardMaterial color="#0A0008" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Left post */}
      <mesh position={[-1.55, 1.8, -1]}>
        <boxGeometry args={[0.12, 3.3, 0.12]} />
        <meshStandardMaterial color="#0D0010" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Right post */}
      <mesh position={[1.55, 1.8, -1]}>
        <boxGeometry args={[0.12, 3.3, 0.12]} />
        <meshStandardMaterial color="#0D0010" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Top arch — colored neon */}
      <mesh position={[0, 3.5, -1]}>
        <boxGeometry args={[3.4, 0.15, 0.15]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 6 : 4} />
      </mesh>

      {/* Neon border strip */}
      <mesh position={[0, 1.8, -0.94]}>
        <boxGeometry args={[3.0, 0.04, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>

      {/* Platform name */}
      <NeonText color={color} fontSize={0.45} position={[0, 2.9, -0.9]}>
        {name.toUpperCase()}
      </NeonText>

      {/* Icon */}
      <Text font="/font.ttf" fontSize={0.6} position={[0, 2.15, -0.9]} anchorX="center" anchorY="middle">
        {icon}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </Text>

      {/* Label */}
      <Text font="/font.ttf" fontSize={0.2} position={[0, 0.7, -0.9]} anchorX="center" anchorY="middle">
        {isPlaceholder ? 'COMING SOON' : 'CLICK TO ENTER'}
        <meshStandardMaterial
          color={hovered ? color : '#666666'}
          emissive={hovered ? color : '#333333'}
          emissiveIntensity={hovered ? 2 : 0.5}
        />
      </Text>

      {/* Ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[2.2, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.12} />
      </mesh>
    </group>
  )
}
