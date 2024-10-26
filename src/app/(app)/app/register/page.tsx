import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Input placeholder="Email" type="email" />
      <Input placeholder="Password" type="password" />
    </div>
  );
}
