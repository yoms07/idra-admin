"use client";
import Link from "next/link";
import { PrimaryButton } from "./ui/Button";
import { Logo } from "./ui/Logo";
import { motion } from "motion/react";
import { Globe, SecondaryGlobe } from "./ui/Globe";
import { InstagramIcon, YoutubeIcon, XTwitterIcon } from "./ui/Icons";
import { usePathname } from "next/navigation";
import { IDRALogoBlack } from "../icons/idra-logo-black";
import { FaT, FaTelegram } from "react-icons/fa6";

const DASHBOARD_URL = "/dashboard";
const TELEGRAM_URL = "#";
const INSTAGRAM_URL = "#";
const XTWITTER_URL = "#";

export function Footer() {
  const pathname = usePathname();
  return (
    <section className="relative mx-auto flex max-w-[1100px] flex-col items-center justify-center gap-18 overflow-hidden px-4 pt-40">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.8, delay: 1.6 } }}
        className="absolute top-full z-10 mx-auto -translate-y-[60%]"
      >
        {pathname === "/allstars" ? <SecondaryGlobe /> : <Globe />}
      </motion.div>
      <FooterCTA />
      <FooterSection />
    </section>
  );
}

function FooterCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: "2rem" }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      className="bg-landing-background-300/30 relative z-10 flex h-[400px] w-full flex-col items-center justify-center gap-11 rounded-2xl px-4"
    >
      <div className="space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: "2rem" }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: 0.2 },
          }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          className="mx-auto max-w-[590px] text-center text-4xl leading-[120%] text-white lg:text-[44px] font-figtree font-bold"
        >
          READY TO UNLOCK <br /> DIGITAL RUPIAH?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: "2rem" }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: 0.4 },
          }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          className="text-[#A2A2A2] font-figtree text-lg font-bold mx-auto max-w-[431px] text-center"
        >
          Experience stable, fast, and global transactions. Start your IDRA
          journey today.
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: "2rem" }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, delay: 0.6 },
        }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      >
        <PrimaryButton onClick={() => window.open(DASHBOARD_URL, "_blank")}>
          GET IDRA NOW
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
}

function FooterSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: "2rem" }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      className="border-landing-border-border bg-landing-background relative z-10 w-full space-y-6 rounded-t-2xl border-t px-4 py-6 lg:px-6"
    >
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: "-2rem" }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, delay: 0.4 },
          }}
          viewport={{ once: true, margin: "0px 0px 0px 0px" }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 font-figtree font-bold text-lg"
          >
            <IDRALogoBlack />
            IDRA
          </Link>
        </motion.div>
        <div className="flex items-center gap-4">
          {SOCIALS.map((social, index) => (
            <motion.button
              key={index}
              onClick={() => window.open(social.url, "_blank")}
              initial={{ opacity: 0, x: "2rem" }}
              whileInView={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.4, delay: 0.4 * index + 0.2 },
              }}
              viewport={{ once: true, margin: "0px 0px 0px 0px" }}
              whileHover={{
                color: "var(--color-muted)",
                transition: { duration: 0.3 },
              }}
              className="cursor-pointer"
            >
              {social.icon}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="flex justify-between gap-3 max-lg:flex-col lg:items-center text-[#A2A2A2]">
        <motion.p
          initial={{ opacity: 0, x: "-2rem" }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, delay: 0.6 },
          }}
          viewport={{ once: true, margin: "0px 0px 0px 0px" }}
          className="text-[#A2A2A2] text-xs font-figtree"
        >
          &copy; $IDRA 2025
        </motion.p>
        <motion.p
          initial={{ opacity: 0, x: "2rem" }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, delay: 0.6 },
          }}
          viewport={{ once: true, margin: "0px 0px 0px 0px" }}
          className="text-[#A2A2A2] text-xs font-figtree"
        >
          Terms of Service
        </motion.p>
      </div>
    </motion.div>
  );
}

const SOCIALS = [
  {
    icon: <FaTelegram className="size-6" />,
    url: TELEGRAM_URL,
  },
  {
    icon: <InstagramIcon className="size-5" />,
    url: INSTAGRAM_URL,
  },
  {
    icon: <XTwitterIcon className="size-5" />,
    url: XTWITTER_URL,
  },
];
