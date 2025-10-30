"use client";
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function SecondaryButton({
  className,
  children,
  isShowIcon = true,
  ...props
}: ButtonProps & { isShowIcon?: boolean }) {
  return (
    <button
      className={cn(
        // Base button styles
        "group bg-black relative flex cursor-pointer items-center gap-1 overflow-hidden rounded-lg border-0 px-[20px] font-semibold text-white transition-all duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
        // Hover states
        "hover:text-black hover:rounded-xl hover:bg-white hover:shadow-none",
        // Active state
        "active:scale-95 active:shadow-[0_0_0_4px_#1a1a1a]",
        "text-sm md:text-base",
        "h-10 md:h-12",
        className
      )}
      type="button"
      {...props}
    >
      <span
        className={`relative z-[1] font-semibold transition-all flex items-center gap-2.5 duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${isShowIcon ? "group-hover:-translate-x-[9px]" : ""}`}
      >
        {children}
      </span>

      <span className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100" />

      {isShowIcon && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="group-hover:fill-black pointer-events-none absolute right-1 z-[9] w-[18px] translate-x-4 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100"
          viewBox="0 0 24 24"
        >
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
      )}
    </button>
  );
}

export function PrimaryButton({ children, className, ...props }: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripple, setRipple] = useState<{
    x: number;
    y: number;
    size: number;
    key: number;
  } | null>(null);

  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2.5;
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      setRipple({ x, y, size, key: Date.now() });
    },
    []
  );

  return (
    <button
      ref={buttonRef}
      onMouseEnter={createRipple}
      onMouseLeave={() => setRipple(null)}
      className={cn(
        "group text-background relative inline-flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white px-4 font-semibold transition-all duration-300 hover:bg-white/80",
        "active:scale-95 active:shadow-[0_0_0_4px_#1a1a1a]",
        "text-sm md:text-base",
        "h-10 md:h-12",
        className
      )}
      {...props}
    >
      <span className="relative z-20 duration-300 group-hover:text-white flex items-center gap-2.5">
        {children}
      </span>

      <AnimatePresence>
        {ripple && (
          <motion.span
            key={ripple.key}
            className="bg-black pointer-events-none absolute z-10 rounded-full"
            style={{
              top: ripple.y,
              left: ripple.x,
              width: ripple.size,
              height: ripple.size,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}
