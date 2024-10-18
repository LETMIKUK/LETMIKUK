"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Layout, Menu } from "antd";
const { Sider } = Layout;

export const AdminSidebar = () => (
  <Sheet defaultOpen={true}>
    <SheetContent className="h-full w-[300px]">
      {" "}
      <div className="">Test</div>
    </SheetContent>
  </Sheet>
);
