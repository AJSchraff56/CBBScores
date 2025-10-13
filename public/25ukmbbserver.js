const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/ukmbb25api', async (req, res) => {
  try {
    const apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=500&groups=50';
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch API data.' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
