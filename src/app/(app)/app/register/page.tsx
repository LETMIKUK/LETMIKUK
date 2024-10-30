"use client";

import LetmikukLogo from "@/app/components/svg/LetmikukLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Call an API route to validate the password and set the cookie
    const res = await fetch("/api/app/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await res.json();
    console.log("response data:", data);

    if (res.ok) {
      router.push("/app"); // Redirect after unlocking
    } else {
      alert("Registrasi gagal.");
    }

    setLoading(false);
  };

  return (
    <div className="flex relative w-full justify-center flex-col space-y-3 items-center">
      <h1 className="text-3xl max-w-64 font-bold">
        <LetmikukLogo />
      </h1>
      <div
        className={`absolute bg-black/10 w-full h-full flex items-center justify-center z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${loading ? "block" : "hidden"}`}
      >
        <Loader className=" animate-spin" />
      </div>
      <div className="max-w-1/2 space-y-3 flex flex-col justify-center items-center">
        <h1>Daftar Akun</h1>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nama Lengkap"
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <Button onClick={handleRegister} variant={"outline"}>
          Daftar
        </Button>
        <Link href="/app/login">
          <Button className="text-xs" variant={"link"}>
            Sudah punya akun?
          </Button>
        </Link>
      </div>
    </div>
  );
}
