import { Fragment } from "react";
import { motion } from "motion/react";
import { Marquee } from "../ui/Marquee";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const Testimonial2 = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-16 px-4 mb-12">
        <div className="flex flex-col gap-4">
          <motion.h1
            initial={{ opacity: 0, y: "2rem" }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, delay: 0.2 },
            }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            className="text-center text-4xl font-medium lg:text-[44px]"
          >
            GOT QUESTIONS?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: "2rem" }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, delay: 0.4 },
            }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            className="text-muted mx-auto max-w-[512px] text-center"
          >
            We have the key answers on IDRA's security, 1:1 backing, and how to
            get started.
          </motion.p>
        </div>
      </div>
      <TestimonialMarquee />
    </>
  );
};

function TestimonialMarquee() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const testimonialsLeft = [
    {
      name: "What is $IDRA?",
      company: "CEO of Indodax",
      quote:
        "IDRA is a Rupiah stablecoin. It is a digital asset (crypto) designed to always maintain a 1:1 value with the Indonesian Rupiah (1 IDRA = 1 IDR). IDRA combines the stability of the Rupiah with the speed and global accessibility of blockchain technology.",
      className: "bg-[#363636]",
      logoClassName: isMobile ? null : "h-8.5 w-auto object-contain",
      logo: isMobile ? null : "/images/img-indodax.png",
    },
    {
      name: "Ricksen",
      company: "CEO of Monk Labs",
      quote:
        "We integrated Xellar into our staking dApp in a day. Users onboard with email, no wallet drama",
    },
    {
      name: "Hiroshi Matsuda",
      company: "ChainMatter",
      quote:
        "Xellar is redefining dev experience for Web3. It's the kind of tool that makes building fun again",
    },
  ];

  const testimonialsCenter = [
    {
      name: "Jamie Xu",
      company: "Engineering Lead at Arcane Labs",
      quote:
        "We shipped our MVP weeks ahead of schedule thanks to Xellar. The abstraction layer just works",
    },
    {
      name: "Nana Okoye",
      company: "Head of UX at BetaBoard",
      quote:
        "Social login + account abstraction = magic. Our users love how smooth the experience is",
    },
    {
      name: "Hiroshi Matsuda",
      company: "ChainMatter",
      quote:
        "Xellar is redefining dev experience for Web3. It's the kind of tool that makes building fun again",
    },
  ];

  const testimonialsRight = [
    {
      name: "Jamie Xu",
      company: "Engineering Lead at Arcane Labs",
      quote:
        "We shipped our MVP weeks ahead of schedule thanks to Xellar. The abstraction layer just works",
    },
    {
      name: "Paul Idris",
      company: "COO of BlockNest",
      quote:
        "Xellar is redefining dev experience for Web3. It's the kind of tool that makes building fun again",
    },
    {
      name: "Willbert",
      company: "Rampable",
      quote:
        "Xellar made our onboarding 10x smoother. Their SDK was effortless to integrate, and their support is top-tier",
      className: "bg-white text-background",
      quoteClassName: "text-background",
      logo: isMobile ? null : "/images/img-rampable-2.png",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: "2rem", scale: 0.9 }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, delay: 0.6 },
      }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      className="relative flex h-full w-full flex-row items-center justify-center overflow-hidden max-lg:flex-col lg:h-[700px]"
    >
      <Marquee pauseOnHover vertical={!isMobile} className="[--duration:20s]">
        {testimonialsLeft.map((review, index) => (
          <Card key={index} {...review} />
        ))}
      </Marquee>
      <Marquee
        reverse
        pauseOnHover
        vertical={!isMobile}
        className="[--duration:20s]"
      >
        {testimonialsCenter.map((review, index) => (
          <Card key={index} {...review} />
        ))}
      </Marquee>
      <Marquee pauseOnHover vertical={!isMobile} className="[--duration:20s]">
        {testimonialsRight.map((review, index) => (
          <Card key={index} {...review} />
        ))}
      </Marquee>
      <div className="from-landing-background pointer-events-none absolute bg-gradient-to-r max-lg:left-0 max-lg:h-full max-lg:w-20 lg:inset-x-0 lg:top-0 lg:h-1/4 lg:bg-gradient-to-b"></div>
      <div className="from-landing-background pointer-events-none absolute bg-gradient-to-l max-lg:right-0 max-lg:h-full max-lg:w-20 lg:inset-x-0 lg:bottom-0 lg:h-1/4 lg:bg-gradient-to-t"></div>
    </motion.div>
  );
}

type CardProps = {
  className?: string;
  quoteClassName?: string;
  nameClassName?: string;
  companyClassName?: string;
  logoClassName?: string | null;
  quote: string;
  logo?: string | null;
  name: string;
  company: string;
};

function Card({
  className,
  quoteClassName,
  nameClassName,
  companyClassName,
  logoClassName,
  logo,
  name,
  company,
  quote,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-landing-background-300 flex h-full w-full flex-col rounded-2xl p-6 max-lg:w-[350px] lg:max-w-[356px]",
        className
      )}
    >
      {logo && (
        <Image
          src={logo}
          alt={name}
          width={200}
          height={200}
          className={cn(
            "mr-auto mb-[76px] h-4 w-auto object-contain",
            logoClassName
          )}
        />
      )}
      <p className={cn(`mb-[52px] text-lg text-white`, quoteClassName)}>
        {quote}
      </p>
      <div className="mt-auto">
        <div className={cn(`text-xs font-medium`, nameClassName)}>{name}</div>
        <div className={cn(`text-muted text-xs`, companyClassName)}>
          {company}
        </div>
      </div>
    </div>
  );
}
