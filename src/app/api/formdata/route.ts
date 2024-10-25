// src/app/api/sheets/route.ts
import { NextResponse } from 'next/server';
import { getSheetData } from "@/lib/googlesheets"

export async function GET(request: Request) {

const sheetId = "1-IgZ5Ew57WiX7bj5wpJZYCuHq92EjKRCrWHVI1xB9Io"; // Your Google Sheet ID
  const range = "Form responses 1!Q1:W101"; // Adjust the range as needed
  console.log('test, this means the /api/formdata was accessible')
  try {
    console.log('before getSheetData')
    // const data = await getSheetData(sheetId, range);
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return NextResponse.error();
  }
  // }
}

