"use client";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "./ui/Icons";
import { Logo } from "./ui/Logo";
import { PrimaryButton } from "./ui/Button";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { IDRALogoBlack } from "../icons/idra-logo-black";
const DASHBOARD_URL = "/dashboard";

export function Header() {
  const [isScrolled, setisScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setisScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: "-2rem" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.2)" : "transparent",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        paddingTop: isScrolled ? "1rem" : "1.75rem",
        paddingBottom: isScrolled ? "1rem" : "1.75rem",
        transition:
          "background-color 0.3s ease, backdrop-filter 0.3s ease, padding-top 0.3s ease, padding-bottom 0.3s ease",
        willChange:
          "opacity, y, backgroundColor, backdropFilter, padding-top, padding-bottom",
      }}
      className={cn("fixed top-0 left-0 z-50 w-full px-5 py-7")}
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-40 lg:grid-cols-3">
        <Link
          href="/"
          className="flex w-23 items-center gap-2 font-figtree font-bold text-xl"
        >
          <IDRALogoBlack />
          IDRA
        </Link>
        <Navigation className="max-lg:hidden" />
        <PrimaryButton
          onClick={() => window.open(DASHBOARD_URL, "_blank")}
          className="ml-auto h-10 text-sm max-lg:hidden font-figtree"
        >
          Login / SignUp
        </PrimaryButton>
        <Sidebar />
      </div>
    </motion.header>
  );
}

function Navigation({
  className,
  buttonClassName,
  onClick,
}: {
  className?: string;
  buttonClassName?: string;
  onClick?: () => void;
  scrollOffset?: number;
}) {
  const router = useRouter();
  const lenis = useLenis();

  function handleClick(url: string, scrollOffset?: number) {
    onClick?.();
    if (url.startsWith("http")) {
      window.open(url, "_blank");
    } else if (url.startsWith("/")) {
      router.push(url);
    } else {
      lenis?.scrollTo(url, { offset: scrollOffset ?? -80 });
    }
  }

  return (
    <nav className={cn("flex items-center justify-center gap-16", className)}>
      {NAVIGATION_ITEMS.map((item, index) => {
        if (item.label === "developer") {
          return <DropdownMenu onClick={() => onClick?.()} key={index} />;
        }

        return (
          <button
            key={index}
            onClick={() => handleClick(item.url, item.offset)}
            className={cn(
              "hover:text-muted cursor-pointer whitespace-nowrap leading-[100%] font-medium text-nowrap transition-all duration-300 font-figtree",
              buttonClassName
            )}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useClickOutside(sidebarRef, () => setIsOpen(false));
  return (
    <>
      <PrimaryButton
        onClick={() => setIsOpen(true)}
        className="ml-auto h-10 w-10 px-0 lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Menu</span>
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar"
            className="bg-landing-background/50 fixed top-0 right-0 z-50 h-[100dvh] w-full backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.2 } }}
            style={{
              willChange: "opacity, filter",
            }}
          >
            <motion.div
              ref={sidebarRef}
              initial={{ x: "100%" }}
              animate={{ x: 0, transition: { duration: 0.2, delay: 0.2 } }}
              exit={{ x: "100%", transition: { duration: 0.2 } }}
              className="from-landing-background-200 to-landing-background-300 relative ml-auto flex h-full w-[70%] flex-col justify-between bg-gradient-to-b p-6"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 cursor-pointer"
              >
                <CloseIcon className="size-4" />
                <span className="sr-only">Close</span>
              </button>
              <div className="flex flex-col gap-8">
                <Link
                  href="/"
                  className="w-fit flex items-center gap-2 text-lg font-figtree font-bold"
                >
                  <IDRALogoBlack />
                  IDRA
                </Link>
                <Navigation
                  className="flex flex-col items-start gap-6"
                  buttonClassName="text-lg"
                  onClick={() => setIsOpen(false)}
                />
              </div>
              <PrimaryButton
                onClick={() => window.open(DASHBOARD_URL, "_blank")}
                className="w-fit"
              >
                Login / Sign Up
              </PrimaryButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DropdownMenu({ onClick }: { onClick?: () => void }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);

  function handleClick(url: string) {
    onClick?.();
    window.open(url, "_blank");
  }

  if (isMobile) {
    return (
      <div className="flex flex-col gap-6">
        <button
          onClick={() => handleClick("/dashboard")}
          className="hover:text-muted w-fit cursor-pointer text-lg font-medium text-nowrap transition-all duration-300"
        >
          Devkits Dashboard
        </button>
        <button
          onClick={() => handleClick("/sdk")}
          className="hover:text-muted w-fit cursor-pointer text-lg font-medium text-nowrap transition-all duration-300"
        >
          Developer Docs
        </button>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="relative flex h-full items-center justify-center"
    >
      <button
        className={`flex w-fit cursor-pointer items-center gap-2 leading-[100%] font-medium text-nowrap transition-all duration-300 ${isOpen ? "text-muted" : "text-foreground"}`}
      >
        Developer{" "}
        <ChevronDownIcon
          className={`size-4 transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}

const NAVIGATION_ITEMS = [
  {
    label: "What is IDRA?",
    url: "#product",
  },
  {
    label: "Utility",
    url: "#utility",
    offset: 70,
  },
  {
    label: "Features",
    url: "#features",
    offset: 150,
  },
  {
    label: "Transparency",
    url: "#transparency",
  },
  {
    label: "FAQ",
    url: "#faq",
  },
];
