"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/AdminAccordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

export const AdminSidebar = () => {
  const [tab, setTab] = useState("analisa");

  return (
    <aside className="min-h-full bg-white py-5 px-2">
      <Accordion
        className="min-h-full"
        type="multiple"
        defaultValue={["analisa", "intervensi", "marketing", "edukasi"]}
      >
        <AccordionItem className="border-b-0" value="analisa">
          <AccordionTrigger
            className={`${
              tab === "analisa" ? "bg-sky-100 text-sky-500" : ""
            } rounded-lg`}
          >
            Analisa Stunting per Provinsi
          </AccordionTrigger>
          <AccordionContent>
            <p>Laporan Rangkuman</p>
            <p>Pengolahan Budget Proyek</p>
            <p>Pembuatan Proposal Proyek</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className="border-b-0" value="intervensi">
          <AccordionTrigger>Penanganan Proyek Intervensi</AccordionTrigger>
          <AccordionContent>
            <p>Laporan Hasil Proyek</p>
            <p>Suplai & Tenaga Kerja</p>
            <p>Pengrekrutan</p>
          </AccordionContent>
        </AccordionItem>
        <Separator className="my-3" />
        <AccordionItem className="border-b-0" value="marketing">
          <AccordionTrigger>Penanganan Marketing</AccordionTrigger>
          <AccordionContent>
            <p>Laporan Rangkuman</p>

            <p>Whatsapp</p>
            <p>Instagram</p>
            <p>Facebook</p>
            <p>Pengrekrutan</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className="border-b-0" value="edukasi">
          <AccordionTrigger>Penanganan Edukasi</AccordionTrigger>
          <AccordionContent>
            <p>Laporan Rangkuman</p>
            <p>Instagram</p>
            <p>Facebook</p>
            <p>Pengrekrutan</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};
