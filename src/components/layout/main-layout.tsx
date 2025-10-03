"use client";

import { AppSidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import Link from "next/link";
import { useAppStore } from "@/state/stores/appStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, UserRound } from "lucide-react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, reset, notifications } = useAppStore();

  const handleDisconnect = () => {
    reset();
    window.location.href = "/login";
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full">
        <AppSidebar />

        <SidebarInset className="w-full">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Notifications"
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
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 rounded-full p-0"
                    aria-label="Open profile menu"
                  >
                    <Avatar className="size-9 border-primary border-1">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0) ||
                          user?.email?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 space-y-1">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <UserRound /> Your Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDisconnect}
                    className="text-destructive !hover:text-destructive !hover:bg-destructive/10"
                  >
                    <LogOut /> Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            {children}
          </main>

          {/* Mobile Navigation */}
          <MobileNav />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
