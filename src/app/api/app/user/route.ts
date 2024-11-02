import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  if (!process.env.SANITY_TOKEN) {
    return NextResponse.json(
      { message: "Internal error, missing env variables" },
      { status: 500 }
    );
  }

  const appCookie = cookies().get("app_account_cookie")?.value;
  if (!appCookie) {
    return NextResponse.json(
      { message: "Missing app auth cookie" },
      { status: 500 }
    );
  }

  const decryptedToken = verifyToken(appCookie);
  console.log("token:", decryptedToken);

  const { userId } = decryptedToken;

  const client = createClient({
    apiVersion,
    dataset,
    projectId,
    useCdn: true,
    token: process.env.SANITY_TOKEN,
  });

  try {
    const user = await client.fetch(
      `*[_type == "appAccount" && _id == $userId][0]`,
      { userId }
    );

    return NextResponse.json({ message: "OK", user: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
