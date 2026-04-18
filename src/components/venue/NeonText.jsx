import { Text } from '@react-three/drei'

export default function NeonText({
  children,
  color = '#FF6B00',
  fontSize = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  anchorX = 'center',
  anchorY = 'middle',
  maxWidth,
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Glow layer — slightly larger, same color, high emissive */}
      <Text
        fontSize={fontSize * 1.02}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        maxWidth={maxWidth}
        renderOrder={1}
      >
        {children}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={8}
          toneMapped={false}
          transparent
          opacity={0.3}
        />
      </Text>
      {/* Sharp layer */}
      <Text
        fontSize={fontSize}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        maxWidth={maxWidth}
        renderOrder={2}
      >
        {children}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={6}
          toneMapped={false}
        />
      </Text>
    </group>
  )
}
