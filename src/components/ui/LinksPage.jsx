import { useEffect, useRef } from 'react'

// Inner orbit — socials (closer to center, 6 planets)
const INNER = [
  { name: 'X',         color: '#e5e5e5',  icon: 'x',        url: 'https://x.com/AunySillyMe' },
  { name: 'Instagram', color: '#E1306C',  icon: 'instagram', url: 'https://www.instagram.com/aunysillyme/' },
  { name: 'TikTok',    color: '#00E5FF',  icon: 'tiktok',    url: 'https://www.tiktok.com/@aunysillyme' },
  { name: 'Website',   color: '#FF6B1A',  icon: null,        url: 'https://aunysillyme.com' },
  { name: 'Threads',   color: '#d0d0d0',  icon: 'threads',   url: 'https://www.threads.com/@aunysillyme' },
  { name: 'Bluesky',   color: '#0096FF',  icon: 'bluesky',   url: 'https://bsky.app/profile/aunysillyme.bsky.social' },
]

// Outer orbit — streaming platforms (8 planets)
const OUTER = [
  { name: 'Spotify',       color: '#1DB954', icon: 'spotify',      url: 'https://open.spotify.com/artist/2HSQl7HB2BksGuCU8f39hI' },
  { name: 'Apple Music',   color: '#FC3C44', icon: 'applemusic',   url: 'https://music.apple.com/us/artist/auny/1866039713' },
  { name: 'YouTube Music', color: '#FF0000', icon: 'youtubemusic', url: 'https://music.youtube.com/@aunysillyme' },
  { name: 'Deezer',        color: '#00C7F2', icon: 'deezer',       url: 'https://www.deezer.com/us/artist/365193422' },
  { name: 'Amazon Music',  color: '#FF9900', icon: 'amazonmusic',  url: 'https://music.amazon.com/artists/B0GDL275G8/auny' },
  { name: 'Pandora',       color: '#3668FF', icon: 'pandora',      url: 'https://www.pandora.com/artist/auny/AR2rwlqqccbVhhq' },
  { name: 'Audiomack',     color: '#FF6A00', icon: 'audiomack',    url: 'https://audiomack.com/aunysillyme-69e90d000942a' },
  { name: 'Suno',          color: '#9B5CFF', icon: null,           url: 'https://suno.com/@aunysillyme' },
]

const CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/'

const MUSIC_NOTE_SVG = `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3" fill="white" stroke="none"/><circle cx="18" cy="16" r="3" fill="white" stroke="none"/></svg>`

const GLOBE_SVG = `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2C9.5 6 8 9 8 12s1.5 6 4 9.5M12 2C14.5 6 16 9 16 12s-1.5 6-4 9.5"/></svg>`

function toRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

export default function LinksPage() {
  const S = typeof window !== 'undefined'
    ? Math.min(580, Math.max(300, Math.min(window.innerWidth - 32, window.innerHeight - 220)))
    : 480

  const C          = S / 2
  const INNER_R    = S * 0.305
  const OUTER_R    = S * 0.441
  const PLANET     = Math.max(46, Math.round(S * 0.094))
  const PLANET_OFF = PLANET / 2
  const ICON_SIZE  = Math.max(22, Math.round(PLANET * 0.52))
  const VINYL      = Math.max(110, Math.round(S * 0.26))
  const INNER_D    = S * 0.611
  const OUTER_D    = S * 0.882
  const LABEL_SIZE = Math.max(10, Math.round(S * 0.022))

  const innerPlanetRefs = useRef([])
  const outerPlanetRefs = useRef([])
  const innerIconRefs   = useRef([])
  const outerIconRefs   = useRef([])
  const vinylRef        = useRef()
  const rafRef          = useRef()
  const innerAngle      = useRef(0)
  const outerAngle      = useRef(Math.PI / 5)
  const vinylAngle      = useRef(0)
  const lastTime        = useRef(null)

  useEffect(() => {
    const load = async (el, iconName) => {
      try {
        const res = await fetch(`${CDN}${iconName}.svg`)
        const svg = await res.text()
        el.innerHTML = svg
          .replace(/<svg /, `<svg width="${ICON_SIZE}" height="${ICON_SIZE}" `)
          .replace(/fill="[^"]*"/g, 'fill="white"')
          .replace(/stroke="[^"]*"/g, 'stroke="none"')
      } catch (_) {}
    }

    INNER.forEach((p, i) => {
      const el = innerIconRefs.current[i]
      if (!el) return
      if (!p.icon) { el.innerHTML = MUSIC_NOTE_SVG; return }
      load(el, p.icon)
    })

    OUTER.forEach((p, i) => {
      const el = outerIconRefs.current[i]
      if (!el) return
      if (!p.icon) { el.innerHTML = p.name === 'Website' ? GLOBE_SVG : MUSIC_NOTE_SVG; return }
      load(el, p.icon)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const animate = (ts) => {
      if (lastTime.current === null) lastTime.current = ts
      const dt = Math.min((ts - lastTime.current) / 1000, 0.05)
      lastTime.current = ts

      innerAngle.current += dt * (2 * Math.PI / 30)
      outerAngle.current -= dt * (2 * Math.PI / 46)
      vinylAngle.current += dt * (360 / 14)

      INNER.forEach((_, i) => {
        const el = innerPlanetRefs.current[i]
        if (!el) return
        const a = innerAngle.current + (i / INNER.length) * 2 * Math.PI
        el.style.left = (C + INNER_R * Math.cos(a) - PLANET_OFF) + 'px'
        el.style.top  = (C + INNER_R * Math.sin(a) - PLANET_OFF) + 'px'
      })

      OUTER.forEach((_, i) => {
        const el = outerPlanetRefs.current[i]
        if (!el) return
        const a = outerAngle.current + (i / OUTER.length) * 2 * Math.PI
        el.style.left = (C + OUTER_R * Math.cos(a) - PLANET_OFF) + 'px'
        el.style.top  = (C + OUTER_R * Math.sin(a) - PLANET_OFF) + 'px'
      })

      if (vinylRef.current) {
        vinylRef.current.style.transform = `rotate(${vinylAngle.current % 360}deg)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ minHeight:'100vh', background:'#05050D', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Space+Mono&family=DM+Sans:wght@400;500&display=swap');

        @keyframes pulse-role   { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes ring-inner   { 0%,100%{border-color:rgba(255,45,120,0.10)} 50%{border-color:rgba(255,45,120,0.28)} }
        @keyframes ring-outer   { 0%,100%{border-color:rgba(0,229,255,0.12)} 50%{border-color:rgba(0,229,255,0.32)} }
        @keyframes fade-up      { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fade-in      { from{opacity:0} to{opacity:1} }
        @keyframes neon-flicker {
          0%,19%,21%,23%,25%,54%,56%,100% { opacity:1; }
          20%,24%,55% { opacity:0.3; }
        }
        @keyframes neon-slow-pulse { 0%,100%{opacity:0.25} 50%{opacity:0.6} }
        @keyframes neon-drift { 0%,100%{transform:translateY(0) rotate(14deg)} 50%{transform:translateY(-8px) rotate(14deg)} }
        @keyframes neon-drift2 { 0%,100%{transform:translateY(0) rotate(-10deg)} 50%{transform:translateY(6px) rotate(-10deg)} }

        .planet { position:absolute; display:flex; flex-direction:column; align-items:center; cursor:pointer; text-decoration:none; }
        .planet-circle { border-radius:50%; display:flex; align-items:center; justify-content:center; overflow:hidden; transition:transform 0.18s, box-shadow 0.18s; }
        .planet:hover .planet-circle { transform:scale(1.3); }
        .planet-label {
          opacity:0; white-space:nowrap; font-family:'Space Mono',monospace;
          background:rgba(5,5,13,0.95); padding:3px 8px; border-radius:4px;
          position:absolute; top:calc(100% + 6px);
          transition:opacity 0.18s; pointer-events:none; letter-spacing:0.04em;
        }
        .planet:hover .planet-label { opacity:1; }
      `}</style>

      {/* Scanline overlay */}
      <div style={{ position:'fixed', inset:0, zIndex:999, pointerEvents:'none', background:'repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)', opacity:0.2 }} />

      {/* Background blobs */}
      <div style={{ position:'fixed', width:270, height:270, borderRadius:'50%', background:'rgba(0,229,255,0.05)',  top:-90,  left:-80,  zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'fixed', width:220, height:220, borderRadius:'50%', background:'rgba(168,85,247,0.07)', top:40,   right:-80, zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'fixed', width:200, height:200, borderRadius:'50%', background:'rgba(255,45,120,0.05)', bottom:50, left:-60,  zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'fixed', width:160, height:160, borderRadius:'50%', background:'rgba(255,107,26,0.06)', top:100,  left:95,   zIndex:0, pointerEvents:'none' }} />

      {/* Neon accent shapes — abstract outlines that flicker */}
      <div style={{
        position:'fixed', top:48, right:36, width:110, height:68,
        border:'1px solid rgba(0,229,255,0.4)',
        boxShadow:'0 0 10px rgba(0,229,255,0.18), inset 0 0 6px rgba(0,229,255,0.06)',
        borderRadius:3, pointerEvents:'none', zIndex:1,
        animation:'neon-flicker 7s ease-in-out infinite, neon-drift 6s ease-in-out infinite',
      }} />
      <div style={{
        position:'fixed', top:68, right:56, width:65, height:38,
        border:'1px solid rgba(0,229,255,0.25)',
        boxShadow:'0 0 6px rgba(0,229,255,0.12)',
        borderRadius:2, pointerEvents:'none', zIndex:1,
        animation:'neon-flicker 7s ease-in-out infinite 0.4s, neon-drift 6s ease-in-out infinite',
      }} />

      <div style={{
        position:'fixed', bottom:72, left:32, width:90, height:56,
        border:'1px solid rgba(255,45,120,0.38)',
        boxShadow:'0 0 10px rgba(255,45,120,0.15)',
        borderRadius:3, pointerEvents:'none', zIndex:1,
        animation:'neon-flicker 9s ease-in-out infinite 2s, neon-drift2 8s ease-in-out infinite',
      }} />
      <div style={{
        position:'fixed', bottom:88, left:50, width:52, height:30,
        border:'1px solid rgba(255,45,120,0.2)',
        borderRadius:2, pointerEvents:'none', zIndex:1,
        animation:'neon-flicker 9s ease-in-out infinite 2.5s, neon-drift2 8s ease-in-out infinite',
      }} />

      {/* Neon line — left edge */}
      <div style={{
        position:'fixed', left:18, top:'25%', width:1, height:'18vh',
        background:'linear-gradient(to bottom, transparent, rgba(168,85,247,0.5), transparent)',
        boxShadow:'0 0 8px rgba(168,85,247,0.3)',
        pointerEvents:'none', zIndex:1,
        animation:'neon-slow-pulse 4s ease-in-out infinite 1s',
      }} />
      {/* Neon line — right edge */}
      <div style={{
        position:'fixed', right:18, bottom:'28%', width:1, height:'14vh',
        background:'linear-gradient(to bottom, transparent, rgba(255,107,26,0.45), transparent)',
        boxShadow:'0 0 8px rgba(255,107,26,0.25)',
        pointerEvents:'none', zIndex:1,
        animation:'neon-slow-pulse 5s ease-in-out infinite',
      }} />

      {/* Hero */}
      <div style={{ position:'relative', zIndex:4, textAlign:'center', paddingBottom:8, animation:'fade-up 500ms ease-out both' }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontWeight:700, fontSize:'clamp(34px, 6vw, 54px)', color:'#fff', letterSpacing:'-0.3px', margin:0, lineHeight:1.1 }}>
          AunySillyMe
        </h1>
        <p style={{ fontFamily:"'Space Mono', monospace", fontSize:'clamp(9px, 1.4vw, 11px)', letterSpacing:'4px', textTransform:'uppercase', color:'#00E5FF', margin:'8px 0 0', animation:'pulse-role 3s ease-in-out infinite' }}>
          Artist · Producer
        </p>
        <p style={{
          fontFamily:"'DM Sans', sans-serif", fontWeight:500,
          fontSize:'clamp(11px, 1.8vw, 14px)',
          color:'#FF2D78',
          textShadow:'0 0 12px rgba(255,45,120,0.7), 0 0 28px rgba(255,45,120,0.3)',
          margin:'10px 0 0', letterSpacing:'0.06em',
          animation:'neon-flicker 8s ease-in-out infinite 3s',
        }}>
          all of me, in orbit ✦
        </p>
      </div>

      {/* Orbit system */}
      <div style={{ position:'relative', width:S, height:S, zIndex:4, flexShrink:0, overflow:'visible', animation:'fade-in 500ms ease-out 200ms both' }}>

        {/* Ring tracks */}
        <div style={{ position:'absolute', width:INNER_D, height:INNER_D, left:C - INNER_D/2, top:C - INNER_D/2, borderRadius:'50%', border:'1px solid rgba(0,229,255,0.14)', animation:'ring-inner 4s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:OUTER_D, height:OUTER_D, left:C - OUTER_D/2, top:C - OUTER_D/2, borderRadius:'50%', border:'1px solid rgba(255,45,120,0.10)', animation:'ring-outer 4s ease-in-out infinite 2s', pointerEvents:'none' }} />

        {/* Vinyl center */}
        <div ref={vinylRef} style={{ position:'absolute', width:VINYL, height:VINYL, left:C - VINYL/2, top:C - VINYL/2, zIndex:5, willChange:'transform' }}>
          <svg width={VINYL} height={VINYL} viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="41" cy="41" r="40" fill="#0c0c16"/>
            <circle cx="41" cy="41" r="37" stroke="#1e1e2e" strokeWidth="1.8"/>
            <circle cx="41" cy="41" r="33" stroke="#181824" strokeWidth="1.2"/>
            <circle cx="41" cy="41" r="29" stroke="#1e1e2e" strokeWidth="1.8"/>
            <circle cx="41" cy="41" r="25" stroke="#181824" strokeWidth="1.2"/>
            <circle cx="41" cy="41" r="23" stroke="#00E5FF" strokeWidth="0.7" opacity="0.35"/>
            <circle cx="41" cy="41" r="20" fill="#07070F"/>
            <circle cx="41" cy="41" r="17.5" stroke="#00E5FF" strokeWidth="1" opacity="0.4"/>
            <circle cx="41" cy="41" r="16" fill="#FF6B1A"/>
            <defs>
              <clipPath id="pfpClip">
                <circle cx="41" cy="41" r="15.5"/>
              </clipPath>
            </defs>
            <image href="/images/auny pfp 5.png" x="25.5" y="25.5" width="31" height="31" clipPath="url(#pfpClip)" preserveAspectRatio="xMidYMid slice"/>
            <circle cx="41" cy="41" r="2.5" fill="#05050D"/>
          </svg>
        </div>

        {/* Inner ring — streaming platforms */}
        {INNER.map((p, i) => (
          <a
            key={p.name}
            ref={el => { innerPlanetRefs.current[i] = el }}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="planet"
            style={{ width:PLANET, left:C - PLANET_OFF, top:C - PLANET_OFF }}
          >
            <div
              className="planet-circle"
              style={{
                width:PLANET, height:PLANET,
                background: toRgba(p.color, 0.22),
                border: `1.5px solid ${p.color}`,
                boxShadow: `0 0 14px ${toRgba(p.color, 0.5)}, inset 0 0 8px ${toRgba(p.color, 0.12)}`,
              }}
            >
              <div ref={el => { innerIconRefs.current[i] = el }} style={{ width:ICON_SIZE, height:ICON_SIZE, display:'flex', alignItems:'center', justifyContent:'center' }} />
            </div>
            <span className="planet-label" style={{ color:p.color, fontSize:LABEL_SIZE }}>{p.name}</span>
          </a>
        ))}

        {/* Outer ring — social platforms */}
        {OUTER.map((p, i) => (
          <a
            key={p.name}
            ref={el => { outerPlanetRefs.current[i] = el }}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="planet"
            style={{ width:PLANET, left:C - PLANET_OFF, top:C - PLANET_OFF }}
          >
            <div
              className="planet-circle"
              style={{
                width:PLANET, height:PLANET,
                background: toRgba(p.color.startsWith('#') ? p.color : '#ffffff', 0.12),
                border: `1.5px solid ${p.color}`,
                boxShadow: `0 0 14px ${p.color.startsWith('#') ? toRgba(p.color, 0.45) : 'rgba(220,220,220,0.3)'}`,
              }}
            >
              <div ref={el => { outerIconRefs.current[i] = el }} style={{ width:ICON_SIZE, height:ICON_SIZE, display:'flex', alignItems:'center', justifyContent:'center' }} />
            </div>
            <span className="planet-label" style={{ color:p.color, fontSize:LABEL_SIZE }}>{p.name}</span>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div style={{ position:'relative', zIndex:4, textAlign:'center', paddingTop:6, paddingBottom:24 }}>
        <span style={{ fontSize:18, color:'rgba(255,107,26,0.45)' }}>🧡</span>
      </div>
    </div>
  )
}
