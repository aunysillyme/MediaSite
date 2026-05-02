import { useEffect, useRef, useLayoutEffect } from 'react'

const INNER = [
  { name: 'Spotify',       color: '#1DB954', icon: 'spotify',      url: 'https://open.spotify.com/artist/2HSQl7HB2BksGuCU8f39hI' },
  { name: 'Apple Music',   color: '#FC3C44', icon: 'applemusic',   url: 'https://music.apple.com/us/artist/auny/1866039713' },
  { name: 'YouTube Music', color: '#FF0000', icon: 'youtubemusic', url: 'https://music.youtube.com/' },
  { name: 'Deezer',        color: '#00C7F2', icon: 'deezer',       url: 'https://www.deezer.com/us/artist/365193422' },
  { name: 'Amazon Music',  color: '#FF9900', icon: 'amazonmusic',  url: 'https://music.amazon.com/artists/B0GDL275G8/auny' },
  { name: 'Pandora',       color: '#3668FF', icon: 'pandora',      url: 'https://www.pandora.com/artist/auny/AR2rwlqqccbVhhq' },
  { name: 'Audiomack',     color: '#FF6A00', icon: 'audiomack',    url: 'https://audiomack.com/aunysillyme-69e90d000942a' },
  { name: 'Suno',          color: '#9B5CFF', icon: null,           url: 'https://suno.com/@aunysillyme' },
]

const OUTER = [
  { name: 'X',         color: 'rgba(240,240,240,0.9)', icon: 'x',        url: 'https://x.com/AunySillyMe' },
  { name: 'Instagram', color: '#E1306C',               icon: 'instagram', url: 'https://www.instagram.com/aunysillyme/' },
  { name: 'TikTok',    color: '#00E5FF',               icon: 'tiktok',    url: 'https://www.tiktok.com/@aunysillyme' },
  { name: 'Website',   color: '#FF6B1A',               icon: null,        url: 'https://aunysillyme.com' },
  { name: 'Threads',   color: 'rgba(210,210,210,0.8)', icon: 'threads',   url: 'https://www.threads.com/@aunysillyme' },
  { name: 'Bluesky',   color: '#0096FF',               icon: 'bluesky',   url: 'https://bsky.app/profile/aunysillyme.bsky.social' },
]

const CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/'

const MUSIC_NOTE = (color) =>
  `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3" fill="${color}" stroke="none"/><circle cx="18" cy="16" r="3" fill="${color}" stroke="none"/></svg>`

const GLOBE = (color) =>
  `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2C9.5 6 8 9 8 12s1.5 6 4 9.5M12 2C14.5 6 16 9 16 12s-1.5 6-4 9.5"/></svg>`

function toRgba(c, a) {
  if (c.startsWith('rgba(')) {
    return c.replace(/[\d.]+\)$/, `${a})`)
  }
  // hex → rgba
  const r = parseInt(c.slice(1, 3), 16)
  const g = parseInt(c.slice(3, 5), 16)
  const b = parseInt(c.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

function solidColor(c) {
  if (c.startsWith('rgba(')) {
    const m = c.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/)
    return m ? `rgb(${m[1]},${m[2]},${m[3]})` : '#fff'
  }
  return c
}

export default function LinksPage() {
  // Compute orbit size: fills viewport, capped at 580px
  const orbitSize = typeof window !== 'undefined'
    ? Math.min(580, Math.max(280, Math.min(window.innerWidth - 32, window.innerHeight - 200)))
    : 480

  const S = orbitSize
  const C = S / 2
  const INNER_R    = S * 0.305
  const OUTER_R    = S * 0.441
  const PLANET     = Math.max(40, Math.round(S * 0.085))
  const PLANET_OFF = PLANET / 2
  const ICON_SIZE  = Math.max(18, Math.round(PLANET * 0.46))
  const VINYL      = Math.max(96, Math.round(S * 0.22))
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

  // Load icons from simple-icons CDN
  useEffect(() => {
    const load = async (el, iconName, color) => {
      try {
        const res = await fetch(`${CDN}${iconName}.svg`)
        const svg = await res.text()
        const sc = solidColor(color)
        el.innerHTML = svg
          .replace(/<svg /, `<svg width="${ICON_SIZE}" height="${ICON_SIZE}" `)
          .replace(/fill="[^"]*"/g, `fill="${sc}"`)
          .replace(/stroke="[^"]*"/g, `stroke="none"`)
      } catch (_) {}
    }

    INNER.forEach((p, i) => {
      const el = innerIconRefs.current[i]
      if (!el) return
      if (!p.icon) { el.innerHTML = MUSIC_NOTE(p.color); return }
      load(el, p.icon, p.color)
    })

    OUTER.forEach((p, i) => {
      const el = outerIconRefs.current[i]
      if (!el) return
      if (!p.icon) { el.innerHTML = p.name === 'Website' ? GLOBE(p.color) : MUSIC_NOTE(p.color); return }
      load(el, p.icon, p.color)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // rAF animation loop
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
    <div style={{ minHeight:'100vh', background:'#05050D', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'4px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Space+Mono&family=DM+Sans&display=swap');
        @keyframes pulse-role { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes ring-inner { 0%,100%{border-color:rgba(0,229,255,0.12)} 50%{border-color:rgba(0,229,255,0.30)} }
        @keyframes ring-outer { 0%,100%{border-color:rgba(255,45,120,0.10)} 50%{border-color:rgba(255,45,120,0.25)} }
        @keyframes fade-up    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fade-in    { from{opacity:0} to{opacity:1} }
        .planet { position:absolute; display:flex; flex-direction:column; align-items:center; cursor:pointer; text-decoration:none; }
        .planet-circle { border-radius:50%; display:flex; align-items:center; justify-content:center; overflow:hidden; transition:transform 0.18s, box-shadow 0.18s; }
        .planet:hover .planet-circle { transform:scale(1.28); }
        .planet-label { opacity:0; white-space:nowrap; font-family:'Space Mono',monospace; background:rgba(5,5,13,0.92); padding:3px 7px; border-radius:4px; position:absolute; top:calc(100% + 5px); transition:opacity 0.18s; pointer-events:none; letter-spacing:0.03em; }
        .planet:hover .planet-label { opacity:1; }
      `}</style>

      {/* Scanline overlay */}
      <div style={{ position:'fixed', inset:0, zIndex:999, pointerEvents:'none', background:'repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)', opacity:0.25 }} />

      {/* Background blobs */}
      <div style={{ position:'fixed', width:270, height:270, borderRadius:'50%', background:'rgba(0,229,255,0.06)',  top:-90,  left:-80,  zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'fixed', width:220, height:220, borderRadius:'50%', background:'rgba(168,85,247,0.08)', top:40,   right:-80, zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'fixed', width:200, height:200, borderRadius:'50%', background:'rgba(255,45,120,0.06)', bottom:50, left:-60,  zIndex:0, pointerEvents:'none' }} />
      <div style={{ position:'fixed', width:160, height:160, borderRadius:'50%', background:'rgba(255,107,26,0.07)', top:100,  left:95,   zIndex:0, pointerEvents:'none' }} />

      {/* Hero */}
      <div style={{ position:'relative', zIndex:4, textAlign:'center', paddingBottom:6, animation:'fade-up 500ms ease-out both' }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontWeight:700, fontSize:'clamp(32px, 6vw, 52px)', color:'#fff', letterSpacing:'-0.3px', margin:0, lineHeight:1.1 }}>
          AunySillyMe
        </h1>
        <p style={{ fontFamily:"'Space Mono', monospace", fontSize:'clamp(9px, 1.5vw, 12px)', letterSpacing:'4px', textTransform:'uppercase', color:'#00E5FF', margin:'8px 0 0', animation:'pulse-role 3s ease-in-out infinite' }}>
          Artist · Producer
        </p>
      </div>

      {/* Orbit system */}
      <div style={{ position:'relative', width:S, height:S, zIndex:4, flexShrink:0, animation:'fade-in 500ms ease-out 200ms both' }}>

        {/* Ring tracks */}
        <div style={{ position:'absolute', width:INNER_D, height:INNER_D, left:C - INNER_D/2, top:C - INNER_D/2, borderRadius:'50%', border:'1px solid rgba(0,229,255,0.14)', animation:'ring-inner 4s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:OUTER_D, height:OUTER_D, left:C - OUTER_D/2, top:C - OUTER_D/2, borderRadius:'50%', border:'1px solid rgba(255,45,120,0.10)', animation:'ring-outer 4s ease-in-out infinite 2s', pointerEvents:'none' }} />

        {/* Vinyl center */}
        <div ref={vinylRef} style={{ position:'absolute', width:VINYL, height:VINYL, left:C - VINYL/2, top:C - VINYL/2, zIndex:5, willChange:'transform' }}>
          <svg width={VINYL} height={VINYL} viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="41" cy="41" r="40" fill="#0c0c16"/>
            <circle cx="41" cy="41" r="37" stroke="#181824" strokeWidth="1.5"/>
            <circle cx="41" cy="41" r="34" stroke="#121218" strokeWidth="1"/>
            <circle cx="41" cy="41" r="31" stroke="#181824" strokeWidth="1.5"/>
            <circle cx="41" cy="41" r="28" stroke="#121218" strokeWidth="1"/>
            <circle cx="41" cy="41" r="25" stroke="#181824" strokeWidth="1.5"/>
            <circle cx="41" cy="41" r="22" stroke="#00E5FF" strokeWidth="0.6" opacity="0.3"/>
            <circle cx="41" cy="41" r="18" fill="#07070F"/>
            <circle cx="41" cy="41" r="15" stroke="#00E5FF" strokeWidth="1" opacity="0.45"/>
            <circle cx="41" cy="41" r="13" fill="#FF6B1A"/>
            <defs>
              <clipPath id="pfpClip">
                <circle cx="41" cy="41" r="12.5"/>
              </clipPath>
            </defs>
            <image href="/images/auny pfp 5.png" x="28.5" y="28.5" width="25" height="25" clipPath="url(#pfpClip)" preserveAspectRatio="xMidYMid slice"/>
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
                background: toRgba(p.color, 0.1),
                border: `1px solid ${p.color}`,
                boxShadow: `0 0 10px ${toRgba(p.color, 0.2)}`,
              }}
            >
              <div
                ref={el => { innerIconRefs.current[i] = el }}
                style={{ width:ICON_SIZE, height:ICON_SIZE, display:'flex', alignItems:'center', justifyContent:'center' }}
              />
            </div>
            <span className="planet-label" style={{ color:solidColor(p.color), fontSize:LABEL_SIZE }}>{p.name}</span>
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
                background: toRgba(p.color, 0.1),
                border: `1px solid ${p.color}`,
                boxShadow: `0 0 10px ${toRgba(p.color, 0.2)}`,
              }}
            >
              <div
                ref={el => { outerIconRefs.current[i] = el }}
                style={{ width:ICON_SIZE, height:ICON_SIZE, display:'flex', alignItems:'center', justifyContent:'center' }}
              />
            </div>
            <span className="planet-label" style={{ color:solidColor(p.color), fontSize:LABEL_SIZE }}>{p.name}</span>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div style={{ position:'relative', zIndex:4, textAlign:'center', paddingTop:4, paddingBottom:20 }}>
        <span style={{ fontSize:18, color:'rgba(255,107,26,0.4)' }}>🧡</span>
      </div>
    </div>
  )
}
