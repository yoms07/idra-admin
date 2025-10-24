"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function Testimonial() {
  return (
    <section className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-16 px-4 pt-21 pb-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, boxShadow: "0 0 12px #7B61FF00" }}
        whileInView={{
          opacity: 1,
          scale: 1,
          boxShadow: "0 0 12px #7B61FF00",
          transition: { duration: 0.6, delay: 0.3 },
        }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        className="absolute bottom-full flex translate-y-1/2 items-center justify-center rounded-full"
        whileHover={{
          scale: 1.25,
          boxShadow: "0 0 12px #7B61FF55",
          transition: { duration: 0.3, delay: 0.2 },
        }}
      >
        <Image
          src="/images/img-xellar-logo-2.png"
          alt="testimonial"
          width={500}
          height={500}
          className="h-[118px] w-auto object-contain"
        />
      </motion.div>
      <motion.h1 className="mx-auto mb-21 max-w-[650px] text-center text-5xl leading-[120%] font-medium lg:text-[72px]">
        {TITLE.map((item, index) => (
          <Fragment key={index}>
            <motion.span
              className={`${item.className} inline-block`}
              initial={{ opacity: 0, filter: "blur(10px)", x: "-1rem" }}
              whileInView={{
                opacity: 1,
                filter: "blur(0px)",
                x: 0,
                transition: { duration: 0.4, delay: (index + 1) * 0.2 },
              }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              style={{
                willChange: "opacity, filter, scale",
              }}
            >
              {item.word}
            </motion.span>{" "}
          </Fragment>
        ))}
      </motion.h1>
    </section>
  );
}

const TITLE = [
  { word: "Supported", className: "" },
  { word: "3 Networks", className: "" },
];
