
const pageSize = 5;
const leftColumnContainer = document.getElementById('leftColumn');
const rightColumnContainer = document.getElementById('rightColumn');


async function fetchScores() {
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    const games = data.events.map(event => {
      const competition = event.competitions[0];
      const teams = competition.competitors.map(team => ({
        name: team.team.shortDisplayName,
        score: team.score ?? "0",
        logo: team.team.logo ?? 'https://i.ibb.co/zhvf878M/convert.png',
        homeAway: team.homeAway,
      }));

      return {
        name: event.name,
        date: event.date,
        status: event.status.type.shortDetail ?? "Scheduled",
        downDistanceText: competition.situation?.downDistanceText ?? "",
        possessionTeamId: competition.situation?.possession ?? null,
        teams: teams,
      };
    });

    const prioritizedGames = games.sort((a, b) => {
      const statusOrder = { 'in': 0, 'scheduled': 1, 'final': 2 };
      const getStatusCategory = status => {
        if (status.match(/1st|2nd|3rd|4th|OT/)) return 'in';
        if (status.includes('-')) return 'scheduled';
        return 'final';
      };
      return statusOrder[getStatusCategory(a.status)] - statusOrder[getStatusCategory(b.status)];
    });

    renderGames(prioritizedGames.slice(0, 10));
  } catch (error) {
    console.error('Error fetching scores:', error);
  }
}


function renderGames(games) {
  leftColumnContainer.innerHTML = '';
  rightColumnContainer.innerHTML = '';

  const leftGames = games.slice(0, 5);
  const rightGames = games.slice(5, 10);

  leftGames.forEach(game => {
    const card = createGameCard(game);
    leftColumnContainer.appendChild(card);
  });

  rightGames.forEach(game => {
    const card = createGameCard(game);
    rightColumnContainer.appendChild(card);
  });
}

function createGameCard(game) {
  const [team1, team2] = game.teams;

  const card = document.createElement('div');
  card.className = 'game-card';

  const status = formatGameStatus(game);

  card.innerHTML = `
    <div class="team-row">
      <img src="${team1.logo}" class="team-logo" alt="${.name}</div>
      <div class="score">${team1.score}</div>
    </div>
    <div class="status">${status}</div>
    <div class="team-row">
      ${team2.logo}
      <div class="team-name">${team2.name}</div>
      <div class="score">${team2.score}</div>
    </div>
  `;
  return card;
}

function formatGameStatus(game) {
  if (game.status.match(/1st|2nd|3rd|4th|OT/)) {
    return game.status;
  } else if (game.status.includes('-')) {
    const date = new Date(game.date);
    const day = date.toLocaleDateString([], { weekday: 'short' });
    const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${day} - ${time}`;
  } else {
    return game.status;
  }
}

// Initial fetch and refresh every 30 seconds
fetchScores();
setInterval(fetchScores, 30000);
