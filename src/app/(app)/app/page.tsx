"use client";

import GradientText from "@/app/components/GradientText";
import LetmikukLogo from "@/app/components/svg/LetmikukLogo";
import LetmikukSymbolLogo from "@/app/components/svg/LetmikukSymbolLogo";
import Sparkle from "@/app/components/svg/Sparkle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/lib/contexts/UserContext";
import { getInitials, getPregnantDuration } from "@/lib/helpers";
import {
  Book,
  Calendar,
  ChartArea,
  ChefHat,
  Cookie,
  ForkKnifeCrossed,
  HelpCircle,
  Home,
  LogOut,
  Newspaper,
  Ruler,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user, logout } = useUser();

  // api.ts

  // placeholder app home
  // <div className="flex flex-col p-5 w-full justify-center items-center">
  //   <div className="space-y-3 items-center justify-center flex flex-col ">
  //     <h1 className="text-3xl max-w-64 flex-1 h-full font-bold">
  //       <LetmikukLogo />
  //     </h1>
  //     <p className="text-sm animate-pulse max-w-64 text-center">
  //       Aplikasi untuk merekam pertumbuhan anak dan keperluan nutrisi
  //     </p>
  //   </div>
  //   <Link href="/app/chatbot">
  //     <Button variant={"outline"} className="mt-10">
  //       Mulai
  //       <ArrowRight />
  //     </Button>
  //   </Link>
  // </div>
  return (
    <ScrollArea className="flex relative bg-white space-y-3 flex-col w-full">
      <div
        id="app-header"
        className="p-3 items-center shadow-sm flex flex-row bg-white justify-between"
      >
        <Avatar>
          <AvatarFallback>
            {getInitials(user.personalInfo.fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex justify-center items-center space-x-1">
          <LetmikukSymbolLogo className="max-w-6" />
          <LetmikukLogo className="max-w-24" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Settings className="text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="text-sm bg-white">
            <DropdownMenuItem>
              {user.personalInfo.role === "mother"
                ? "Edit Profil Anak"
                : "Edit Data Anak"}
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:!text-red-500">
              <button
                className="flex items-center p-0 font-normal gap-0 gap-x-2 whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                onClick={logout}
              >
                Logout <LogOut />
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="bg-white flex flex-col px-5 py-2">
        <p>{user.personalInfo.fullName}</p>
        <p className="text-sm text-muted-foreground">
          {user.personalInfo.email}
        </p>
        <Badge className="text-xs mt-1 bg-pink-100 text-pink-500 max-w-fit hover:bg-pink-200">
          {user &&
            (user.personalInfo.role === "mother"
              ? (user.motherInfo?.pregnancyStartDate &&
                  `${getPregnantDuration(new Date(user.motherInfo?.pregnancyStartDate))}`) ||
                "Tanggal HTPT Belum dicantumkan"
              : user.personalInfo.nik)}
        </Badge>
        <Link className="mt-5 mb-3" href={"/app/chatbot"}>
          <Button
            variant={"outline"}
            className="w-full bg-white text-foreground mt-3 py-8 rounded-xl"
          >
            <GradientText
              speed={5}
              className="font-bold"
              text="Tanya LETMIKUK AI"
            />
            <Sparkle />
          </Button>
        </Link>
        <div className="gap-3 grid grid-cols-3">
          <Button
            className=" flex rounded-xl flex-col aspect-square w-full py-10 text-lg"
            variant={"outline"}
          >
            <Calendar className="text-3xl" />
            <p className="text-xs">Skedul Scan</p>
          </Button>
          <Button
            className=" flex shadow-sm rounded-xl flex-col aspect-square w-full py-10 text-lg"
            variant={"outline"}
          >
            <Ruler className="text-3xl" />
            <p className="text-xs">Growth Tracker</p>
          </Button>
          <Button
            className="flex shadow-sm rounded-xl flex-col aspect-square text-lg w-full py-10"
            variant={"outline"}
          >
            <ChartArea className="text-3xl" />
            <p className="text-xs">Standar Badan</p>
          </Button>
          <Button
            className="flex shadow-sm rounded-xl flex-col aspect-square text-lg w-full py-10"
            variant={"outline"}
          >
            <ChefHat className="text-3xl" />
            <p className="text-xs">Meal Plan</p>
          </Button>
          <Button
            className="flex shadow-sm rounded-xl flex-col aspect-square text-lg w-full py-10"
            variant={"outline"}
          >
            <Cookie className="text-3xl" />
            <p className="text-xs">Bantuan Gizi</p>
          </Button>
          <Button
            className="flex shadow-sm rounded-xl flex-col aspect-square text-lg w-full py-10"
            variant={"outline"}
          >
            <Book className="text-3xl" />
            <p className="text-xs text-wrap">Perpustakaan</p>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-0 px-8 text-muted-foreground border-t bg-white flex-row justify-between shadow-sm py-5 flex w-full">
        <div className="flex flex-col justify-center items-center">
          <Home />
          <p className="text-xs">Beranda</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <ForkKnifeCrossed />
          <p className="text-xs">Resep</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <Newspaper />

          <p className="text-xs">Berita</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <HelpCircle />

          <p className="text-xs">Bantuan</p>
        </div>
      </div>
    </ScrollArea>
  );
}
