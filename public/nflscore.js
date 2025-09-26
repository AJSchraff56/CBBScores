let nflIntervalId = null;
let refreshIntervalId = null;
let currentRefreshInterval = null;

console.log("nflscript.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    const leftSide = document.getElementById('leftScores');
    const rightSide = document.getElementById('rightScores');

    if (!leftSide || !rightSide) {
        console.error('Required containers not found. Exiting NFL script.');
        return;
    }

    const pageSize = 5;
    let nflData = [];

    // NFL Team Colors Mapping (abbreviation -> color)
    const teamColors = {
        "ARI": "#a40227",
        "ATL": "#A71930",
        "BAL": "#241773",
        "BUF": "#00338D",
        "CAR": "#0085CA",
        "CHI": "#0B162A",
        "CIN": "#FB4F14",
        "CLE": "#311D00",
        "DAL": "#003594",
        "DEN": "#FB4F14",
        "DET": "#0076B6",
        "GB": "#203731",
        "HOU": "#A71930",
        "IND": "#002C5F",
        "JAX": "#006778",
        "KC": "#E31837",
        "LV": "#000000",
        "LAC": "#0080C6",
        "LAR": "#003594",
        "MIA": "#008E97",
        "MIN": "#4F2683",
        "NE": "#002244",
        "NO": "#D3BC8D",
        "NYG": "#0B2265",
        "NYJ": "#125740",
        "PHI": "#004C54",
        "PIT": "#FFB612",
        "SEA": "#002A5C",
        "SF": "#AA0000",
        "TB": "#D50A0A",
        "TEN": "#4B92DB",
        "WAS": "#5A1414"
    };

    const defaultColor1 = "#222";
    const defaultColor2 = "#444";

    // Calculate refresh interval by number of games
    function calculateRefreshInterval() {
        const totalPages = Math.ceil(nflData.length / (2 * pageSize));
        if (totalPages === 0) return 10000; // fallback 10s
        return totalPages * 10000;
    }

    // Start auto-refresh
    function startAutoRefresh() {
        const refreshInterval = calculateRefreshInterval();
        if (refreshIntervalId && currentRefreshInterval === refreshInterval) return;
        if (refreshIntervalId) clearInterval(refreshIntervalId);

        currentRefreshInterval = refreshInterval;
        console.log(`Setting NFL refresh interval to ${refreshInterval / 1000} seconds`);
        refreshIntervalId = setInterval(fetchScores, refreshInterval);
    }

    // Fetch scores from ESPN NFL API
    async function fetchScores() {
        try {
            console.log("Fetching NFL scores...");
            const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("API Data Fetched:", data);

            nflData = [];

            data.events.forEach(event => {
                const competition = event.competitions[0];
                const teams = competition.competitors.map(team => {
                    const overallRecord = team.records?.find(r => r.name === "overall")?.summary || "0-0";
                    return {
                        name: team.team.displayName,
                        shortName: team.team.shortDisplayName,
                        abbr: team.team.abbreviation,
                        id: team.team.id,
                        score: team.score || "0",
                        logo: team.team.logo || 'https://i.ibb.co/zhvf878M/convert.png',
                        record: overallRecord,
                        color: team.team.color ? `#${team.team.color}` : (teamColors[team.team.abbreviation] || defaultColor1),
                        homeAway: team.homeAway
                    };
                });

                nflData.push({
                    matchup: event.name,
                    teams: teams,
                    status: event.status.type.shortDetail || "Scheduled",
                    date: event.date,
                });
            });

            startNFLCycle();
        } catch (error) {
            console.error('Error fetching scores:', error);
            leftSide.innerHTML = '<p>Error loading NFL scores</p>';
            rightSide.innerHTML = '<p>Error loading NFL scores</p>';
        }
    }

    // Format date/time for scheduled games
    function formatScheduledDateTime(gameDateTimeString) {
        const date = new Date(gameDateTimeString);
        const dayAbbr = date.toLocaleDateString([], { weekday: 'short' });
        const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${dayAbbr}. - ${time}`;
    }

    // Create a NFL Game Card
    function createGameCard(game) {
        const [home, away] = game.teams[0].homeAway === 'home'
            ? [game.teams[0], game.teams[1]]
            : [game.teams[1], game.teams[0]];

        // Team colors or defaults
        const homeColor = home.color || defaultColor1;
        const awayColor = away.color || defaultColor2;

        // Determine what to display in status
        let displayStatus = '';
        if (
            game.status.includes('1st') ||
            game.status.includes('2nd') ||
            game.status.includes('3rd') ||
            game.status.includes('4th') ||
            game.status.includes('OT') ||
            game.status.includes('Halftime')
        ) {
            displayStatus = game.status;
        } else if (game.status.includes('-')) {
            displayStatus = formatScheduledDateTime(game.date);
        } else {
            displayStatus = game.status;
        }

        // Card element
        const card = document.createElement('div');
        card.className = 'game-card';

        card.style.setProperty(
            '--diagonal-bg',
            `linear-gradient(135deg, ${awayColor} 0%, ${awayColor} 20%, ${homeColor} 80%, ${homeColor} 100%)`
        );

        card.innerHTML = `
            <div class="team-left">
                <div class="team-logo-wrapper">
                    <img src="${away.logo}" alt="${away.name}" class="team-logo" />
                    <div class="record">${away.record}</div>
                </div>
                <div>
                    <div class="team-name">${away.name}</div>
                    <div class="score">${away.score}</div>
                </div>
            </div>
            <div class="status-wrapper">
                <div class="status">${displayStatus}</div>
            </div>
            <div class="team-right">
                <div class="team-logo-wrapper">
                    <img src="${home.logo}" alt="${home.name}" class="team-logo" />
                    <div class="record">${home.record}</div>
                </div>
                <div>
                    <div class="team-name">${home.name}</div>
                    <div class="score">${home.score}</div>
                </div>
            </div>
        `;
        return card;
    }

    // Rotate/cycle NFL Scores (5 per side)
    function startNFLCycle() {
        if (nflIntervalId) clearInterval(nflIntervalId);

        if (!nflData.length) {
            leftSide.innerHTML = '<p>No NFL games available.</p>';
            rightSide.innerHTML = '<p>No NFL games available.</p>';
            return;
        }

        const totalPages = Math.ceil(nflData.length / (2 * pageSize));
        let currentPage = 0;

        function updateScores() {
            leftSide.innerHTML = '';
            rightSide.innerHTML = '';
            // Slice 10 games per "page" (5 left, 5 right)
            const start = currentPage * 2 * pageSize;
            const leftGames = nflData.slice(start, start + pageSize);
            const rightGames = nflData.slice(start + pageSize, start + 2 * pageSize);

            leftGames.forEach(game => {
                const card = createGameCard(game);
                leftSide.appendChild(card);
            });
            rightGames.forEach(game => {
                const card = createGameCard(game);
                rightSide.appendChild(card);
            });

            currentPage = (currentPage + 1) % totalPages;
        }

        updateScores();
        nflIntervalId = setInterval(updateScores, 10000);
    }

    // On page load:
    fetchScores().then(() => {
        startAutoRefresh();
    });

});
