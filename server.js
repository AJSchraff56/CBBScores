const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const conferenceMapping = {
    1: "America East",
    2: "Atlantic Coast",
    3: "Atlantic 10",
    4: "Big East",
    5: "Big Sky",
    6: "Big South",
    7: "Big Ten",
    8: "Big 12",
    9: "Big West",
    10: "Coastal Athletic",
    11: "Conference USA",
    12: "Ivy League",
    13: "Metro Atlantic Athletic",
    14: "Mid-American",
    16: "Mid-Eastern Athletic",
    18: "Missouri Valley",
    19: "Northeast",
    20: "Ohio Valley",
    22: "Patriot League",
    23: "Southeastern",
    24: "Southern",
    25: "Southland",
    26: "Southwestern Athletic",
    27: "Sun Belt",
    29: "West Coast",
    30: "Western Athletic",
    44: "Mountain West",
    45: "Horizon League",
    46: "Atlantic Sun",
    49: "Summit League",
    62: "American Athletic"
};

// Helper function to fetch games
const fetchDivision1Games = async (date) => {
    try {
        const response = await axios.get(
            `http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard`,
            {
                params: {
                    dates: date,
                    groups: 50,
                    limit: 500
                }
            }
        );

        return response.data.events.map(event => {
            const competition = event.competitions[0];
            return {
                matchup: event.name,
                teams: competition.competitors.map(team => ({
                    name: team.team.shortDisplayName,
                    score: team.score,
                    logo: team.team.logo || '',
                    rank: team.curatedRank ? team.curatedRank.current : null,
                    record: team.records?.find(r => r.name === "overall")?.summary || "N/A",
                    conferenceId: parseInt(team.team.conferenceId, 10) || null,
                    conferenceName: conferenceMapping[parseInt(team.team.conferenceId, 10)] || "Unknown"
                })),
                status: event.status.type.shortDetail
            };
        });
    } catch (error) {
        console.error('Error fetching games:', error.message);
        return [];
    }
};

app.get('/scores', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const games = await fetchDivision1Games(today);

        const top25Games = games.filter(game =>
            game.teams.some(team => team.rank && team.rank >= 1 && team.rank <= 25)
        );

        res.json({ top25: top25Games, games });
    } catch (error) {
        console.error('Error fetching API data:', error.message);
        res.status(500).send('Error fetching scores');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
