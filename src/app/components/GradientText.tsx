import React from "react";

const GradientText = ({ text }: { text: string }) => {
  // Styles for the gradient text
  const gradientStyle = {
    background:
      "linear-gradient(90deg,#EC4899 16.666%, #84CC16 50%, #0EA5E9 83.333%, #EC4899 100%)",
    backgroundSize: "400% 100%", // Make the background wide enough for smooth transition
    WebkitBackgroundClip: "text", // For text gradient in WebKit browsers
    WebkitTextFillColor: "transparent", // Make the text fill transparent to see the gradient
    animation: "moveGradient 1s linear infinite", // Fixed gradient speed
  };

  // Keyframes for gradient movement
  const keyframes = `
    @keyframes moveGradient {
      0% {
        background-position: 0% 50%;
      }
      100% {
        background-position: 100% 50%;
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <p className="font-light" style={gradientStyle}>
        {/* Please let us cook 🙏 */}
        {text}
      </p>
    </>
  );
};

export default GradientText;
