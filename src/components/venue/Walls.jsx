export default function Walls() {
  return (
    <group>
      {/* Left wall */}
      <mesh position={[-16, 4, -2]}>
        <boxGeometry args={[0.3, 8, 36]} />
        <meshStandardMaterial color="#060008" roughness={0.9} />
      </mesh>
      {/* Right wall */}
      <mesh position={[16, 4, -2]}>
        <boxGeometry args={[0.3, 8, 36]} />
        <meshStandardMaterial color="#060008" roughness={0.9} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 4, -18]}>
        <boxGeometry args={[32, 8, 0.3]} />
        <meshStandardMaterial color="#060008" roughness={0.9} />
      </mesh>
      {/* Entrance wall */}
      <mesh position={[0, 4, 18]}>
        <boxGeometry args={[32, 8, 0.3]} />
        <meshStandardMaterial color="#060008" roughness={0.9} />
      </mesh>

      {/* Left wall neon strip */}
      <mesh position={[-15.8, 1, -2]}>
        <boxGeometry args={[0.03, 0.03, 36]} />
        <meshStandardMaterial color="#7B00FF" emissive="#7B00FF" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      {/* Right wall neon strip */}
      <mesh position={[15.8, 1, -2]}>
        <boxGeometry args={[0.03, 0.03, 36]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      {/* Floor-level neon strips */}
      <mesh position={[-15.8, 0.05, -2]}>
        <boxGeometry args={[0.05, 0.05, 36]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[15.8, 0.05, -2]}>
        <boxGeometry args={[0.05, 0.05, 36]} />
        <meshStandardMaterial color="#7B00FF" emissive="#7B00FF" emissiveIntensity={3} toneMapped={false} />
      </mesh>
    </group>
  )
}
