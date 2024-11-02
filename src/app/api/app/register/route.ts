import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { createClient } from "next-sanity";

const stuntingProneProvinces = [
  "Nusa Tenggara Timur",
  "Papua",
  "Papua Barat",
  "Kalimantan Barat",
  "Sulawesi Barat",
  "Aceh",
  "Sumatera Utara",
  "Nusa Tenggara Barat",
  "Kalimantan Tengah",
  "Sulawesi Tengah",
];

// Ini cuma buat testing aja, aslinya mungkin dia cek berdasarkan KTP di database dia sudah di assign ke region yg mana.
function assignRandomProvince() {
  const randomIndex = Math.floor(Math.random() * stuntingProneProvinces.length);
  return stuntingProneProvinces[randomIndex];
}

export async function POST(req: NextRequest) {
  const {
    fullName,
    email,
    password,
    role,
    isPregnant,
    pregnancyStartDate,
    haveOtherChildren,
    children,
    nik,
  } = await req.json();

  if (!process.env.SANITY_TOKEN) {
    return NextResponse.json(
      { message: "Internal error, missing env variables" },
      { status: 500 }
    );
  }

  if (!fullName || !email || !password || !role) {
    return NextResponse.json(
      { message: "Form tidak lengkap." },
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

  try {
    // Check if email already exists
    const existingUser = await client.fetch(
      `*[_type == "appAccount" && email == $email][0]`,
      { email }
    );
    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terpakai!" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare base user data
    const newUser: any = {
      _type: "appAccount",
      fullName,
      email,
      hashedPassword,
      role,
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
    };

    // Add additional fields based on role
    if (role === "mother") {
      newUser.isPregnant = isPregnant;
      newUser.pregnancyStartDate = isPregnant ? pregnancyStartDate : null;
      newUser.children = haveOtherChildren ? children : [];
    } else if (role === "health_officer") {
      newUser.nik = nik;
      newUser.assignedRegion = assignRandomProvince;
    }

    // Create user in Sanity
    const user = await client.create(newUser);

    // Generate JWT token
    const token = createToken(user._id);

    const response = NextResponse.json({ message: "OK" });

    // Set the token as an HTTP-only cookie
    response.cookies.set("app_account_cookie", token, {
      secure: true,
      httpOnly: true,
      maxAge: 28800, // 8 hours in seconds
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Pendaftaran gagal." },
      { status: 500 }
    );
  }
}
