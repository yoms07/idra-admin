"use client";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useMe } from "../hooks/authHook";
import { Loader } from "@/components/common/Loader";
import { RoleEnum } from "@/features/user/schema/user";

export function RequireAuthentication({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center">
        <Loader className="size-40" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
  }

  return <>{children}</>;
}

export function RequireNotAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center">
        <Loader className="size-40" />
      </div>
    );
  }

  if (isAuthenticated) {
    router.push("/dashboard");
  }

  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useIsAuthenticated();
  const { data: me, isLoading: isMeLoading } = useMe();
  const router = useRouter();

  const isLoading = isAuthLoading || isMeLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center">
        <Loader className="size-40" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  if (me?.role !== RoleEnum.enum.ADMIN) {
    router.push("/dashboard");
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Access denied. Admin only.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
