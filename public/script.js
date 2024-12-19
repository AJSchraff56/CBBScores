document.addEventListener("DOMContentLoaded", async () => {
    const conferenceFilter = document.getElementById("conferenceFilter");
    const conferenceScores = document.getElementById("conferenceScores");
    const conferenceTitle = document.getElementById("conferenceTitle");
    const top25Scores = document.getElementById("top25Scores");
    let selectedConference = "all";
    const pageSize = 4;
    let top25Data = [];
    let conferenceData = [];

    async function fetchScores() {
        const response = await fetch("/scores");
        const { top25, games } = await response.json();
        top25Data = top25;
        conferenceData = games;
        populateDropdown();
        displayTop25();
    }

    function populateDropdown() {
        const conferences = [
            ...new Set(conferenceData.flatMap((game) => game.teams.map((team) => team.conferenceName)))
        ].sort();
        conferenceFilter.innerHTML = `<option value="all">All Conferences</option>`;
        conferences.forEach((conference) => {
            conferenceFilter.innerHTML += `<option value="${conference}">${conference}</option>`;
        });
    }

    function displayTop25() {
        top25Scores.innerHTML = top25Data
            .slice(0, pageSize)
            .map(
                (game) => `
                <div class="game-card">
                    ${game.matchup}
                </div>
            `
            )
            .join("");
    }

    conferenceFilter.addEventListener("change", () => {
        selectedConference = conferenceFilter.value;
    });

    fetchScores();
});
