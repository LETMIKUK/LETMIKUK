import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <div className="flex flex-col space-y-3 justify-center items-center">
      <h1>Login</h1>
      <Input placeholder="Email" type="email" />
      <Input placeholder="Password" type="password" />
    </div>
  );
}
