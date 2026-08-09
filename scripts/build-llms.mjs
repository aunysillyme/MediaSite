#!/usr/bin/env node
// Generates /llms.txt from the data layer — the catalogue an agent should know
// about, derived rather than hand-maintained so it cannot drift on a release.
//
// Deliberately carries NO total counts. The site's own totals currently
// undercount the catalogue (Café Musik EP has no data entry, AUN-661), and a
// wrong number in an agent-facing file is worse than no number. Listing the
// releases is the useful part; asserting how many there are is not.
//
// Unreleased items are excluded: an agent quoting a release that is not out yet
// is the same class of error as a dead link.

import { ALBUMS } from '../src/data/albums.js';
import { SINGLES } from '../src/data/singles.js';
import { writeOut, isReleased, todayISO } from './_lib.mjs';

const today = todayISO();
const albums = ALBUMS.filter((a) => isReleased(a, today));
const singles = SINGLES.filter((s) => isReleased(s, today));
const upcoming = ALBUMS.filter((a) => !isReleased(a, today));

const line = (r, kind) =>
  `- [${r.title}](https://www.auny.media/${kind}/${r.slug}): `
  + `${r.releaseDisplay}${Array.isArray(r.tracks) ? `, ${r.tracks.length} tracks` : ''}`
  + `${r.genre ? `. ${r.genre.split('·')[0].trim()}` : ''}`;

const out = `# Auny - music

> Auny is an independent artist releasing instrumental and vocal electronic music:
> dark EDM, lo-fi, ambient, downtempo, and the Color Series. This site is the
> official catalogue. Every release links out to Spotify, Apple Music and the
> other streaming platforms.

Artist: Auny (also written AunySillyMe). Label: AunySillyMe.

## Albums
${albums.map((a) => line(a, 'albums')).join('\n')}

## Singles
${singles.map((s) => line(s, 'singles')).join('\n')}
${upcoming.length ? `
## Upcoming
${upcoming.map((a) => `- [${a.title}](https://www.auny.media/albums/${a.slug}): releases ${a.releaseDisplay}${a.preorder ? `. Pre-order on ${a.preorder.store}: ${a.preorder.url}` : ''}`).join('\n')}
` : ''}
## Browse
- [All albums](https://www.auny.media/albums)
- [All singles](https://www.auny.media/singles)
- [Every streaming platform](https://www.auny.media/links)

## Listen
- [Spotify](https://open.spotify.com/artist/2HSQl7HB2BksGuCU8f39hI)
- [Apple Music](https://music.apple.com/us/artist/auny/1866039713)
- [Amazon Music](https://music.amazon.com/artists/B0GDL275G8/auny)
- [YouTube](https://www.youtube.com/@aunysillyme)

## Elsewhere
- [Consulting and content work at aunysillyme.com](https://www.aunysillyme.com/) - the same person, different site. Content strategy, AI workflows, paid social.
- [X](https://x.com/AunySillyMe)

## Notes for agents
- Release facts on this site are generated from a single data layer, so titles, dates and track counts here match the pages.
- A release with no streaming link yet is one whose platform IDs have not been published. The music is out; the link is pending.
- Lyrics are on the individual single pages where they exist.
`;

writeOut('llms.txt', out);
console.log(`✓ generated /llms.txt → public/llms.txt (${albums.length} albums, ${singles.length} singles, ${upcoming.length} upcoming)`);
