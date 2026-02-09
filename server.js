import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Enable CORS for frontend dev server
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Serve static files from current directory
app.use(express.static(__dirname));

/**
 * 1. API: Get Current Windows User
 */
app.get('/api/user', (req, res) => {
    const username = process.env.USERNAME;
    const domain = process.env.USERDOMAIN;

    // PowerShell command to get Full Name
    const psCommand = `powershell -Command "([adsi]'WinNT://${domain}/${username},user').FullName"`;

    exec(psCommand, (error, stdout, stderr) => {
        let fullName = stdout.trim();

        // Fallback if PowerShell fails or returns empty
        if (!fullName || error) {
            console.warn("Could not retrieve full name via PowerShell:", error);
            fullName = username; // Just use the login name
        }

        res.json({
            username: username,
            fullName: fullName,
            domain: domain,
            source: "Local Windows Environment"
        });
    });
});

/**
 * 2. Serve the main app
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n---------------------------------------------------`);
    console.log(` EN_SmartApp Local Server Running`);
    console.log(` - URL: http://localhost:${PORT}`);
    console.log(` - User: ${process.env.USERNAME}`);
    console.log(`---------------------------------------------------\n`);
});
