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
  // populated folder-by-folder from the vault — see commit history.
};
