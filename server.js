const https = require('https');
https.globalAgent.options.secureProtocol = 'TLSv1_2_method';
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 1000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// BB Users array
const users = [
    { username: 'admin', password: 'B!$hyB0y1028!', isAdmin: true },
    { username: 'user1', password: 'B!$hyB0y1028!', isAdmin: false },
    { username: 'GWAthletics', password: 'G0Rev$2025', isAdmin: false },
    { username: 'UDAthletics', password: 'GoFly3r$2025', isAdmin: false },
    { username: 'AuburnAthletics', password: 'G0+!ger$', isAdmin: false },
];

// New user array for bsbscores.html and sbscores.html
const bsbUsers = [
    { username: 'bsbAdmin', password: 'BsbS3cret!', isAdmin: true },
    { username: 'bsbUser1', password: 'B!ShyB0y1028!', isAdmin: false },
    
];

// Conference Mapping
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
    62: "American Athletic",
};

// Middleware for authentication
function checkAuth(req, res, next) {
    if (req.session && req.session.user) {
        console.log(`User authenticated: ${req.session.user.username}`);
        next();
    } else {
        res.status(401).sendFile(path.join(__dirname, 'public', 'login.html'));
    }
}

// Middleware for bsb authentication
function checkBsbAuth(req, res, next) {
    if (req.session && req.session.bsbUser) {
        console.log(`BSB User authenticated: ${req.session.bsbUser.username}`);
        next();
    } else {
        res.status(401).sendFile(path.join(__dirname, 'public', 'login.html'));
    }
}

// Middleware for bsb admin access
function checkBsbAdmin(req, res, next) {
    if (req.session && req.session.bsbUser && req.session.bsbUser.isAdmin) {
        console.log(`BSB Admin access granted: ${req.session.bsbUser.username}`);
        next();
    } else {
        res.status(403).send('Forbidden: Admins only');
    }
}

// Middleware for admin access
function checkAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.isAdmin) {
        console.log(`Admin access granted: ${req.session.user.username}`);
        next();
    } else {
        res.status(403).send('Forbidden: Admins only');
    }
}

// Update the login endpoint to handle routing to bsbscores.html
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    const bsbUser = bsbUsers.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user;
        console.log(`Login successful: ${username}`);
        
        res.status(200).send({ message: 'Login successful', isAdmin: user.isAdmin });
    } else if (bsbUser) {
        req.session.bsbUser = bsbUser;
        console.log(`BSB Login successful: ${username}`);
        
        res.status(200).send({ message: 'Login successful', isAdmin: bsbUser.isAdmin });
    } else {
        console.log(`Login failed for: ${username}`);
        res.status(401).send('Invalid username or password');
    }
});

// Add this route for bsbindex.html
app.get('/bsbindex.html', checkBsbAuth, (req, res) => {
    if (req.session.bsbUser.isAdmin) {
        res.redirect('/bsbadmin.html');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'bsbindex.html'));
    }
});

// Add this route for sbscores.html
app.get('/sbscores.html', checkBsbAuth, (req, res) => {
    if (req.session.bsbUser.isAdmin) {
        res.redirect('/bsbadmin.html');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'sbscores.html'));
    }
});

// Serve bsbadmin.html
app.get('/bsbadmin.html', checkBsbAuth, checkBsbAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bsbadmin.html'));
});

// Update routes to include a check for admin users
app.get('/mscores.html', checkAuth, (req, res) => {
    if (req.session.user.isAdmin) {
        res.redirect('/admin.html');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'mscores.html'));
    }
});

app.get('/wscores.html', checkAuth, (req, res) => {
    if (req.session.user.isAdmin) {
        res.redirect('/admin.html');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'wscores.html'));
    }
});

// Serve admin.html
app.get('/admin.html', checkAuth, checkAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Logout endpoint
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Failed to logout');
        }
        res.clearCookie('connect.sid');
        res.status(200).send('Logout successful');
    });
});

// Scores Endpoint
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Disable SSL verification (not recommended for production)
    }),
});

app.get('/mscores', checkAuth, async (req, res) => {
    console.log('GET /mscores route called');
    try {
        const response = await axiosInstance.get('https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard', {
            params: { groups: 50, dates: new Date().toISOString().split('T')[0].replace(/-/g, '') },
        });

        const games = response.data.events.map(event => {
            const competition = event.competitions[0];
            return {
                matchup: event.name,
                teams: competition.competitors.map(team => ({
                    name: team.team.shortDisplayName,
                    score: team.score || "0",
                    logo: team.team.logo || '',
                    rank: team.curatedRank ? team.curatedRank.current : null,
                    record: team.records?.find(r => r.name === "overall")?.summary || "N/A",
                    conferenceId: parseInt(team.team.conferenceId, 10),
                    conferenceName: conferenceMapping[team.team.conferenceId] || "Unknown",
                })),
                status: event.status.type.shortDetail || "Scheduled",
            };
        });

        const top25Games = games.filter(game =>
            game.teams.some(team => team.rank && team.rank >= 1 && team.rank <= 25)
        );

        res.json({ top25: top25Games, games });
    } catch (error) {
        console.error('Error fetching scores:', error.message);
        res.status(500).send('Failed to fetch scores');
    }
});

app.get('/wscores', checkAuth, async (req, res) => {
    console.log('GET /wscores route called');
    try {
        const response = await axiosInstance.get('https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/scoreboard', {
            params: { groups: 50, dates: new Date().toISOString().split('T')[0].replace(/-/g, '') },
        });

        const games = response.data.events.map(event => {
            const competition = event.competitions[0];
            return {
                matchup: event.name,
                teams: competition.competitors.map(team => ({
                    name: team.team.shortDisplayName,
                    score: team.score || "0",
                    logo: team.team.logo || '',
                    rank: team.curatedRank ? team.curatedRank.current : null,
                    record: team.records?.find(r => r.name === "overall")?.summary || "N/A",
                    conferenceId: parseInt(team.team.conferenceId, 10),
                    conferenceName: conferenceMapping[team.team.conferenceId] || "Unknown",
                })),
                status: event.status.type.shortDetail || "Scheduled",
            };
        });

        const top25Games = games.filter(game =>
            game.teams.some(team => team.rank && team.rank >= 1 && team.rank <= 25)
        );

        res.json({ top25: top25Games, games });
    } catch (error) {
        console.error("Error fetching women's scores:", error.message);
        res.status(500).send('Failed to fetch scores');
    }
});

// Get all users
app.get('/users', checkAuth, checkAdmin, (req, res) => {
    res.json(users);
});

// Add a new user
app.post('/users', checkAuth, checkAdmin, (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    users.push({ username, password, isAdmin: false });
    res.status(201).send('User added successfully');
});

// Remove a user
app.delete('/users/:username', checkAuth, checkAdmin, (req, res) => {
    const { username } = req.params;
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex > -1) {
        users.splice(userIndex, 1);
        res.status(200).send('User removed successfully');
    } else {
        res.status(404).send('User not found');
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
