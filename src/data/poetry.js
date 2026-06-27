// Source of truth for the Poetry section (spoken word + video + verse).
//
// ⚠️ SCAFFOLD / HELD: these are PLACEHOLDER pieces. The section is built but not
// revealed — it's excluded from the nav + sitemap and the pages carry a noindex
// tag until real pieces land. Replace the placeholders, set `media`, flip
// `status` to 'live', then wire the nav + sitemap to launch.
//
// Per piece:
//   slug      url segment → /poetry/<slug>
//   title     display title
//   type      'video' | 'audio' — decides the player + transcript treatment
//   status    'coming-soon' | 'live'  (coming-soon → disabled player)
//   accent    per-piece accent { color, rgb } — themes the page + its node
//   poster    image shown in the player + collection node (placeholder = a cover)
//   media     the audio/video URL on the media host (empty until uploaded)
//   captions  the .vtt URL (captions for video, synced transcript for audio)
//   duration  display string
//   date      ISO date
//   blurb     the pulled line shown on the collection node
//   pos       { left, top } in % — where the node floats on the Night Field
//   lines     the spoken text, line by line (drives captions / transcript)

export const POETRY = [
  {
    slug: 'the-void-speaks-back',
    title: 'The Void Speaks Back',
    type: 'video',
    status: 'coming-soon',
    accent: { color: '#8FB3D6', rgb: '143,179,214' },
    poster: '/album-art/singles/the-void.jpg',
    media: '',
    captions: '',
    duration: '2:14',
    date: '2026-06-27',
    blurb: 'I called into the dark and for once the dark answered in my own voice.',
    pos: { left: 56, top: 38 },
    lines: [
      'I called into the dark',
      'and for once the dark answered',
      'in my own voice.',
    ],
  },
  {
    slug: 'letters-i-never-sent',
    title: 'Letters I Never Sent',
    type: 'audio',
    status: 'coming-soon',
    accent: { color: '#D9A441', rgb: '217,164,65' },
    poster: '/album-art/singles/from-the-ashes.jpg',
    media: '',
    captions: '',
    duration: '1:48',
    date: '2026-06-27',
    blurb: 'If silence is a kind of letter, then I have written you a library.',
    pos: { left: 78, top: 30 },
    lines: [
      "There's a drawer in me that doesn't open,",
      'stuffed with everything I almost said.',
      'If silence is a kind of letter,',
      'then I have written you a library.',
    ],
  },
  {
    slug: 'how-to-disappear',
    title: 'How to Disappear',
    type: 'video',
    status: 'coming-soon',
    accent: { color: '#C29BD6', rgb: '194,155,214' },
    poster: '/album-art/singles/escape.jpg',
    media: '',
    captions: '',
    duration: '2:35',
    date: '2026-06-27',
    blurb: 'I got so good at leaving that staying feels like a language I forgot.',
    pos: { left: 50, top: 62 },
    lines: [
      'I got so good at leaving',
      'that staying feels like',
      'a language I forgot.',
    ],
  },
];
