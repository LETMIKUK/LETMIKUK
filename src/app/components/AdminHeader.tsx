import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminSidebar } from "./AdminSidebar";

export default function AdminHeader() {
  return (
    <header className="bg-white sticky z-[999] items-center w-full top-0 py-4 px-6 flex flex-row justify-between">
      <div className="flex items-center space-x-3">
        <span className="font-bold text-2xl">LETMIKUK</span>
      </div>
      <div className="flex items-center space-x-3">
        <p>Halo, Ryan</p>
        <Avatar>
          <AvatarFallback>RT</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
