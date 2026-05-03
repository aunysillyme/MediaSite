import { useState, Suspense, lazy, Component } from 'react'
import LoadingScreen from './components/ui/LoadingScreen.jsx'
import PlatformOverlay from './components/ui/PlatformOverlay.jsx'
import LinksPage from './components/ui/LinksPage.jsx'

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

  if (window.location.pathname === '/links') return <LinksPage />

  return (
    <div style={{ width: '100%', height: '100%', background: '#0A0005' }}>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <CanvasErrorBoundary>
        <Suspense fallback={null}>
          <VenueCanvas />
        </Suspense>
      </CanvasErrorBoundary>

      <PlatformOverlay />

      {/* Connect button */}
      {loaded && (
        <a
          href="/links"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            top: '1.25rem',
            right: '1.5rem',
            zIndex: 200,
            padding: '0.45rem 1rem',
            borderRadius: '8px',
            background: 'rgba(4, 0, 14, 0.82)',
            border: '1px solid #FF6B0055',
            color: '#FF6B00',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textDecoration: 'none',
            backdropFilter: 'blur(10px)',
            fontFamily: 'system-ui, sans-serif',
            textTransform: 'uppercase',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#FF6B00'
            e.currentTarget.style.boxShadow = '0 0 14px #FF6B0044'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#FF6B0055'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Connect ↗
        </a>
      )}

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
