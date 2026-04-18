import { Suspense } from 'react'
import { Stars } from '@react-three/drei'
import Floor from './Floor.jsx'
import Ceiling from './Ceiling.jsx'
import SphereStage from './SphereStage.jsx'
import Walls from './Walls.jsx'
import Particles from './Particles.jsx'
import BoothsCarousel from './BoothsCarousel.jsx'
import NeonText from './NeonText.jsx'

export default function Venue() {
  return (
    <>
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[0, 10, 5]} intensity={0.5} color="#bb88ff" />
      <fog attach="fog" args={['#0A0005', 30, 65]} />

      <Stars radius={80} depth={40} count={400} factor={3} saturation={0} fade speed={0.3} />

      <Suspense fallback={null}>
        <Floor />
        <Ceiling />
        <SphereStage />
        <Walls />
        <Particles count={120} />
        <BoothsCarousel />

        {/* Neon billboard behind sphere */}
        <group position={[0, 11, -9]}>
          {/* Frame backing */}
          <mesh>
            <boxGeometry args={[11.5, 3.2, 0.22]} />
            <meshStandardMaterial color="#08000f" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Top bar */}
          <mesh position={[0, 1.6, 0.14]}>
            <boxGeometry args={[11.5, 0.09, 0.09]} />
            <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={6} />
          </mesh>
          {/* Bottom bar */}
          <mesh position={[0, -1.6, 0.14]}>
            <boxGeometry args={[11.5, 0.09, 0.09]} />
            <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={6} />
          </mesh>
          {/* Left post */}
          <mesh position={[-5.75, 0, 0.14]}>
            <boxGeometry args={[0.09, 3.2, 0.09]} />
            <meshStandardMaterial color="#7B00FF" emissive="#7B00FF" emissiveIntensity={5} />
          </mesh>
          {/* Right post */}
          <mesh position={[5.75, 0, 0.14]}>
            <boxGeometry args={[0.09, 3.2, 0.09]} />
            <meshStandardMaterial color="#7B00FF" emissive="#7B00FF" emissiveIntensity={5} />
          </mesh>
          {/* Artist name */}
          <NeonText color="#FF6B00" fontSize={1.35} position={[0, 0.4, 0.18]}>
            AunySillyMe
          </NeonText>
          {/* Subtitle */}
          <NeonText color="#FFD700" fontSize={0.42} position={[0, -0.75, 0.18]}>
            — MUSIC —
          </NeonText>
          {/* Billboard glow */}
          <pointLight color="#FF6B00" intensity={4} distance={14} position={[0, 0, 2]} />
        </group>
      </Suspense>
    </>
  )
}

