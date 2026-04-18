import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import LoadingScreen from './components/ui/LoadingScreen.jsx'
import PlatformOverlay from './components/ui/PlatformOverlay.jsx'
import CameraController from './components/camera/CameraController.jsx'
import Venue from './components/venue/Venue.jsx'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [dpr, setDpr] = useState(1.5)

  return (
    <div style={{ width: '100%', height: '100%', background: '#0A0005' }}>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <Canvas
        dpr={dpr}
        camera={{ position: [0, 5, 16], fov: 70, near: 0.1, far: 200 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        style={{ position: 'absolute', inset: 0 }}
        shadows={false}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
        <CameraController />
        <Venue />
      </Canvas>

      <PlatformOverlay />

      {loaded && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          color: '#555',
          fontFamily: 'system-ui, sans-serif',
          pointerEvents: 'none',
          textTransform: 'uppercase',
          animation: 'fadeInHint 2s ease 1s both',
        }}>
          Scroll to spin · Click to explore
        </div>
      )}

      <style>{`
        @keyframes fadeInHint {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
