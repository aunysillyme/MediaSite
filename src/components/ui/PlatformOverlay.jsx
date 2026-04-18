import { motion, AnimatePresence } from 'framer-motion'
import { useVenueStore } from '../../store.js'
import { TRACKS, PLATFORMS, SOCIALS } from '../../data/platforms.js'
import TrackCard from './TrackCard.jsx'

const MUSIC_PLATFORMS = PLATFORMS.filter(p => p.type !== 'connect' && !p.isPlaceholder && p.url !== '#')

function LinkCard({ name, color, url, icon, delay = 0 }) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.7rem 1rem',
        borderRadius: '10px',
        background: `${color}12`,
        border: `1px solid ${color}33`,
        color: '#fff',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: 600,
        transition: 'background 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}28`; e.currentTarget.style.borderColor = `${color}88` }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}12`; e.currentTarget.style.borderColor = `${color}33` }}
    >
      <span style={{ fontSize: '1.1rem', color }}>{icon}</span>
      <span>{name}</span>
      <span style={{ marginLeft: 'auto', color: '#555', fontSize: '0.75rem' }}>↗</span>
    </motion.a>
  )
}

export default function PlatformOverlay() {
  const overlayOpen = useVenueStore((s) => s.overlayOpen)
  const activePlatform = useVenueStore((s) => s.activePlatform)
  const closeOverlay = useVenueStore((s) => s.closeOverlay)

  if (!activePlatform) return null

  const { name, color, url, embedType, albums, icon, description, isPlaceholder, type } = activePlatform
  const isSpotifyAlbums = embedType === 'spotify-albums' && albums?.length > 0
  const isConnect = type === 'connect'

  return (
    <AnimatePresence>
      {overlayOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOverlay}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 100,
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(420px, 100vw)',
              background: 'linear-gradient(180deg, #0D0015 0%, #0A0005 100%)',
              borderLeft: `1px solid ${color}33`,
              zIndex: 101,
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'system-ui, sans-serif',
              overflowY: 'auto',
              boxShadow: `-20px 0 60px ${color}22`,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.5rem',
                borderBottom: `1px solid ${color}22`,
                background: `linear-gradient(180deg, ${color}11 0%, transparent 100%)`,
                flexShrink: 0,
              }}
            >
              <button
                onClick={closeOverlay}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  letterSpacing: '0.15em',
                  padding: '0 0 1rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                ← BACK TO VENUE
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: `${color}22`,
                    border: `2px solid ${color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    boxShadow: `0 0 20px ${color}66`,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: '#fff',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: color, marginTop: '2px' }}>
                    {description}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Connect: all links & socials */}
              {isConnect && (
                <>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.25em', color: '#555', textTransform: 'uppercase', paddingBottom: '0.25rem', borderBottom: '1px solid #ffffff0a' }}>
                    Music Platforms
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {MUSIC_PLATFORMS.map((p, i) => (
                      <LinkCard key={p.id} name={p.name} color={p.color} url={p.url} icon={p.icon} delay={i * 0.04} />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.25em', color: '#555', textTransform: 'uppercase', paddingBottom: '0.25rem', borderBottom: '1px solid #ffffff0a', marginTop: '0.5rem' }}>
                    Socials
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {SOCIALS.map((s, i) => (
                      <LinkCard key={s.name} name={s.name} color={s.color} url={s.url} icon={s.icon} delay={MUSIC_PLATFORMS.length * 0.04 + i * 0.04} />
                    ))}
                  </div>
                </>
              )}

              {/* Spotify album embeds */}
              {!isConnect && isSpotifyAlbums && (
                <>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.25em',
                      color: '#555',
                      textTransform: 'uppercase',
                      paddingBottom: '0.25rem',
                      borderBottom: `1px solid #ffffff0a`,
                    }}
                  >
                    Albums
                  </div>
                  {albums.map((albumId, i) => (
                    <motion.div
                      key={albumId}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{ borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}
                    >
                      <iframe
                        src={`https://open.spotify.com/embed/album/${albumId}?utm_source=generator&theme=0`}
                        width="100%"
                        height="352"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        style={{ display: 'block' }}
                      />
                    </motion.div>
                  ))}
                </>
              )}

              {/* Placeholder notice */}
              {!isConnect && isPlaceholder && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    background: `${color}11`,
                    border: `1px dashed ${color}44`,
                    color: color,
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    letterSpacing: '0.05em',
                  }}
                >
                  🎵 Music coming soon to {name}
                </motion.div>
              )}

              {/* Track list for non-Spotify platforms */}
              {!isConnect && !isSpotifyAlbums && !isPlaceholder && (
                <>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.25em',
                      color: '#555',
                      textTransform: 'uppercase',
                      paddingBottom: '0.25rem',
                      borderBottom: `1px solid #ffffff0a`,
                    }}
                  >
                    Tracks
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {TRACKS.map((track, i) => (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <TrackCard
                          track={track}
                          platformColor={color}
                          platformUrl={url}
                          platformId={activePlatform.id}
                        />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* CTA footer — hidden for Connect booth */}
            {!isConnect && (
              <div style={{ padding: '1.25rem', borderTop: `1px solid ${color}22`, flexShrink: 0 }}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '10px',
                    background: color,
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    letterSpacing: '0.05em',
                    textDecoration: 'none',
                    boxShadow: `0 0 25px ${color}66`,
                    transition: 'box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 45px ${color}99`)}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 0 25px ${color}66`)}
                >
                  Open in {name} →
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
