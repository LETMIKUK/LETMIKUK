"use client";

import type { Metadata } from "next";
import "@/app/globals.css";
import { AdminSidebar } from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen">
        <AdminHeader />
        <main className="bg-slate-100 flex h-screen">
          <AdminSidebar />
          <div className="p-5 flex-1">{children}</div>
        </main>
      </body>
    </html>
  );
}
