import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { createClient } from "next-sanity";

export async function POST(req: NextRequest) {
  const { fullName, email, password } = await req.json();

  if (!process.env.SANITY_TOKEN) {
    return NextResponse.json(
      { message: "Internal error, missing env variables" },
      { status: 500 }
    );
  }

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { message: "Incomplete form values" },
      { status: 500 }
    );
  }

  const client = createClient({
    apiVersion,
    dataset,
    projectId,
    useCdn: true,
    token: process.env.SANITY_TOKEN,
  });

  console.log("req json:", fullName, email, password);
  try {
    // Check if email exists in Sanity
    const existingUser = await client.fetch(
      `*[_type == "appAccount" && email == $email][0]`,
      { email }
    );
    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terpakai!" },
        { status: 500 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Sanity
    const newUser = {
      _type: "appAccount",
      fullName,
      email,
      hashedPassword,
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
    };

    const user = await client.create(newUser);

    // Generate JWT token
    const token = createToken(user._id);

    const response = NextResponse.json({ message: "OK" });

    // Set the token as an HTTP-only cookie
    response.cookies.set("app_account_cookie", token, {
      secure: true,
      httpOnly: true,
      maxAge: 28800,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}
