import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen justify-center items-center flex flex-col">
      <h1 className="text-6xl font-bold">L.E.T.M.I.K.U.K</h1>
      <h2>
        Layanan Efektif untuk Tanggap Malnutrisi dan Intervensi Kesehatan Untuk
        Kesejahteraan
      </h2>
      <div className="flex mt-10 flex-col space-y-5">
        <Link href={"/admin"}>Admin Dashboard</Link>
        <Button>Newborn App</Button>
        <Button>Riset & Argumen Kami</Button>
        <Button>Tentang Kami</Button>
      </div>
    </main>
  );
}
