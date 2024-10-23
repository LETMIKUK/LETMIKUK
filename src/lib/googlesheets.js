const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

// Load the credentials from your downloaded JSON key
const credentialsPath = path.join(process.cwd(), 'LETMIKUK\src\app\(admin)\admin\edukasi\pengrekrutan\lib\sheetsapijsonkey.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

const client_email = credentials.client_email;
const private_key = credentials.private_key;
const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

const auth = new google.auth.JWT(client_email, null, private_key, scopes);

const sheets = google.sheets({ version: "v4", auth });

async function getSheetData(sheetId, range) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: range,
  });

  return response.data.values;
}

module.exports = { getSheetData };
