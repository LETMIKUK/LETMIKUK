const animationDuration = "1s";

const LargeSparkle = (props: any) => (
  <svg
    width="63"
    height="62"
    viewBox="0 0 63 62"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ animation: `rotateGradient ${animationDuration} linear infinite` }} // Animation for gradient rotation
    {...props}
  >
    <style>
      {`
        @keyframes rotateGradient {
          0% {
            transform: rotate(45deg);
          }
          100% {
            transform: rotate(405deg); /* Full 360° rotation + 45° starting angle */
          }
        }
      `}
    </style>
    <path
      fill="url(#a)"
      d="M28.3426 2.30148C29.078 -0.677656 33.3132 -0.677655 34.0486 2.30148V2.30148C37.188 15.018 47.1171 24.9468 59.8336 28.0859V28.0859C62.8128 28.8214 62.8128 33.0567 59.8336 33.7921V33.7921C47.1171 36.9313 37.188 46.8601 34.0486 59.5766V59.5766C33.3132 62.5557 29.078 62.5557 28.3426 59.5765V59.5765C25.2032 46.8601 15.2741 36.9313 2.55759 33.7921V33.7921C-0.421626 33.0567 -0.421627 28.8214 2.55759 28.0859V28.0859C15.2741 24.9468 25.2032 15.018 28.3426 2.30148V2.30148Z"
    />
    <defs>
      <linearGradient
        id="a"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%" // Rotating gradient set to 45° angle
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

export default LargeSparkle;
