"use client";
import { useRouter } from "next/navigation";
import { useIsAuthenticated } from "../hooks/authHook";

export function RequireAuthentication({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
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
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    router.push("/dashboard");
  }

  return <>{children}</>;
}
