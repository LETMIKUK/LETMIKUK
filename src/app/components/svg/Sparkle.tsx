const animationDuration = "2s"; // Duration for gradient rotation and colour change
const svgWidth = 26; // Width of the SVG
const svgHeight = 26; // Height of the SVG
const gradientColors = {
  start: "#EC4899",
  middle: "#84CC16",
  end: "#0EA5E9",
}; // Gradient colours
const initialGradientAngle = 45; // Starting angle of the gradient
const rotationAmount = 360; // Rotation angle amount

const Sparkle = (props: any) => (
  <svg
    width={svgWidth}
    height={svgHeight}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      animation: `rotateGradient ${animationDuration} linear infinite`,
    }}
    {...props}
  >
    <style>
      {`
        @keyframes rotateGradient {
          0% {
            transform: rotate(${initialGradientAngle}deg);
          }
          100% {
            transform: rotate(${
              initialGradientAngle + rotationAmount
            }deg); /* Full rotation + initial angle */
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
        y2="100%" // Gradient angle set to 45°
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor={gradientColors.start}>
          <animate
            attributeName="stop-color"
            values={`${gradientColors.start}; ${gradientColors.middle}; ${gradientColors.end}; ${gradientColors.start}`}
            dur={animationDuration}
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="50%" stopColor={gradientColors.middle}>
          <animate
            attributeName="stop-color"
            values={`${gradientColors.middle}; ${gradientColors.end}; ${gradientColors.start}; ${gradientColors.middle}`}
            dur={animationDuration}
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" stopColor={gradientColors.end}>
          <animate
            attributeName="stop-color"
            values={`${gradientColors.end}; ${gradientColors.start}; ${gradientColors.middle}; ${gradientColors.end}`}
            dur={animationDuration}
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>
    </defs>
  </svg>
);

export default Sparkle;
