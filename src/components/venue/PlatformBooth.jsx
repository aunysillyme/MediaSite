import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
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
  const archMatRef = useRef()
  const borderMatRef = useRef()
  const glowMatRef = useRef()
  const iconMatRef = useRef()
  const auroraC = useRef(new THREE.Color())

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    const pulse = 1 + Math.sin(t * 2 + orbitRotationY) * 0.015
    const targetScale = hovered ? 1.08 : isActive ? 1.05 : pulse
    groupRef.current.scale.setScalar(
      groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * 0.1
    )

    const h = 0.5 + Math.sin(t * 0.25 + orbitRotationY) * 0.15 + Math.cos(t * 0.17 + orbitRotationY * 0.7) * 0.08
    auroraC.current.setHSL(h, 0.95, 0.65)

    if (archMatRef.current) {
      archMatRef.current.color.copy(auroraC.current)
      archMatRef.current.emissive.copy(auroraC.current)
      archMatRef.current.emissiveIntensity = hovered ? 7 : 4
    }
    if (borderMatRef.current) {
      borderMatRef.current.color.copy(auroraC.current)
      borderMatRef.current.emissive.copy(auroraC.current)
    }
    if (glowMatRef.current) {
      glowMatRef.current.color.copy(auroraC.current)
      glowMatRef.current.emissive.copy(auroraC.current)
    }
    if (iconMatRef.current) {
      iconMatRef.current.color.copy(auroraC.current)
      iconMatRef.current.emissive.copy(auroraC.current)
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

      {/* Top arch — aurora animated */}
      <mesh position={[0, 3.5, -1]}>
        <boxGeometry args={[3.4, 0.15, 0.15]} />
        <meshStandardMaterial ref={archMatRef} color={color} emissive={color} emissiveIntensity={4} />
      </mesh>

      {/* Neon border strip — aurora animated */}
      <mesh position={[0, 1.8, -0.94]}>
        <boxGeometry args={[3.0, 0.04, 0.04]} />
        <meshStandardMaterial ref={borderMatRef} color={color} emissive={color} emissiveIntensity={3} />
      </mesh>

      {/* Platform name — aurora animated */}
      <NeonText aurora phase={orbitRotationY} color={color} fontSize={0.45} position={[0, 2.9, -0.9]}>
        {name.toUpperCase()}
      </NeonText>

      {/* Icon — aurora animated */}
      <Text font="/font.ttf" fontSize={0.6} position={[0, 2.15, -0.9]} anchorX="center" anchorY="middle">
        {icon}
        <meshStandardMaterial ref={iconMatRef} color={color} emissive={color} emissiveIntensity={2} />
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

      {/* Ground glow — aurora animated */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[2.2, 24]} />
        <meshStandardMaterial ref={glowMatRef} color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.12} />
      </mesh>
    </group>
  )
}
