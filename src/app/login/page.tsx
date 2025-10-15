"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ConnectDialogStandAlone } from "@xellar/kit";
import { useAccount, useDisconnect } from "wagmi";
import { useIsAuthenticated, useSiweAuthentication } from "@/features/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "@/components/common/Loader";
import { Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequireNotAuthenticated } from "@/features/auth/components/auth-wrapper";

const LoginPage = () => {
  const router = useRouter();
  const {
    address,
    isConnected: isWalletConnected,
    isDisconnected: isWalletDisconnected,
  } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    signInWithEthereum,
    isGettingNonce,
    isVerifying,
    isSigning,
    errorMessage,
  } = useSiweAuthentication();
  const { isAuthenticated, isLoading: isCheckingAuth } = useIsAuthenticated();

  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     router.push("/dashboard");
  //   }
  // }, [isAuthenticated, user, router]);

  const handleWalletAuthentication = async () => {
    if (!address) return;
    setIsConnecting(true);
    setError(null);
    const err = await signInWithEthereum(address);
    if (err) {
      setError(err);
    } else {
      router.push("/dashboard");
    }
    setIsConnecting(false);
  };

  const mainButtonText = () => {
    if (isGettingNonce) return "Getting Nonce...";
    if (isVerifying) return "Verifying...";
    if (isSigning) return "Signing...";
    if (isConnecting) return "Authenticating...";
    return "Sign in with Ethereum";
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">
              ID
            </span>
          </div>
          <CardTitle className="text-2xl">Welcome to IDRA Dashboard</CardTitle>
          <CardDescription>
            Connect your wallet to manage your IDRA transactions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 items-center flex flex-col">
            {!isWalletConnected && <ConnectDialogStandAlone />}

            {isWalletConnected && address && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Wallet Connected</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
                <div className="flex items-center mt-3 gap-3">
                  {!isAuthenticated && (
                    <Button
                      onClick={handleWalletAuthentication}
                      disabled={isGettingNonce || isVerifying || isConnecting}
                    >
                      {mainButtonText()}
                    </Button>
                  )}
                  <Button onClick={() => disconnect()}>Change Wallet</Button>
                </div>
                {(isConnecting ||
                  isGettingNonce ||
                  isVerifying ||
                  isSigning) && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Loader className="h-3 w-3" />
                    <span className="text-xs text-muted-foreground">
                      {isGettingNonce && "Getting authentication nonce..."}
                      {isVerifying && "Verifying signature..."}
                      {isSigning && "Requesting signature..."}
                      {isConnecting && "Authenticating..."}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            By connecting your wallet, you agree to our Terms of Service and
            Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default function () {
  return (
    <RequireNotAuthenticated>
      <LoginPage />
    </RequireNotAuthenticated>
  );
}
