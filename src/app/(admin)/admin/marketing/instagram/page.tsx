"use client";
import { useToPng, useToSvg, useToJpeg } from "@hugocxl/react-to-image";
import { Breadcrumb, Radio, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  Plus,
  Trash,
  Zap,
} from "lucide-react";
import Sparkle from "@/app/components/svg/Sparkle";
import GradientAIBarsContainer from "@/app/components/GradientAIBarsContainer";
import GradientText from "@/app/components/GradientText";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [_, convert, ref] = useToJpeg<HTMLDivElement>({
    quality: 1,
    onSuccess: (data) => {
      const link = document.createElement("a");
      link.download = `${
        headingValue
          ? headingValue.replace(/\s+/g, "-").toLowerCase()
          : "ig-post-stunting"
      }.png`;
      link.href = data;
      link.click();
    },
  });

  const [headingValue, setHeadingValue] = useState("");
  const [bodyValue, setBodyValue] = useState<string[]>([""]);
  const [keywordValue, setKeywordValue] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const startTimeRef = useRef<null | number>(null);
  const secondsPassedRef = useRef(0);
  const intervalRef = useRef<any>(null);
  const timeDisplayRef = useRef<HTMLSpanElement>(null);

  // Handle adding a new paragraph
  const addParagraph = () => {
    setBodyValue([...bodyValue, ""]);
  };

  // Handle deleting a specific paragraph
  const deleteParagraph = (index: number) => {
    setBodyValue(bodyValue.filter((_, i) => i !== index));
  };

  // Handle updating a specific paragraph
  const updateParagraph = (index: number, newValue: string) => {
    setBodyValue(bodyValue.map((value, i) => (i === index ? newValue : value)));
  };

  function updateDisplay() {
    if (startTimeRef.current !== null && timeDisplayRef.current) {
      const now = Date.now();
      secondsPassedRef.current = (now - startTimeRef.current) / 1000;
      timeDisplayRef.current.textContent = secondsPassedRef.current.toFixed(3);
    }
    intervalRef.current = requestAnimationFrame(updateDisplay); // Use requestAnimationFrame
  }

  function handleStart() {
    startTimeRef.current = Date.now();

    cancelAnimationFrame(intervalRef.current); // Clear previous animation frame
    intervalRef.current = requestAnimationFrame(updateDisplay); // Start the animation frame
  }

  function handleStop() {
    cancelAnimationFrame(intervalRef.current); // Stop the updates
  }

  useEffect(() => {
    return () => cancelAnimationFrame(intervalRef.current); // Cleanup on unmount
  }, []);

  // ...

  const testValue = {
    headingValue: "Apa itu Stunting?",
    bodyValue:
      "Stunting adalah kondisi di mana anak memiliki tinggi badan yang lebih pendek dari anak seusianya akibat kurang gizi. Hal ini dapat menghambat pertumbuhan fisik dan perkembangan kognitif. Dengan pemantauan dan intervensi gizi yang baik, kita bisa membantu anak-anak tumbuh sehat. Mari bersama-sama kita atasi stunting dan berikan masa depan yang lebih baik untuk generasi mendatang.",
  };

  const parseContent = (content: string) => {
    // Remove asterisks used for bolding
    const cleanedContent = content
      .replace(/\*\*/g, "") // Remove double asterisks
      .replace(/[*_]/g, "") // Remove single asterisks and underscores
      .replace(/[^\w\s.,?!]/g, "") // Remove emojis or special symbols
      .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
      .replace(/\n{2,}/g, "\n"); // Replace multiple newlines with a single newline

    // Regular expression to match Judul and Isi sections
    const judulMatch = content.match(/Judul:\s*(.*)/);
    const isiMatch = content.match(/Isi:\s*([\s\S]*)/);

    // Extract Judul
    const judul = judulMatch ? judulMatch[1].trim() : "";

    // Extract Isi and split it into paragraphs based on newlines
    const isi = isiMatch ? isiMatch[1].trim().split("\n\n") : [];

    // Set the heading and body
    setHeadingValue(judul);
    setBodyValue(isi);
  };

  const contentPages = [headingValue, ...bodyValue];

  // Display bodyValue as a string with paragraphs separated by newlines
  const bodyValueDisplay = bodyValue.join("\n");

  const handleGenerateContent = async (prompt: string) => {
    setIsLoading(true);
    handleStart();

    try {
      const generate = await fetch("/api/generate/ig/education", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      if (!generate.ok) {
        const errorData = await generate.json();
        console.error("Generation error:", errorData);
        throw new Error(errorData.error?.message || "Generation failed");
      }

      const response = await generate.json();
      console.log("Generation response:", response);

      if (response.data) {
        parseContent(response.data);
      } else if (response.error) {
        console.warn("Content generation issue:", response.error);
        // Optionally display a message to the user or provide default content
      } else {
        console.warn("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Client-side error:", error);
      // Optionally show error to user
      // setError(error instanceof Error ? error.message : 'Generation failed');
    } finally {
      setIsLoading(false);
    }
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
            title: "Buat Postingan Baru",
          },
        ]}
      />
      <div className="p-5 border w-full h-full block bg-white mt-3 rounded-lg">
        <h1>IG Post</h1>
        <div className="flex flex-row py-6 space-x-6">
          <div className="w-96 h-96 relative" ref={ref}>
            <Carousel className="w-full h-full">
              <CarouselContent className="w-full h-full flex">
                {/* Heading slide */}
                <CarouselItem className="flex flex-col items-center justify-center relative w-96 h-96">
                  <Image
                    alt="canva background template"
                    src="/images/canva_templates/blue_food_love_pattern.png"
                    width={384}
                    height={384}
                    className="z-0"
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-5 text-center">
                    <p className="text-2xl font-bold text-white">
                      {headingValue}
                    </p>
                  </div>
                </CarouselItem>
                {/* Body slides */}
                {bodyValue.map((paragraph, index) => (
                  <CarouselItem
                    key={index}
                    className="flex flex-col items-center justify-center relative w-96 h-96"
                  >
                    <Image
                      alt="canva background template"
                      src="/images/canva_templates/blue_food_love_pattern.png"
                      width={384}
                      height={384}
                      className="z-0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-5">
                      <p className="text-sm px-5 text-justify text-white">
                        {paragraph}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
                {/* {contentPages.map((content, index) => (
                  <CarouselItem
                    key={index}
                    className="flex flex-col items-center justify-center relative w-96 h-96"
                  >
                    <Image
                      alt="canva background template"
                      src="/images/canva_templates/blue_food_love_pattern.png"
                      width={384} // Fixed 96x96 Tailwind size
                      height={384}
                      className="z-0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-5 text-center">
                      {index === 0 ? (
                        <p className="text-2xl font-bold text-white">
                          {content}
                        </p>
                      ) : (
                        <p className="text-sm px-5 text-justify text-white">
                          {content}
                        </p>
                      )}
                    </div>
                  </CarouselItem>
                ))} */}
              </CarouselContent>
            </Carousel>
            {/* <div className="absolute p-5 space-y-3 w-full flex flex-col justify-center items-center text-center top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              <p className="text-2xl font-bold text-white" id="post-heading-1">
                {headingValue}
              </p>
              <p className="text-sm text-justify text-white" id="post-body-1">
                {bodyValue}
              </p>
            </div> */}
          </div>
          <div className="flex flex-col w-full space-y-3">
            {isLoading ? ( // Show loading segment if loading
              <>
                <div className="flex space-x-2">
                  <Sparkle className="animate-spin" />
                  <GradientText text="Membuat konten..." />
                </div>
                <GradientAIBarsContainer barCount={5} />
              </>
            ) : null}
            {isLoading ? (
              <div className="!space-y-1 flex flex-col">
                <span ref={timeDisplayRef} className="text-slate-500 text-xs">
                  {secondsPassedRef.current.toFixed(3)}
                </span>
                <p className="text-slate-500 text-xs">
                  Estimasi waktu: 5 menit{" "}
                </p>
              </div>
            ) : null}
            <Label>Subtopik</Label>
            <Input
              placeholder="contoh: asi ekslusif, 1000 hari pertama, dll"
              value={keywordValue}
              onChange={(e) => setKeywordValue(e.target.value)}
            />
            <Button
              disabled={!keywordValue || isLoading}
              onClick={() => handleGenerateContent(keywordValue)}
              // iconPosition="start"
              // icon={<Zap size={15} />}
            >
              <Zap /> Buat Konten
            </Button>
            <Label>Judul Postingan</Label>

            <Input
              value={headingValue}
              onChange={(e) => setHeadingValue(e.target.value)}
            />
            <Label>Isi Postingan</Label>

            {bodyValue.map((paragraph, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={paragraph}
                  onChange={(e) => updateParagraph(index, e.target.value)}
                  placeholder={`Paragraf ${index + 1}`}
                />
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  onClick={() => deleteParagraph(index)}
                >
                  <Trash />
                </Button>
              </div>
            ))}

            {/* Add new paragraph button */}
            <Button type="button" onClick={addParagraph}>
              <Plus />
              Tambah Paragraf
            </Button>
          </div>
        </div>

        <Button onClick={convert}>Download PNG</Button>
      </div>
    </>
  );
}
