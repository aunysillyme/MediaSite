import { Suspense } from 'react'
import { Stars } from '@react-three/drei'
import Floor from './Floor.jsx'
import Ceiling from './Ceiling.jsx'
import SphereStage from './SphereStage.jsx'
import Walls from './Walls.jsx'
import Particles from './Particles.jsx'
import BoothsCarousel from './BoothsCarousel.jsx'
import NeonBillboard from './NeonBillboard.jsx'

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

        <NeonBillboard />
      </Suspense>
    </>
  )
}

