// pages/api/ukmbb25api.js
export default async function handler(req, res) {
  const API_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=500&groups=50';
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(204).end();
    }

    const apiRes = await fetch(API_URL);
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: `Upstream API returned ${apiRes.status}` });
    }

    const data = await apiRes.json();

    // Return raw JSON for Datalinq
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(502).json({ error: 'Failed to fetch upstream API' });
  }
}