"use client";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useIsAuthenticated, useLogout, useMe } from "../hooks/authHook";
import { Loader } from "@/components/common/Loader";
import { RoleEnum } from "@/features/user/schema/user";
import { Button } from "@/components/ui/button";

const ADMIN_HOME_PATH = "/admin/users";
const LOGIN_PATH = "/login";

function FullscreenLoader() {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Loader className="size-40" />
    </div>
  );
}

export function RequireAuthentication({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(LOGIN_PATH);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <FullscreenLoader />;
  }

  return <>{children}</>;
}

export function RequireNotAuthenticated({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(ADMIN_HOME_PATH);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return <FullscreenLoader />;
  }

  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useIsAuthenticated();
  const { data: me, isLoading: isMeLoading } = useMe();
  const router = useRouter();
  const { mutateAsync: logout } = useLogout();

  if (isAuthLoading || isMeLoading || !isAuthenticated) {
    return <FullscreenLoader />;
  }

  const handleLogout = async () => {
    await logout();
    router.push(LOGIN_PATH);
  };

  if (me?.role !== RoleEnum.enum.ADMIN) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Access denied. Admin only.</p>
          <Button variant="default" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
