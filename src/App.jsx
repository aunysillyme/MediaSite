import { useState, Suspense, lazy, Component } from 'react'
import LoadingScreen from './components/ui/LoadingScreen.jsx'
import PlatformOverlay from './components/ui/PlatformOverlay.jsx'

const VenueCanvas = lazy(() => import('./VenueCanvas.jsx'))

class CanvasErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) {
      return (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1rem',
          fontFamily: 'system-ui, sans-serif', color: '#888', textAlign: 'center', padding: '2rem',
        }}>
          <div style={{ fontSize: '1.1rem', color: '#FF6B00' }}>AunySillyMe — The Venue</div>
          <div style={{ fontSize: '0.85rem', maxWidth: 320 }}>
            Your browser couldn't start the 3D venue. Try Chrome or Edge for the best experience.
          </div>
          <a href="https://open.spotify.com/artist/2HSQl7HB2BksGuCU8f39hI"
            style={{ color: '#1DB954', fontSize: '0.85rem' }}>
            → Open on Spotify instead
          </a>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div style={{ width: '100%', height: '100%', background: '#0A0005' }}>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <CanvasErrorBoundary>
        <Suspense fallback={null}>
          <VenueCanvas />
        </Suspense>
      </CanvasErrorBoundary>

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
