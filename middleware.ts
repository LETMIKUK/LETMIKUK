import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware function
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || ""; // Get the request host (e.g., admin.localhost:3000)

  if (host.startsWith("admin.")) {
    // Rewrite to /admin route
    return NextResponse.rewrite(new URL("/admin", req.nextUrl.origin));
  } else if (host.startsWith("app.")) {
    // Rewrite to /app route
    return NextResponse.rewrite(new URL("/app", req.nextUrl.origin));
  }

  // Proceed normally for other cases (localhost)
  return NextResponse.next();
}
