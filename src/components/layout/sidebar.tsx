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
import {
  Home,
  Send,
  Clock,
  Settings,
  ChevronDown,
  Bell,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IDRALogoLightMode } from "../icons/idra-logo-light-mode";
import { useMe } from "@/features/auth";
import { AvatarImage } from "@radix-ui/react-avatar";
import { GradientAvatar } from "../ui/gradient-avatar";

const navigation = [
  { name: "home", href: "/dashboard", icon: <Home /> },
  { name: "Referral", href: "#", icon: <Bell /> },
  { name: "Terms & Policy", href: "#", icon: <Zap /> },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: me } = useMe();

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
                <span className="flex items-center gap-1.5">
                  <Avatar className="size-5">
                    <AvatarImage src={""} className="size-5" />
                    <AvatarFallback>
                      <GradientAvatar
                        name={me?.name || ""}
                        className="size-5 text-xs"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <span>{me?.name}</span>
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
