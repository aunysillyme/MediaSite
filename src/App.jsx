import { useState, Suspense, lazy } from 'react'
import LoadingScreen from './components/ui/LoadingScreen.jsx'
import PlatformOverlay from './components/ui/PlatformOverlay.jsx'

const VenueCanvas = lazy(() => import('./VenueCanvas.jsx'))

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div style={{ width: '100%', height: '100%', background: '#0A0005' }}>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <Suspense fallback={null}>
        <VenueCanvas />
      </Suspense>

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
