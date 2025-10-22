// pages/api/ukmbb25api.js
export default async function handler(req, res) {
  const API_URL =
    'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=500&groups=50';

  // Utility: escape a JSON Pointer segment per RFC 6901
  const escapePointer = (segment) =>
    String(segment).replace(/~/g, '~0').replace(/\//g, '~1');

  // Helper to coerce query values that may be arrays (Next.js behavior)
  const q = (name) => {
    const v = req.query?.[name];
    if (Array.isArray(v)) return v[0];
    return v;
  };

  // Build an index of locations (JSON Pointers) for objects that have id or uid
  // and also build friendly groupings / event summaries for easier visual scanning.
  const buildIndex = (node, path, index) => {
    if (Array.isArray(node)) {
      node.forEach((item, i) => buildIndex(item, `${path}/${i}`, index));
      return;
    }
    if (node && typeof node === 'object') {
      // Record by id/uid/type if present
      if (node.id !== undefined || node.uid !== undefined) {
        const idKey = node.id !== undefined ? String(node.id) : null;
        const uidKey = node.uid !== undefined ? String(node.uid) : null;
        if (idKey) index.byId[idKey] = path;
        if (uidKey) index.byUid[uidKey] = path;

        const t = node.type || 'unknown';
        if (!index.byType[t]) index.byType[t] = {};
        if (idKey) index.byType[t][idKey] = path;
      }

      // If this node looks like an "event" (by type or because it's inside /events/),
      // capture a lightweight summary to make scanning easier.
      const isEventLike =
        (typeof node.type === 'string' && node.type.toLowerCase() === 'event') ||
        path.includes('/events/');
      if (isEventLike) {
        // Try to derive an event id (prefer numeric id, else uid)
        const eventId = node.id !== undefined ? String(node.id) : node.uid || null;
        if (eventId) {
          // Avoid overwriting if summary already exists (first one wins)
          if (!index.events[eventId]) {
            // Date: try well-known fields
            const date = node.date || node.startDate || (node.competitions && node.competitions[0]?.date) || null;

            // Status: try a few fields ESPN uses
            const status =
              (node.status && (node.status.type?.state || node.status.type?.name || node.status.type)) ||
              node.status?.detail ||
              node.status?.description ||
              null;

            // Name: prefer node.name/shortName; else try to synthesize from competitors
            let name = node.name || node.shortName || node.displayName || null;
            const competitors = [];

            try {
              // Many ESPN event objects contain competitions -> competitors -> team
              const comp = node.competitions && node.competitions[0];
              if (comp && Array.isArray(comp.competitors)) {
                for (const c of comp.competitors) {
                  const teamObj = c.team || {};
                  const compId = c.id ?? teamObj.id ?? null;
                  const compUid = c.uid ?? teamObj.uid ?? null;
                  const teamName =
                    teamObj.displayName ||
                    teamObj.shortDisplayName ||
                    teamObj.name ||
                    c.name ||
                    null;
                  competitors.push({
                    id: compId !== null ? String(compId) : null,
                    uid: compUid !== null ? String(compUid) : null,
                    homeAway: c.homeAway || null,
                    pointer: compId ? index.byId[String(compId)] || null : null,
                    teamName,
                  });
                }
              }
            } catch (e) {
              // ignore extraction errors, keep competitors empty
            }

            if (!name && competitors.length) {
              // synthesize something like "A at B" if we can determine home/away
              const home = competitors.find((c) => c.homeAway === 'home') || competitors[1] || competitors[0];
              const away = competitors.find((c) => c.homeAway === 'away') || competitors[0] || competitors[1] || competitors[0];
              const hName = home?.teamName || 'Home';
              const aName = away?.teamName || 'Away';
              name = `${aName} at ${hName}`;
            }

            index.events[eventId] = {
              pointer: path,
              uid: node.uid || null,
              date,
              name,
              status,
              competitionsCount: node.competitions ? node.competitions.length : 0,
              competitors,
            };

            // Help quick enumeration by top-level grouping
            index.grouped.events.push(path);
          }
        } else {
          // If there's no id, but it's event-like, still add path to grouped listing
          if (!index.grouped.events.includes(path)) index.grouped.events.push(path);
        }
      }

      // Group pointers by the top-level path segment for quick enumeration.
      // Example: "/leagues/0/..." => group "leagues", "/events/..." => "events"
      if (path) {
        const seg = path.split('/').filter(Boolean)[0]; // first non-empty segment
        if (seg) {
          if (!index.grouped[seg]) index.grouped[seg] = [];
          if (!index.grouped[seg].includes(path)) index.grouped[seg].push(path);
        }
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
      byId: {}, // maps numeric/string id -> JSON Pointer (e.g. "/leagues/0/groups/0/events/1")
      byUid: {}, // maps uid -> JSON Pointer
      byType: {}, // maps type -> { id: pointer, ... }
      events: {}, // friendly event summaries keyed by event id or uid
      grouped: {
        // grouped lists of pointers by top-level segment; events also has a list
        events: [],
      },
    };

    // Build the index / summaries
    buildIndex(data, '', index);

    // Query params to control output:
    // - pretty=true => pretty-print entire response
    // - pretty=index => pretty-print only index; data still included but compact
    // - indexOnly=true => return only index (useful for quick lookups)
    // Normalize query params
    // Turn on pretty printing by default. Use ?pretty=false to disable.
    const prettyRaw = q('pretty');
    const pretty = (prettyRaw === undefined || prettyRaw === null) ? 'true' : prettyRaw;

    const indexOnlyRaw = q('indexOnly');
    const indexOnlyFlag =
      indexOnlyRaw === true ||
      indexOnlyRaw === 'true' ||
      indexOnlyRaw === '1' ||
      (typeof indexOnlyRaw === 'string' && indexOnlyRaw.toLowerCase() === 'yes');

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Return according to requested format
    if (indexOnlyFlag) {
      if (pretty === 'true' || pretty === '1' || pretty === 'yes') {
        return res.status(200).send(JSON.stringify(index, null, 2));
      }
      return res.status(200).json(index);
    }

    if (pretty === 'index') {
      const payload = { index, data: '<raw data omitted for readability; use ?pretty=true to view full data>' };
      return res.status(200).send(JSON.stringify(payload, null, 2));
    }

    if (pretty === 'true' || pretty === '1' || pretty === 'yes') {
      return res.status(200).send(JSON.stringify({ index, data }, null, 2));
    }

    // default: compact JSON with index + original data
    return res.status(200).json({ index, data });
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(502).json({ error: 'Failed to fetch upstream API' });
  }
}
