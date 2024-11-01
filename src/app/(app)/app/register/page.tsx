"use client";

import LetmikukLogo from "@/app/components/svg/LetmikukLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  BookHeart,
  CalendarIcon,
  Cross,
  Loader,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import ShadCN Tabs
import { useRegistration } from "@/lib/contexts/RegistrationContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// import { PregnancyDatePicker } from "@/components/ui/htpt-date-picker";

export default function Page() {
  // const { registrationInfo, setRegistrationInfo } = useRegistration();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<string | undefined>(undefined);

  const [isPregnant, setIsPregnant] = useState<boolean | undefined>(undefined);
  const [pregnancyStartDate, setPregnancyStartDate] = useState<any>(undefined);
  const [children, setChildren] = useState<any[] | undefined>(undefined);

  const [nik, setNik] = useState<number | undefined>(undefined);

  const [tab, setTab] = useState<string>("register");
  const router = useRouter();

  const handleRoleChange = (role: string) => {
    if (!role) {
      return;
    }

    setRole(role);
    setTab(`${role}-details`);
  };
  // const handleSubmit = async () => {
  //   setLoading(true);
  //   setErrorMessage("");

  //   try {
  //     const res = await fetch("/api/app/register", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(registrationInfo),
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       router.push("/app"); // Redirect after successful registration
  //     } else {
  //       setErrorMessage(data.message || "Registration failed.");
  //     }
  //   } catch (error) {
  //     setErrorMessage("An unexpected error occurred.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="flex relative w-full justify-center flex-col space-y-3 items-center">
      <div
        className={`absolute bg-black/10 w-full h-full flex items-center justify-center z-10 ${loading ? "block" : "hidden"}`}
      >
        <Loader className="animate-spin" />
      </div>

      <div className="w-full space-y-3 flex flex-col justify-center items-center">
        {errorMessage && (
          <Alert variant="destructive" className="w-full">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs value={tab} className="w-full" defaultValue="register">
          <TabsContent
            className={`flex flex-col justify-center space-y-3 items-center ${tab != "register" ? "!hidden" : ""}`}
            value="register"
          >
            <h1 className="text-3xl max-w-64 font-bold">
              <LetmikukLogo />
            </h1>
            <h2 className="">Daftar Akun</h2>

            <form
              onSubmit={(e) => e.preventDefault()}
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
              <Button
                disabled={!fullName || !email || !password}
                variant={"outline"}
                onClick={() => setTab("role-selection")}
              >
                Buat Akun
              </Button>
            </form>

            <Link href="/app/login">
              <Button className="text-xs" variant={"link"}>
                Sudah punya akun?
              </Button>
            </Link>

            {fullName && email && password && (
              <div className="mx-5 px-5 w-full">
                <Progress className="" color="sky-500" value={25} />
              </div>
            )}
          </TabsContent>

          <TabsContent
            className={`p-5 flex flex-col space-y-3 ${tab != "role-selection" ? "!hidden" : ""}`}
            value="role-selection"
          >
            <Button
              onClick={() => setTab("register")}
              className="max-w-fit"
              variant={"ghost"}
            >
              <ArrowLeft /> Kembali
            </Button>
            <button
              value="mother"
              className="flex justify-start group items-center flex-row hover:bg-pink-100 rounded-lg border hover:border-pink-500 w-full h-28 py-3 p-3"
              onClick={() => handleRoleChange("mother")}
            >
              <div className="flex-shrink-0 w-1/3 flex group-hover:text-pink-500 justify-center items-center pr-3">
                <BookHeart size={48} />
              </div>
              <div className="text-start">
                <h2 className="group-hover:text-pink-500">Orang Tua</h2>
                <p className="text-muted-foreground group-hover:text-pink-400 text-xs font-light">
                  Akun untuk orang tua anak yang ingin belajar tentang nutrisi
                  dan pertumbuhan anak.
                </p>
              </div>
            </button>
            <button
              value="health-officer"
              className="flex group justify-start items-center flex-row hover:bg-lime-100 rounded-lg border hover:border-lime-500 w-full h-28 py-3 p-3"
              onClick={() => handleRoleChange("health-officer")}
            >
              <div className="flex-shrink-0 group-hover:text-lime-500 w-1/3 flex justify-center items-center  pr-3">
                <Cross size={48} />
              </div>
              <div className="text-start">
                <h2 className="group-hover:text-lime-500">Tenaga Kesehatan</h2>
                <p className="text-muted-foreground group-hover:text-lime-400 text-xs font-light">
                  Akun untuk tenaga kesehatan proyek intervensi LETMIKUK.
                </p>
              </div>
            </button>
            {/* <div className="w-full items-center justify-center flex">
            <Button className="">Selanjutnya</Button>

            </div> */}
            <Progress color="lime-500" value={50} />
          </TabsContent>

          <TabsContent
            value="mother-details"
            className={`w-full h-full flex flex-col justify-center items-center p-5 ${tab != "mother-details" ? "!hidden" : ""}`}
          >
            <div className="w-full flex justify-start">
              <Button
                onClick={() => setTab("role-selection")}
                className="max-w-fit"
                variant={"ghost"}
              >
                <ArrowLeft /> Kembali
              </Button>
            </div>
            <form
              // onSubmit={handleSubmit}
              className="flex mt-10 mb-5 flex-col w-full h-72 items-center space-y-3"
            >
              <div className="w-full">
                <Tabs
                  defaultValue=""
                  className="w-full flex flex-col space-y-3"
                >
                  <p>Apakah Anda Hamil?</p>

                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="hamil">Ya</TabsTrigger>
                    <TabsTrigger value="tidak_hamil">Tidak</TabsTrigger>
                  </TabsList>

                  <TabsContent
                    className="flex flex-col space-y-3"
                    value="hamil"
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !pregnancyStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {pregnancyStartDate ? (
                            format(pregnancyStartDate, "PPP")
                          ) : (
                            <span>Tanggal HTPT Kehamilan</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={pregnancyStartDate}
                          onSelect={setPregnancyStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {pregnancyStartDate != undefined && (
                      <>
                        <p>Apakah Anda memiliki anak lain?</p>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="punya_anak_lain">Ya</TabsTrigger>
                          <TabsTrigger value="tidak_punya_anak_lain">
                            Tidak
                          </TabsTrigger>
                        </TabsList>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Add other fields as needed */}
              {isPregnant != undefined && children != undefined && (
                <Button type="submit" variant={"outline"} disabled={loading}>
                  Daftar Akun
                </Button>
              )}
            </form>
          </TabsContent>

          <TabsContent
            value="health-officer-details"
            className={`p-5 ${tab != "health-officer-details" ? "!hidden" : ""}`}
          >
            <Button
              onClick={() => setTab("role-selection")}
              className="max-w-fit"
              variant={"ghost"}
            >
              <ArrowLeft /> Kembali
            </Button>

            <form
              // onSubmit={handleSubmit}
              className="flex flex-col items-center space-y-3"
            >
              <Input
                placeholder="NIK"
                onChange={(e) => setNik(parseInt(e.target.value))}
              />
              <Button type="submit" variant={"outline"} disabled={loading}>
                Submit Health Officer Info
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
