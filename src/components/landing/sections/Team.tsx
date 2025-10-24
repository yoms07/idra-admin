"use client";
import Image from "next/image";
import { Marquee } from "../ui/Marquee";
import { motion } from "motion/react";

export function Team() {
  return (
    <section className="mx-auto flex max-w-[1100px] flex-col gap-4 px-4 py-15">
      <motion.h1
        initial={{ opacity: 0, y: "2rem" }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, delay: 0.2 },
        }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        className="text-muted text-center text-xl"
      >
        Trusted by Innovative Teams
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: "2rem" }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, delay: 0.4 },
        }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        className="relative flex items-center justify-center overflow-hidden"
      >
        <Marquee className="[--duration:20s]">
          {IMAGES.map((image, index) => (
            <Image
              key={index}
              className="h-16 w-auto"
              src={image}
              alt="logo"
              width={500}
              height={500}
            />
          ))}
        </Marquee>
        <div className="from-landing-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r to-transparent" />
        <div className="from-landing-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l to-transparent" />
      </motion.div>
    </section>
  );
}

const IMAGES = [
  "/images/img-indodax.png",
  "/images/img-yapp.png",
  "/images/img-rampable.png",
  "/images/img-qolaq.png",
  "/images/img-sekuya.png",
  "/images/img-mindblowon.png",
  "/images/img-blockdevid.png",
  "/images/img-creoengine.png",
  "/images/img-innovation-factory.png",
  "/images/img-nobi.png",
];
