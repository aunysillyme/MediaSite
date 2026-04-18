import { Suspense } from 'react'
import { Stars } from '@react-three/drei'
import Floor from './Floor.jsx'
import Ceiling from './Ceiling.jsx'
import Stage from './Stage.jsx'
import Walls from './Walls.jsx'
import Particles from './Particles.jsx'
import PlatformBooth from './PlatformBooth.jsx'
import PostProcessing from '../effects/PostProcessing.jsx'
import CameraController from '../camera/CameraController.jsx'
import { PLATFORMS } from '../../data/platforms.js'

export default function Venue() {
  return (
    <>
      <CameraController />

      {/* Scene lighting */}
      <ambientLight intensity={0.35} color="#2a0050" />
      <fog attach="fog" args={['#0A0005', 28, 60]} />

      {/* Stars visible through ceiling gaps */}
      <Stars radius={80} depth={50} count={1000} factor={3} saturation={0} fade speed={0.5} />

      {/* Main venue elements */}
      <Suspense fallback={null}>
        <Floor />
        <Ceiling />
        <Stage />
        <Walls />
        <Particles count={250} />

        {/* All platform booths */}
        {PLATFORMS.map((platform) => (
          <PlatformBooth key={platform.id} platform={platform} />
        ))}


      </Suspense>

      {/* Post-processing — skip in preview mode for headless rendering */}
      {!new URLSearchParams(window.location.search).has('skip') && <PostProcessing />}
    </>
  )
}
