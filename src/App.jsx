import { useState, Suspense, lazy, Component } from 'react'
import LoadingScreen from './components/ui/LoadingScreen.jsx'
import PlatformOverlay from './components/ui/PlatformOverlay.jsx'
import { useVenueStore } from './store.js'

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
  const overlayOpen = useVenueStore((s) => s.overlayOpen)

  return (
    <div style={{ width: '100%', height: '100%', background: '#0A0005' }}>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <CanvasErrorBoundary>
        <Suspense fallback={null}>
          <VenueCanvas />
        </Suspense>
      </CanvasErrorBoundary>

      {/* Venue title — fades out when overlay is open */}
      {loaded && (
        <div style={{
          position: 'fixed',
          top: '36%',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: overlayOpen ? 0 : 1,
          transition: 'opacity 0.4s ease',
          fontFamily: '"Arial Black", "Impact", Arial, sans-serif',
          fontSize: 'clamp(1.2rem, 3vw, 2.4rem)',
          fontWeight: 900,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          background: 'linear-gradient(90deg, #FF6B00 0%, #FFD700 30%, #ffffff 50%, #FFD700 70%, #FF6B00 100%)',
          backgroundSize: '250% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 14px rgba(255,107,0,0.9))',
          animation: 'titleShimmer 4s linear infinite',
        }}>
          AunySillyMe Music
        </div>
      )}

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
        @keyframes titleShimmer {
          0%   { background-position: 0%   center; }
          100% { background-position: 250% center; }
        }
        @keyframes fadeInHint {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
