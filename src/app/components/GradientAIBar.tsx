import React from "react";

interface GradientAIBarProps {
  initialDuration: string; // Prop for initial width expansion duration
  gradientDuration: string; // Prop for gradient animation duration
}

const GradientAIBar: React.FC<GradientAIBarProps> = ({
  initialDuration,
  gradientDuration,
}) => {
  const gradientStyle = {
    background:
      "linear-gradient(90deg,#EC4899 16.666%, #84CC16 50%, #0EA5E9 83.333%, #EC4899 100%)",
    backgroundSize: "400% 100%", // Make the background wide enough for smooth transition
    animation: `moveGradient ${gradientDuration} linear infinite`, // Use passed prop for speed
    height: "1rem", // Height of the bar (adjust as needed)
    width: "100%", // Full width of the bar after initial load
    borderRadius: "0.375rem", // Rounded corners like Tailwind's rounded-md
    transition: `width ${initialDuration} ease-in-out`, // Smooth transition for width
  };

  const containerStyle = {
    width: "0%", // Start from 0 width
    animation: `expandBar ${initialDuration} ease-in-out forwards`, // Expand width with passed duration
  };

  // Embedding keyframes for the gradient movement and width expansion directly in the component
  const keyframes = `
    @keyframes moveGradient {
      0% {
        background-position: 0% 50%;
      }
      100% {
        background-position: 125% 50%;
      }
    }
    
    @keyframes expandBar {
      0% {
        width: 0%;
      }
      100% {
        width: 100%;
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={containerStyle}>
        <div style={gradientStyle}></div>
      </div>
    </>
  );
};

export default GradientAIBar;
