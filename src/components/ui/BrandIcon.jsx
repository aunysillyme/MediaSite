export default function BrandIcon({ name, color, size = 20 }) {
  const s = size
  const p = {
    width: s,
    height: s,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    style: { flexShrink: 0, display: 'block' },
  }

  switch (name) {
    case 'Spotify':
      return <svg {...p}><circle cx="12" cy="12" r="10.5" fill={color}/><path d="M7.5 14.5Q12 12.8 16.5 14.5" stroke="white" strokeWidth="1.9" strokeLinecap="round"/><path d="M6 11.2Q12 9 18 11.2" stroke="white" strokeWidth="1.9" strokeLinecap="round"/><path d="M5 7.8Q12 5.5 19 7.8" stroke="white" strokeWidth="1.9" strokeLinecap="round"/></svg>

    case 'Apple Music':
      return <svg {...p}><rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill={color}/><path d="M15 8.5l-5 1.5V15" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="15" r="2" fill="white"/><circle cx="14" cy="14" r="2" fill="white"/></svg>

    case 'YouTube':
      return <svg {...p}><path d="M22.5 7.5C22.2 6.2 21.2 5.2 20 4.9 18 4.5 12 4.5 12 4.5s-6 0-8 .4C2.8 5.2 1.8 6.2 1.5 7.5 1.1 9.5 1.1 12s0 2.5.4 4.5c.3 1.3 1.3 2.3 2.5 2.6C6 19.5 12 19.5 12 19.5s6 0 8-.4c1.2-.3 2.2-1.3 2.5-2.6.4-2 .4-4.5.4-4.5s0-2.5-.4-4.5zM10 15.5v-7l6 3.5-6 3.5z" fill={color}/></svg>

    case 'YouTube Music':
      return <svg {...p}><circle cx="12" cy="12" r="10.5" fill={color}/><circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5"/><polygon points="11,10 11,14 15,12" fill="white"/></svg>

    case 'SoundCloud':
      return <svg {...p}><path d="M1.5 15.5C1.5 13.8 2.9 12.5 4.5 12.5c.1-2.5 2.3-4.5 5-4.5.9 0 1.7.3 2.4.7C13 7.6 14.2 7 15.5 7 18 7 20 9 20 11.5v.3c1.4.3 2.5 1.5 2.5 3 0 1.7-1.3 3-3 3H4.5C2.9 18 1.5 16.9 1.5 15.5z" fill={color}/><path d="M7 11.5v5M9.5 10.5v6M12 9.5v7M14.5 11v5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>

    case 'Suno':
      return <svg {...p}><circle cx="12" cy="12" r="10.5" fill={color}/><path d="M8.5 9C8.5 7 10 5.5 12 5.5s3.5 1.5 3.5 3.5S14 12.5 12 12.5 8.5 14 8.5 16s1.5 2.5 3.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>

    case 'Deezer':
      return <svg {...p}><rect x="1.5" y="2" width="21" height="20" rx="3.5" fill={color}/><rect x="4" y="13" width="3" height="5.5" rx="1" fill="white"/><rect x="8.5" y="10" width="3" height="8.5" rx="1" fill="white"/><rect x="13" y="7.5" width="3" height="11" rx="1" fill="white"/><rect x="17.5" y="11" width="3" height="7.5" rx="1" fill="white"/></svg>

    case 'Audiomack':
      return <svg {...p}><rect x="2" y="2" width="20" height="20" rx="4.5" fill={color}/><path d="M7 16V9l9-2v7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="7" cy="16.5" r="2" fill="white"/><circle cx="16" cy="14.5" r="2" fill="white"/></svg>

    case 'Amazon Music':
      return <svg {...p}><circle cx="12" cy="12" r="10.5" fill={color}/><path d="M7.5 15.5C9.5 16.5 12 16.8 15.5 15.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/><path d="M14.5 14.2C15 15 15.7 15.5 16.5 15.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/><path d="M8 11l4-3 4 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="8" x2="12" y2="14" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>

    case 'Pandora':
      return <svg {...p}><circle cx="12" cy="12" r="10.5" fill={color}/><path d="M9 7h4.5a3.5 3.5 0 1 1 0 7H9V7z" stroke="white" strokeWidth="1.5"/><line x1="9" y1="7" x2="9" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>

    case 'iHeart':
      return <svg {...p}><circle cx="12" cy="12" r="10.5" fill={color}/><path d="M12 17.5C10 15.8 6 12.5 6 9.5a3.5 3.5 0 0 1 6-2.4A3.5 3.5 0 0 1 18 9.5c0 3-4 6.3-6 8z" fill="white"/></svg>

    case 'Website':
      return <svg {...p}><circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="2"/><path d="M12 2.5C9.5 6 8 9 8 12s1.5 6 4 9.5" stroke={color} strokeWidth="1.5"/><path d="M12 2.5C14.5 6 16 9 16 12s-1.5 6-4 9.5" stroke={color} strokeWidth="1.5"/><line x1="2.5" y1="12" x2="21.5" y2="12" stroke={color} strokeWidth="1.5"/><line x1="3.5" y1="7.5" x2="20.5" y2="7.5" stroke={color} strokeWidth="1" opacity="0.5"/><line x1="3.5" y1="16.5" x2="20.5" y2="16.5" stroke={color} strokeWidth="1" opacity="0.5"/></svg>

    case 'Instagram':
      return <svg {...p}><rect x="2" y="2" width="20" height="20" rx="6" fill={color}/><rect x="7" y="7" width="10" height="10" rx="3.5" stroke="white" strokeWidth="1.6"/><circle cx="12" cy="12" r="2.5" stroke="white" strokeWidth="1.6"/><circle cx="17" cy="7" r="1.2" fill="white"/></svg>

    case 'TikTok':
      return <svg {...p}><rect x="2" y="2" width="20" height="20" rx="5" fill={color}/><path d="M15 7.5a3.5 3.5 0 0 0 3.5 3.5v2.5a6 6 0 0 1-3.5-1.1V17a4.5 4.5 0 1 1-3-4.3v2.8a2 2 0 1 0 1 1.8V7.5H15z" fill="white"/></svg>

    case 'X (Twitter)':
      return <svg {...p}><circle cx="12" cy="12" r="10.5" fill={color}/><path d="M8 8l8 8M16 8L8 16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>

    case 'Threads':
      return <svg {...p}><circle cx="12" cy="12" r="10.5" fill={color}/><path d="M16.5 12c-.4-2.8-2.2-4.5-4.5-4.5-2.8 0-4.5 2-4.5 4.5s1.7 4.5 4.5 4.5c2 0 3.5-1 4.2-2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="7.5" x2="12" y2="16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>

    case 'Bluesky':
      return <svg {...p}><circle cx="12" cy="12" r="10.5" fill={color}/><path d="M12 14.5C9 11.5 5.5 9.5 5.5 9.5c.5 2.5 2 4 4.5 5L12 14.5c-3 .5-5 2.5-4.5 5 0 0 3.5-2 6.5-5z" fill="white"/><path d="M12 14.5C15 11.5 18.5 9.5 18.5 9.5c-.5 2.5-2 4-4.5 5L12 14.5c3 .5 5 2.5 4.5 5 0 0-3.5-2-6.5-5z" fill="white"/></svg>

    case 'LinkedIn':
      return <svg {...p}><rect x="1.5" y="1.5" width="21" height="21" rx="4.5" fill={color}/><circle cx="7" cy="7.5" r="1.8" fill="white"/><rect x="5.5" y="10.5" width="3" height="8" rx="0.5" fill="white"/><path d="M12 10.5h2.5v1.8c.6-1.1 1.8-1.8 3-1.8 2.5 0 3.5 1.5 3.5 4v4h-3v-3.8c0-1.3-.5-2-1.5-2s-2 .8-2 2.2v3.6H12v-8z" fill="white"/></svg>

    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
          <text x="12" y="16.5" textAnchor="middle" fill={color} fontSize="10" fontFamily="sans-serif">
            {name.charAt(0)}
          </text>
        </svg>
      )
  }
}
