import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const TRUSS_POSITIONS = [
  [-8, 0], [-4, 0], [0, 0], [4, 0], [8, 0],
]

function TrussLight({ x, z, color, pulseOffset = 0 }) {
  const lightRef = useRef()
  useFrame(({ clock }) => {
    if (!lightRef.current) return
    const t = clock.getElapsedTime()
    lightRef.current.intensity = 0.8 + Math.sin(t * 1.5 + pulseOffset) * 0.4
  })
  return (
    <group position={[x, 7.8, z]}>
      {/* Truss bar segment */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 6]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Light cone */}
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <spotLight
        ref={lightRef}
        position={[0, -0.5, 0]}
        target-position={[0, 0, 0]}
        color={color}
        intensity={1.2}
        angle={0.3}
        penumbra={0.5}
        distance={20}
        castShadow={false}
      />
      <pointLight color={color} intensity={0.3} distance={3} />
    </group>
  )
}

export default function Ceiling() {
  const colors = ['#FF6B00', '#7B00FF', '#FF6B00', '#7B00FF', '#FFD700']

  return (
    <group>
      {/* Ceiling plane */}
      <mesh position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#050005" roughness={1} />
      </mesh>

      {/* Truss bars */}
      {[-8, -4, 0, 4, 8].map((z, i) => (
        <mesh key={z} position={[0, 7.9, z]}>
          <boxGeometry args={[20, 0.1, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Truss lights */}
      {[-8, -4, 0, 4, 8].map((z, zi) =>
        [-8, -4, 0, 4, 8].map((x, xi) => (
          <TrussLight
            key={`${x}-${z}`}
            x={x}
            z={z}
            color={colors[(zi + xi) % colors.length]}
            pulseOffset={(zi * 5 + xi) * 0.4}
          />
        ))
      )}

      {/* Main ambient from above */}
      <pointLight position={[0, 7, 0]} color="#3A0060" intensity={2} distance={30} />
    </group>
  )
}
