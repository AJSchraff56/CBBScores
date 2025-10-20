// Simple Vercel/Netlify-compatible serverless function
export default async function handler(req, res) {
  const API_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=500&groups=50';

  try {
    const apiRes = await fetch(API_URL, { method: 'GET' });
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: `Upstream API returned ${apiRes.status}` });
    }

    const data = await apiRes.json();

    // Set content-type and caching headers appropriate for Datalinq (no HTML)
    res.setHeader('Content-Type', 'application/json');
    // Short cache to reduce upstream hits but keep data fresh; adjust as needed
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');

    // Optionally allow cross-origin requests (if XPression needs it)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    return res.status(200).send(JSON.stringify(data));
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(502).json({ error: 'Failed to fetch upstream API' });
  }
}
