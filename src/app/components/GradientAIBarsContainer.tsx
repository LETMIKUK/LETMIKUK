import React from "react";
import GradientAIBar from "./GradientAIBar";

interface GradientAIBarsContainerProps {
  barCount: number; // Prop to specify how many bars to render
}

const GradientAIBarsContainer: React.FC<GradientAIBarsContainerProps> = ({
  barCount,
}) => {
  const bars = Array.from({ length: barCount }, () => {
    // Randomize the duration for initial width expansion (0.5s to 1.5s)
    const initialDuration =
      (Math.random() * (1.5 - 0.5) + 0.5).toFixed(2) + "s";

    // Randomize the duration for gradient movement (1s to 3s)
    const gradientDuration = (Math.random() * (1.5 - 1) + 1).toFixed(2) + "s";

    return (
      <GradientAIBar
        key={Math.random()} // Unique key for each bar
        initialDuration={initialDuration}
        gradientDuration={gradientDuration}
      />
    );
  });

  return <div className="flex flex-col space-y-1">{bars}</div>;
};

export default GradientAIBarsContainer;
