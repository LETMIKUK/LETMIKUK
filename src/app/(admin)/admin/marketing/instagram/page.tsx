"use client";
import { useToPng } from "@hugocxl/react-to-image";
import { Button } from "antd";

export default function Page() {
  const [_, convert, ref] = useToPng<HTMLDivElement>({
    quality: 0.8,
    onSuccess: (data) => {
      const link = document.createElement("a");
      link.download = "my-image-name.jpeg";
      link.href = data;
      link.click();
    },
  });

  return (
    <div
      className="p-5 border ml-3 bg-white mt-3 rounded-lg max-h-36"
      ref={ref}
    >
      <h1>My component</h1>
      <Button onClick={convert}>Download PNG</Button>
    </div>
  );
}
