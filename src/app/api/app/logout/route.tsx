import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the app_account_cookie by setting it to an empty value and expiring it immediately
  response.cookies.set("app_account_cookie", "", {
    httpOnly: true,
    secure: true,
    maxAge: 0, // Expire immediately
    path: "/",
  });

  return response;
}
