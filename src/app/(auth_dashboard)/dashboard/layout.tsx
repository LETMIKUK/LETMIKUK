import type { Metadata } from "next";
// import "@/app/globals.css";
import { AdminSidebar } from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";

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
      <main className="bg-slate-100 flex flex-col justify-center items-center h-screen">
        <div className="p-5 flex-1 flex flex-col justify-center items-center">
          {children}
        </div>
      </main>
    </>
  );
}
