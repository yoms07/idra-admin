"use client";
import { useRouter } from "next/navigation";
import { useIsAuthenticated } from "../hooks/authHook";
import { Loader } from "@/components/common/Loader";

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
