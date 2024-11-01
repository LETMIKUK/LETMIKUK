import { RegistrationProvider } from "@/lib/contexts/RegistrationContext";
import { Metadata } from "next";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LETMIKUK App",
  description:
    "Aplikasi LETMIKUK untuk merekam pertumbuhan anak dan edukasi nutrisi anak.",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RegistrationProvider>
      <main className="flex justify-center items-center w-full h-full bg-gradient-to-r from-background via-sky-500/30 to-background">
        <div className="bg-background flex min-h-[640px] max-w-[360px] w-full min-w-[320px] h-full rounded-lg shadow-lg">
          {children}
        </div>
      </main>
    </RegistrationProvider>
  );
}
