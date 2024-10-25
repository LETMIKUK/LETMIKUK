"use client";
import { useToPng, useToSvg, useToJpeg } from "@hugocxl/react-to-image";
import { Breadcrumb, Button, Input, Radio, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyStartIcon,
  Zap,
} from "lucide-react";
import Sparkle from "@/app/components/svg/Sparkle";
import GradientAIBarsContainer from "@/app/components/GradientAIBarsContainer";
import GradientText from "@/app/components/GradientText";
// import { useStopwatch } from "react-use-precision-timer";
import { useRef } from "react";

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
  const [bodyValue, setBodyValue] = useState("");
  const [keywordValue, setKeywordValue] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const startTimeRef = useRef<null | number>(null);
  const secondsPassedRef = useRef(0);
  const intervalRef = useRef<any>(null);
  const timeDisplayRef = useRef<HTMLSpanElement>(null);

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
        // Use Next.js specific options
        next: {
          revalidate: 0,
        },
      });

      if (!generate.ok) {
        const errorData = await generate.json();
        console.error("Generation error:", errorData);
        throw new Error(errorData.error?.message || "Generation failed");
      }

      const response = await generate.json();
      console.log("Generation response:", response);

      if (response.data && typeof response.data === "string") {
        setBodyValue(response.data);
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
            title: "Buat post baru",
          },
        ]}
      />
      <div className="p-5 border bg-white mt-3 rounded-lg">
        <h1>IG Post</h1>
        <div className="flex flex-row py-6 space-x-6">
          <div className="aspect-square w-96 max-w-96 relative" ref={ref}>
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
              {/* 
              <Button>
                <AlignHorizontalJustifyStart />{" "}
              </Button>

              <Button>
                <AlignHorizontalJustifyCenter />{" "}
              </Button>
              <Button>
                <AlignHorizontalJustifyEnd />{" "}
              </Button> */}
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            {isLoading ? ( // Show loading segment if loading
              <>
                <div className="flex space-x-2">
                  <Sparkle className="animate-spin" />
                  <GradientText />
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

            <Input
              value={keywordValue}
              onChange={(e) => setKeywordValue(e.target.value)}
            />
            <Button
              disabled={!keywordValue || isLoading}
              onClick={() => handleGenerateContent(keywordValue)}
              iconPosition="start"
              shape="round"
              icon={<Zap size={15} />}
            >
              Buat Konten
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
            <Radio.Group
              // block
              optionType="button"
              buttonStyle="solid"
              options={[
                {
                  label: <AlignHorizontalJustifyCenter />,
                  value: "start",
                },
                {
                  label: <AlignHorizontalJustifyCenter />,
                  value: "center",
                },
                {
                  label: <AlignHorizontalJustifyEnd />,
                  value: "end",
                },
              ]}
              defaultValue="center"
            />
          </div>
        </div>

        <Button onClick={convert}>Download PNG</Button>
      </div>
    </>
  );
}
