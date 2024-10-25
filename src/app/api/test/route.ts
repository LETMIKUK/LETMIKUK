import { NextResponse } from "next/server";

export async function GET() {
  try {

const data = 'yay it work woohoo'
    return NextResponse.json({ message: "OK", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}