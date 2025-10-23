/**
 * pages/api/ukmbb25api/filterByDate.js
 *
 * Returns a compact list of event summaries for a given date (YYYY-MM-DD).
 * Example: /api/ukmbb25api/filterByDate?date=2025-11-03
 */

export default async function handler(req, res) {
  const date = String(req.query?.date || '').trim();
  if (!date) {
    return res.status(400).json({ error: 'Missing required query parameter: date=YYYY-MM-DD' });
  }

  const BASE = 'https://cbb-scores-flax.vercel.app/api/ukmbb25api';

  // Helper to safely resolve RFC6901 pointer into an object
  function jsonPointerGet(obj, pointer) {
    if (!pointer || pointer === '') return obj;
    return pointer
      .split('/')
      .slice(1)
      .reduce((acc, seg) => {
        seg = seg.replace(/~1/g, '/').replace(/~0/g, '~');
        return acc && Object.prototype.hasOwnProperty.call(acc, seg) ? acc[seg] : undefined;
      }, obj);
  }

  try {
    // Use index-only for speed
    const idxRes = await fetch(`${BASE}?indexOnly=true`);
    if (!idxRes.ok) {
      return res.status(idxRes.status).json({ error: 'Failed to fetch index' });
    }
    const index = await idxRes.json();

    const matches = Object.values(index.events || {}).filter(
      (e) => e?.date && String(e.date).startsWith(date)
    );

    // Convert to explicit home/away shape expected by XPression
    const items = matches.map((e) => {
      const homeComp = (e.competitors || []).find((c) => c.homeAway === 'home') || {};
      const awayComp = (e.competitors || []).find((c) => c.homeAway === 'away') || {};
      return {
        id: e.pointer ? String(e.pointer.split('/').pop()) : null,
        uid: e.uid || null,
        name: e.name || null,
        date: e.date || null,
        status: e.status || null,
        competitionsCount: e.competitionsCount || 0,
        competitors: {
          home: {
            id: homeComp.id || null,
            teamName: homeComp.teamName || null,
            pointer: homeComp.pointer || null,
          },
          away: {
            id: awayComp.id || null,
            teamName: awayComp.teamName || null,
            pointer: awayComp.pointer || null,
          },
        },
        pointer: e.pointer || null,
      };
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ items });
  } catch (err) {
    console.error('filterByDate error:', err);
    return res.status(502).json({ error: 'Failed to fetch or process data' });
  }
}
