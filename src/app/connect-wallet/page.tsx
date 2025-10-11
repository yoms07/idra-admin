"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// Legacy page; wallet connection is handled on /login via Xellar Kit
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
import {
  Wallet,
  Smartphone,
  ExternalLink,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function ConnectWalletPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExternalWallet = async () => {
    setIsLoading(true);
    setError(null);
  };

  const handleEmbeddedWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to create embedded wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const handleBack = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">M</span>
          </div>
          <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
          <CardDescription>
            Choose how you'd like to connect your wallet to start using MSC
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
              onClick={handleExternalWallet}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4" />
              ) : (
                <Wallet className="mr-2 h-4 w-4" />
              )}
              Connect External Wallet
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              MetaMask, WalletConnect, and more
            </div>

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
              onClick={handleEmbeddedWallet}
              disabled={isLoading}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4" />
              ) : (
                <Smartphone className="mr-2 h-4 w-4" />
              )}
              Create Embedded Wallet
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              We'll create a secure wallet for you
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Button onClick={handleSkip} variant="ghost" className="w-full">
              Skip for now (View Only)
            </Button>

            <Button onClick={handleBack} variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            You can connect a wallet later in settings
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
