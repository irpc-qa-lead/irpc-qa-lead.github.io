// --- CONFIGURATION ---
const DB_SPREADSHEET_ID = "1HIBTM-PlwvJ1I7k5qS3LDoUEt8AgXpCmAxXO-e-BTmI";
const DB_SHEET_NAME = "data_source";

// --- API ENTRY POINTS ---

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e, true);
}

function handleRequest(e, isPost = false) {
  const params = e.parameter;
  const action = params.action;
  
  let result = {};

  try {
    if (action === 'getJobList') {
      result = getJobList(params.year);
    } 
    else if (action === 'loadJobDetail') {
      result = loadJobDetail(params.jobId);
    } 
    else if (isPost && action === 'saveNewJob') {
      const data = JSON.parse(e.postData.contents);
      result = saveNewJob(data);
    } 
    else if (isPost && action === 'updateJob') {
      const data = JSON.parse(e.postData.contents);
      result = updateJob(data);
    }
    else {
      throw new Error("Invalid action or method: " + action);
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- DATABASE FUNCTIONS ---

function getDbSheet() {
  const ss = SpreadsheetApp.openById(DB_SPREADSHEET_ID);
  let sheet = ss.getSheetByName(DB_SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(DB_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Job ID", "Job Name", "Year", "Created Date", 
      "Updated Date", "Input Mode", "Target Elevation", 
      "Points Data (JSON)", "Results Data (JSON)", "Surveyor Email"
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getJobList(yearInput) {
  const sheet = getDbSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const data = sheet.getRange(2, 1, lastRow - 1, 5).getValues(); 
  const targetYear = parseInt(yearInput) || new Date().getFullYear();
  
  const jobs = data
    .map((row) => ({
      id: row[0],
      name: row[1],
      year: row[2],
      created: row[3],
      updated: row[4]
    }))
    .filter(job => job.year === targetYear)
    .sort((a, b) => new Date(b.updated) - new Date(a.updated));
    
  return jobs.map(j => ({
    id: j.id,
    name: j.name,
    date: formatDate(j.created),
    updated: formatDate(j.updated)
  }));
}

function loadJobDetail(jobId) {
  const sheet = getDbSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) throw new Error("Job not found");

  const data = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
  const jobRow = data.find(r => r[0] === jobId);
  
  if (!jobRow) throw new Error("Job ID not found: " + jobId);

  const safeParse = (str) => { try { return JSON.parse(str || "[]"); } catch (e) { return []; } };
  const safeParseObj = (str) => { try { return JSON.parse(str || "{}"); } catch (e) { return {}; } };

  return {
    jobId: jobRow[0],
    jobName: jobRow[1],
    year: jobRow[2],
    created: jobRow[3],
    updated: jobRow[4],
    mode: jobRow[5],
    targetElev: jobRow[6],
    points: safeParse(jobRow[7]),
    results: safeParseObj(jobRow[8]),
    email: jobRow[9]
  };
}

function saveNewJob(formData) {
  const sheet = getDbSheet();
  const year = new Date().getFullYear();
  const jobId = `JOB-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Note: Session.getActiveUser() may be restricted in web apps depending on execution mode
  // If 'Execute as me', it's the script owner. If 'Execute as user', they must be logged in.
  // For public web apps, email might be unavailable.
  const userEmail = Session.getActiveUser().getEmail() || "anonymous";
  const now = new Date();

  const newRow = [
    jobId,
    formData.jobName,
    year,
    now,
    now,
    formData.mode,
    formData.targetElev,
    JSON.stringify(formData.points),
    JSON.stringify(formData.results),
    userEmail
  ];

  sheet.appendRow(newRow);
  return { success: true, jobId: jobId };
}

function updateJob(formData) {
  const sheet = getDbSheet();
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(2, 1, lastRow - 1, 1);
  const ids = range.getValues().flat();
  
  const rowIndex = ids.indexOf(formData.jobId);
  if (rowIndex === -1) throw new Error("Job to update not found");
  
  const actualRow = rowIndex + 2;
  const now = new Date();
  const userEmail = Session.getActiveUser().getEmail() || "anonymous";

  sheet.getRange(actualRow, 2).setValue(formData.jobName);
  sheet.getRange(actualRow, 5).setValue(now);
  sheet.getRange(actualRow, 6).setValue(formData.mode);
  sheet.getRange(actualRow, 7).setValue(formData.targetElev);
  sheet.getRange(actualRow, 8).setValue(JSON.stringify(formData.points));
  sheet.getRange(actualRow, 9).setValue(JSON.stringify(formData.results));
  sheet.getRange(actualRow, 10).setValue(userEmail);

  return { success: true };
}

function formatDate(dateObj) {
  if (!dateObj) return "";
  try {
    return Utilities.formatDate(new Date(dateObj), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
  } catch (e) {
    return String(dateObj);
  }
}
