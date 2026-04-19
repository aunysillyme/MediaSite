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

        {/* Neon billboard on back wall */}
        <group position={[0, 6.2, -17.6]}>
          {/* Frame backing */}
          <mesh>
            <boxGeometry args={[22, 4.5, 0.18]} />
            <meshStandardMaterial color="#08000f" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Top bar */}
          <mesh position={[0, 2.25, 0.12]}>
            <boxGeometry args={[22, 0.1, 0.1]} />
            <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={6} />
          </mesh>
          {/* Bottom bar */}
          <mesh position={[0, -2.25, 0.12]}>
            <boxGeometry args={[22, 0.1, 0.1]} />
            <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={6} />
          </mesh>
          {/* Left post */}
          <mesh position={[-11, 0, 0.12]}>
            <boxGeometry args={[0.1, 4.5, 0.1]} />
            <meshStandardMaterial color="#7B00FF" emissive="#7B00FF" emissiveIntensity={5} />
          </mesh>
          {/* Right post */}
          <mesh position={[11, 0, 0.12]}>
            <boxGeometry args={[0.1, 4.5, 0.1]} />
            <meshStandardMaterial color="#7B00FF" emissive="#7B00FF" emissiveIntensity={5} />
          </mesh>
          <NeonText color="#FF6B00" fontSize={2.1} position={[0, 0.6, 0.16]}>
            AunySillyMe
          </NeonText>
          <NeonText color="#FFD700" fontSize={0.6} position={[0, -0.95, 0.16]}>
            — MUSIC —
          </NeonText>
          <pointLight color="#FF6B00" intensity={5} distance={18} position={[0, 0, 2]} />
        </group>
      </Suspense>
    </>
  )
}

