// "use client";

// import LetmikukLogo from "@/app/components/svg/LetmikukLogo";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Loader } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import ShadCN Alert

// export default function Page() {
//   const [fullName, setFullName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string>(""); // State for error message
//   const router = useRouter();

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage(""); // Clear any previous error messages

//     try {
//       const res = await fetch("/api/app/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ fullName, email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         router.push("/app"); // Redirect after successful registration
//       } else {
//         setErrorMessage(data.message || "Registration failed."); // Display API error message
//       }
//     } catch (error) {
//       setErrorMessage("An unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex relative w-full justify-center flex-col space-y-3 items-center">
//       <h1 className="text-3xl max-w-64 font-bold">
//         <LetmikukLogo />
//       </h1>
//       {/* Loading overlay */}
//       <div
//         className={`absolute bg-black/10 w-full h-full flex items-center justify-center z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${loading ? "block" : "hidden"}`}
//       >
//         <Loader className="animate-spin" />
//       </div>
//       <div className="max-w-1/2 space-y-3 flex flex-col justify-center items-center">
//         <h1>Daftar Akun</h1>

//         {/* Error Message Display */}
//         {errorMessage && (
//           <Alert variant="destructive" className="w-full">
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>{errorMessage}</AlertDescription>
//           </Alert>
//         )}

//         {/* Registration Form */}
//         <form
//           onSubmit={handleRegister}
//           className="flex flex-col items-center justify-center space-y-3"
//         >
//           <Input
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             placeholder="Nama Lengkap"
//             required
//           />
//           <Input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             type="email"
//             required
//           />
//           <Input
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             type="password"
//             required
//           />
//           <Button type="submit" variant={"outline"} disabled={loading}>
//             Daftar
//           </Button>
//         </form>
//         <Link href="/app/login">
//           <Button className="text-xs" variant={"link"}>
//             Sudah punya akun?
//           </Button>
//         </Link>
//       </div>
//     </div>
//   );
// }
"use client";

import LetmikukLogo from "@/app/components/svg/LetmikukLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent } from "@/components/ui/tabs"; // Import ShadCN Tabs
import { useRegistration } from "@/lib/contexts/RegistrationContext";

export default function Page() {
  // const { registrationInfo, setRegistrationInfo } = useRegistration();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [tab, setTab] = useState<string>("register");
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationInfo),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/app"); // Redirect after successful registration
      } else {
        setErrorMessage(data.message || "Registration failed.");
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
      <div
        className={`absolute bg-black/10 w-full h-full flex items-center justify-center z-10 ${loading ? "block" : "hidden"}`}
      >
        <Loader className="animate-spin" />
      </div>

      <div className="max-w-1/2 space-y-3 flex flex-col justify-center items-center">
        <h1>Daftar Akun</h1>

        {errorMessage && (
          <Alert variant="destructive" className="w-full">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs value={tab} defaultValue="register">
          <TabsContent value="register">
            <form className="flex flex-col items-center justify-center space-y-3">
              <Input
                value={registrationInfo.fullName}
                onChange={(e) =>
                  setRegistrationInfo((info: any) => ({
                    ...info,
                    fullName: e.target.value,
                  }))
                }
                placeholder="Nama Lengkap"
                required
              />
              <Input
                value={registrationInfo.email}
                onChange={(e) =>
                  setRegistrationInfo((info: any) => ({
                    ...info,
                    email: e.target.value,
                  }))
                }
                placeholder="Email"
                type="email"
                required
              />
              <Input
                value={registrationInfo.password}
                onChange={(e) =>
                  setRegistrationInfo((info: any) => ({
                    ...info,
                    password: e.target.value,
                  }))
                }
                placeholder="Password"
                type="password"
                required
              />
              <Button disabled={!fullName || !password} variant={"outline"}>
                Buat Akun
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="role-selection">
            <div className="flex space-x-3">
              <Button
                onClick={() =>
                  setRegistrationInfo((info: any) => ({
                    ...info,
                    role: "Mother",
                  }))
                }
                variant="outline"
              >
                Mother
              </Button>
              <Button
                onClick={() =>
                  setRegistrationInfo((info: any) => ({
                    ...info,
                    role: "Health Officer",
                  }))
                }
                variant="outline"
              >
                Health Officer
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="mother-details">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center space-y-3"
            >
              <Input
                placeholder="Pregnancy Start Date"
                onChange={(e) =>
                  setRegistrationInfo((info) => ({
                    ...info,
                    additionalInfo: {
                      ...info.additionalInfo,
                      pregnancyStartDate: e.target.value,
                    },
                  }))
                }
              />
              {/* Add other fields as needed */}
              <Button type="submit" variant={"outline"} disabled={loading}>
                Submit Mother Info
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="officer-details">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center space-y-3"
            >
              <Input
                placeholder="NIK"
                onChange={(e) =>
                  setRegistrationInfo((info) => ({
                    ...info,
                    additionalInfo: {
                      ...info.additionalInfo,
                      nik: e.target.value,
                    },
                  }))
                }
              />
              <Button type="submit" variant={"outline"} disabled={loading}>
                Submit Health Officer Info
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <Link href="/app/login">
          <Button className="text-xs" variant={"link"}>
            Sudah punya akun?
          </Button>
        </Link>
      </div>
    </div>
  );
}
