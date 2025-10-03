"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/state/stores/appStore";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "@/components/common/Loader";
import { SendFormSchema, type SendForm } from "@/lib/schema";
import {
  Send,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  QrCode,
  ArrowUpDown,
} from "lucide-react";

export default function SendPage() {
  const router = useRouter();
  const { walletConnected, balance, balanceUSD, addTransaction } =
    useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SendForm>({
    resolver: zodResolver(SendFormSchema),
    defaultValues: {
      recipientAddress: "",
      mscAmount: "",
      note: "",
    },
  });

  const mscAmount = form.watch("mscAmount");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      form.setValue("recipientAddress", text);
    } catch (err) {
      console.error("Failed to paste from clipboard:", err);
    }
  };

  const validateAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const onSubmit = async (data: SendForm) => {
    if (!walletConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (parseFloat(data.mscAmount) > parseFloat(balance)) {
      setError("Insufficient balance");
      return;
    }

    if (!validateAddress(data.recipientAddress)) {
      setError("Invalid wallet address");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // TODO: Implement actual transaction
      // For now, simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create pending transaction
      const transaction = {
        id: Date.now().toString(),
        type: "send" as const,
        status: "pending" as const,
        amount: data.mscAmount,
        amountUSD: data.mscAmount, // 1:1 ratio for now
        to: data.recipientAddress,
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        networkFee: "0.001",
        note: data.note,
        createdAt: new Date(),
      };

      addTransaction(transaction);
      setShowConfirmation(true);
    } catch (err) {
      setError("Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmation = () => {
    router.push("/dashboard");
  };

  if (!walletConnected) {
    return (
      <MainLayout>
        <div className="p-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h2 className="text-xl font-semibold">Wallet Required</h2>
                  <p className="text-muted-foreground">
                    Please connect your wallet to send IDRA tokens.
                  </p>
                </div>
                <Button asChild className="w-full">
                  <a href="/connect-wallet">Connect Wallet</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (showConfirmation) {
    return (
      <MainLayout>
        <div className="p-6">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Transaction Sent</CardTitle>
              <CardDescription>
                Your MSC tokens have been sent successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold">{mscAmount} IDRA</div>
                <div className="text-muted-foreground">Rp{mscAmount} IDR</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Amount</span>
                  <span>{mscAmount} IDRA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Network Fee</span>
                  <span>0.001 MSC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total</span>
                  <span>
                    {(parseFloat(mscAmount || "0") + 0.001).toFixed(3)} MSC
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>To</span>
                  <span className="font-mono text-xs">
                    {form.getValues("recipientAddress").slice(0, 6)}...
                    {form.getValues("recipientAddress").slice(-4)}
                  </span>
                </div>
              </div>

              <Button onClick={handleConfirmation} className="w-full">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Send IDRA Tokens</h1>
          <p className="text-muted-foreground text-sm">
            Send IDRA tokens to any wallet address
          </p>
        </div>

        <div className="space-y-4">
          {/* Account Selection */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      M
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">My Account</div>
                    <div className="text-sm text-muted-foreground">
                      IDRA Wallet
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Send Form */}
          <Card>
            <CardContent className="p-4">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Recipient Address */}
                <div className="space-y-3">
                  <Label
                    htmlFor="recipientAddress"
                    className="text-sm font-medium"
                  >
                    Recipient's address
                  </Label>
                  <Input
                    id="recipientAddress"
                    placeholder="Enter wallet address..."
                    className="text-base"
                    rightElement={
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs"
                          onClick={handlePaste}
                        >
                          Paste
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </div>
                    }
                    {...form.register("recipientAddress")}
                  />

                  {form.watch("recipientAddress") && (
                    <div className="space-y-2">
                      <div className="text-sm font-mono text-muted-foreground">
                        {form.watch("recipientAddress").slice(0, 6)}...
                        {form.watch("recipientAddress").slice(-4)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          IDRA address
                        </span>
                        {validateAddress(form.watch("recipientAddress")) ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Address found</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">Invalid address</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {form.formState.errors.recipientAddress && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.recipientAddress.message}
                    </p>
                  )}
                </div>

                {/* Amount Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Amount</Label>
                    <div className="text-sm text-muted-foreground">
                      Balance: {parseFloat(balance).toFixed(2)} IDRA
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-center">
                      {mscAmount || "0.00"}
                    </div>
                    <Input
                      id="mscAmount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={balance}
                      placeholder="Enter the total amount"
                      className="text-center text-base"
                      rightElement={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            // Toggle between IDRA and IDR
                          }}
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      }
                      {...form.register("mscAmount")}
                    />
                  </div>

                  {form.formState.errors.mscAmount && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.mscAmount.message}
                    </p>
                  )}
                </div>

                {/* Send Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium"
                  disabled={
                    isProcessing ||
                    !mscAmount ||
                    !form.watch("recipientAddress") ||
                    !validateAddress(form.watch("recipientAddress"))
                  }
                >
                  {isProcessing ? (
                    <>
                      <Loader className="mr-2 h-4 w-4" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send IDRA
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
