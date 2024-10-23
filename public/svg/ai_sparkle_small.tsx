const animationDuration = "1s";

const Sparkle = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={26}
    fill="none"
    {...props}
    style={{ animation: `rotateGradient ${animationDuration} linear infinite` }} // Apply animation to the SVG
  >
    <style>
      {`
        @keyframes rotateGradient {
          0% {
            transform: rotate(45deg);
          }
          100% {
            transform: rotate(405deg); /* 360 + 45 for a complete rotation */
          }
        }
      `}
    </style>
    <path
      fill="url(#a)"
      d="M11.71 1.678c.297-1.206 2.012-1.206 2.31 0a14.274 14.274 0 0 0 10.436 10.436c1.206.298 1.206 2.012 0 2.31A14.274 14.274 0 0 0 14.02 24.86c-.297 1.206-2.011 1.206-2.31 0A14.274 14.274 0 0 0 1.274 14.424c-1.206-.298-1.206-2.012 0-2.31A14.274 14.274 0 0 0 11.71 1.678Z"
    />
    <defs>
      <linearGradient
        id="a"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#EC4899">
          <animate
            attributeName="stop-color"
            values="#EC4899; #84CC16; #0EA5E9; #EC4899"
            dur={animationDuration}
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="50%" stopColor="#84CC16">
          <animate
            attributeName="stop-color"
            values="#84CC16; #0EA5E9; #EC4899; #84CC16"
            dur={animationDuration}
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" stopColor="#0EA5E9">
          <animate
            attributeName="stop-color"
            values="#0EA5E9; #EC4899; #84CC16; #0EA5E9"
            dur={animationDuration}
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>
    </defs>
  </svg>
);

export default Sparkle;
