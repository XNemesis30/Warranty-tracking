// EZ GADGETS RMA - Google Apps Script Backend
// Deploy this as a Web App (Execute as: Me, Access: Anyone)
// After deploying, paste the Web App URL into the frontend config

const SHEET_NAME = "RMA_Records";
const HEADERS = [
  "RMA_Code", "Date", "Location", "Customer_Name", "Contact",
  "Address", "Product_Name", "Serial_Number", "Issue",
  "Status", "Repair_Location", "Notes", "Last_Updated"
];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function generateRMACode(location) {
  const prefix = location === "Location 1" ? "EZL1" : "EZL2";
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${yy}${mm}${dd}-${rand}`;
}

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const cors = ContentService.createTextOutput();
  cors.setMimeType(ContentService.MimeType.JSON);

  try {
    const params = e.parameter || {};
    const action = params.action;
    let result;

    if (action === "add") {
      result = addRecord(params);
    } else if (action === "search") {
      result = searchRecords(params.query || "");
    } else if (action === "getAll") {
      result = getAllRecords();
    } else if (action === "updateStatus") {
      result = updateStatus(params);
    } else if (action === "getByCode") {
      result = getByCode(params.code);
    } else {
      result = { success: false, error: "Unknown action" };
    }

    cors.setContent(JSON.stringify(result));
  } catch (err) {
    cors.setContent(JSON.stringify({ success: false, error: err.message }));
  }

  return cors;
}

function addRecord(params) {
  const sheet = getOrCreateSheet();
  const code = generateRMACode(params.location);
  const now = new Date().toISOString();

  const row = [
    code,
    params.date || new Date().toLocaleDateString("en-GB"),
    params.location || "",
    params.customerName || "",
    params.contact || "",
    params.address || "",
    params.productName || "",
    params.serialNumber || "",
    params.issue || "",
    "Received",
    "In-House",
    "",
    now
  ];

  sheet.appendRow(row);
  return { success: true, code: code };
}

function searchRecords(query) {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, records: [] };

  const q = query.toLowerCase().trim();
  const headers = data[0];
  const records = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const name = String(row[3] || "").toLowerCase();
    const contact = String(row[4] || "").toLowerCase();
    const code = String(row[0] || "").toLowerCase();

    if (name.includes(q) || contact.includes(q) || code.includes(q)) {
      const record = {};
      headers.forEach((h, idx) => { record[h] = row[idx]; });
      records.push(record);
    }
  }

  return { success: true, records: records };
}

function getAllRecords() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, records: [] };

  const headers = data[0];
  const records = data.slice(1).map(row => {
    const record = {};
    headers.forEach((h, idx) => { record[h] = row[idx]; });
    return record;
  });

  return { success: true, records: records.reverse() }; // newest first
}

function updateStatus(params) {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  const code = params.code;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === code) {
      const rowNum = i + 1;
      sheet.getRange(rowNum, 10).setValue(params.status || "Received");
      sheet.getRange(rowNum, 11).setValue(params.repairLocation || "In-House");
      sheet.getRange(rowNum, 12).setValue(params.notes || "");
      sheet.getRange(rowNum, 13).setValue(new Date().toISOString());
      return { success: true };
    }
  }

  return { success: false, error: "Record not found" };
}

function getByCode(code) {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === code) {
      const record = {};
      headers.forEach((h, idx) => { record[h] = data[i][idx]; });
      return { success: true, record: record };
    }
  }

  return { success: false, error: "Not found" };
}
