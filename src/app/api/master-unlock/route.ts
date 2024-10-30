import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password }: { password: string } = await req.json();

  const masterPassword = process.env.MASTER_PASSWORD;

  if (!masterPassword) {
    return NextResponse.json(
      { message: "Kesalahan Internal" },
      { status: 500 }
    );
  }

  // Verify password (consider using an environment variable for storage)
  if (password === masterPassword) {
    const response = NextResponse.json(
      { message: "Password Benar" },
      { status: 200 }
    );

    const cookieValue = process.env.MASTER_COOKIE;

    if (!cookieValue) {
      return NextResponse.json(
        { message: "Kesalahan Internal" },
        { status: 500 }
      );
    }

    response.cookies.set("master_cookie", cookieValue, {
      secure: process.env.USE_SECURE_COOKIES === "true",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 3,
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ message: "Password Salah" }, { status: 401 });
}
