import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import NeonText from './NeonText.jsx'

export default function NeonBillboard() {
  const topRef  = useRef()
  const botRef  = useRef()
  const leftRef = useRef()
  const rightRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Multi-frequency buzz + occasional random dropout
    const buzz = 5.5
      + Math.sin(t * 53.1) * 1.4
      + Math.sin(t * 17.7) * 0.9
      + Math.sin(t * 3.3)  * 0.4
      + (Math.random() < 0.018 ? -4 : 0)
    const ei = Math.max(0.4, buzz)

    if (topRef.current)   topRef.current.emissiveIntensity   = ei
    if (botRef.current)   botRef.current.emissiveIntensity   = ei * 0.88
    if (leftRef.current)  leftRef.current.emissiveIntensity  = ei * 0.76
    if (rightRef.current) rightRef.current.emissiveIntensity = ei * 1.1
  })

  return (
    <group position={[-11, 0, -13]} rotation={[0, -0.3, 0]}>

      {/* Left pole */}
      <mesh position={[-2.4, 4.2, 0]}>
        <boxGeometry args={[0.26, 8.4, 0.26]} />
        <meshStandardMaterial color="#111111" metalness={0.95} roughness={0.08} />
      </mesh>

      {/* Right pole */}
      <mesh position={[2.4, 4.2, 0]}>
        <boxGeometry args={[0.26, 8.4, 0.26]} />
        <meshStandardMaterial color="#111111" metalness={0.95} roughness={0.08} />
      </mesh>

      {/* Mid cross-brace */}
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[4.8, 0.18, 0.18]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Diagonal brace left (structural detail) */}
      <mesh position={[-1.8, 5.4, -0.1]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[0.12, 2.8, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Diagonal brace right */}
      <mesh position={[1.8, 5.4, -0.1]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.12, 2.8, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Sign face */}
      <group position={[0, 7, 0]}>

        {/* Dark backing panel */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[7.6, 2.9, 0.12]} />
          <meshStandardMaterial color="#060010" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Neon top tube */}
        <mesh position={[0, 1.45, 0.1]}>
          <boxGeometry args={[7.6, 0.1, 0.1]} />
          <meshStandardMaterial ref={topRef} color="#FF6B00" emissive="#FF6B00" emissiveIntensity={5.5} />
        </mesh>

        {/* Neon bottom tube */}
        <mesh position={[0, -1.45, 0.1]}>
          <boxGeometry args={[7.6, 0.1, 0.1]} />
          <meshStandardMaterial ref={botRef} color="#FF6B00" emissive="#FF6B00" emissiveIntensity={5.5} />
        </mesh>

        {/* Neon left tube */}
        <mesh position={[-3.8, 0, 0.1]}>
          <boxGeometry args={[0.1, 2.9, 0.1]} />
          <meshStandardMaterial ref={leftRef} color="#7B00FF" emissive="#7B00FF" emissiveIntensity={5.5} />
        </mesh>

        {/* Neon right tube */}
        <mesh position={[3.8, 0, 0.1]}>
          <boxGeometry args={[0.1, 2.9, 0.1]} />
          <meshStandardMaterial ref={rightRef} color="#7B00FF" emissive="#7B00FF" emissiveIntensity={5.5} />
        </mesh>

        <NeonText color="#FF6B00" fontSize={0.95} position={[0, 0.3, 0.16]}>
          AunySillyMe
        </NeonText>
        <NeonText color="#FFD700" fontSize={0.3} position={[0, -0.62, 0.16]}>
          — MUSIC —
        </NeonText>

        <pointLight color="#FF6B00" intensity={3} distance={12} position={[0, 0, 2]} />
      </group>
    </group>
  )
}
