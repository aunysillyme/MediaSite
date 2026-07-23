// Optional per-single enrichment: tempo (BPM) + a one-line production/vibe note.
// Keyed by single slug (matches SINGLES[].slug in singles.js). A single page
// renders its Tempo meta-row + production note ONLY if it has an entry here —
// so enrichment is additive and opt-in (add a slug to light it up).
//
// Shape:
//   'slug': { bpm: 92, note: "One-line production / vibe descriptor." }
// Both fields are optional: bpm-only or note-only entries render fine.
//
// Source of truth: the "🎵 Music" Obsidian vault, one folder per single
// (Singles/<name>/). BPMs missing from the vault are sourced from Suno and
// written back to the vault so the two stay consistent.

export const SINGLE_NOTES = {
  // Color-series singles carry documented Suno prompts (BPM + stem recipe);
  // most narrative singles were Suno auto-tempo with no recorded BPM.
  'pink': {
    bpm: 95,
    note: 'Three stems — dark EDM, rave, and lo-fi — generated at matched tempo in A minor and layered in post.',
  },
  'cyan': {
    bpm: 85,
    note: 'Dark atmospheric EDM with processed violin (Lindsey Stirling influence), icy layered synths, deep sub-bass.',
  },
  'let-go': {
    bpm: 80,
    note: 'Dark EDM meets golden-hour warmth in A major — acoustic guitar, crisp xylophone, flute, heartbeat piano.',
  },
  'mechanical-screen': {
    bpm: 151,
    note: 'Cinematic experimental electronica — two instrumental layers (151 & 125 BPM) under hypnotic, seductive vocals.',
  },
  'yellow': {
    note: 'Dark midtempo EDM — hypnotic, heavy distorted synths, spatial xylophone, whispered call-and-response vocals.',
  },
  'story-of-you': {
    note: 'A two-voice arrangement — a harsh inner-critic vocal answered by a warm, reassuring one.',
  },
};
