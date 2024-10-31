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
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex w-full justify-center flex-col space-y-3 items-center">
      <h1 className="text-3xl max-w-64 font-bold">
        <LetmikukLogo />
      </h1>
      <div className="max-w-1/2 space-y-3 flex flex-col justify-center items-center">
        <h1>Login</h1>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Akun Preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="master">Full Access</SelectItem>
            <SelectItem value="project_director">Project Director</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="education">Education</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" />
        <Button variant={"outline"}>Masuk</Button>
        <Link href="/app/register">
          <Button variant={"link"} className="text-xs">
            Buat akun?
          </Button>
        </Link>
      </div>
    </div>
  );
}
