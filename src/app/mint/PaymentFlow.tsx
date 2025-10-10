"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock, QrCode, Receipt } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useMintById } from "@/features/mint/hooks/useMint";

interface PaymentFlowProps {
  amountIdr: string;
  amountIdra: string;
  paymentMethod: "qris" | "va_bri" | "va_bca" | "va_bni";
  onDone: () => void;
  onMintMore: () => void;
  qrData?: string;
  mintId?: string;
}

type Step = "instructions" | "minting" | "success";

export function PaymentFlow({
  amountIdr,
  amountIdra,
  paymentMethod,
  onDone,
  onMintMore,
  qrData,
  mintId,
}: PaymentFlowProps) {
  const [step, setStep] = useState<Step>("instructions");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const { data: mint, refetch } = useMintById(mintId);

  const virtualAccount = mint?.paymentInstructions?.accountNumber;

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Set up periodic refetch while component is mounted
  useEffect(() => {
    if (!mintId) return;
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      refetch();
    }, 2000);
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [mintId, refetch]);

  useEffect(() => {
    if (!mint) return;
    // payment status handling
    if (mint.paymentStatus === "paid" && step === "instructions") {
      setStep("minting");
    }
    if (mint.paymentStatus === "failed") {
      setError("Payment failed. Please try again.");
      setIsChecking(false);
    }
    if (mint.paymentStatus === "expired") {
      setError("Payment expired. Please create a new request.");
      setIsChecking(false);
    }

    // mint status handling
    if (mint.status === "completed") {
      setStep("success");
      setIsChecking(false);
    }
    if (mint.status === "failed") {
      setError("Minting failed. Please contact support.");
      setIsChecking(false);
    }
  }, [mint, step]);

  const startBackgroundCheck = () => {
    // Start polling via parent-provided mintId
    setIsChecking(true);
    setError(null);
    // Trigger an immediate refetch on click
    refetch();
  };

  return (
    <Card className="max-w-md mx-auto w-full">
      <CardHeader className="text-center">
        {step === "instructions" && (
          <>
            <CardTitle>Complete Your Payment</CardTitle>
            <CardDescription>
              Pay Rp{amountIdr} IDR to receive {amountIdra} IDRA
            </CardDescription>
          </>
        )}
        {step === "minting" && (
          <>
            <CardTitle>Minting In Progress</CardTitle>
            <CardDescription>
              We're minting {amountIdra} IDRA to your wallet
            </CardDescription>
          </>
        )}
        {step === "success" && (
          <>
            <CardTitle>Payment Successful</CardTitle>
            <CardDescription>You received {amountIdra} IDRA</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === "instructions" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-300">
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                {paymentMethod === "qris" ? (
                  <QrCode className="h-6 w-6" />
                ) : (
                  <Receipt className="h-6 w-6" />
                )}
                <div>
                  <div className="font-medium">
                    {paymentMethod === "qris"
                      ? "Scan to Pay"
                      : "Virtual Account"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {paymentMethod === "qris"
                      ? "Supported by all Indonesian banks"
                      : "Use your bank app to pay via VA"}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-background border p-3 text-center">
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className="font-semibold">Rp{amountIdr}</div>
                </div>
                <div className="rounded-lg bg-background border p-3 text-center">
                  <div className="text-xs text-muted-foreground">You get</div>
                  <div className="font-semibold">{amountIdra} IDRA</div>
                </div>
              </div>
              {paymentMethod !== "qris" ? (
                <>
                  <div className="mt-4 rounded-lg bg-background border p-3">
                    <div className="text-xs text-muted-foreground">
                      Virtual Account
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="font-mono tracking-wider text-sm">
                        {virtualAccount}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(virtualAccount!)
                        }
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm list-disc pl-5 text-muted-foreground">
                    <li>
                      Open your banking app and choose Virtual Account payment
                    </li>
                    <li>Enter the VA number exactly as shown</li>
                    <li>Confirm the amount: Rp{amountIdr}</li>
                    <li>Complete the payment within 10 minutes</li>
                  </ul>
                </>
              ) : (
                <div className="mt-4 rounded-lg bg-background border p-6 text-center">
                  <div className="inline-flex items-center justify-center rounded-md border p-6">
                    {qrData ? (
                      <QRCodeCanvas
                        value={qrData}
                        size={180}
                        includeMargin={true}
                      />
                    ) : (
                      <QrCode className="h-16 w-16" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-3">
                    Scan this QR with your bank app
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 animate-pulse" />
              Waiting for your payment...
            </div>

            <div className="flex gap-2">
              <Button onClick={startBackgroundCheck} className="flex-1">
                I already paid
              </Button>
              <Button variant="outline" className="flex-1" onClick={onDone}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === "minting" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-300">
            <div className="flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <div className="font-medium">Minting IDRA</div>
              <div className="text-sm text-muted-foreground">
                This usually takes ~10–30s
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span className="text-sm">
                We will notify you here once it’s done.
              </span>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-300">
            <div className="flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="font-medium">Payment confirmed</div>
              <div className="text-sm text-muted-foreground">
                {amountIdra} IDRA has been minted
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={onDone}>
                Go to transactions
              </Button>
              <Button variant="outline" className="flex-1" onClick={onMintMore}>
                Mint more
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
