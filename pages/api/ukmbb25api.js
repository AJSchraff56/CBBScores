export default async function handler(req, res) {
  const API_URL =
    'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=500&groups=50';

  const escapePointer = (segment) =>
    String(segment).replace(/~/g, '~0').replace(/\//g, '~1');

  const q = (name) => {
    const v = req.query?.[name];
    if (Array.isArray(v)) return v[0];
    return v;
  };

  const dateFilter = q('date'); // Format: YYYY-MM-DD
  const conferenceIdFilter = q('conferenceId'); // Format: string
  const idFilter = q('id'); // Format: string

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const competitions = data?.events?.flatMap(event => event.competitions || []) || [];

    const filteredCompetitions = competitions.filter(comp => {
      const matchDate = dateFilter
        ? comp.date?.startsWith(dateFilter)
        : true;

      const matchId = idFilter
        ? comp.id === idFilter
        : true;

      const matchConference = conferenceIdFilter
        ? comp.competitors?.some(c => c.team?.conferenceId === conferenceIdFilter)
        : true;

      return matchDate && matchId && matchConference;
    });

    res.status(200).json({ competitions: filteredCompetitions });
  } catch (error) {
    console.error('Error fetching or filtering data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

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
