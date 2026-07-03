// Optional per-album enrichment: production notes + per-track BPM/vibe.
// Keyed by album slug; tracks keyed by exact track name. An album renders
// its 'The Making' + enriched tracklist ONLY if it has an entry here — so
// enrichment is additive and opt-in (add a slug to light it up).

export const ALBUM_NOTES = {
  'flatline': {
    making: [
      "A study in suspended clinical tension and delicate organic realism \u2014 designed to induce a state of \"Intricate Zen\": hyper-focused calm, mental stillness, sensory immersion.",
      "Every track pairs one cold, clinical texture (heartbeat sub-bass, ECG flatline pings, ticking basalt metronomes, glass) against one organic one (scratching quills, dripping water, autumn leaves, wildflowers).",
      "Mastered locally on a custom pure-Python DSP engine \u2014 bilinear biquad EQ and asymptotic soft-knee limiting, staged to \u221214 to \u221218 LUFS with a \u22121.0 dBFS true-peak ceiling for clean streaming encodes.",
    ],
    specs: [
      ["Tempo", "50\u201368 BPM"],
      ["Loudness", "\u221214 to \u221218 LUFS"],
      ["Ceiling", "\u22121.0 dBFS TP"],
      ["Mastering", "pure-Python DSP"],
    ],
    tracks: {
      "Bluebell": { bpm: 62, vibe: "Warm organic intro \u2014 wide scratching quill, liquid bubbles, soft xylophone" },
      "Quill on Beat": { bpm: 62, vibe: "Rhythmic quill \u2014 calligraphy scratching over organic felt-piano beats" },
      "Basement": { bpm: 64, vibe: "Earthy bass space \u2014 leaf rustle, water droplets, deep vibrating bass" },
      "Hum": { bpm: 64, vibe: "Earthy hum \u2014 leaf rustle, organic-mechanical circuit hum" },
      "Jellyfish": { bpm: 63, vibe: "Urban melodic bridge \u2014 slow urban bass, city echoes, xylophone & violin" },
      "Hearts Collide": { bpm: 58, vibe: "Romantic realism \u2014 double-bass plucks, finger snaps, water dripping" },
      "Salty Heartbeat": { bpm: 58, vibe: "Liquid jazz groove \u2014 double-bass plucks, falling teardrops, snaps" },
      "Clinks": { bpm: 58, vibe: "Dusty crackle \u2014 paper shuffle, upright bass, dusty vinyl crackle" },
      "Vinyl": { bpm: 65, vibe: "Boom-bap groove \u2014 heavy bass, delicate glass clinking, vinyl crackle" },
      "Glass X": { bpm: 65, vibe: "Sharp geometric beat \u2014 glass clinks panned wide, thick glass resonance" },
      "Moonlit": { bpm: 60, vibe: "Glistening cool-tone \u2014 crystal bells, cool dark bass, thumping drum" },
      "Under the Stars": { bpm: 60, vibe: "Cosmic glisten \u2014 sparkling crystal bells, expansive space" },
      "Sandglass": { bpm: 68, vibe: "High-tension sandstorm \u2014 granular synthesis, dark piano chords" },
      "Echo Cardio": { bpm: 55, vibe: "Clinical heartbeat \u2014 biological sub-bass, flickering light" },
      "Flatline": { bpm: 55, vibe: "Album climax \u2014 heartbeat sub-bass, spatial ECG flatline pings" },
      "Glass Clinking": { bpm: 50, vibe: "Pristine ambient still \u2014 shimmering glass, night-piano echoes" },
      "Metronome": { bpm: 50, vibe: "Suspended time \u2014 basalt-stone metronome tick, cyan light waves" },
      "Melancholy": { bpm: 52, vibe: "Cinematic resolution \u2014 mechanical xylophone, felt piano & violin" },
      "Cogwheel": { bpm: 52, vibe: "Album outro \u2014 mechanical gear tick, felt-piano reverb fade" },
    },
  },
  'midnight-glitch': {
    making: [
      "The catalog's hardest, fastest album \u2014 high-intensity instrumental techno built for coding, gaming, and deep focus. Neon underground, late night, no vocals.",
      "Driven by squelchy TB-303 acid basslines and heavily distorted industrial kicks, with atmospheric drift-phonk pads and relentless locked grooves running 148\u2013160 BPM.",
      "Mastered on a custom pure-Python biquad EQ + soft-knee limiter: per-track shelving (a \u22121.5 dB cut at 6 kHz turned Suno's digital hiss into warm tape texture; a +1.5 dB lift at 100 Hz added sub-bass weight), staged to \u221214 LUFS at a \u22121.0 dBFS ceiling.",
    ],
    specs: [
      ["Tempo", "148\u2013160 BPM"],
      ["Loudness", "\u221214 LUFS"],
      ["Ceiling", "\u22121.0 dBFS TP"],
      ["Mastering", "pure-Python biquad"],
    ],
    tracks: {
      "Glitch City": { bpm: 150, vibe: "Cold-open city ambience \u2014 distorted kick drops at 1:00, TB-303 acid, high-speed chase" },
      "Midnight Glitch": { bpm: 148, vibe: "System powering down \u2014 warped decaying synths, looping phrase into static" },
      "Digital Dusk": { bpm: 148, vibe: "Neon city fading to static \u2014 drifting bass, fragmented percussion" },
      "Phantom Signal": { bpm: 154, vibe: "Deconstructed phonk \u2014 relentless techno percussion, oppressive atmosphere" },
      "Going Spectral": { bpm: 154, vibe: "Energy-surge push \u2014 warped harmonic layers, locked groove" },
      "Hard Reset": { bpm: 157, vibe: "Pounding distorted kick, aggressive TB-303 acid, club-floor intensity" },
      "Override": { bpm: 157, vibe: "No breaks, no mercy \u2014 relentless industrial groove, hypnotic repetition" },
      "Flow State": { bpm: 151, vibe: "Eerie smooth phonk \u2014 rapid hats, neon-rain ambience, cinematic tension" },
      "Binary": { bpm: 151, vibe: "Sub-bass pulses, fragmented melody, unsettling harmonic drift" },
      "Dead Channel": { bpm: 160, vibe: "Peak rave \u2014 psy-trance rolling triplets, industrial kick, full speed" },
      "Null n Void": { bpm: 160, vibe: "Maximum energy \u2014 aggressive acid bassline, no breaks" },
      "System To Blame": { bpm: 153, vibe: "Off-kilter syncopation \u2014 driving momentum without payoff, cinematic dread" },
      "It's Your Fault": { bpm: 153, vibe: "Unresolved loops, warped bass, uneasy and hypnotic" },
      "Dark Matter": { bpm: 156, vibe: "White-noise riser to full rave eruption \u2014 dominant TB-303 acid" },
      "Fractured Core": { bpm: 152, vibe: "Bitcrushed pads, warped drones, deep sub-bass, oppressive" },
      "Corrupted Personality": { bpm: 152, vibe: "Fractured harmonic layers, neon-static ambience, locked groove" },
      "Spectral Drift": { bpm: 158, vibe: "3-minute anxious build to a massive distorted drop \u2014 chrome & steel" },
      "Chromatic Aberration": { bpm: 158, vibe: "Rolling triplets, snare rolls, maximum-impact drop" },
      "Ghost Frequency": { bpm: 150, vibe: "Moody phonk \u2014 eerie pads, warped fragments, neon-rain" },
      "Signal": { bpm: 150, vibe: "Sharp hats, deep sub-bass, dark and immersive" },
      "Neon Collapse": { bpm: 155, vibe: "Full energy from the top \u2014 TB-303 acid, high-speed chase, motorway" },
      "Neon Arsenal": { bpm: 155, vibe: "Rolling snare fills, relentless driving percussion" },
      "Transit": { bpm: 156, vibe: "White-noise riser, rave eruption, deep-space aesthetic" },
    },
  },
};
