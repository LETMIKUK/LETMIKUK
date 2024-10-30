"use client";

import type { Metadata } from "next";
// import "@/app/globals.css";
import { AdminSidebar } from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LETMIKUK Dashboard",
  description:
    "Digunakan oleh pemerintah untuk memonitor dan mengelola prevalensi stunting per provinsi, mengorganisasi proyek intervensi yang sedang berlangsung, serta merekrut relawan dan tenaga kerja yang diperlukan.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdminHeader />
      <main className="bg-slate-100 flex h-screen">
        <AdminSidebar />
        <div className="p-5 flex-1">{children}</div>
      </main>
    </>
  );
}
