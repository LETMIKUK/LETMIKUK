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
  Plus,
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
import { id } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { FormCallbacksProvider } from "sanity";
import { getPregnantDuration } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [haveOtherChildren, setHaveOtherChildren] = useState(false);
  const [children, setChildren] = useState<any[] | undefined>(undefined);

  const [childName, setChildName] = useState("");
  const [childGender, setChildGender] = useState<string | undefined>(undefined);
  const [childBirthDate, setChildBirthDate] = useState<any>(undefined);
  const [childAllergies, setChildAllergies] = useState<string[]>([]);
  const [childNotes, setChildNotes] = useState("");

  // Function to handle adding a child to the list
  const addChild = (e: any) => {
    e.preventDefault();
    if (childName && childGender && childBirthDate) {
      const newChild = {
        name: childName,
        gender: childGender,
        birthDate: childBirthDate,
        allergies: childAllergies,
        notes: childNotes,
      };
      setChildren((prevChildren) =>
        prevChildren ? [...prevChildren, newChild] : [newChild]
      );
      setChildName(""); // Clear form inputs
      setChildGender(undefined);
      setChildBirthDate(undefined);
      setChildAllergies([]);
      setChildNotes("");
    }
  };

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

  const register = async () => {
    try {
      // Validation: Ensure all fields are filled
      if (!fullName || !email || !password || role === undefined) {
        alert("Silakan isi semua bidang yang diperlukan.");
        return;
      }

      // Additional validation for mother role
      if (role === "mother") {
        if (isPregnant === undefined) {
          alert("Silakan pilih apakah Anda sedang hamil atau tidak.");
          return;
        }
        if (isPregnant && !pregnancyStartDate) {
          alert("Silakan masukkan tanggal awal kehamilan.");
          return;
        }
        if (haveOtherChildren && (!children || children.length === 0)) {
          alert(
            "Silakan tambahkan setidaknya satu anak atau konfirmasi bahwa tidak ada anak lain."
          );
          return;
        }
      }

      // Prepare the request payload
      const payload = {
        fullName,
        email,
        password,
        role,
        isPregnant,
        pregnancyStartDate: pregnancyStartDate
          ? pregnancyStartDate.toISOString()
          : undefined,
        haveOtherChildren,
        children: children
          ? children.map((child) => ({
              name: child.name,
              gender: child.gender,
              birthDate: child.birthDate.toISOString(),
              allergies: child.allergies,
              notes: child.notes,
            }))
          : [],
      };

      // Make the API request
      const response = await fetch("/api/app/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // To allow HTTP-only cookies
      });

      // Handle response
      if (response.ok) {
        router.push("/app");
        // Optionally redirect user or reset form
      } else {
        const errorData = await response.json();
        alert(`Pendaftaran gagal: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat pendaftaran:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
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
            className={`w-full h-full flex flex-col justify-start items-start p-3 ${tab != "mother-details" ? "!hidden" : ""}`}
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
            <ScrollArea
              // onSubmit={handleSubmit}
              className="flex flex-col w-full h-full justify-start items-start space-y-3"
            >
              <div className="flex w-full justify-between items-center">
                <span className="text-sm font-medium">Apakah Anda Hamil?</span>
                <div>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPregnant(true);
                    }}
                    variant={"ghost"}
                    className={`max-w-fit ${isPregnant ? "bg-accent text-muted-foreground" : ""}`}
                  >
                    Ya
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPregnant(false);
                    }}
                    variant={"ghost"}
                    className={`max-w-fit ${!isPregnant ? "bg-accent text-muted-foreground" : ""}`}
                  >
                    Tidak
                  </Button>
                </div>
              </div>

              {isPregnant ? (
                <>
                  <div className="flex flex-col mt-2 space-y-1">
                    <Label className="text-xs font-normal">
                      Masukkan Tanggal HTPT Kehamilan
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] text-xs justify-start text-left",
                            !pregnancyStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {pregnancyStartDate ? (
                            format(pregnancyStartDate, "PPP", { locale: id })
                          ) : (
                            <span>Tanggal HTPT Kehamilan</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          locale={id}
                          mode="single"
                          selected={pregnancyStartDate}
                          onSelect={setPregnancyStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {pregnancyStartDate ? (
                      <>
                        <br></br>
                        <Badge className="block max-w-fit" variant={"outline"}>
                          {getPregnantDuration(pregnancyStartDate)}
                        </Badge>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}

              {pregnancyStartDate != undefined && (
                <div className="flex w-full justify-between items-center">
                  <span className="text-sm font-medium">
                    Apakah Anda punya anak lain?
                  </span>
                  <div className="text-xs">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setHaveOtherChildren(true);
                      }}
                      variant={"ghost"}
                      className={`max-w-fit ${haveOtherChildren ? "bg-accent text-muted-foreground" : ""}`}
                    >
                      Ya
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setHaveOtherChildren(false);
                      }}
                      variant={"ghost"}
                      className={`max-w-fit ${!haveOtherChildren ? "bg-accent text-muted-foreground" : ""}`}
                    >
                      Tidak
                    </Button>
                  </div>
                </div>
              )}
              {haveOtherChildren ? (
                <>
                  <div className="flex mt-2 flex-col text-xs space-y-3">
                    {/* Nama Anak */}
                    <Input
                      className="text-xs"
                      placeholder="Nama Anak"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                    />

                    {/* Jenis Kelamin */}
                    <Select onValueChange={setChildGender} value={childGender}>
                      <SelectTrigger className="text-xs">
                        <SelectValue
                          className="text-xs"
                          placeholder="Jenis Kelamin"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50 border rounded-lg text-xs">
                        <SelectItem className="text-xs" value="male">
                          Laki-laki
                        </SelectItem>
                        <SelectItem className="text-xs" value="female">
                          Perempuan
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Tanggal Lahir Anak */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-[240px] text-xs justify-start text-left"
                        >
                          <CalendarIcon />
                          {childBirthDate ? (
                            format(childBirthDate, "PPP", { locale: id })
                          ) : (
                            <span>Tanggal Lahir Anak</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start">
                        <Calendar
                          locale={id}
                          mode="single"
                          selected={childBirthDate}
                          onSelect={setChildBirthDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {/* Alergi */}
                    <Input
                      className="text-xs"
                      placeholder="Alergi (pisahkan dengan koma)"
                      value={childAllergies.join(", ")}
                      onChange={(e) =>
                        setChildAllergies(
                          e.target.value
                            .split(",")
                            .map((allergy) => allergy.trim())
                            .filter((allergy) => allergy)
                        )
                      }
                    />

                    {/* Catatan Tambahan */}
                    <Input
                      className="text-xs"
                      placeholder="Catatan Tambahan"
                      value={childNotes}
                      onChange={(e) => setChildNotes(e.target.value)}
                    />

                    {/* Button to add child */}
                    <Button
                      className="w-full font-normal text-sm mt-2"
                      variant="outline"
                      onClick={(e) => addChild(e)}
                    >
                      <Plus /> Tambah Anak
                    </Button>

                    {/* Display added children */}
                    {children && children.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {children.map((child, index) => (
                          <li key={index} className="border p-2 rounded">
                            <p>Nama Anak: {child.name}</p>
                            <p>
                              Jenis Kelamin:{" "}
                              {child.gender === "male"
                                ? "Laki-laki"
                                : "Perempuan"}
                            </p>
                            <p>
                              Tanggal Lahir:{" "}
                              {format(child.birthDate, "PPP", { locale: id })}
                            </p>
                            <p>Alergi: {child.allergies.join(", ")}</p>
                            <p>Catatan: {child.notes}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              ) : null}

              {/* Add other fields as needed */}
              {isPregnant != undefined && children != undefined && (
                <Button
                  className="mt-3"
                  onClick={register}
                  variant={"outline"}
                  disabled={loading}
                >
                  Daftar Akun
                </Button>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="health-officer-details"
            className={`p-3 ${tab != "health-officer-details" ? "!hidden" : ""}`}
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
                Daftar Akun{" "}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
