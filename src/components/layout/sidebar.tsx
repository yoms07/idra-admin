"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/state/stores/appStore";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Send, Clock } from "lucide-react";
import { MintSymbol } from "../icons/mint-symbol";
import { RedeemSymbol } from "../icons/redeem-symbol";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: <Home /> },
  { name: "Mint", href: "/mint", icon: <MintSymbol /> },
  { name: "Redeem", href: "/redeem", icon: <RedeemSymbol /> },
  { name: "Send", href: "/send", icon: <Send /> },
  { name: "History", href: "/transactions", icon: <Clock /> },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { reset } = useAppStore();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              ID
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">IDRA Dashboard</span>
            <span className="text-xs text-muted-foreground">
              Stablecoin Service
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                    >
                      <Link href={item.href} className="flex gap-1 hover:gap-2">
                        {item.icon}
                        <span className="">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
