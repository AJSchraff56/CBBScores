// pages/api/ukmbb25api.js
export default async function handler(req, res) {
  const API_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=500&groups=50';

  // Utility: escape a JSON Pointer segment per RFC 6901
  const escapePointer = (segment) =>
    String(segment).replace(/~/g, '~0').replace(/\//g, '~1');

  // Build an index of locations (JSON Pointers) for objects that have id or uid
  const buildIndex = (node, path, index) => {
    if (Array.isArray(node)) {
      node.forEach((item, i) => buildIndex(item, `${path}/${i}`, index));
      return;
    }
    if (node && typeof node === 'object') {
      // If object has an id or uid, record it
      if (node.id !== undefined || node.uid !== undefined) {
        const idKey = node.id !== undefined ? String(node.id) : null;
        const uidKey = node.uid !== undefined ? String(node.uid) : null;
        if (idKey) index.byId[idKey] = path;
        if (uidKey) index.byUid[uidKey] = path;

        // also group by type if available (makes it easier to find teams/events/games)
        const t = node.type || 'unknown';
        if (!index.byType[t]) index.byType[t] = {};
        if (idKey) index.byType[t][idKey] = path;
      }

      // Recurse into keys
      for (const k of Object.keys(node)) {
        buildIndex(node[k], `${path}/${escapePointer(k)}`, index);
      }
    }
  };

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

    // Build a lightweight index of pointers into the JSON payload so external programs
    // can quickly locate objects by id or uid using JSON Pointer (RFC 6901).
    const index = {
      generatedAt: new Date().toISOString(),
      byId: {},     // maps numeric/string id -> JSON Pointer (e.g. "/leagues/0/groups/0/events/1")
      byUid: {},    // maps uid -> JSON Pointer
      byType: {},   // maps type -> { id: pointer, ... }
    };

    buildIndex(data, '', index);

    // Return structured payload:
    // - index: mapping to JSON Pointers
    // - data: original raw JSON payload (unchanged)
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json({ index, data });
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(502).json({ error: 'Failed to fetch upstream API' });
  }
}
