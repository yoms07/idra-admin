"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/state/stores/appStore";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Send, Clock, Settings, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MintSymbol } from "../icons/mint-symbol";
import { RedeemSymbol } from "../icons/redeem-symbol";
import { IDRALogoBlack } from "../icons/idra-logo-black";
import { IDRALogoLightMode } from "../icons/idra-logo-light-mode";

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
        <div className="flex items-center gap-2 px-2 text-3xl pt-2 text-black font-bold cursor-pointer">
          <IDRALogoLightMode />
          IDRA
        </div>
      </SidebarHeader>

      <SidebarContent className="mt-2">
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
                      className="font-semibold py-5"
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

      <SidebarFooter>
        <SidebarMenu>
          {/* Settings */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="py-5">
              <Link href="#" className="flex gap-1 hover:gap-2">
                <Settings className="text-muted-foreground" />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* User attachment */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="py-5">
              <button className="flex gap-1 justify-between hover:gap-2">
                <span className="flex items-center gap-1">
                  <Avatar className="size-5">
                    <AvatarFallback className="bg-[#1F2A37] text-white text-xs font-bold">
                      DI
                    </AvatarFallback>
                  </Avatar>
                  <span>Dimas Indra</span>
                </span>
                <ChevronDown className="text-muted-foreground" />
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
