import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { createClient } from "next-sanity";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!process.env.SANITY_TOKEN) {
    return NextResponse.json(
      { message: "Internal error, missing environment variables" },
      { status: 500 }
    );
  }

  if (!email || !password) {
    return NextResponse.json(
      { message: "Incomplete login values" },
      { status: 400 }
    );
  }

  const client = createClient({
    apiVersion,
    dataset,
    projectId,
    useCdn: true,
    token: process.env.SANITY_TOKEN,
  });

  try {
    // Retrieve the user document from Sanity based on the email
    const user = await client.fetch(
      `*[_type == "appAccount" && email == $email][0]`,
      { email }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verify the password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate a JWT token for the authenticated user
    const token = createToken(user._id, user.role);

    const response = NextResponse.json({ message: "Login successful" });

    // Set the token as an HTTP-only cookie
    response.cookies.set("app_account_cookie", token, {
      secure: true,
      httpOnly: true,
      maxAge: 28800, // 8 hours in seconds
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
