import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export default function NeonText({
  children,
  color = '#FF6B00',
  fontSize = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  anchorX = 'center',
  anchorY = 'middle',
  maxWidth,
  aurora = false,
  phase = 0,
}) {
  const glowMatRef = useRef()
  const sharpMatRef = useRef()
  const c = useRef(new THREE.Color(color))

  useFrame(({ clock }) => {
    if (!aurora || !glowMatRef.current || !sharpMatRef.current) return
    const t = clock.getElapsedTime()
    const h = 0.5 + Math.sin(t * 0.25 + phase) * 0.15 + Math.cos(t * 0.17 + phase * 0.7) * 0.08
    c.current.setHSL(h, 0.95, 0.65)
    glowMatRef.current.color.copy(c.current)
    glowMatRef.current.emissive.copy(c.current)
    sharpMatRef.current.color.copy(c.current)
    sharpMatRef.current.emissive.copy(c.current)
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Glow layer — pushed slightly back to prevent z-fighting */}
      <Text
        font="/font.ttf"
        fontSize={fontSize * 1.02}
        anchorX={anchorX}
        anchorY={anchorY}
        maxWidth={maxWidth}
        renderOrder={1}
        position={[0, 0, -0.003]}
      >
        {children}
        <meshStandardMaterial
          ref={glowMatRef}
          color={color}
          emissive={color}
          emissiveIntensity={8}
          toneMapped={false}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </Text>
      {/* Sharp layer — in front */}
      <Text
        font="/font.ttf"
        fontSize={fontSize}
        anchorX={anchorX}
        anchorY={anchorY}
        maxWidth={maxWidth}
        renderOrder={2}
        position={[0, 0, 0.003]}
      >
        {children}
        <meshStandardMaterial
          ref={sharpMatRef}
          color={color}
          emissive={color}
          emissiveIntensity={6}
          toneMapped={false}
          depthWrite={false}
        />
      </Text>
    </group>
  )
}
