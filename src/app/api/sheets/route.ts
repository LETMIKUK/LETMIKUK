// src/app/api/sheets/route.ts
import { NextResponse } from 'next/server';
import { getSheetData } from '../../../lib/googlesheets'; // Adjusted import path

export async function GET(request: Request) {
  const sheetId = "1-IgZ5Ew57WiX7bj5wpJZYCuHq92EjKRCrWHVI1xB9Io"; // Your Google Sheet ID
  const range = "Sheet1!Q1:W101"; // Adjust the range as needed
  
  try {
    const data = await getSheetData(sheetId, range);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return NextResponse.error();
  }
}
