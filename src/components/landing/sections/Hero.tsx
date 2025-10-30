"use client";

import { motion } from "motion/react";
import { Fragment } from "react";
import { PrimaryButton, SecondaryButton } from "../ui/Button";
import { SparklesCore } from "../ui/Sparkles";
import { Globe } from "../ui/Globe";
import Image from "next/image";
import { Lightning } from "../ui/Lightning";

const DASHBOARD_URL = "/dashboard";
const SDK_URL = "#";
function Background() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.2 } }}
      className="absolute inset-0"
    >
      <Image
        src="/images/img-as-hero-bg.png"
        alt="allstars"
        width={3200}
        height={3200}
        className="h-full w-full object-cover"
      />
      <div className="from-background absolute inset-0 bg-gradient-to-t to-transparent" />
      <Lightning
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.4, delay: 0.4 },
        }}
        className="absolute top-1/2 left-1/2 h-[400px] w-[400px] lg:h-[1200px] lg:w-[1200px] -translate-x-1/2 -translate-y-1/2 max-lg:-translate-y-[40%]"
      />
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative flex h-[102vh] w-full items-center justify-center overflow-hidden px-4">
      <Background />
      <HeroContent />
      {/* <RotateGlobe /> */}
      <div className="absolute top-full h-[80vh] w-[180vw] -translate-y-1/2 overflow-hidden rounded-t-[100%] lg:w-[105vw]">
        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.4}
          particleDensity={20}
          className="h-full w-full"
          particleColor="#ffffff"
        />
      </div>
      <div className="from-background absolute bottom-0 left-0 z-20 h-16 w-full bg-gradient-to-t to-transparent" />
    </section>
  );
}

function HeroContent() {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center md:justify-end gap-2 max-h-screen h-full">
      <div className="bg-[#870E1680] px-4 py-1 italic rounded-full text-sm md:text-lg font-instrument-serif tracking-widest text-white font-medium">
        <p>INDONESIA STABLE COIN</p>
      </div>
      <h1 className="mx-auto max-w-[704px] gap-x-5 text-center text-4xl md:text-5xl leading-[110%] font-medium lg:text-7xl">
        {TITLE.map((item, index) => (
          <Fragment key={index}>
            <motion.span
              className={`${item.className} inline-block`}
              initial={{ opacity: 0, filter: "blur(10px)", x: "-1rem" }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                x: 0,
                transition: { duration: 0.4, delay: (index + 1) * 0.2 },
              }}
              style={{
                willChange: "opacity, filter, scale",
              }}
            >
              {item.word}
            </motion.span>{" "}
          </Fragment>
        ))}
      </h1>
      <motion.p
        initial={{ opacity: 0, y: "2rem" }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, delay: 1.4 },
        }}
        className="text-muted max-w-[680px] text-center text-md md:text-xl font-geist-mono text-[#A2A2A2] font-bold"
      >
        Welcome to $IDRA, Indonesia's premier Rupiah Stable Coin. The stability
        you trust, now unleashed with the speed and power of Web3. Instant
        global transactions, 1:1 secured, and always on 24/7.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: "2rem" }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, delay: 1.6 },
        }}
        className="flex items-center gap-5 py-4"
      >
        <PrimaryButton onClick={() => window.open(DASHBOARD_URL, "_blank")}>
          Login / Sign Up
        </PrimaryButton>
        <PrimaryButton
          onClick={() => window.open(SDK_URL, "_blank")}
          className=""
        >
          Explore SDKs
        </PrimaryButton>
      </motion.div>
      <motion.img src="/images/logo.png" className="w-5/12 hidden md:block" />
      <motion.img
        src="/images/logo-mobile.png"
        className="w-1/2 block md:hidden"
      />
    </div>
  );
}

// function Background() {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.2 } }}
//       className="absolute inset-0"
//     >
//       <SilkBackground
//         speed={5}
//         scale={1}
//         color="#18181b"
//         noiseIntensity={1.5}
//         rotation={0}
//       />
//     </motion.div>
//   );
// }

export function RotateGlobe() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8, delay: 1.6 } }}
      className="absolute top-full z-10 mx-auto -translate-y-1/2"
    >
      <Globe />
    </motion.div>
  );
}

const TITLE = [
  {
    word: "Evolved",
    className: "font-figtree font-bold",
  },
  {
    word: "Stability",
    className: "font-figtree font-bold",
  },
  {
    word: "Rupiah",
    className: "font-figtree font-bold",
  },
  {
    word: "Stable",
    className: "italic font-instrument-serif",
  },
  {
    word: "Coin",
    className: "italic font-instrument-serif",
  },
];
