"use client";
import { Button } from "@/components/ui/button";
import React from "react";

function scrollToElement(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

const ScrollButton = ({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className: string;
}) => {
  return (
    <Button
      variant={"ghost"}
      className={`${className} hover:bg-transparent bg-transparent flex flex-col items-center justify-center hover:scale-110 transition-transform`}
      onClick={() => scrollToElement(id)}
    >
      {children}
    </Button>
  );
};

export default ScrollButton;
