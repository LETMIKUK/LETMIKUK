import { google } from "googleapis";
import path from "path";
import fs from "fs";

// Load the credentials from your downloaded JSON key
const credentialsPath = path.join(process.cwd(), 'LETMIKUK/src/app/(admin)/admin/edukasi/pengrekrutan/lib/sheetsapijsonkey.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

// Define types for the credentials
interface GoogleCredentials {
  client_email: string;
  private_key: string;
}

// Extract client email and private key from the credentials
const { client_email, private_key }: GoogleCredentials = credentials;

// Define the scopes needed for Google Sheets API
const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

// Authenticate using JWT
const auth = new google.auth.JWT(client_email, undefined, private_key, scopes);

// Set up the Google Sheets client
const sheets = google.sheets({ version: "v4", auth });

// Define the function to get sheet data with TypeScript typing
export async function getSheetData(sheetId: string, range: string): Promise<any[][] | undefined> {
  try {
    console.log('initiating getSheetData function')
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });
    console.log('response of getSheetData:', response)
    return (response.data.values as any);
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    throw new Error("Failed to fetch data from Google Sheets");
  }
}
