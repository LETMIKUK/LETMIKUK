import { Button } from "@/components/ui/button";
import Link from "next/link";
import LetmikukLogo from "./components/svg/LetmikukLogo";
import GradientText from "./components/GradientText";
import LetmikukSymbolLogo from "./components/svg/LetmikukSymbolLogo";
import { BackgroundLines } from "@/components/ui/background-lines";
import { ArrowDown } from "lucide-react";
import ScrollButton from "./components/ScrollButton";
import RoundStar from "./components/svg/RoundStar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <BackgroundLines
        svgOptions={{ duration: 7 }}
        className="graph-paper relative h-screen w-full justify-center items-center flex flex-col"
      >
        <div className="flex flex-col justify-center items-center relative z-50">
          <div className="max-w-24">
            <LetmikukSymbolLogo className="w-full" />
          </div>
          <h1 className="w-lg font-bold">
            <LetmikukLogo className="w-full" />
          </h1>
          <h2 className="mt-5 md:w-full text-center max-sm:max-w-sm">
            <GradientText
              className="!font-bold"
              speed={5}
              text="Layanan Edukasi Terkait Malnutrisi dan Intervensi Kesehatan Untuk Keluarga"
            />
          </h2>
        </div>

        <div className="flex mt-10 relative z-50 items-center flex-col space-y-5">
          <Link href={"/dashboard"}>
            <Button variant={"link"}> LETMIKUK Dashboard 📊</Button>
          </Link>
          <Link href={"/app"}>
            <Button variant={"link"}>LETMIKUK App 📲</Button>{" "}
          </Link>
          <Link href={"/riset"}>
            <Button variant={"link"}> Riset & Argumen Kami 📝</Button>
          </Link>
          <Link href={"/#tentang-kami"}>
            <Button variant={"link"}>Tentang Kami 👥</Button>
          </Link>
        </div>
        <ScrollButton
          id="apa-itu-letmikuk"
          className="absolute flex flex-col justify-center items-center bottom-3"
        >
          <p className=" mb-2">ℹ️</p>
          <ArrowDown className="animate-bounce" />
        </ScrollButton>
      </BackgroundLines>
      <div className="h-screen w-full p-10">
        <h2 id="apa-itu-letmikuk">
          <Link href="/#apa-itu-letmikuk">
            <Button className="font-medium text-5xl p-0 mb-5" variant={"link"}>
              Apa itu{" "}
              <GradientText text="LETMIKUK" className="!font-bold" speed={5} />?
            </Button>
          </Link>
        </h2>
        <p className="max-w-sm md:max-w-md text-justify">
          LETMIKUK (singkatan dari Layanan Edukasi Terkait Malnutrisi dan
          Intervensi Kesehatan Untuk Keluarga) adalah program berisi kumpulan
          layanan untuk mencegah stunting yang didesain untuk dapat dimanfaatkan
          <b> oleh segala kalangan masyarakat.</b>
          <br />
          <br />
          Mulai dari AI yang dapat membantu orang tua dalam merencanakan menu
          makanan yang bernutrisi untuk anak sampai AI yang membantu karyawan
          pemerintah dalam memudahkan tugas administratif dalam proyek
          intervensi langsung ke daerah yang rawan stunting.
        </p>
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center w-full p-10">
        <h2 className="mb-10" id="apa-itu-letmikuk">
          <Link href="/#apa-itu-letmikuk">
            <Button className="font-medium text-5xl p-0" variant={"link"}>
              <GradientText
                text="Tim LETMIKUK"
                className="!font-bold"
                speed={5}
              />
            </Button>
          </Link>
        </h2>
        <div className="w-full graph-paper py-5 gap-x-10 rounded-full place-items-center grid max-md:gap-y-5 max-md:grid-rows-3 md:grid-cols-3">
          <div className="max-w-56 text-center">
            <RoundStar src={"/images/avatar_felix.jpeg"} />
            <h3 className="text-3xl font-medium">Felixx Colin Lianto</h3>
            <p className="text-muted-foreground text-sm text-center">
              BTEC HND Computing | Juni 2024 | UniSadhuGuna International
              College BSD
            </p>
          </div>
          <div className="max-w-56 text-center">
            <RoundStar src={"/images/avatar_ryan.jpeg"} />
            <h3 className="text-3xl font-medium">Ryan Ferdinand Tobing</h3>
            <p className="text-muted-foreground text-sm text-center">
              BTEC HND Computing | Juni 2024 | UniSadhuGuna International
              College BSD
            </p>
          </div>
          <div className="max-w-56 text-center">
            <RoundStar />
            <h3 className="text-3xl font-medium">Ahmad Syafiq Hartono</h3>
            <p className="text-muted-foreground text-sm text-center">
              S1 Computer Science | 2025 | BINUS University Kemanggisan
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
