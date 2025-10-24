"use client";
import { motion } from "motion/react";

export function Globe() {
  return (
    <motion.svg
      viewBox="0 0 782 781"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[500px] w-[500px] lg:h-[780px] lg:w-[780px]"
      animate={{
        rotate: 360,
        transition: { duration: 60, repeat: Infinity, repeatType: "loop" },
      }}
      style={{
        willChange: "transform",
      }}
    >
      <g filter="url(#filter0_f_1554_400)">
        <circle
          cx="391.001"
          cy="390.227"
          r="310.227"
          fill="#C1BFB0"
          fillOpacity="0.5"
        />
      </g>
      <g filter="url(#filter1_f_1554_400)">
        <g clipPath="url(#clip0_1554_400)">
          <rect
            x="118"
            y="98.6133"
            width="546"
            height="546"
            rx="273"
            fill="#1F1F1F"
          />
          <g style={{ mixBlendMode: "color-dodge" }}>
            <circle
              cx="220.375"
              cy="542.238"
              r="170.625"
              fill="#D9D9D9"
              fillOpacity="0.5"
            />
          </g>
          <g style={{ mixBlendMode: "color-dodge" }}>
            <circle cx="589.545" cy="269.238" r="170.625" fill="#D6DFFF" />
          </g>
          <g style={{ mixBlendMode: "color-dodge" }}>
            <circle cx="257.602" cy="259.932" r="170.625" fill="#7E859D" />
          </g>
          <g style={{ mixBlendMode: "color-dodge" }}>
            <circle cx="480.967" cy="287.852" r="170.625" fill="#0099FF" />
          </g>
          <g style={{ mixBlendMode: "color-dodge" }}>
            <circle cx="547.664" cy="517.42" r="170.625" fill="#5A5E5E" />
          </g>
          <foreignObject
            x="70.7734"
            y="69.9995"
            width="640.455"
            height="640.455"
          >
            <div
              style={{
                backdropFilter: "blur(5px)",
                clipPath: "url(#bgblur_1_1554_400_clip_path)",
                height: "100%",
                width: "100%",
              }}
            ></div>
          </foreignObject>
          <circle
            data-figma-bg-blur-radius="10"
            cx="391.001"
            cy="390.227"
            r="310.227"
            fill="black"
            fillOpacity="0.1"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_1554_400"
          x="0.773438"
          y="0"
          width="780.455"
          height="780.455"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="40"
            result="effect1_foregroundBlur_1554_400"
          />
        </filter>
        <filter
          id="filter1_f_1554_400"
          x="38"
          y="18.6133"
          width="706"
          height="706"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="40"
            result="effect1_foregroundBlur_1554_400"
          />
        </filter>
        <clipPath
          id="bgblur_1_1554_400_clip_path"
          transform="translate(-70.7734 -69.9995)"
        >
          <circle cx="391.001" cy="390.227" r="310.227" />
        </clipPath>
        <clipPath id="clip0_1554_400">
          <rect
            x="118"
            y="98.6133"
            width="546"
            height="546"
            rx="273"
            fill="white"
          />
        </clipPath>
      </defs>
    </motion.svg>
  );
}

export function SecondaryGlobe() {
  return (
    <motion.svg
      width="784"
      height="784"
      viewBox="0 0 784 784"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        rotate: 360,
        transition: { duration: 60, repeat: Infinity, repeatType: "loop" },
      }}
      style={{
        willChange: "transform",
      }}
    >
      <g filter="url(#filter0_f_1749_435)">
        <circle cx="392" cy="392" r="311" fill="#C1BFB0" fillOpacity="0.5" />
      </g>
      <g filter="url(#filter1_f_1749_435)">
        <g clipPath="url(#clip0_1749_435)">
          <rect
            x="118.32"
            y="99.6597"
            width="547.36"
            height="547.36"
            rx="273.68"
            fill="#1F1F1F"
          />
          <g style={{ mixBlendMode: "color-dodge" }}>
            <circle
              cx="220.948"
              cy="544.39"
              r="171.05"
              fill="#D9D9D9"
              fillOpacity="0.5"
            />
          </g>
          <g style={{ mixBlendMode: "color-dodge" }}>
            <circle cx="591.038" cy="270.71" r="171.05" fill="#FEFFD6" />
          </g>
          <g style={{ mixBlendMode: "color-dodge" }}>
            <circle cx="258.267" cy="261.38" r="171.05" fill="#9D917E" />
          </g>
          <g style={{ mixBlendMode: "color-dodge" }}>
            <circle cx="482.191" cy="289.37" r="171.05" fill="#FFB700" />
          </g>
          <g style={{ mixBlendMode: "color-dodge" }}>
            <circle cx="549.052" cy="519.51" r="171.05" fill="#5A5E5E" />
          </g>
          <foreignObject x="70.9751" y="70.9746" width="642.05" height="642.05">
            <div
              style={{
                backdropFilter: "blur(5.01px)",
                clipPath: "url(#bgblur_1_1749_435_clip_path)",
                height: "100%",
                width: "100%",
              }}
            ></div>
          </foreignObject>
          <circle
            data-figma-bg-blur-radius="10.0249"
            cx="392"
            cy="392"
            r="311"
            fill="black"
            fillOpacity="0.1"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_1749_435"
          x="0.800735"
          y="0.800735"
          width="782.399"
          height="782.399"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="40.0996"
            result="effect1_foregroundBlur_1749_435"
          />
        </filter>
        <filter
          id="filter1_f_1749_435"
          x="38.121"
          y="19.4604"
          width="707.758"
          height="707.759"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="40.0996"
            result="effect1_foregroundBlur_1749_435"
          />
        </filter>
        <clipPath
          id="bgblur_1_1749_435_clip_path"
          transform="translate(-70.9751 -70.9746)"
        >
          <circle cx="392" cy="392" r="311" />
        </clipPath>
        <clipPath id="clip0_1749_435">
          <rect
            x="118.32"
            y="99.6597"
            width="547.36"
            height="547.36"
            rx="273.68"
            fill="white"
          />
        </clipPath>
      </defs>
    </motion.svg>
  );
}
