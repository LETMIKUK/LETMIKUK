// // src/app/api/sheets/route.ts
// import { NextResponse } from 'next/server';
// import { getSheetData } from "@/lib/googlesheets"

// export const revalidate = 0;

// export async function GET(request: Request) {

//   // console.log("Incoming request:", request);

//   // const json = await request.json();
//   // console.log("Parsed JSON:", json);
//   const sheetId = "1-IgZ5Ew57WiX7bj5wpJZYCuHq92EjKRCrWHVI1xB9Io"; // Your Google Sheet ID
//   const range = "Form responses 1!Q1:W101"; // Adjust the range as needed
//   console.log('test, this means the /api/sheets was accessible')
//   try {
//     console.log('before getSheetData')
//     const data = await getSheetData(sheetId, range);
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Failed to fetch data:", error);
//     return NextResponse.error();
//   }
// }

import { NextResponse } from "next/server";

export async function GET() {
  try {

const data = 'yay it work woohoo'
console.log('data:', data)
console.log('hi hi hi')
    return NextResponse.json({ message: "OK", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}