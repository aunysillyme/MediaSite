import { motion } from 'framer-motion'
import BrandIcon from './BrandIcon.jsx'
import { PLATFORMS, SOCIALS } from '../../data/platforms.js'

const MUSIC = PLATFORMS.filter(p => p.type !== 'connect' && !p.isPlaceholder && p.url !== '#')

function LinkCard({ name, color, url, delay }) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.85rem 1.1rem',
        borderRadius: '12px',
        background: `${color}0d`,
        border: `1px solid ${color}28`,
        color: '#fff',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        fontFamily: 'system-ui, sans-serif',
        transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${color}1e`
        e.currentTarget.style.borderColor = `${color}66`
        e.currentTarget.style.boxShadow = `0 0 18px ${color}22`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = `${color}0d`
        e.currentTarget.style.borderColor = `${color}28`
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <BrandIcon name={name} color={color} size={22} />
      <span style={{ flex: 1 }}>{name}</span>
      <span style={{ color: '#3a3a3a', fontSize: '0.75rem' }}>↗</span>
    </motion.a>
  )
}

function SectionLabel({ children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      style={{
        fontSize: '0.62rem',
        letterSpacing: '0.3em',
        color: '#3a3a3a',
        textTransform: 'uppercase',
        fontFamily: 'system-ui, sans-serif',
        marginBottom: '0.6rem',
      }}
    >
      {children}
    </motion.div>
  )
}

export default function LinksPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0005',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '3.5rem 1.25rem 5rem',
      overflowY: 'auto',
      position: 'relative',
    }}>
      <style>{`
        @font-face { font-family: 'AunyFont'; src: url('/font.ttf') format('truetype'); }
        @keyframes blob1 { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.15) translate(4%,3%)} }
        @keyframes blob2 { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.1) translate(-3%,-4%)} }
        @keyframes blob3 { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.08) translate(2%,-2%)} }
      `}</style>

      {/* Ambient blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-15%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'radial-gradient(circle, #FF6B0014 0%, transparent 65%)', animation: 'blob1 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, #7B00FF12 0%, transparent 65%)', animation: 'blob2 12s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '40%', right: '20%', width: '30vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(circle, #FFD70009 0%, transparent 65%)', animation: 'blob3 15s ease-in-out infinite' }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: 460,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2.25rem',
      }}>

        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
        >
          <div style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            border: '2px solid #FF6B00',
            boxShadow: '0 0 28px #FF6B0055, 0 0 60px #FF6B0018',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            <img
              src="/images/auny pfp 5.png"
              alt="AunySillyMe"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'AunyFont, system-ui, sans-serif',
              fontSize: '1.75rem',
              color: '#FF6B00',
              textShadow: '0 0 24px #FF6B0077',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}>
              AunySillyMe
            </div>
            <div style={{
              fontSize: '0.7rem',
              letterSpacing: '0.35em',
              color: '#FFD700',
              textTransform: 'uppercase',
              marginTop: '0.45rem',
              opacity: 0.75,
              fontFamily: 'system-ui, sans-serif',
            }}>
              artist
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #FF6B0033, transparent)' }} />

        {/* Streaming platforms */}
        <div style={{ width: '100%' }}>
          <SectionLabel delay={0.2}>Stream</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {MUSIC.map((p, i) => (
              <LinkCard key={p.id} name={p.name} color={p.color} url={p.url} delay={0.25 + i * 0.05} />
            ))}
          </div>
        </div>

        {/* Socials */}
        <div style={{ width: '100%' }}>
          <SectionLabel delay={0.5}>Socials</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {SOCIALS.map((s, i) => (
              <LinkCard key={s.name} name={s.name} color={s.color} url={s.url} delay={0.55 + i * 0.05} />
            ))}
          </div>
        </div>

        {/* Back to venue */}
        <motion.a
          href="/"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            fontSize: '0.72rem',
            color: '#2a2a2a',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            fontFamily: 'system-ui, sans-serif',
            marginTop: '0.5rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#FF6B00'}
          onMouseLeave={e => e.currentTarget.style.color = '#2a2a2a'}
        >
          ← Enter the Venue
        </motion.a>
      </div>
    </div>
  )
}
