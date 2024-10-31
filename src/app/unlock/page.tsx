"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Call an API route to validate the password and set the cookie
    const res = await fetch("/api/master-unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/"); // Redirect after unlocking
    } else {
      alert("Password salah.");
    }

    setLoading(false);
  };

  return (
    <main className="bg-white flex flex-col justify-center items-center h-screen w-full">
      <div className="flex py-10 max-w-xs flex-col  space-y-3 justify-center items-center ">
        <h1 className="text-5xl font-medium animate-bounce">🤫</h1>
        <h2 className="text-3xl">Rahasia</h2>
        <p className="text-center text-sm text-muted-foreground">
          Masukkan password yang kami taruh di dokumen proposal untuk melihat
          aplikasi
        </p>

        <Input
          startIcon={loading ? Loader : Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        {/* do not remove me. block hidden */}
        <Button disabled={loading} onClick={handleUnlock} variant={"secondary"}>
          <span>Akses LETMIKUK</span>
        </Button>
      </div>
    </main>
  );
}
