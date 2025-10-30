import { Fragment } from "react";
import { motion } from "motion/react";
import { Marquee } from "../ui/Marquee";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const Testimonial2 = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-16 px-4 mb-12" id="faq">
        <div className="flex flex-col gap-4">
          <motion.h1
            initial={{ opacity: 0, y: "2rem" }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, delay: 0.2 },
            }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            className="text-center text-4xl font-bold lg:text-[44px] font-figtree text-[#FBFBFB]"
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
            className="text-[#A2A2A2] font-geist-mono mx-auto max-w-[512px] text-center"
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
      question: "What is $IDRA?",
      answer:
        "IDRA is a Rupiah stablecoin. It is a digital asset (crypto) designed to always maintain a 1:1 value with the Indonesian Rupiah (1 IDRA = 1 IDR). IDRA combines the stability of the Rupiah with the speed and global accessibility of blockchain technology.",
      className: "bg-[#363636]",
    },
    {
      question: "Is $IDRA secure? What about the risk of hacks?",
      answer:
        "Yes. Our technology (smart contracts) is fully audited by security experts like [Certik]. Your Rupiah reserves are held in separate, secure accounts, completely independent of our company funds.",
    },
  ];

  const testimonialsCenter = [
    {
      question: "Is $IDRA legal and regulated in Indonesia?",
      answer:
        "Yes. IDRA fully complies with Indonesian regulations. We are registered and supervised by the relevant authorities [e.g., BAPPEBTI].",
    },
    {
      question: "Where can I buy and use $IDRA?",
      answer:
        "You can easily buy IDRA on our partner CEX and DEX platforms. Use it for trading, sending money, making payments, or as a stable asset in the Web3 world.",
    },
    {
      question: "How do I change $IDRA back into Rupiah?",
      answer:
        "Simply sell your IDRA on any partner exchange to convert it back to Rupiah (IDR), then withdraw it directly to your bank account.",
    },
  ];

  const testimonialsRight = [
    {
      question: "Who is the team behind $IDRA?",
      answer:
        "IDRA is managed by Xellar, an experienced Indonesian team specializing in finance, blockchain technology, and regulatory compliance.",
    },
    {
      question: "How can I trust that its value is really 1:1 with Rupiah?",
      answer:
        "This is our core guarantee. For every 1 IDRA in circulation, we hold 1 Rupiah (IDR) in reserve at trusted, regulated financial institutions. Our reserves are periodically audited by independent, third-party firms to prove this 1:1 backing is always maintained.",
      className: "bg-white text-background",
      quoteClassName: "text-background",
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
  answer: string;
  logo?: string | null;
  question: string;
  company?: string;
};

function Card({
  className,
  quoteClassName,
  nameClassName,
  companyClassName,
  logoClassName,
  logo,
  question,
  company,
  answer,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-landing-background-300 text-white hover:text-black hover:bg-white duration-300 transition-all flex h-full w-full flex-col rounded-2xl p-6 max-lg:w-[350px] lg:max-w-[356px] font-geist-mono",
        className
      )}
    >
      {logo && (
        <Image
          src={logo}
          alt={question}
          width={200}
          height={200}
          className={cn(
            "mr-auto mb-[76px] h-4 w-auto object-contain",
            logoClassName
          )}
        />
      )}
      <p className={cn(`mb-[52px] text-lg`, quoteClassName)}>{question}</p>
      <div className="mt-auto">
        <div
          className={cn(`text-xs font-medium text-[#A2A2A2]`, nameClassName)}
        >
          {answer}
        </div>
        <div className={cn(`text-[#A2A2A2] text-xs`, companyClassName)}>
          {company}
        </div>
      </div>
    </div>
  );
}
