import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="graph-paper flex flex-col justify-center items-center h-screen w-full">
      <div className="flex py-10 w-full flex-col  space-y-3 justify-center items-center ">
        <h1 className="text-5xl rotate-2 font-medium">Nyasar... 😔</h1>
        <p className="-rotate-2">404: halaman tidak ditemukan</p>
        <Link href="/">
          <Button variant={"link"}>
            <span>Balik ke '/' 🏠</span>
          </Button>
        </Link>
      </div>
    </main>
  );
}
