import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminHeader() {
  return (
    <header className="bg-white sticky items-center shadow-md w-full top-0 py-4 px-3 flex flex-row justify-between">
      <span className="font-bold text-2xl">LETMIKUK</span>
      <div className="flex items-center space-x-3">
        <p>Halo, Ryan</p>
        <Avatar>
          <AvatarFallback>RT</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
