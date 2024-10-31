"use client";

import LetmikukLogo from "@/app/components/svg/LetmikukLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import ShadCN Alert

export default function Page() {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(""); // State for error message
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages

    try {
      const res = await fetch("/api/app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/app"); // Redirect after successful registration
      } else {
        setErrorMessage(data.message || "Registration failed."); // Display API error message
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex relative w-full justify-center flex-col space-y-3 items-center">
      <h1 className="text-3xl max-w-64 font-bold">
        <LetmikukLogo />
      </h1>
      {/* Loading overlay */}
      <div
        className={`absolute bg-black/10 w-full h-full flex items-center justify-center z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${loading ? "block" : "hidden"}`}
      >
        <Loader className="animate-spin" />
      </div>
      <div className="max-w-1/2 space-y-3 flex flex-col justify-center items-center">
        <h1>Daftar Akun</h1>

        {/* Error Message Display */}
        {errorMessage && (
          <Alert variant="destructive" className="w-full">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Registration Form */}
        <form
          onSubmit={handleRegister}
          className="flex flex-col items-center justify-center space-y-3"
        >
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nama Lengkap"
            required
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Button type="submit" variant={"outline"} disabled={loading}>
            Daftar
          </Button>
        </form>
        <Link href="/app/login">
          <Button className="text-xs" variant={"link"}>
            Sudah punya akun?
          </Button>
        </Link>
      </div>
    </div>
  );
}
