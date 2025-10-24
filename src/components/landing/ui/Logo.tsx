import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/img-xellar-logo.png"
      alt="Xellar Logo"
      width={200}
      height={200}
      className={cn("h-8 w-auto object-contain", className)}
    />
  );
}
