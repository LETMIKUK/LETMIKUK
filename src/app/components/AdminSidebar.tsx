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
import { useEffect, useState } from "react";
import { categories } from "../json/adminSidebarLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AdminSidebar = () => {
  const pathname = usePathname(); // Get the current path
  const [activeTab, setActiveTab] = useState<string>("");
  useEffect(() => {
    categories.forEach((category) => {
      // Check if the current path matches any parent or child links
      const isActive =
        pathname.includes(`/admin/${category.id}`) ||
        category.links.some((link) => pathname.includes(`/admin/${link.url}`));

      // Set the active tab if any match
      if (isActive) {
        setActiveTab(category.id);
        console.log(category.id);
      }
    });
  }, [pathname]);

  // preload tailwind classes
  // bg-sky-100 text-sky-500 bg-amber-100 text-amber-500 bg-pink-100 text-pink-500 bg-lime-100 text-lime-500

  return (
    <aside className="min-h-full min-w-[200px] bg-white py-5 px-2">
      <Accordion
        className="min-h-full"
        type="multiple"
        defaultValue={categories.map((cat) => cat.id)}
      >
        {categories.map((category) => {
          const isActive = activeTab === category.id;

          return (
            <div key={category.id}>
              {/* Render the separator before a category if separatorBefore is true */}
              {category.separatorBefore && <Separator className="my-3" />}

              <AccordionItem
                key={category.id}
                value={category.id}
                className="border-b-0"
              >
                <AccordionTrigger
                  className={`${
                    activeTab === category.id
                      ? `bg-${category.color}-100 text-${category.color}-500`
                      : ""
                  } transition-colors text-start`}
                >
                  {/* Make this a full navigation link */}
                  <Link href={`/admin/${category.id}`}>{category.title}</Link>
                </AccordionTrigger>
                <AccordionContent>
                  {category.links.map((link) => {
                    // Check if the current link corresponds to the active pathname
                    const isLinkActive =
                      pathname === `/admin${link.url}` ||
                      pathname === `/admin${link.url}/`;

                    return (
                      <p key={link.url} className="w-full">
                        <Link
                          href={`/admin${link.url}`}
                          onClick={() => setActiveTab(category.id)}
                          className={`${
                            isLinkActive ? `text-${category.color}-500` : ""
                          } px-2 py-2 w-full transition-colors`}
                        >
                          {link.title}
                        </Link>
                      </p>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </div>
          );
        })}
      </Accordion>
    </aside>
  );
};
