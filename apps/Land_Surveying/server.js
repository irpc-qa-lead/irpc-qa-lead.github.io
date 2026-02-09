const express = require('express');
const path = require('path');
const open = require('open'); // Optional: to open browser automatically

const app = express();
const PORT = 3001;

// Serve static files (index.html, css, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Since index.html is in the root for now based on your structure, lets serve root too
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`\nTo connect to Google Sheets, make sure to update the 'API_URL' in index.html with your deployed Web App URL.`);
});
