import * as React from "react";

import { cn } from "@/lib/utils";

interface GradientAvatarProps {
  name: string;
  className?: string;
  showInitials?: boolean;
}

export const GradientAvatar = ({
  name,
  className,
  showInitials = true,
}: GradientAvatarProps) => {
  // Generate consistent colors from string
  const getColors = (str: string) => {
    const hash = str.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    // Generate two different hues for gradient
    const hue1 = hash % 360;
    const hue2 = (hue1 + 40) % 360;

    return {
      color1: `hsl(${hue1}, 70%, 60%)`,
      color2: `hsl(${hue2}, 70%, 60%)`,
    };
  };

  const { color1, color2 } = getColors(name);

  // Get initials from name
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div
      className={cn(
        "size-10 rounded-full flex items-center justify-center text-white font-bold select-none text-sm",
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
      }}
    >
      {showInitials ? initials : null}
    </div>
  );
};
