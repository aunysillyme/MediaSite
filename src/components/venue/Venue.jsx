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

        {/* Freestanding billboard — left corner, angled toward camera */}
        <group position={[-11, 0, -13]} rotation={[0, -0.32, 0]}>
          {/* Left support post */}
          <mesh position={[-2.8, 3.5, 0]}>
            <boxGeometry args={[0.22, 7, 0.22]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Right support post */}
          <mesh position={[2.8, 3.5, 0]}>
            <boxGeometry args={[0.22, 7, 0.22]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Billboard face */}
          <group position={[0, 6.2, 0]}>
            <mesh>
              <boxGeometry args={[7.2, 2.6, 0.18]} />
              <meshStandardMaterial color="#08000f" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0, 1.3, 0.12]}>
              <boxGeometry args={[7.2, 0.08, 0.08]} />
              <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={7} />
            </mesh>
            <mesh position={[0, -1.3, 0.12]}>
              <boxGeometry args={[7.2, 0.08, 0.08]} />
              <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={7} />
            </mesh>
            <mesh position={[-3.6, 0, 0.12]}>
              <boxGeometry args={[0.08, 2.6, 0.08]} />
              <meshStandardMaterial color="#7B00FF" emissive="#7B00FF" emissiveIntensity={6} />
            </mesh>
            <mesh position={[3.6, 0, 0.12]}>
              <boxGeometry args={[0.08, 2.6, 0.08]} />
              <meshStandardMaterial color="#7B00FF" emissive="#7B00FF" emissiveIntensity={6} />
            </mesh>
            <NeonText color="#FF6B00" fontSize={0.95} position={[0, 0.28, 0.14]}>
              AunySillyMe
            </NeonText>
            <NeonText color="#FFD700" fontSize={0.3} position={[0, -0.6, 0.14]}>
              — MUSIC —
            </NeonText>
            <pointLight color="#FF6B00" intensity={3} distance={10} position={[0, 0, 2]} />
          </group>
        </group>
      </Suspense>
    </>
  )
}

