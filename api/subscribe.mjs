// POST /api/subscribe — subscribes an email to Mind n Machine (beehiiv).
// Called by the footer form on auny.media.
//
// Env vars (set in Vercel project settings):
//   BEEHIIV_API_KEY  — beehiiv API key with subscription:write scope.
//
// Beehiiv tags the subscriber with utm_source=auny.media so music-site
// signups can be filtered separately from mindnmachine.nl signups.

const PUBLICATION_ID = 'pub_f468c8eb-98c8-44fa-888e-6b366b116e09';
const BEEHIIV_ENDPOINT = `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'server_misconfigured' });
  }

  // Vercel parses JSON bodies automatically when Content-Type: application/json
  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
  const email = String(body.email || '').trim().toLowerCase();
  const honeypot = String(body.website || '');

  // Honeypot — bots fill hidden fields, humans don't see them.
  if (honeypot) return res.status(200).json({ ok: true });

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'invalid_email' });
  }

  try {
    const r = await fetch(BEEHIIV_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        send_welcome_email: true,
        reactivate_existing: true,
        utm_source: 'auny.media',
        utm_medium: 'footer_form',
        utm_campaign: 'music_site',
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      console.error('beehiiv error', r.status, text);
      return res.status(502).json({ error: 'upstream_error' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('subscribe handler error', err);
    return res.status(500).json({ error: 'unknown' });
  }
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
