"use client";

import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import { ReactNode, useRef } from "react";

export function About() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const words =
    "$IDRA is your Rupiah Stable Coin  backed 1:1 by audited reserves and designed as your stability anchor in Web3. It's your instant bridge from Rupiah to global finance.".split(
      " "
    );

  return (
    <section ref={targetRef} className="relative z-0 h-[300vh]">
      <div className="sticky top-0 mx-auto flex h-1/3 max-w-[1100px] flex-col justify-center items-center gap-6 px-4">
        <h1 className="text-foreground font-instrument uppercase italic px-4 py-2 bg-primary-1000/50 rounded-full">
          WHAT IS IDRA?
        </h1>
        <span className="text-muted flex flex-wrap justify-center space-x-1 text-3xl font-medium lg:space-x-1.5 xl:text-[44px]">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </span>
      </div>
    </section>
  );
}

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative">
      <span className="absolute opacity-30">{children}</span>
      <motion.span style={{ opacity: opacity }} className={"text-foreground"}>
        {children}
      </motion.span>
    </span>
  );
}
