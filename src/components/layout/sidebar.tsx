"use client";

import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IDRALogoLightMode } from "../icons/idra-logo-light-mode";
import { useMe, useLogout } from "@/features/auth";
import { AvatarImage } from "@radix-ui/react-avatar";
import { GradientAvatar } from "../ui/gradient-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SolidAvatar } from "../ui/solid-avatar";

const navigation = [
  {
    name: "Home",
    href: "/dashboard",
    icon: <Home className="w-full h-full" />,
  },
  // { name: "Referral", href: "#", icon: <Bell /> },
  {
    name: "Terms & Policy",
    href: "#",
    icon: <Zap className="h-full w-full" />,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: me } = useMe();
  const { mutateAsync: logout } = useLogout();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleProfile = async () => {
    router.push("/profile");
  };

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
                      className="font-semibold h-12 border-1 border-transparent hover:bg-sidebar hover:border-primary hover:border-1 hover:text-primary duration-300 transition-all"
                    >
                      <Link
                        href={item.href}
                        className="flex gap-1 hover:gap-2 items-center py-0"
                      >
                        <div
                          style={{
                            width: "22px",
                            height: "22px",
                          }}
                        >
                          {item.icon}
                        </div>
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
          {/* <SidebarMenuItem>
            <SidebarMenuButton asChild className="py-5">
              <Link href="#" className="flex gap-1 hover:gap-2">
                <Settings className="text-muted-foreground" />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}

          {/* User attachment */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="py-5 w-full border-1 border-transparent hover:bg-sidebar hover:border-primary hover:border-1 hover:text-primary duration-300 transition-all cursor-pointer">
                  <div className="flex gap-1 justify-between items-center w-full">
                    <span className="flex items-center gap-1.5">
                      <Avatar className="size-6">
                        <AvatarImage src={""} className="size-6" />
                        <AvatarFallback>
                          <SolidAvatar
                            name={me?.name || ""}
                            className="size-6 text-xs"
                          />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-base">{me?.name}</span>
                    </span>
                    <ChevronDown className="text-muted-foreground" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={handleProfile}
                  className="cursor-pointer !hover:bg-primary"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer !hover:bg-primary"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
