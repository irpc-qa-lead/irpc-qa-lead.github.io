/* 
 * GAS_SourceCode.js
 * -----------------
 * COPY THIS ENTIRE FILE TO GOOGLE APPS SCRIPT.
 * 
 * Instructions:
 * 1. Create a "USERS" tab in your Google Sheet.
 * 2. Add Headers: [id, name, role, avatar_url, active]
 * 3. Add Sample User: [1001, Somchai Jai-dee, Engineer, https://ui-avatars.com/api/?name=Somchai, TRUE]
 * 4. Deploy > Web App > Access: "Anyone".
 */

const CONFIG = {
    DB_SHEET_ID: "current_spreadsheet",
    TABS: {
        LOGS: "AUDIT_LOGS",
        CIVIL: "CIVIL_LAND_DATA",
        MECH: "MECH_PIPERACK_DATA",
        USERS: "USERS" // New Database for Users
    }
};

function setupSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Create / Check USERS Tab
    let userSheet = ss.getSheetByName(CONFIG.TABS.USERS);
    if (!userSheet) {
        userSheet = ss.insertSheet(CONFIG.TABS.USERS);
        // Header Row - Comprehensive User Profile
        userSheet.appendRow(["id", "username", "name", "email", "department", "role", "avatar_url", "active"]);
        // Sample Data
        userSheet.appendRow(["1001", "somchai", "Somchai Jai-dee", "somchai@irpc.co.th", "Civil", "Engineer", "https://ui-avatars.com/api/?name=Somchai", "TRUE"]);
        userSheet.appendRow(["1002", "burinthorn", "Burinthorn Thong-o", "burinthorn@irpc.co.th", "Mechanical", "Admin", "https://ui-avatars.com/api/?name=Burinthorn", "TRUE"]);
    }

    // Ensure Logic/Audit tabs exist (same as before)
    let logSheet = ss.getSheetByName(CONFIG.TABS.LOGS);
    if (!logSheet) {
        logSheet = ss.insertSheet(CONFIG.TABS.LOGS);
        logSheet.appendRow(["timestamp", "user", "action", "app_id", "status", "payload"]);
    }
}

/**
 * Handle GET Requests (Read Data only)
 * Example: ?action=GET_USER&id=1001
 */
function doGet(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(5000);

    try {
        const action = e.parameter.action;
        const id = e.parameter.id;

        let result = {};

        if (action === "GET_USER") {
            result = findUserById(id);
        } else {
            result = { status: "error", message: "Unknown Action" };
        }

        // Return JSON with CORS Headers
        return ContentService.createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON)
        // .setHeader("Access-Control-Allow-Origin", "*"); 
        // Note: GAS handles CORS automatically for `MimeType.JSON` if access is correct.

    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({
            status: "error",
            message: err.toString()
        })).setMimeType(ContentService.MimeType.JSON);

    } finally {
        lock.releaseLock();
    }
}

/**
 * Handle POST Requests (Write Data)
 */
function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const data = JSON.parse(e.postData.contents);
        const action = data.action;
        const appId = data.appId;
        const user = data.user || "Anonymous";
        const payload = data.payload;

        logAudit(user, action, appId, "RECEIVED", JSON.stringify(payload).substring(0, 50));

        let result = {};

        if (action === "SAVE_CALCULATION") {
            result = saveCalculation(appId, payload, user);
        } else {
            throw new Error("Unknown Action");
        }

        return ContentService.createTextOutput(JSON.stringify({
            status: "success",
            data: result
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({
            status: "error",
            message: err.toString()
        })).setMimeType(ContentService.MimeType.JSON);

    } finally {
        lock.releaseLock();
    }
}

// ------------------------------------------------------------------
//  HELPER FUNCTIONS (Database Logic)
// ------------------------------------------------------------------

function findUserById(id) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.TABS.USERS);
    if (!sheet) return { status: "error", message: "User DB not found" };

    const data = sheet.getDataRange().getValues(); // Read all rows
    // Assuming ID is Column 0 (Index 0)
    // Headers are Row 0

    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        /* 
          Col 0: ID (A)
          Col 1: Username (B)
          Col 2: Name (C)
          Col 3: Email (D)
          Col 4: Dept (E)
          Col 5: Position (F)  <-- NEW
          Col 6: Role (G)
          Col 7: Avatar (H)
          Col 8: Active (I)
        */

        // Logic: Match either ID OR Username (Case Insensitive)
        const isIdMatch = String(row[0]) === String(id);
        const isUserMatch = String(row[1]).toLowerCase() === String(id).toLowerCase();
        // Check Col 8 for Active status
        const isActive = String(row[8]).toUpperCase() === "TRUE";

        if ((isIdMatch || isUserMatch) && isActive) {
            return {
                status: "success",
                data: {
                    id: row[0],
                    username: row[1],
                    name: row[2],
                    email: row[3],
                    department: row[4],
                    position: row[5], // New Field
                    role: row[6],
                    avatar: row[7]
                }
            };
        }
    }

    return { status: "error", message: "User Not Found or Inactive" };
}

function saveCalculation(appId, data, user) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = new Date().toISOString();

    // (Simplified for demo)
    // ... saving logic ...
    return { saved: true, id: timestamp };
}

function logAudit(user, action, appId, status, snippet) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.TABS.LOGS);
    if (sheet) sheet.appendRow([new Date(), user, action, appId, status, snippet]);
}
