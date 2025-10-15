"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/state/stores/appStore";
import { Badge } from "@/components/ui/badge";
import { Home, Plus, Minus, Send, History, Bell, Clock } from "lucide-react";
import { RedeemSymbol } from "../icons/redeem-symbol";
import { MintSymbol } from "../icons/mint-symbol";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Mint", href: "/mint", icon: MintSymbol },
  { name: "Redeem", href: "/redeem", icon: RedeemSymbol },
  { name: "Send", href: "/send", icon: Send },
  { name: "History", href: "/transactions", icon: Clock },
];

export function MobileNav() {
  const pathname = usePathname();
  const { unreadNotifications } = useAppStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <nav className="flex items-center justify-around py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.name === "History" && unreadNotifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </div>
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
