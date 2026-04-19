export default function Ceiling() {
  const lights = [
    { pos: [-8, 11, -4], color: '#FF6B00' },
    { pos: [8, 11, -4], color: '#7B00FF' },
    { pos: [0, 11, 2], color: '#FFD700' },
    { pos: [-8, 11, 8], color: '#7B00FF' },
    { pos: [8, 11, 8], color: '#FF6B00' },
  ]

  return (
    <group>
      {/* Ceiling plane */}
      <mesh position={[0, 12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#050005" roughness={1} />
      </mesh>

      {/* Truss bars */}
      {[-8, -4, 0, 4, 8].map((z) => (
        <mesh key={z} position={[0, 11.9, z]}>
          <boxGeometry args={[20, 0.1, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Colored truss light cones (visual only) */}
      {lights.map(({ pos, color }) => (
        <group key={pos.join()} position={pos}>
          <mesh position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.15, 0.4, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} />
          </mesh>
          <pointLight color={color} intensity={3} distance={18} decay={2} />
        </group>
      ))}

      {/* Overhead fill */}
      <pointLight position={[0, 11, 0]} color="#3A0060" intensity={2} distance={36} />
    </group>
  )
}
