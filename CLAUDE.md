# CLAUDE.md — operating rules for this repo

These apply to every Claude session working on auny.media. Read them before acting.

## Working with Auny

1. **Stop and ask when stuck.** If you're unsure of the right approach, a tool fails unexpectedly, or you don't understand what's in front of you — pause and ask. Don't guess your way forward.
2. **Never retry the same thing twice.** If a command, edit, or tool call failed, switch strategy. Re-running the same thing hoping it works the second time wastes tokens and time.
3. **Research current docs when relevant.** For any library/API/SDK/CLI work, fetch current docs (Context7 for libraries, web search for everything else) instead of trusting training-cut memory. Even for things you "know."
4. **Favor lightweight code.** Before adding or rewriting, ask: can the existing code be tightened or consolidated? Don't introduce a helper for a one-off. Don't fork a builder when a parameter would do.
5. **Think and plan before acting.** Map the change in your head first, then make the smallest set of edits. No exploratory tool spam. Token-frugal by default.

## Repo facts (current as of June 2026)

- Static multi-page site, deploys from `main` via Vercel project `media-site` (team `aunysillymes-projects`).
- Domain `auny.media` (+ `www`), behind Cloudflare proxy (zone in "Auny on Cloud9"). Registrar is Name.com via Vercel reseller.
- Build pipeline: `npm run build:site` chains `optimize-images → singles → albums → home → sitemap`. All builders read from `src/data/{albums,singles}.js` and templates in `templates/`.
- Image pipeline ships 320/640 AVIF+WebP per cover via `coverPicture()` in `scripts/_lib.mjs`; master JPEG remains the `<picture>` fallback + `og:image`.
- Fonts self-hosted under `public/fonts/` (5 latin woff2 faces). Don't re-add Google Fonts.
- CSP lives in `vercel.json` headers (not Cloudflare Transform Rules — they'd duplicate).
- Spotify player on detail pages is a click-to-play facade (`templates/_player.html` + `_player.css`); don't replace it with an auto-loading iframe.
- Per-release platform links live in `release.platforms = { appleMusic, youtubeMusic, amazonMusic, tidal, deezer, pandora }`; rendered via shared `platformRowFor()` and fed into schema `sameAs`.
- Upcoming-release auto-flip: any album/single with `upcoming: true`, a future `releaseDate`, or empty `spotifyAlbumId/spotifyTrackId` renders pre-release UI automatically; flips to "released" on the next build after the data is updated.
