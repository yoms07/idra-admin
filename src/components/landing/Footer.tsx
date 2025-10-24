"use client";
import Link from "next/link";
import { PrimaryButton } from "./ui/Button";
import { Logo } from "./ui/Logo";
import { motion } from "motion/react";
import { Globe, SecondaryGlobe } from "./ui/Globe";
import { InstagramIcon, YoutubeIcon, XTwitterIcon } from "./ui/Icons";
import { usePathname } from "next/navigation";

const DASHBOARD_URL = "/dashboard";
const YOUTUBE_URL = "https://www.youtube.com/@xellar";
const INSTAGRAM_URL = "https://www.instagram.com/xellar";
const XTWITTER_URL = "https://x.com/xellar";

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
          className="mx-auto max-w-[590px] text-center text-4xl leading-[120%] font-medium lg:text-[44px]"
        >
          READY TO UNLOCK DIGITAL RUPIAH?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: "2rem" }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: 0.4 },
          }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          className="text-muted mx-auto max-w-[431px] text-center"
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
          <Link href="/">
            <Logo />
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
      <div className="flex justify-between gap-3 max-lg:flex-col lg:items-center">
        <motion.p
          initial={{ opacity: 0, x: "-2rem" }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, delay: 0.6 },
          }}
          viewport={{ once: true, margin: "0px 0px 0px 0px" }}
          className="text-muted text-xs"
        >
          &copy; Xellar Technologies 2025
        </motion.p>
        <motion.p
          initial={{ opacity: 0, x: "2rem" }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, delay: 0.6 },
          }}
          viewport={{ once: true, margin: "0px 0px 0px 0px" }}
          className="text-muted text-xs"
        >
          Xellar does not have a token and is not affiliated with any project
          pretending to be Xellar.
        </motion.p>
      </div>
    </motion.div>
  );
}

const SOCIALS = [
  {
    icon: <YoutubeIcon className="size-6" />,
    url: YOUTUBE_URL,
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
