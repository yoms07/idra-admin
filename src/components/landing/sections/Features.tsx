"use client";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";
import AccountAbstractionIcon from "../assets/AccountAbstractionIcon";
import LogoSdk1 from "../assets/LogoSdk1";
import LogoSdk2 from "../assets/LogoSdk2";
import LogoSdk3 from "../assets/LogoSdk3";
import LogoSdk4 from "../assets/LogoSdk4";
import LogoSdk5 from "../assets/LogoSdk5";
import LogoSdk6 from "../assets/LogoSdk6";
import Onramp1 from "../assets/Onramp1";
import Onramp2 from "../assets/Onramp2";
import Onramp3 from "../assets/Onramp3";
import Onramp4 from "../assets/Onramp4";
import Onramp5 from "../assets/Onramp5";
import OnrampBackground from "../assets/OnrampBackground";
import { PixelBackground } from "../ui/PixelBackground";
import { AnimatedBeam } from "../ui/AnimateBeam";

export default function Feature() {
  return (
    <div className="bg-landing-background-100 relative flex w-full items-center justify-center">
      <div className="item-center absolute top-0 mx-auto flex w-full max-w-[1100px] flex-col items-center justify-center px-4">
        <div
          style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)" }}
          className="bg-landing-background relative z-10 mx-auto h-16 w-full max-w-[1100px]"
        />
        <motion.div
          initial={{
            width: "30%",
          }}
          whileInView={{
            width: "100%",
            transition: { duration: 3, ease: "easeInOut" },
          }}
          viewport={{ once: true }}
          className="absolute -bottom-0.5 mx-auto h-1 w-full max-w-[70%] bg-white"
        />
        <motion.div
          initial={{
            width: "30%",
          }}
          whileInView={{
            width: "100%",
            transition: { duration: 3, ease: "easeInOut" },
          }}
          viewport={{ once: true }}
          style={{
            background: "#FFFFFF",
            filter: "blur(10px)",
            willChange: "width, opacity",
          }}
          className="absolute -bottom-1 mx-auto h-1 w-full max-w-[70%] bg-white"
        />
      </div>
      <section
        id="product"
        className="relative mx-auto flex w-full max-w-[1100px] flex-col items-center overflow-visible px-4 pt-[124px] pb-[75.5px]"
      >
        <motion.h1
          initial={{ opacity: 0, y: "2rem" }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: 0.2 },
          }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          className="mx-auto max-w-[630px] text-center text-[44px] leading-[120%] font-medium"
        >
          Everything You Need For{" "}
          <span className="font-instrument">Authentication</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: "2rem" }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: 0.4 },
          }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          className="text-muted z-20 mb-[98px] max-w-[505px] text-center max-md:mb-[64px]"
        >
          Use Xellar&apos;s Embedded Wallet service to streamline authentication
        </motion.p>
        <div className="z-20 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <FeatureCard1 />
          <FeatureCard2 />
          <FeatureCard3 />
          <FeatureCard4 />
        </div>
      </section>
    </div>
  );
}

function MaskedFlickeringGrid({ width = 543, height = 239, ...props }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <defs>
        <mask
          id="account-abstraction-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={width}
          height={height}
        >
          <path
            d="M544 40C320.8 168.865 88.3333 93.6936 0 40V231.5C234 96.4 460.167 175.208 544 231.5V40Z"
            fill="#fff"
          />
        </mask>
      </defs>
      <foreignObject
        x="0"
        y="0"
        width={width}
        height={height}
        mask="url(#account-abstraction-mask)"
      >
        <div style={{ width: "100%", height: "100%" }}>
          <PixelBackground
            width={width}
            height={height}
            color="#6d6d6d"
            squareSize={4}
            gridGap={8}
            maxOpacity={0.3}
            {...props}
          />
        </div>
      </foreignObject>
    </svg>
  );
}

// EmbeddedWalletUI: SVG as React component, logos as <Image>
function EmbeddedWalletUI() {
  // Floating (breathing) animation for the whole SVG
  return (
    <motion.svg
      width="342"
      height="196"
      viewBox="0 0 342 196"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ y: 0 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "block" }}
    >
      <g clipPath="url(#clip0_1067_545)">
        <rect width="341.088" height="195.324" rx="12.209" fill="#222222" />
        <path
          d="M12.209 0.381836H328.879C335.411 0.381836 340.706 5.67687 340.706 12.209V155.283H0.381836V12.209C0.381839 5.67688 5.67688 0.381836 12.209 0.381836Z"
          fill="url(#paint0_radial_1067_545)"
        />
        <path
          d="M12.209 0.381836H328.879C335.411 0.381836 340.706 5.67687 340.706 12.209V155.283H0.381836V12.209C0.381839 5.67688 5.67688 0.381836 12.209 0.381836Z"
          stroke="#2D2D2D"
          strokeWidth="0.76306"
        />
        {/* Google */}
        <foreignObject x="18" y="24" width="46" height="46">
          <motion.div
            whileHover={{ scale: 1.13, boxShadow: "0 0 16px #7B61FF44" }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/images/img-google.svg"
              alt="google"
              width={200}
              height={200}
              style={{ borderRadius: 6 }}
              className="h-[46px] min-h-[46px] w-[46px] min-w-[46px]"
            />
          </motion.div>
        </foreignObject>
        {/* Telegram */}
        <foreignObject x="73" y="24" width="46" height="46">
          <motion.div
            whileHover={{ scale: 1.13, boxShadow: "0 0 16px #7B61FF44" }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/images/img-telegram.svg"
              alt="Telegram"
              width={46}
              height={46}
              style={{ borderRadius: 6 }}
            />
          </motion.div>
        </foreignObject>
        {/* Apple */}
        <foreignObject x="128" y="24" width="46" height="46">
          <motion.div
            whileHover={{ scale: 1.13, boxShadow: "0 0 16px #7B61FF44" }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/images/img-apple.svg"
              alt="Apple"
              width={46}
              height={46}
              style={{ borderRadius: 6 }}
            />
          </motion.div>
        </foreignObject>
        {/* Metamask */}
        <foreignObject x="183" y="24" width="46" height="46">
          <motion.div
            whileHover={{ scale: 1.13, boxShadow: "0 0 16px #7B61FF44" }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/images/img-metamask.svg"
              alt="Metamask"
              width={46}
              height={46}
              style={{ borderRadius: 6 }}
            />
          </motion.div>
        </foreignObject>
        {/* More Option */}
        <foreignObject x="238" y="24" width="84" height="46">
          <motion.div
            whileHover={{ scale: 1.08, boxShadow: "0 0 12px #7B61FF33" }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              background: "linear-gradient(180deg, #49494B 0%, #29292F 100%)",
            }}
          >
            <span style={{ color: "#fff", fontWeight: 500, fontSize: 10 }}>
              More Option
            </span>
          </motion.div>
        </foreignObject>
        {/* Connect Your Wallet Button */}
        <rect
          x="18.8"
          y="95.1"
          width="303.5"
          height="36.6"
          rx="5.6"
          stroke="#515151"
        />
        <foreignObject x="18.8" y="95.1" width="303.5" height="36.6">
          <motion.div
            whileHover={{ scale: 1.03, boxShadow: "0 0 16px #7B61FF55" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 600,
              fontSize: 12,
              fontFamily: "var(--font-figtree), sans-serif",
              borderRadius: 6,
              cursor: "pointer",
              boxShadow: "0 0 0 0 transparent",
            }}
          >
            Connect Your Wallet
          </motion.div>
        </foreignObject>
        {/* Powered by Xellar */}
        <foreignObject x="0" y="155.7" width="341.1" height="39.7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#B2B2B2",
              fontSize: 9,
              fontWeight: 400,
              gap: 8,
            }}
          >
            Powered by
            <Image
              src="/images/img-xellar-signup.svg"
              alt="Xellar"
              width={43}
              height={43}
              style={{ display: "inline", marginLeft: 2 }}
            />
          </motion.div>
        </foreignObject>
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_1067_545"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(170.544 77.8321) rotate(-90) scale(651.832 1428.26)"
        >
          <stop stopColor="#242424" />
          <stop offset="1" stopColor="#49494B" />
        </radialGradient>
        <clipPath id="clip0_1067_545">
          <rect width="341.088" height="195.324" rx="12.209" fill="white" />
        </clipPath>
      </defs>
    </motion.svg>
  );
}

function FeatureCard1() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0 }}
      className="relative flex min-h-[260px] flex-col items-start overflow-hidden rounded-2xl border border-white/10 bg-[#1E1E1E] p-6 pt-[30px] shadow-lg"
    >
      <div className="z-10 mb-14 flex w-full items-center justify-center max-md:mb-8">
        <EmbeddedWalletUI />
      </div>
      <div className="z-10">
        <h3 className="mb-[15px] text-2xl font-semibold text-[#FBFBFB]">
          Social login
        </h3>
        <p className="leading-relaxed text-[#A2A2A2] max-md:text-sm">
          Create embedded wallets that can be accessed using Email, WhatsApp, X
          and custom login methods
        </p>
      </div>
    </motion.div>
  );
}

function FeatureCard2() {
  // Refs for AnimatedBeam
  const containerRef = React.useRef(null);
  const leftRef = React.useRef(null);
  const rightRef = React.useRef(null);
  const leftRef2 = React.useRef(null);
  const rightRef2 = React.useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="relative flex min-h-[260px] flex-col items-start overflow-hidden rounded-2xl border border-white/10 bg-[#1E1E1E] p-6 px-0 shadow-lg"
    >
      {/* Dots background masked sesuai Figma */}
      <div
        ref={containerRef}
        className="absolute top-0 left-0 z-0 h-[239px] w-full"
      >
        <MaskedFlickeringGrid width={550} height={239} />
        {/* Titik kiri & kanan untuk AnimatedBeam bawah (sekarang di atas, arc ke bawah, lebih dekat ke tengah) */}
        <div
          ref={leftRef2}
          style={{
            position: "absolute",
            left: -30,
            bottom: -10,
            width: 8,
            height: 8,
          }}
        />
        <div
          ref={rightRef2}
          style={{
            position: "absolute",
            right: -30,
            bottom: -10,
            width: 8,
            height: 8,
          }}
        />
        {/* Titik kiri & kanan untuk AnimatedBeam atas (sekarang di bawah, arc ke atas, lebih dekat ke tengah) */}
        <div
          ref={leftRef}
          style={{
            position: "absolute",
            left: -30,
            top: 20,
            width: 8,
            height: 8,
          }}
        />
        <div
          ref={rightRef}
          style={{
            position: "absolute",
            right: -30,
            top: 20,
            width: 8,
            height: 8,
          }}
        />
        {/* AnimatedBeam bawah, arc lebar dan rapi (sekarang di atas) */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={leftRef2}
          toRef={rightRef2}
          curvature={160}
          pathColor="#fff"
          pathOpacity={0.13}
          gradientStartColor="#fff"
          gradientStopColor="#7B61FF"
          pathWidth={3}
          duration={3.5}
        />
        {/* AnimatedBeam atas, arc lebar dan rapi (sekarang di bawah) */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={leftRef}
          toRef={rightRef}
          curvature={-160}
          pathColor="#fff"
          pathOpacity={0.18}
          gradientStartColor="#fff"
          gradientStopColor="#7B61FF"
          pathWidth={3}
          duration={3}
        />
      </div>
      <div className="relative z-10 mb-12 flex w-full items-center justify-center">
        <motion.div
          whileHover={{ scale: 1.13, boxShadow: "0 0 32px 0 #7B61FF55" }}
          whileTap={{ scale: 0.97 }}
          style={{
            borderRadius: "50%",
            transition: "box-shadow 0.3s, transform 0.3s",
          }}
        >
          <AccountAbstractionIcon />
        </motion.div>
      </div>
      <div className="z-10 px-6">
        <h3 className="mb-[15px] text-2xl font-semibold text-[#FBFBFB]">
          Account Abstraction
        </h3>
        <p className="leading-relaxed text-[#A2A2A2] max-md:text-sm">
          Remove the gas fee from wallet transactions creating seamless crypto
          experiences.
        </p>
      </div>
    </motion.div>
  );
}

function FeatureCard3() {
  // Refs for AnimatedBeam
  const containerRef = React.useRef(null);
  const leftRef = React.useRef(null);
  const rightRef = React.useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="relative flex min-h-[260px] flex-col items-start overflow-hidden rounded-2xl border border-white/10 bg-[#1E1E1E] p-6 pt-0 shadow-lg"
    >
      <div
        ref={containerRef}
        className="relative z-10 mb-4 flex aspect-[544/100] w-full items-center justify-center"
      >
        {/* Top curve only */}
        <div
          ref={leftRef}
          style={{
            position: "absolute",
            left: "10%",
            top: "-28px",
            width: "16px",
            height: "16px",
          }}
        />
        <div
          ref={rightRef}
          style={{
            position: "absolute",
            right: "10%",
            top: "-28px",
            width: "16px",
            height: "16px",
          }}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={leftRef}
          toRef={rightRef}
          curvature={-180}
          pathColor="#fff"
          pathOpacity={0.13}
          gradientStartColor="#fff"
          gradientStopColor="#7B61FF"
          pathWidth={2.5}
          duration={3.5}
        />
        {/* SDK Logos row (replace image) */}
        <div className="relative z-10 mt-[120px] mb-[60px] flex w-full flex-row items-center justify-center gap-3 max-md:gap-0">
          {[LogoSdk1, LogoSdk2, LogoSdk3, LogoSdk4, LogoSdk5, LogoSdk6].map(
            (Logo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.3, delay: 0.15 * i },
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.15,
                  boxShadow: "0 0 24px 0 #7B61FF33",
                  transition: { duration: 0.18, delay: 0, type: "tween" },
                }}
                style={{ borderRadius: "50%" }}
                className="cursor-pointer max-md:mr-3.5 max-md:h-10 max-md:w-10 max-md:scale-75"
              >
                <Logo />
              </motion.div>
            )
          )}
        </div>
      </div>
      <div className="z-10">
        <h3 className="mb-[15px] text-2xl font-semibold text-[#FBFBFB]">
          Seamless SDKs For Modern Frameworks
        </h3>
        <p className="leading-relaxed text-[#A2A2A2] max-md:text-sm">
          Developers can leverage our SDK and APIs to create powerful,
          customizable experiences for their applications.
        </p>
      </div>
    </motion.div>
  );
}

function FeatureCard4() {
  // Refs for AnimatedBeam
  const containerRef = React.useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.45 }}
      className="relative flex min-h-[260px] flex-col items-start overflow-hidden rounded-2xl border border-white/10 bg-[#1E1E1E] p-0 shadow-lg"
    >
      <div
        ref={containerRef}
        className="relative z-10 mb-4 flex w-full items-center justify-start"
      >
        {/* Background SVG */}

        <div className="flex h-full w-full items-start">
          <OnrampBackground />
        </div>
        {/* Main Onramp1 logo (center, large) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0 }}
          whileHover={{ scale: 1.18, boxShadow: "0 0 24px 0 #7B61FF33" }}
          style={{ borderRadius: "50%" }}
          className="absolute top-1/2 left-1/2 z-10 size-[80px] -translate-x-1/2 -translate-y-1/2 cursor-pointer lg:size-[118px]"
        >
          <Onramp1 />
        </motion.div>
        {/* Onramp2-5: positioned in an arc around the main logo, matching Figma */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {/* Onramp2: left top */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{
              scale: 1.12,
              boxShadow: "0 0 24px 0 #7B61FF66",
              filter: "blur(0.5px) brightness(1.1)",
            }}
            style={{
              position: "absolute",
              left: "8%",
              top: "28%",
              borderRadius: "50%",
              transition: "box-shadow 0.18s, filter 0.18s, transform 0.18s",
              pointerEvents: "auto",
              willChange: "filter",
            }}
            className="size-10 cursor-pointer lg:size-[50px]"
          >
            <Onramp2 />
          </motion.div>
          {/* Onramp3: left bottom */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{
              scale: 1.12,
              boxShadow: "0 0 24px 0 #7B61FF66",
              filter: "blur(0.5px) brightness(1.1)",
            }}
            style={{
              position: "absolute",
              left: "18%",
              bottom: "20%",
              borderRadius: "50%",
              transition: "box-shadow 0.18s, filter 0.18s, transform 0.18s",
              pointerEvents: "auto",
              willChange: "filter",
            }}
            className="size-10 cursor-pointer lg:size-[50px]"
          >
            <Onramp3 />
          </motion.div>
          {/* Onramp4: right bottom */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{
              scale: 1.12,
              boxShadow: "0 0 24px 0 #7B61FF66",
              filter: "blur(0.5px) brightness(1.1)",
            }}
            style={{
              position: "absolute",
              right: "17%",
              bottom: "20%",
              borderRadius: "50%",
              transition: "box-shadow 0.18s, filter 0.18s, transform 0.18s",
              pointerEvents: "auto",
              willChange: "filter",
            }}
            className="size-10 cursor-pointer lg:size-[50px]"
          >
            <Onramp4 />
          </motion.div>
          {/* Onramp5: right top */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{
              scale: 1.12,
              boxShadow: "0 0 24px 0 #7B61FF66",
              filter: "blur(0.5px) brightness(1.1)",
            }}
            style={{
              position: "absolute",
              right: "5%",
              top: "30%",
              borderRadius: "50%",
              transition: "box-shadow 0.18s, filter 0.18s, transform 0.18s",
              pointerEvents: "auto",
              willChange: "filter",
            }}
            className="size-10 cursor-pointer lg:size-[50px]"
          >
            <Onramp5 />
          </motion.div>
        </div>
      </div>
      <div className="z-10 px-6 pb-6">
        <h3 className={`mb-[15px] text-2xl font-semibold text-[#FBFBFB]`}>
          Multichain DeFi Integration
        </h3>
        <p className={`leading-relaxed text-[#A2A2A2] max-md:text-sm`}>
          Xellar brings seamless DeFi support across 9 chains, with more
          integrations coming soon.
        </p>
      </div>
    </motion.div>
  );
}
