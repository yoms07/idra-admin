"use client";
import Image from "next/image";
import { motion, MotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div"> &
  MotionProps & { imageClassName?: string };

export function Lightning({ className, imageClassName, ...props }: Props) {
  return (
    <motion.div
      className={cn("absolute flex items-center justify-center", className)}
      {...props}
    >
      <Image
        src="/images/img-as-light-decoration.png"
        alt="lightning"
        width={1080}
        height={1080}
        className={cn(
          "pointer-events-none h-full w-full object-contain",
          imageClassName
        )}
      />
    </motion.div>
  );
}
