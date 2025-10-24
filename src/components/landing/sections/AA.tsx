"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { useRef } from "react";
import {
  HandShakeCheckIcon,
  LampPuzzleIcon,
  LiquidIcon,
  Wallet2Icon,
} from "../ui/Icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function AccountAbstraction() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const cards = container?.querySelectorAll(".vertical-card");
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        cards?.forEach((card, index) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card as Element,
              start: "top-=250px bottom",
              end: "bottom+=250px top",
              scrub: true,
            },
          });

          tl.to(card as Element, { y: 50 * -index, rotate: -2 + index * 0.2 })
            .to(card as Element, { y: 50 * index, rotate: 0 })
            .to(card as Element, { y: 50, rotate: 1 });
        });

        return () => {
          cards?.forEach((card) => {
            gsap.set(card as Element, { y: 0, rotate: 0 });
          });
        };
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative mx-auto   flex max-w-[1100px] flex-col items-center gap-10 px-4 py-16 max-lg:flex-col lg:h-[200vh] lg:gap-19.5"
    >
      <div className="top-0 flex w-full flex-col gap-4 lg:sticky lg:h-screen lg:justify-center">
        <motion.p
          initial={{ opacity: 0, x: "-2rem" }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, delay: 0.2 },
          }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          className="font-instrument uppercase py-2 px-4 rounded-full bg-primary-1000/50  italic flex w-fit"
        >
          Account Abstraction
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, x: "-2rem" }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, delay: 0.4 },
          }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          className="text-4xl font-medium lg:text-[44px]"
        >
          BORDERLESS FINANCE.&#10; <br />
          BACKED BY TRUST
        </motion.h1>
      </div>
      <div className="mx-auto grid w-full items-center gap-4 lg:grid-cols-4">
        {CARD_ITEMS.map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </div>
    </section>
  );
}

function Card({
  icon,
  title,
  description,
  number,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: string;
}) {
  return (
    <div className="vertical-card bg-landing-background-200 flex h-[370px] w-full flex-col items-center justify-between p-6">
      <div className="flex w-full items-center justify-between">
        <p className="font-instrument text-[32px]">{number}</p>
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-medium text-white lg:text-2xl">
          {title}
        </h3>
        <p className="text-muted text-sm lg:text-base">{description}</p>
      </div>
    </div>
  );
}

const CARD_ITEMS = [
  {
    icon: <LampPuzzleIcon />,
    title: "STABLE & AUDITED",
    description:
      "with fully regulated Rupiah reserves, proven by independent audits.",
    number: "01",
  },

  {
    icon: <LiquidIcon />,
    title: "INSTANT SETTLEMENT",
    description:
      "Send and receive digital Rupiah globally in seconds. No delays, no closing hours. Always active 24/7/365.",
    number: "02",
  },

  {
    icon: <Wallet2Icon />,
    title: "NEAR-ZERO FEES",
    description:
      "Built on blockchain to cut intermediary costs. Enjoy efficient global transfers with incredibly low fees.",
    number: "03",
  },

  {
    icon: <HandShakeCheckIcon />,
    title: "OPEN & GLOBAL ACCESS",
    description:
      "Accessible to anyone, anywhere. IDRA is your passport to the global Web3 and DeFi ecosystem",
    number: "04",
  },
];
