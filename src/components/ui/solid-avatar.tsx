import * as React from "react";

import { cn } from "@/lib/utils";

interface SolidAvatarProps {
  name: string;
  className?: string;
  showInitials?: boolean;
}

export const SolidAvatar = ({
  name,
  className,
  showInitials = true,
}: SolidAvatarProps) => {
  // Generate consistent color from string
  const getColor = (str: string) => {
    const hash = str.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    // Generate a single hue for solid color
    const hue = hash % 360;

    return `hsl(${hue}, 70%, 60%)`;
  };

  const color = getColor(name);

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
        backgroundColor: color,
      }}
    >
      {showInitials ? initials : null}
    </div>
  );
};
