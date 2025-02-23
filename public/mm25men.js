console.log("script.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM content loaded");

 // Custom team names mapping
const customTeamNames = {
    "E Illinois": "Eastern Illinois",
    "G Washington": "George Washington",
    "Wichita St": "Wichita State",
    "UAlbany": "Albany",
    "Morehead St": "Morehead State",
    "W Michigan": "Western Michigan",
    "Michigan St": "Michigan State",
    "C Michigan": "Central Michigan",
    "N Illinois": "NIU",
    "Miami OH": "Miami",
    "E Michigan": "Eastern Michigan",
    "S Illinois": "SIU",
    "So Indiana": "Southern Indiana",
    "Fresno St": "Fresno State",
    "Colorado St": "Colorado State",
    "San José St": "San José State",
    "San Diego St": "San Diego State",
    "Pitt": "Pittsburgh",













    // Add more custom mappings as needed
};

// Utility to get the custom team name
function getCustomTeamName(name) {
    return customTeamNames[name] || name;
}


    // NCAA Team Colors Mapping
    const teamColors = {
        // Add colors here based on Wikipedia data
            "Air Force": "#0061AA",
            "Akron": "#000E41",
            "Alabama": "#A80532",
            "Alabama A&M": "#750000",
            "Alabama St": "#FECB09",
            "Albany": "#3D2777",
            "Alcorn St": "#42094A",
            "American University": "#C41130",
            "App State": "#000000",
            "Arizona": "#003559",
            "Arizona St": "#96203D",
            "Arkansas": "#CD1041",
            "Arkansas Pine-Bluff": "#000000",
            "Arkansas St": "#ED1B2E",
            "Arkansas-Little Rock": "#AD0000",
            "Army": "#D19D00",
            "Auburn": "#172240",
            "Austin Peay": "#8E0B0B",
            "Ball St": "#DA0000",
            "Baylor": "#008649",
            "Belmont": "#2A3F76",
            "Bethune": "#841B35",
            "Binghamton": "#006F53",
            "Boise St": "#2D4492",
            "Boston College": "#821E1E",
            "Boston University": "#DD072E",
            "Bowling Green": "#4E2400",
            "Bradley": "#FF151A",
            "Brigham Young": "#002D62",
            "Brown": "#543019",
            "Bryant University": "#702D07",
            "Bucknell": "#000064",
            "Buffalo": "#0068B4",
            "Butler": "#0D1361",
            "Cal Poly": "#123C31",
            "Cal St Bakersfield": "#005DAB",
            "Cal St Fullerton": "#003768",
            "Cal St Northridge": "#CD1041",
            "California": "#003768",
            "Campbell": "#000000",
            "Canisius": "#002859",
            "Centenary": "#A20B36",
            "Central Arkansas": "#4F2683",
            "Central Connecticut St": "#1B49A2",
            "Central Michigan": "#780006",
            "Charleston": "#B5A172",
            "Charleston So": "#00447C",
            "Charlotte": "#006331",
            "Chattanooga": "#EEB311",
            "Chicago St": "#006700",
            "Cincinnati": "#000000",
            "The Citadel": "#002B5C",
            "Clemson": "#F06014",
            "Cleveland St": "#00573D",
            "Coastal Car": "#009297",
            "Colgate": "#8B011D",
            "Colorado": "#D9C994",
            "Colorado St": "#008C75",
            "Columbia": "#7CC2F1",
            "UConn": "#0A1D5A",
            "Coppin St": "#2E3192",
            "Cornell": "#D60027",
            "Creighton": "#192DAA",
            "Dartmouth": "#005730",
            "Davidson": "#000000",
            "Dayton": "#151A66",
            "Delaware": "#01539B",
            "Delaware St": "#F11A2D",
            "Denver": "#98002E",
            "DePaul": "#336698",
            "Detroit Mercy": "#1C64A4",
            "Drake": "#0053A0",
            "Drexel": "#010160",
            "Duke": "#004C7D",
            "Duquesne": "#002D62",
            "East Carolina": "#4A1F68",
            "ETSU": "#025BA3",
            "Eastern Illinois": "#000000",
            "Eastern Kentucky": "#730B27",
            "Eastern Michigan": "#0B5F24",
            "Eastern Washington": "#D72E34",
            "Elon": "#040404",
            "Evansville": "#663399",
            "Fairfield": "#181111",
            "Fairleigh Dickinson": "#004898",
            "Florida": "#2139CE",
            "Florida A&M": "#F89728",
            "Florida Atlantic": "#004B85",
            "Florida Gulf Coast": "#702D07",
            "Florida International": "#002D62",
            "Florida St": "#900028",
            "Fordham": "#830032",
            "Fresno St": "#00427A",
            "Furman": "#3A1769",
            "Gardner-Webb": "#BF2C37",
            "George Mason": "#006539",
            "G Washington": "#063065",
            "Georgetown": "#49487C",
            "Georgia": "#A0000B",
            "GA Southern": "#003775",
            "Georgia St": "#005DAA",
            "Georgia Tech": "#160A06",
            "Gonzaga": "#2D2161",
            "Grambling St": "#F88400",
            "Green Bay": "#006F51",
            "Hampton": "#0067AC",
            "Hartford": "#ED1B2E",
            "Harvard": "#C41130",
            "Hawaii": "#004231",
            "High Point": "#AAB3B8",
            "Hofstra": "#0756A4",
            "Holy Cross": "#090909",
            "Houston": "#C90822",
            "Houston Baptist": "#702D07",
            "Howard": "#EE3A43",
            "Idaho": "#000000",
            "Idaho St": "#FF8400",
            "Illinois": "#F5873C",
            "Illinois St": "#E61731",
            "Illinois-Chicago": "#234077",
            "Indiana": "#A82B3D",
            "Indiana St": "#00669A",
            "Iona": "#910126",
            "Iowa": "#000000",
            "Iowa St": "#840A2C",
            "Purdue FW": "#1B3F95",
            "IU Indy": "#A81F30",
            "Jackson St": "#123297",
            "Jacksonville": "#008568",
            "Jacksonville St": "#E53F40",
            "James Madison": "#263997",
            "Kansas": "#006AB5",
            "Kansas St": "#633194",
            "Kennesaw St": "#F0B410",
            "Kent St": "#131149",
            "Kentucky": "#003399",
            "La Salle": "#000F4C",
            "Lafayette": "#9A0024",
            "Lamar": "#231F20",
            "Lehigh": "#994708",
            "Liberty": "#02298A",
            "Lipscomb": "#122A65",
            "Long Beach St": "#000000",
            "Long Island": "#000000",
            "Longwood": "#004990",
            "Louisiana Tech": "#006AB5",
            "Louisiana-Lafayette": "#D73347",
            "Louisiana-Monroe": "#231F20",
            "Louisville": "#FD0B20",
            "Loyola": "#9E0E43",
            "LSU": "#33297B",
            "Maine": "#2E8DC4",
            "Manhattan": "#528C39",
            "Marist": "#EF1216",
            "Marquette": "#002F78",
            "Marshall": "#01592F",
            "Maryland": "#D5002B",
            "Maryland-Eastern Shore": "#98012E",
            "UMass": "#9F011A",
            "McNeese": "#FFD51D",
            "Memphis": "#2A2A9B",
            "Mercer": "#FF7F27",
            "Miami (FL)": "#003E24",
            "Miami (OH)": "#C60808",
            "Michigan": "#272341",
            "Michigan St": "#1C453A",
            "Middle Tennessee": "#0079C2",
            "Milwaukee": "#000000",
            "Minnesota": "#7F011B",
            "Ole Miss": "#002C91",
            "Mississippi St": "#762123",
            "Mississippi Valley St": "#054105",
            "Missouri": "#231F20",
            "Missouri St": "#5F0000",
            "Monmouth": "#051844",
            "Montana": "#751D4A",
            "Montana St": "#003875",
            "Morehead St": "#094FA3",
            "Morgan St": "#014786",
            "Mount St. Mary's": "#005596",
            "Murray St": "#002148",
            "NJIT": "#EE3024",
            "Navy": "#131630",
            "Nebraska": "#F20017",
            "Nevada": "#153E5F",
            "New Hampshire": "#004990",
            "New Mexico": "#D41045",
            "New Mexico St": "#891216",
            "New Orleans": "#2B3986",
            "Niagara": "#69207E",
            "Nicholls": "#C41230",
            "Norfolk St": "#046546",
            "UNC": "#98BFE5",
            "North Carolina A&T": "#0505AA",
            "North Carolina Central": "#880023",
            "NC State": "#EF1216",
            "UNC Asheville": "#156199",
            "UNC Wilmington": "#1D2F68",
            "North Dakota": "#702D07",
            "North Dakota St": "#01402A",
            "North Florida": "#0A548D",
            "North Texas": "#00853D",
            "Northeastern": "#CC0001",
            "Northern Arizona": "#003976",
            "Northern Colorado": "#13558D",
            "Northern Illinois": "#F1122C",
            "Northern Iowa": "#473282",
            "Northwestern": "#393996",
            "N'Western St": "#492F91",
            "Notre Dame": "#00122B",
            "Oakland": "#998448",
            "Ohio": "#295A29",
            "Ohio State": "#DE3121",
            "Oklahoma": "#BA0034",
            "Oklahoma St": "#FF6500",
            "Old Dominion": "#00507D",
            "Oral Roberts": "#002E70",
            "Oregon": "#044520",
            "Oregon St": "#000203",
            "Pacific": "#F47820",
            "Penn State": "#00265D",
            "Pennsylvania": "#082A74",
            "Pepperdine": "#003A72",
            "Pittsburgh": "#003263",
            "Portland": "#0E034E",
            "Portland St": "#005E60",
            "Prairie View A&M": "#5A185C",
            "Presbyterian": "#194896",
            "Princeton": "#F9A13A",
            "Providence": "#000000",
            "Purdue": "#B89D29",
            "Quinnipiac": "#041B43",
            "Radford": "#BC1515",
            "Rhode Island": "#3691C6",
            "Rice": "#003D7D",
            "Richmond": "#9E0712",
            "Rider": "#A80532",
            "Robert Morris": "#00214D",
            "Rutgers": "#EE363D",
            "Sacramento St": "#00573C",
            "Sacred Heart": "#CE1040",
            "Saint Joseph's": "#C2071B",
            "Saint Louis": "#00539C",
            "Saint Mary's": "#003768",
            "Sam Houston St": "#F78F1E",
            "Samford": "#005485",
            "San Diego": "#2f99d4",
            "San Diego St": "#231F20",
            "San Francisco": "#22523F",
            "San Jose St": "#005893",
            "Santa Clara": "#690B0B",
            "Savannah St": "#280298",
            "Seattle": "#BF2E1A",
            "Seton Hall": "#0857B1",
            "Siena": "#037961",
            "SIU-Edwardsville": "#BC9B6A",
            "South Alabama": "#003E7E",
            "South Carolina": "#CD0000",
            "South Carolina St": "#7E1812",
            "South Dakota": "#CD1241",
            "S Dakota St": "#005DAB",
            "South Florida": "#004A36",
            "Southeast Missouri St": "#E2373E",
            "Southeastern Louisiana": "#007550",
            "S Illinois": "#85283D",
            "Southern Methodist": "#E32F38",
            "Southern Miss": "#FFAA3C",
            "Southern": "#004B97",
            "Southern Utah": "#D12947",
            "St. Bonaventure": "#70261D",
            "St. Francis (NY)": "#113682",
            "St. Francis (PA)": "#F41650",
            "St. John's": "#D31145",
            "St. Peter's": "#004CC2",
            "Stanford": "#A80532",
            "SF Austin": "#393996",
            "Stetson": "#18581C",
            "Stony Brook": "#115F9A",
            "Syracuse": "#002D62",
            "TCU": "#3C377D",
            "Temple": "#A80532",
            "Tennessee": "#EE9627",
            "Tennessee St": "#383C84",
            "Tennessee Tech": "#5A4099",
            "Tennessee-Martin": "#FF6700",
            "Texas": "#EE7524",
            "Texas A&M": "#5C0025",
            "Texas A&M-CC": "#014B80",
            "Texas Southern": "#6A0403",
            "Texas St": "#744143",
            "Texas Tech": "#C80025",
            "UT Arlington": "#004B7C",
            "Texas-Pan American": "#DC6000",
            "Texas-San Antonio": "#002A5C",
            "Toledo": "#00488F",
            "Towson": "#FFC229",
            "Troy": "#AE0210",
            "Tulane": "#005837",
            "Tulsa": "#004371",
            "UAB": "#054338",
            "UC Davis": "#183563",
            "UC Irvine": "#002B5C",
            "UC Riverside": "#14234F",
            "UC Santa Barbara": "#1D1160",
            "UCF": "#231F20",
            "UCLA": "#005C8E",
            "UMBC": "#221F1F",
            "UMKC": "#005486",
            "UNC Greensboro": "#003559",
            "UNLV": "#231E1F",
            "USC": "#AE2531",
            "SC Upstate": "#702D07",
            "Utah": "#CD1041",
            "Utah St": "#003263",
            "Utah Valley": "#004812",
            "UTEP": "#002843",
            "Valparaiso": "#794500",
            "Vanderbilt": "#000000",
            "Vermont": "#013C24",
            "Villanova": "#123d7C",
            "Virginia": "#00204E",
            "Virginia Commonwealth": "#7D7D7A",
            "Virginia Military Institute": "#000000",
            "Virginia Tech": "#74232D",
            "Wagner": "#00483A",
            "Wake Forest": "#000000",
            "Washington": "#2B2F64",
            "Washington St": "#97002F",
            "Weber St": "#29086B",
            "West Virginia": "#FFC600",
            "W Carolina": "#492F91",
            "W Illinois": "#6812BB",
            "W Kentucky": "#F32026",
            "W Michigan": "#7E3E09",
            "Wichita St": "#101008",
            "William & Mary": "#103217",
            "Winthrop": "#9E0B0E",
            "Wisconsin": "#A00000",
            "Wofford": "#000000",
            "Wright St": "#006F53",
            "Wyoming": "#533B22",
            "Xavier": "#002144",
            "Yale": "#004A81",
            "Youngstown St": "#E51937"
        }

    // Fallback colors
    const defaultColor1 = "#333"; // Default dark gray
    const defaultColor2 = "#444"; // Default slightly lighter gray

    // Function to calculate the refresh interval
     function calculateRefreshInterval() {
        const totalPages = Math.ceil(top25Data.length / pageSize);
        return totalPages * 10000; // 10 seconds per page
    }

   // Function to start auto-refresh
    let refreshIntervalId;
    function startAutoRefresh() {
        if (refreshIntervalId) clearInterval(refreshIntervalId);
        const refreshInterval = calculateRefreshInterval();
        console.log(`Setting refresh interval to ${refreshInterval / 1000} seconds`);
        refreshIntervalId = setInterval(() => {
            fetchScores().then(() => {
                // Adjust refresh interval if data size changes
                const newRefreshInterval = calculateRefreshInterval();
                if (newRefreshInterval !== refreshInterval) {
                    startAutoRefresh();
                }
            });
        }, refreshInterval);
    }
    // Fetch scores from the backend
    async function fetchScores() {
        try {
            console.log("Fetching scores...");
            const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=500&groups=50');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("API Data Fetched:", data);

         

const games = data.events.map(event => {
    const competition = event.competitions[0];
    return {
        matchup: event.name,
        teams: competition.competitors.map(team => {
            const overallRecord = team.records?.find(r => r.name === "overall")?.summary || "N/A";
            return {
                name: getCustomTeamName(team.team.shortDisplayName),
                score: team.score || "0",
                logo: team.team.logo || '',
                rank: team.curatedRank?.current || null,
                record: overallRecord,
            };
        }),
        status: event.status.type.shortDetail || "Scheduled",
    };
});

console.log("Mapped Games:", games);

    

            updateScores(games);
        } catch (error) {
            console.error('Error fetching scores:', error);
            scoresContainer.innerHTML = '<p>Error loading scores</p>';
        }
    }
    

    function updateScores(games) {
        scoresContainer.innerHTML = '';
        games.forEach(game => {
            const card = createGameCard(game);
            scoresContainer.appendChild(card);
        });
    }

function createGameCard(game) {
        const [team1, team2] = game.teams;

        const team1Color = teamColors[team1.name] || defaultColor1;
        const team2Color = teamColors[team2.name] || defaultColor2;

        const team1Name = getCustomTeamName(team1.name);
        const team2Name = getCustomTeamName(team2.name);

        const card = document.createElement('div');
        card.className = 'game-card';
        card.style.background = `linear-gradient(135deg, ${team2Color}, ${team1Color})`;

        function convertToLocalTime(estTime) {
            const [time, period] = estTime.split(' ').slice(0, 2);
            if (!time || !period) return "Invalid Time";

            const [hours, minutes] = time.split(':').map(Number);

            let estHours = hours;
            if (period === "PM" && hours !== 12) estHours += 12;
            if (period === "AM" && hours === 12) estHours = 0;

            const now = new Date();

            const estDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), estHours + 5, minutes));

            return estDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
        }

        let displayStatus = '';
        if (game.status.includes('1st') || game.status.includes('2nd') || game.status.includes('3rd') || game.status.includes('4th') || game.status.includes('OT') || game.status.includes('2OT')) {
            displayStatus = game.status;
        } else if (game.status.includes('-')) {
            const timeString = game.status.split('-')[1]?.trim();
            displayStatus = convertToLocalTime(timeString);
        } else {
            displayStatus = game.status;
        }

        card.innerHTML = `
            <div class="team-left">
                <div class="team-logo-container">
                    <img src="${team2.logo}" alt="${team2.name}" class="team-logo" />
                    <div class="record">${team2.record}</div>
                </div>
                <div>
                    <div class="team-name">#${team2.rank} ${team2.name}</div>
                    <div class="score">${team2.score}</div>
                </div>
            </div>
            <div class="status-wrapper">
                <div class="status">${displayStatus}</div>
            </div>
            <div class="team-right">
                <div class="team-logo-container">
                    <img src="${team1.logo}" alt="${team1.name}" class="team-logo" />
                    <div class="record">${team1.record}</div>
                </div>
                <div>
                    <div class="team-name">#${team1.rank} ${team1.name}</div>
                    <div class="score">${team1.score}</div>
                </div>
            </div>
        `;
        return card;
    }

    function startAutoRefresh() {
    if (refreshIntervalId) clearInterval(refreshIntervalId);
    const refreshInterval = 20000; // 20 seconds in milliseconds
    console.log(`Setting refresh interval to ${refreshInterval / 1000} seconds`);
    refreshIntervalId = setInterval(() => {
        fetchScores().then(() => {
            // No need to adjust refresh interval since it's constant
        });
    }, refreshInterval);
}

    fetchScores().then(() => {
        startAutoRefresh();
    });
});

