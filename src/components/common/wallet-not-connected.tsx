"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface WalletNotConnectedProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export function WalletNotConnected({
  title = "Wallet Required",
  description = "Please connect your wallet to continue.",
  actionText = "Connect Wallet",
  actionHref = "/login",
}: WalletNotConnectedProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Button asChild className="w-full">
            <a href={actionHref}>{actionText}</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
