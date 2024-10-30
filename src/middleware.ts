import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;

  // Master lock cookie check
  const masterCookie = req.cookies.get("master_cookie")?.value;

  if (masterCookie && pathname === "/unlock") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!masterCookie && pathname !== "/unlock") {
    // Redirect any route to /unlock if master lock is not bypassed
    const unlockUrl = new URL("/unlock", req.url);
    return NextResponse.redirect(unlockUrl);
  }

  // Detect environment
  const isLocalhost =
    hostname === "localhost" || hostname.endsWith(".localhost");
  const isAppSubdomain =
    hostname.startsWith("app.") && hostname.endsWith("letmikuk.netlify.app");
  const isDashboardSubdomain =
    hostname.startsWith("dashboard.") &&
    hostname.endsWith("letmikuk.netlify.app");

  // Get cookies
  const appCookie = req.cookies.get("app_account_cookie")?.value;
  const dashboardCookie = req.cookies.get("dashboard_account_cookie")?.value;

  // Define login and registration pages based on the environment
  const isAppAuthPage =
    pathname === "/app/login" || pathname === "/app/register";
  const isDashboardAuthPage =
    pathname === "/dashboard/login" || pathname === "/dashboard/register";

  // Handle /app routes
  if ((isLocalhost && pathname.startsWith("/app")) || isAppSubdomain) {
    // If no app cookie, redirect to /app/login
    if (!appCookie && !isAppAuthPage) {
      return NextResponse.redirect(new URL("/app/login", req.url));
    }

    // If already authenticated, redirect from login/register to /app
    if (appCookie && isAppAuthPage) {
      return NextResponse.redirect(new URL("/app", req.url));
    }
  }

  // Handle /dashboard routes
  if (
    (isLocalhost && pathname.startsWith("/dashboard")) ||
    isDashboardSubdomain
  ) {
    // If no dashboard cookie, redirect to /dashboard/login
    if (!dashboardCookie && !isDashboardAuthPage) {
      return NextResponse.redirect(new URL("/dashboard/login", req.url));
    }

    // If already authenticated, redirect from login/register to /dashboard
    if (dashboardCookie && isDashboardAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Allow the request if all checks pass
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
