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
 * Helper: Get Current User Info (Cross-Platform)
 */
const getUserInfo = (callback) => {
    const isWindows = process.platform === "win32";
    const username = process.env.USERNAME || process.env.USER || "Unknown User";
    const domain = process.env.USERDOMAIN || "Local";

    if (isWindows) {
        // Windows: PowerShell command to get Full Name
        const psCommand = `powershell -Command "([adsi]'WinNT://${domain}/${username},user').FullName"`;
        exec(psCommand, (error, stdout, stderr) => {
            let fullName = stdout.trim();
            if (!fullName || error) {
                console.warn("Could not retrieve full name via PowerShell:", error);
                fullName = username;
            }
            callback({
                username,
                fullName,
                domain,
                source: "Windows Environment",
                avatar: "http://localhost:3000/public/DrX.jpeg"
            });
        });
    } else {
        // Linux/macOS: Just use the username or simple command if needed
        // For now, simpliest approach:
        callback({
            username,
            fullName: username, // tough to get full name reliably without specific tools like `getent`
            domain,
            source: "Linux/Unix Environment",
            avatar: "http://localhost:3000/public/DrX.jpeg"
        });
    }
};

/**
 * 1. API: Get Current User
 */
app.get('/api/user', (req, res) => {
    getUserInfo((userInfo) => {
        res.json(userInfo);
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
    const user = process.env.USERNAME || process.env.USER || "Unknown";
    console.log(`\n---------------------------------------------------`);
    console.log(` EN_SmartApp Local Server Running`);
    console.log(` - URL: http://localhost:${PORT}`);
    console.log(` - User: ${user}`);
    console.log(` - Platform: ${process.platform}`);
    console.log(`---------------------------------------------------\n`);
});
