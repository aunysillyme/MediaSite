#!/usr/bin/env node
// Fetch latest Spotify monthly-listener count via the public Pathfinder GraphQL
// endpoint (same one Spotify's web player uses). No OAuth required — uses an
// anonymous bearer token from open.spotify.com/get_access_token.
//
// Updates src/data/stats.json in place. Exits 0 always; logs result.
// Designed to run weekly from .github/workflows/update-stats.yml.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STATS_PATH = join(root, 'src/data/stats.json');

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 ' +
  '(KHTML, like Gecko) Version/17.0 Safari/605.1.15';

// Pathfinder uses persisted-query hashes. This one targets the
// queryArtistOverview operation that powers the public artist page.
const QUERY_HASH = '4bc52527bb77a5f8bbb9afe491e9aa725698d29ab73bff58d49169ee29800167';

async function getAnonymousToken() {
  const res = await fetch(
    'https://open.spotify.com/get_access_token?reason=transport&productType=web_player',
    { headers: { 'User-Agent': UA, Accept: 'application/json' } }
  );
  if (!res.ok) throw new Error(`token fetch failed: ${res.status}`);
  const json = await res.json();
  if (!json.accessToken) throw new Error('no accessToken in response');
  return json.accessToken;
}

async function fetchMonthlyListeners(artistId, token) {
  const variables = JSON.stringify({
    uri: `spotify:artist:${artistId}`,
    locale: '',
    includePrerelease: false,
  });
  const extensions = JSON.stringify({
    persistedQuery: { version: 1, sha256Hash: QUERY_HASH },
  });
  const url =
    'https://api-partner.spotify.com/pathfinder/v1/query' +
    `?operationName=queryArtistOverview&variables=${encodeURIComponent(variables)}` +
    `&extensions=${encodeURIComponent(extensions)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': UA,
      'App-Platform': 'WebPlayer',
      Accept: 'application/json',
    },
  });
  if (!res.ok) throw new Error(`pathfinder failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  const stats = json?.data?.artistUnion?.stats;
  if (!stats) throw new Error('no stats in response: ' + JSON.stringify(json).slice(0, 200));
  return {
    monthlyListeners: stats.monthlyListeners,
    followers: stats.followers,
  };
}

async function main() {
  const stats = JSON.parse(readFileSync(STATS_PATH, 'utf8'));
  const artistId = stats.spotify.artistId;
  if (!artistId) throw new Error('no spotify.artistId in stats.json');

  console.log(`fetching Spotify stats for artist ${artistId}…`);
  const token = await getAnonymousToken();
  const fresh = await fetchMonthlyListeners(artistId, token);

  const oldML = stats.spotify.monthlyListeners;
  const oldF = stats.spotify.followers;
  console.log(`old: ${oldML} listeners, ${oldF ?? 'null'} followers`);
  console.log(`new: ${fresh.monthlyListeners} listeners, ${fresh.followers} followers`);

  stats.spotify.monthlyListeners = fresh.monthlyListeners;
  stats.spotify.followers = fresh.followers;
  stats.spotify.lastUpdated = new Date().toISOString().slice(0, 10);

  writeFileSync(STATS_PATH, JSON.stringify(stats, null, 2) + '\n', 'utf8');
  const changed = oldML !== fresh.monthlyListeners || oldF !== fresh.followers;
  console.log(changed ? '✓ stats.json updated' : '✓ stats.json unchanged');
}

main().catch((err) => {
  console.error('update-stats failed:', err.message);
  process.exit(1);
});
