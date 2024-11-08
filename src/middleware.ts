import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";
import { createClient } from "next-sanity";

export default async function middleware(req: NextRequest) {
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
  if (pathname.startsWith("/app")) {
    // If no app cookie, redirect to /app/login
    if (!appCookie && !isAppAuthPage) {
      return NextResponse.redirect(new URL("/app/login", req.url));
    }

    // If already authenticated, redirect from login/register to /app
    if (appCookie && isAppAuthPage) {
      return NextResponse.redirect(new URL("/app", req.url));
    }

    // if (appCookie) {
    //   try {
    //     // Verify the JWT token and get the user ID
    //     const decodedToken = verifyToken(appCookie);
    //     const userId = decodedToken.userId;

    //     const client = createClient({
    //       apiVersion:
    //         process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-26",
    //       dataset: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    //       projectId: process.env.NEXT_PUBLIC_SANITY_DATASET,
    //       useCdn: true,
    //       token: process.env.SANITY_TOKEN,
    //     });
    //     // Fetch the user's profile completion status from Sanity
    //     const user = await client.fetch(
    //       `*[_type == "appAccount" && _id == $id][0]{ isProfileComplete }`,
    //       { id: userId }
    //     );

    //     // Redirect to complete-profile if profile is incomplete
    //     if (
    //       user &&
    //       !user.isProfileComplete &&
    //       pathname !== "/app/complete-profile"
    //     ) {
    //       return NextResponse.redirect(
    //         new URL("/app/complete-profile", req.url)
    //       );
    //     }
    //   } catch (error) {
    //     console.error("Error in middleware:", error);
    //     // Redirect to login in case of an error in token verification
    //     return NextResponse.redirect(new URL("/app/login", req.url));
    //   }
    // }
  }

  // Handle /dashboard routes
  if (pathname.startsWith("/dashboard")) {
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
