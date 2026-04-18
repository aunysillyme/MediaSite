import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useState } from 'react'
import CameraController from './components/camera/CameraController.jsx'
import Venue from './components/venue/Venue.jsx'

export default function VenueCanvas() {
  const [dpr, setDpr] = useState(1)
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 5, 16], fov: 70, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      style={{ position: 'absolute', inset: 0 }}
      shadows={false}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(0.75)}
        onIncline={() => setDpr(Math.min(window.devicePixelRatio, 1.5))}
      />
      <CameraController />
      <Venue />
    </Canvas>
  )
}
