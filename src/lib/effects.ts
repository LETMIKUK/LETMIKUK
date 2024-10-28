"use client";

import { useEffect, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

export function useAnimatedText(text: string) {
  const animatedCursor = useMotionValue(0);
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    // Animate cursor to reveal text gradually
    const controls = animate(animatedCursor, text.length, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (latest) => {
        setCursor(Math.floor(latest));
      },
    });
    return () => controls.stop();
  }, [text]);

  return text.slice(0, cursor);
}
