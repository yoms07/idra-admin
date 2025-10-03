"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/state/stores/appStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "@/components/common/Loader";
import { Wallet, Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setAuthenticated, setWalletAddress, setWalletConnected } =
    useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement Google OAuth with Xellar Kit
      // For now, simulate successful login
      const mockUser = {
        id: "1",
        email: "user@example.com",
        name: "John Doe",
        avatar: "https://github.com/shadcn.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      setAuthenticated(true);

      // Check if wallet is connected
      const hasWallet = false; // TODO: Check actual wallet connection

      if (hasWallet) {
        router.push("/dashboard");
      } else {
        router.push("/connect-wallet");
      }
    } catch (err) {
      setError("Failed to login with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement wallet connection with Xellar Kit
      // For now, simulate successful wallet connection
      const mockAddress = "0x1234567890123456789012345678901234567890";

      setWalletAddress(mockAddress);
      setWalletConnected(true);

      // Create a mock user for wallet-only login
      const mockUser = {
        id: "1",
        email: "wallet@example.com",
        name: "Wallet User",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      setAuthenticated(true);

      router.push("/dashboard");
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">M</span>
          </div>
          <CardTitle className="text-2xl">Welcome to MSC Dashboard</CardTitle>
          <CardDescription>
            Sign in to manage your stablecoin transactions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <Button
              onClick={handleWalletConnect}
              disabled={isLoading}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4" />
              ) : (
                <Wallet className="mr-2 h-4 w-4" />
              )}
              Connect Wallet
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
