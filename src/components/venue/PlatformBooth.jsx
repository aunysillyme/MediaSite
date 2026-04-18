import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import { useVenueStore } from '../../store.js'
import NeonText from './NeonText.jsx'

export default function PlatformBooth({ platform }) {
  const { id, name, color, position, icon, isPlaceholder } = platform
  const [hovered, setHovered] = useState(false)
  const setActivePlatform = useVenueStore((s) => s.setActivePlatform)
  const activePlatform = useVenueStore((s) => s.activePlatform)
  const isActive = activePlatform?.id === id

  const groupRef = useRef()
  const glowRef = useRef()

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    // Idle pulse
    const pulse = 1 + Math.sin(t * 2 + position[0]) * 0.015
    const targetScale = hovered ? 1.08 : isActive ? 1.05 : pulse
    groupRef.current.scale.setScalar(
      groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * 0.1
    )

    // Glow intensity
    if (glowRef.current) {
      glowRef.current.emissiveIntensity = hovered ? 6 : isActive ? 5 : 2.5 + Math.sin(t * 1.5) * 0.5
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    setActivePlatform(platform)
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default' }}
      onClick={handleClick}
    >
      {/* Booth base platform */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.3, 2.2]} />
        <meshStandardMaterial color="#0D0010" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Booth back panel */}
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

      {/* Top arch */}
      <mesh position={[0, 3.5, -1]}>
        <boxGeometry args={[3.4, 0.15, 0.15]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} toneMapped={false} />
      </mesh>

      {/* Neon border lines on back panel */}
      <mesh ref={glowRef} position={[0, 1.8, -0.94]}>
        <boxGeometry args={[3.0, 0.04, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.35, -0.94]}>
        <boxGeometry args={[3.0, 0.04, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[-1.48, 1.075, -0.94]}>
        <boxGeometry args={[0.04, 1.45, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[1.48, 1.075, -0.94]}>
        <boxGeometry args={[0.04, 1.45, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </mesh>

      {/* Platform name neon sign */}
      <Float speed={2} rotationIntensity={0.02} floatIntensity={0.15}>
        <NeonText color={color} fontSize={0.45} position={[0, 2.9, -0.9]}>
          {name.toUpperCase()}
        </NeonText>
      </Float>

      {/* Icon */}
      <Text
        fontSize={0.6}
        position={[0, 2.15, -0.9]}
        anchorX="center"
        anchorY="middle"
      >
        {icon}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
      </Text>

      {/* "Click to Enter" label */}
      <Text
        fontSize={0.2}
        position={[0, 0.7, -0.9]}
        anchorX="center"
        anchorY="middle"
        color={hovered ? '#FFFFFF' : '#888888'}
      >
        {isPlaceholder ? 'COMING SOON' : 'CLICK TO ENTER'}
        <meshStandardMaterial
          color={hovered ? color : '#666666'}
          emissive={hovered ? color : '#333333'}
          emissiveIntensity={hovered ? 2 : 0.5}
          toneMapped={false}
        />
      </Text>

      {/* Ground glow halo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[2.2, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.5 : 0.6}
          toneMapped={false}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Point light for this booth */}
      <pointLight color={color} intensity={hovered ? 4 : 1.5} distance={6} position={[0, 2, 0]} />
    </group>
  )
}
