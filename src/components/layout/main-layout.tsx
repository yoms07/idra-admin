"use client";

import { AppSidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import Link from "next/link";
import { useAppStore } from "@/state/stores/appStore";
import { useLogout, useMe } from "@/features/auth/hooks/authHook";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, LogOut, UserRound } from "lucide-react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useXellarAccount, useProfileModal } from "@xellar/kit";
import { SolidAvatar } from "../ui/solid-avatar";
import { useRouter } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { reset, notifications } = useAppStore();
  const router = useRouter();
  const { open: openProfileModal } = useProfileModal();
  const me = useMe();
  const { mutateAsync: logout } = useLogout();

  const handleLogout = async () => {
    reset();
    await logout();
    router.push("/login");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full">
        <AppSidebar />

        <SidebarInset className="w-full">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-[#F9F7F5]">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <div className="flex items-center gap-2 ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Notifications"
                    className="bg-transparent rounded-xl !border-[#D4D4D8] shadow-none border-2"
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-2">
                  {!notifications || notifications.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-4 text-center">
                      No notifications
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2 rounded-md hover:bg-muted/60 cursor-default"
                        >
                          <div className="text-sm font-medium truncate">
                            {n.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {n.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <SidebarMenuButton className="py-5 w-full">
                    <div className="flex gap-1 justify-between items-center w-full">
                      <span className="flex items-center gap-1.5">
                        <Avatar className="size-8">
                          <AvatarImage src={""} className="size-8" />
                          <AvatarFallback>
                            <SolidAvatar
                              name={me?.data?.name || ""}
                              className="size-8 text-md"
                            />
                          </AvatarFallback>
                        </Avatar>
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer !hover:bg-primary"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto pb-16 md:pb-0 bg-[#F9F7F5]">
            {children}
          </main>

          {/* Mobile Navigation */}
          <MobileNav />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
