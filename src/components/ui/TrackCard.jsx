import { useState } from 'react'
import { motion } from 'framer-motion'

export default function TrackCard({ track, platformColor, platformUrl, platformId }) {
  const [imgError, setImgError] = useState(false)

  const handleListen = () => {
    window.open(platformUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.65rem 0.75rem',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${platformColor}22`,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      whileHover={{
        background: `${platformColor}15`,
        border: `1px solid ${platformColor}55`,
        x: 4,
      }}
      onClick={handleListen}
    >
      {/* Album art */}
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '6px',
          overflow: 'hidden',
          flexShrink: 0,
          background: `linear-gradient(135deg, ${platformColor}44, #0A0005)`,
          border: `1px solid ${platformColor}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!imgError ? (
          <img
            src={track.art}
            alt={track.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{ fontSize: '1.2rem' }}>🎵</span>
        )}
      </div>

      {/* Track info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#fff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {track.title}
        </div>
        <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '1px' }}>
          {track.year}
        </div>
      </div>

      {/* Play icon */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: platformColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 0 10px ${platformColor}88`,
          fontSize: '0.7rem',
        }}
      >
        ▶
      </div>
    </motion.div>
  )
}
