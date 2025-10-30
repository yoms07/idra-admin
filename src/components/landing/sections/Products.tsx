"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { OrbitingCircles } from "../ui/OrbitingCircle";

export function Products() {
  const [isHoverCard1, setIsHoverCard1] = useState(false);
  const [isHoverCard2, setIsHoverCard2] = useState(false);
  return (
    <section
      className="mx-auto flex w-full flex-col items-center gap-32 pt-40"
      id="utility"
    >
      <BottomSection />
    </section>
  );
}

function Card({
  title,
  description,
  children,
  delay,
  ...props
}: React.ComponentProps<typeof motion.div> & {
  title: string;
  description: string;
  children?: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      className="border-landing-border-100 bg-landing-background-300 flex h-[430px] w-full flex-col items-center justify-between gap-4 overflow-hidden rounded-lg border p-6"
      {...props}
    >
      <div className="flex flex-col items-center gap-4">
        <motion.h2
          initial={{ opacity: 0, y: "2rem" }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: delay },
          }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          className="text-center text-[28px] leading-[120%] font-medium"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: "2rem" }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: delay + 0.2 },
          }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          className="text-muted mx-auto max-w-[330px] text-center"
        >
          {description}
        </motion.p>
      </div>
      {children}
    </motion.div>
  );
}

function Card1Content({ isHoverCard }: { isHoverCard: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, transition: { duration: 0.4, delay: 1 } }}
        animate={{
          scale: isHoverCard ? 1.05 : 1,
          y: isHoverCard ? "-62%" : "-50%",
          transition: { duration: 0.3 },
        }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        className={`absolute top-full`}
      >
        <Image
          src="/images/img-about-1.svg"
          alt="main"
          width={550}
          height={550}
          className="h-[350px] w-auto object-contain lg:h-[408px]"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: "-2rem" }}
        whileInView={{
          opacity: 1,
          x: 0,
          transition: { duration: 0.4, delay: 1.2 },
        }}
        animate={{
          y: isHoverCard ? "-2rem" : 0,
          scale: isHoverCard ? 1.05 : 1,
          transition: { duration: 0.3 },
        }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        className="absolute -bottom-2 -left-2"
      >
        <Image
          src="/images/img-product-card-1-1.svg"
          alt="card-1-1"
          width={550}
          height={550}
          className="h-[70px] w-auto object-contain lg:h-[101px]"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: "2rem" }}
        whileInView={{
          opacity: 1,
          x: 0,
          transition: { duration: 0.4, delay: 1.4 },
        }}
        animate={{
          y: isHoverCard ? "-1rem" : 0,
          scale: isHoverCard ? 1.05 : 1,
          transition: { duration: 0.3 },
        }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        className="absolute right-0 max-lg:top-6 lg:right-6 lg:bottom-16"
      >
        <Image
          src="/images/img-product-card-1-2.svg"
          alt="card-1-1"
          width={550}
          height={550}
          className="h-6 w-auto object-contain lg:h-7.5"
        />
      </motion.div>
    </div>
  );
}

function Card2Content({ isHoverCard }: { isHoverCard: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: "2rem" }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, delay: 1 },
        }}
        animate={{
          scale: isHoverCard ? 1.05 : 1,
          transition: { duration: 0.3 },
        }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        className={`absolute`}
      >
        <Image
          src="/images/img-product-card-2-1.svg"
          alt="main"
          width={550}
          height={550}
          className="h-[190px] w-auto object-contain lg:h-[269px]"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: "-2rem" }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, delay: 1.2 },
        }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        animate={{
          scale: isHoverCard ? 1.1 : 1,
          transition: { duration: 0.3 },
        }}
        className={`absolute left-0 lg:left-4`}
      >
        <motion.div
          animate={{
            y: ["0px", "16px", "0px"],
            transition: { duration: 2.8, repeat: Infinity, repeatType: "loop" },
          }}
        >
          <Image
            src="/images/img-product-card-2-2.png"
            alt="main"
            width={550}
            height={550}
            className="h-[40px] w-auto -rotate-[7deg] object-contain lg:h-[57px]"
          />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: "-2rem" }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, delay: 1.2 },
        }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        animate={{
          scale: isHoverCard ? 1.2 : 1,
          transition: { duration: 0.3 },
        }}
        className={`absolute top-0 right-0 lg:right-4`}
      >
        <motion.div
          animate={{
            y: ["0px", "-12px", "0px"],
            transition: { duration: 3, repeat: Infinity, repeatType: "loop" },
          }}
        >
          <Image
            src="/images/img-product-card-2-2.png"
            alt="main"
            width={550}
            height={550}
            className="h-[33px] w-auto rotate-[7deg] object-contain lg:h-[47px]"
          />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: "2rem" }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, delay: 1.2 },
        }}
        animate={{
          scale: isHoverCard ? 0.9 : 1,
          transition: { duration: 0.3 },
        }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        className={`absolute right-6 -bottom-7 lg:right-12`}
      >
        <motion.div
          animate={{
            y: ["0px", "10px", "0px"],
            transition: { duration: 2.5, repeat: Infinity, repeatType: "loop" },
          }}
        >
          <Image
            src="/images/img-product-card-2-2.png"
            alt="main"
            width={550}
            height={550}
            className="h-[60px] w-auto rotate-[2deg] object-contain lg:h-[85px]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function BottomSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  return (
    <div
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #0A0A0A 40.46%, #3E1F1F 120%)",
      }}
      className="relative flex h-[570px] w-full flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: isInView ? 1 : 0,
          scale: isInView ? 1 : 0,
          transition: { duration: 0.6, delay: 0.3 },
        }}
        className="absolute top-full z-10 flex -translate-y-1/2 items-center justify-center"
      >
        <OrbitingCircles radius={290} iconSize={56} path={false}>
          {ICON.map((icon, index) => (
            <Image
              key={index}
              src={icon}
              alt="icon"
              width={550}
              height={550}
              className={`h-[56px] w-[56px] object-contain`}
            />
          ))}
        </OrbitingCircles>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: isInView ? 1 : 0,
          scale: isInView ? 1 : 0,
          transition: { duration: 0.6, delay: 0.2 },
        }}
        className="absolute top-full -translate-y-1/2"
      >
        <CircleLine />
      </motion.div>
      <div className="absolute bottom-0 mx-auto w-full max-w-[1100px]">
        <Image
          src={"/images/img-product-highlight.png"}
          alt="icon"
          width={1440}
          height={1440}
          className={`h-auto w-full object-contain`}
        />
      </div>
    </div>
  );
}

function CircleLine() {
  return (
    <div className="border-border-200 flex h-[1100px] max-h-[1100px] w-[1100px] max-w-[1100px] items-center justify-center rounded-full border">
      <div className="border-border-200 relative flex h-[771px] max-h-[771px] w-[771px] max-w-[771px] items-center justify-center rounded-full border">
        <div
          style={{
            background: "rgba(112, 114, 113, 0.2)",
            filter: "blur(50px)",
            willChange: "transform, filter",
          }}
          className="absolute inset-0 rounded-full"
        />
        <div
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #1F1F1F 0%, #575757 100%)",
            boxShadow: " inset 0px 4px 4px rgba(255, 241, 241, 0.25)",
          }}
          className="relative z-10 h-[428px] w-[428px] rounded-full"
        />
      </div>
    </div>
  );
}

const ICON = [
  "/images/circle/eth.png",
  "/images/circle/img-logo-10.png",
  "/images/circle/base.png",
  "/images/circle/eth.png",
  "/images/circle/img-logo-10.png",
  "/images/circle/base.png",
  "/images/circle/eth.png",
  "/images/circle/img-logo-10.png",
  "/images/circle/base.png",
  "/images/circle/eth.png",
  "/images/circle/img-logo-10.png",
  "/images/circle/base.png",
  "/images/circle/eth.png",
  "/images/circle/img-logo-10.png",
  "/images/circle/base.png",
  "/images/circle/eth.png",
  "/images/circle/img-logo-10.png",
  "/images/circle/base.png",
  "/images/circle/eth.png",
  "/images/circle/img-logo-10.png",
  "/images/circle/base.png",
];
