const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Data file path
const dataPath = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({
        views: 0,
        submissions: []
    }));
}

// API endpoint to get stats
app.get('/api/stats', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    res.json({
        views: data.views,
        submissions: data.submissions.length
    });
});

// API endpoint to submit form
app.post('/api/submit', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    const submission = {
        ...req.body,
        timestamp: new Date().toISOString()
    };
    
    data.submissions.push(submission);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    
    res.json({ success: true });
});

// Track page views
app.use((req, res, next) => {
    if (req.url.endsWith('.html') || req.url === '/') {
        const data = JSON.parse(fs.readFileSync(dataPath));
        data.views += 1;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    }
    next();
});

// Serve HTML files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});