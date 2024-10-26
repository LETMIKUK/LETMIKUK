import LetmikukLogo from "@/app/components/svg/LetmikukLogo";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col p-5 w-full justify-center items-center">
      <div className="space-y-3 items-center justify-center flex flex-col ">
        <h1 className="text-3xl max-w-64 flex-1 h-full font-bold">
          <LetmikukLogo />
        </h1>
        <p className="text-sm animate-pulse max-w-64 text-center">
          Aplikasi untuk merekam pertumbuhan anak dan keperluan nutrisi
        </p>
      </div>
      <Link href="/app/chatbot">
        <Button variant={"outline"} className="mt-10">
          Mulai
          <ArrowRight />
        </Button>
      </Link>
    </div>
  );
}
