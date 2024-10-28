import { Button } from "@/components/ui/button";
import Link from "next/link";
import LetmikukLogo from "./components/svg/LetmikukLogo";
import GradientText from "./components/GradientText";

export default function Home() {
  return (
    <main className="min-h-screen justify-center items-center flex flex-col">
      <h1 className="w-lg font-bold">
        <LetmikukLogo className="w-full" />
      </h1>
      <h2 className="mt-5">
        <GradientText
          speed={5}
          text="Layanan Edukasi Terkait Malnutrisi dan Intervensi Kesehatan Untuk Keluarga"
        />
      </h2>
      <div className="flex mt-10 flex-col space-y-5">
        <Link href={"/admin"}>LETMIKUK Dashboard</Link>
        <Link href={"/app"}>LETMIKUK App</Link>
        <Link href={"/riset"}>Riset & Argumen Kami</Link>
        <Link href={"/tentang"}>Tentang Kami</Link>
      </div>
    </main>
  );
}
