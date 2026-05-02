import { motion, AnimatePresence } from 'framer-motion'
import { useVenueStore } from '../../store.js'
import { TRACKS, PLATFORMS, SOCIALS } from '../../data/platforms.js'
import TrackCard from './TrackCard.jsx'
import BrandIcon from './BrandIcon.jsx'

const MUSIC_PLATFORMS = PLATFORMS.filter(p => p.type !== 'connect' && !p.isPlaceholder && p.url !== '#')

function LinkCard({ name, color, url, delay = 0 }) {
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
      <BrandIcon name={name} color={color} size={22} />
      <span>{name}</span>
      <span style={{ marginLeft: 'auto', color: '#555', fontSize: '0.75rem' }}>↗</span>
    </motion.a>
  )
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { delay: 0.3 } },
}

const panelVariants = {
  hidden: { clipPath: 'circle(0% at 50% 38%)', opacity: 0 },
  visible: {
    clipPath: 'circle(150% at 50% 38%)',
    opacity: 1,
    transition: {
      clipPath: { type: 'spring', damping: 28, stiffness: 120 },
      opacity: { duration: 0.1 },
    },
  },
  exit: {
    clipPath: 'circle(0% at 50% 38%)',
    opacity: 0,
    transition: {
      clipPath: { type: 'spring', damping: 32, stiffness: 180 },
      opacity: { delay: 0.2, duration: 0.1 },
    },
  },
}

export default function PlatformOverlay() {
  const overlayOpen = useVenueStore((s) => s.overlayOpen)
  const activePlatform = useVenueStore((s) => s.activePlatform)
  const closeOverlay = useVenueStore((s) => s.closeOverlay)
  const clearActivePlatform = useVenueStore((s) => s.clearActivePlatform)

  if (!activePlatform) return null

  const { name, color, url, embedType, albums, videos, icon, description, isPlaceholder, type } = activePlatform
  const isSpotifyAlbums = embedType === 'spotify-albums' && albums?.length > 0
  const isYoutubeVideos = embedType === 'youtube-videos'
  const isConnect = type === 'connect'

  return (
    <AnimatePresence onExitComplete={clearActivePlatform}>
      {overlayOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeOverlay}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.65)',
              zIndex: 100,
              backdropFilter: 'blur(12px)',
            }}
          />

          {/* Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(640px, 92vw)',
              maxHeight: '85vh',
              background: 'linear-gradient(180deg, #0D0015 0%, #0A0005 100%)',
              borderRadius: '16px',
              border: `1px solid ${color}33`,
              boxShadow: `0 0 80px ${color}22`,
              zIndex: 101,
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'system-ui, sans-serif',
              overflowY: 'auto',
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
                      <LinkCard key={p.id} name={p.name} color={p.color} url={p.url} delay={i * 0.04} />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.25em', color: '#555', textTransform: 'uppercase', paddingBottom: '0.25rem', borderBottom: '1px solid #ffffff0a', marginTop: '0.5rem' }}>
                    Socials
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {SOCIALS.map((s, i) => (
                      <LinkCard key={s.name} name={s.name} color={s.color} url={s.url} delay={MUSIC_PLATFORMS.length * 0.04 + i * 0.04} />
                    ))}
                  </div>
                </>
              )}

              {/* YouTube video embeds */}
              {!isConnect && isYoutubeVideos && (
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
                    Videos
                  </div>
                  {videos?.length > 0 ? (
                    videos.map((videoId, i) => (
                      <motion.div
                        key={videoId}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        style={{ borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}
                      >
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          width="100%"
                          height="215"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ display: 'block' }}
                        />
                      </motion.div>
                    ))
                  ) : (
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
                      }}
                    >
                      No videos yet — check the channel!
                    </motion.div>
                  )}
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

              {/* Track list for non-Spotify, non-YouTube platforms */}
              {!isConnect && !isSpotifyAlbums && !isYoutubeVideos && !isPlaceholder && (
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
