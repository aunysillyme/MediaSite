import { Suspense, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import SphereStage from './SphereStage.jsx'
import Particles from './Particles.jsx'
import BoothsCarousel from './BoothsCarousel.jsx'
import NeonBillboard from './NeonBillboard.jsx'

function NebulaCloud({ position, color, scale = 1, opacity = 0.06 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.02
    }
  })
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function GalaxyRing({ radius = 40, y = -2, color = '#1a0033', opacity = 0.08 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.01
  })
  return (
    <mesh ref={ref} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 0.6, radius, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function Venue() {
  return (
    <>
      <ambientLight intensity={0.15} color="#8866cc" />
      <directionalLight position={[0, 10, 5]} intensity={0.3} color="#6644aa" />
      <fog attach="fog" args={['#020008', 50, 120]} />

      <Stars radius={120} depth={80} count={2000} factor={4} saturation={0.1} fade speed={0.2} />
      <Stars radius={60} depth={30} count={600} factor={2} saturation={0.8} fade speed={0.5} />

      <NebulaCloud position={[-30, 15, -40]} color="#4400aa" scale={3} opacity={0.04} />
      <NebulaCloud position={[35, -10, -50]} color="#110033" scale={4} opacity={0.03} />
      <NebulaCloud position={[0, 25, -60]} color="#1a0044" scale={5} opacity={0.035} />
      <NebulaCloud position={[-20, -5, 40]} color="#220055" scale={2.5} opacity={0.03} />
      <NebulaCloud position={[25, 20, 30]} color="#0a0022" scale={3.5} opacity={0.025} />

      <GalaxyRing radius={50} y={-3} color="#1a0044" opacity={0.06} />
      <GalaxyRing radius={35} y={-2} color="#220066" opacity={0.04} />

      <pointLight position={[0, -10, 0]} color="#1a0033" intensity={3} distance={60} />
      <pointLight position={[30, 20, -30]} color="#3300aa" intensity={1.5} distance={50} />
      <pointLight position={[-25, 15, 25]} color="#FF6B00" intensity={0.8} distance={40} />

      <Suspense fallback={null}>
        <SphereStage />
        <Particles count={300} />
        <BoothsCarousel />
        <NeonBillboard />
      </Suspense>
    </>
  )
}
