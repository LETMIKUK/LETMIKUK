"use client";
import { useToPng, useToSvg, useToJpeg } from "@hugocxl/react-to-image";
import { Breadcrumb, Button, Input, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Zap } from "lucide-react";
import Sparkle from "@/app/components/svg/Sparkle";
import SparkleLarge from "@/app/components/svg/SparkleLarge";

export default function Page() {
  const [_, convert, ref] = useToJpeg<HTMLDivElement>({
    quality: 0.8,
    onSuccess: (data) => {
      const link = document.createElement("a");
      link.download = "my-image-name.png";
      link.href = data;
      link.click();
    },
  });

  const [headingValue, setHeadingValue] = useState("");
  const [bodyValue, setBodyValue] = useState("");

  const testValue = {
    headingValue: "Apa itu Stunting?",
    bodyValue:
      "Stunting adalah kondisi di mana anak memiliki tinggi badan yang lebih pendek dari anak seusianya akibat kurang gizi. Hal ini dapat menghambat pertumbuhan fisik dan perkembangan kognitif. Dengan pemantauan dan intervensi gizi yang baik, kita bisa membantu anak-anak tumbuh sehat. Mari bersama-sama kita atasi stunting dan berikan masa depan yang lebih baik untuk generasi mendatang.",
  };

  const handleGenerateContent = () => {
    setHeadingValue(testValue.headingValue);
    setBodyValue(testValue.bodyValue);
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link href="/admin">Admin Dashboard</Link>,
          },
          {
            title: <Link href="/admin/marketing">Marketing</Link>,
          },
          {
            title: <Link href="/admin/marketing/instagram">Instagram</Link>,
          },
          {
            title: "Buat post baru",
          },
        ]}
      />
      <div className="p-5 border bg-white mt-3 rounded-lg">
        <h1>IG Post</h1>
        <div className="flex flex-row py-6 space-x-6">
          <div className="aspect-square w-96 relative" ref={ref}>
            <Image
              alt="canva background template"
              fill={true}
              className="absolute z-0"
              src={"/images/canva_templates/blue_food_love_pattern.png"}
            />
            <div className="absolute p-5 space-y-3 w-full flex flex-col justify-center items-center text-center top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              <p className="text-2xl font-bold text-white" id="post-heading-1">
                {headingValue}
              </p>
              <p className="text-sm text-justify text-white" id="post-body-1">
                {bodyValue}
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Sparkle className="animate-spin" />
            <SparkleLarge className="animate-spin" />

            <Button
              onClick={handleGenerateContent}
              iconPosition="start"
              shape="round"
              icon={<Zap size={15} />}
            >
              Generate Content
            </Button>
            <Typography title="Heading" />
            <Input
              value={headingValue}
              onChange={(e) => setHeadingValue(e.target.value)}
            />
            <Typography title="Body" />
            <Input
              title="Body"
              value={bodyValue}
              onChange={(e) => setBodyValue(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={convert}>Download PNG</Button>
      </div>
    </>
  );
}
