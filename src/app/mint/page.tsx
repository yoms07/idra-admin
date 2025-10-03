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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "@/components/common/Loader";
import { PaymentFlow } from "./PaymentFlow";
import { PaymentMethodItem } from "./PaymentMethodItem";
import { MintFormSchema, type MintForm } from "@/lib/schema";
import {
  DollarSign,
  CreditCard,
  Building2,
  AlertCircle,
  QrCode,
} from "lucide-react";
import { formatIDR } from "@/lib/utils";

const quickAmounts = [20000, 50000, 100000, 500000, 1000000];

export default function MintPage() {
  const router = useRouter();
  const { walletConnected, balance, addTransaction } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MintForm>({
    resolver: zodResolver(MintFormSchema),
    defaultValues: {
      idraAmount: "",
      paymentMethod: "qris",
      walletAddress: "",
    },
  });

  const idraAmount = form.watch("idraAmount");
  const idrToPay = idraAmount ? parseFloat(idraAmount) * 1 : 0; // 1:1 IDRA↔IDR for now
  const fee = idraAmount ? parseFloat(idraAmount) * 0.02 : 0; // 2% fee (applied on IDR to pay)
  const totalAmount = idraAmount ? idrToPay + fee : 0;

  const handleQuickAmount = (amount: number) => {
    form.setValue("idraAmount", amount.toString());
  };

  const onSubmit = async (data: MintForm) => {
    if (!walletConnected) {
      setError("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // TODO: Implement actual payment processing
      // For now, simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create pending transaction
      const transaction = {
        id: Date.now().toString(),
        type: "mint" as const,
        status: "pending" as const,
        amount: idraAmount || "0",
        amountUSD: (idrToPay || "0").toString(),
        paymentId: `pay_${Date.now()}`,
        createdAt: new Date(),
      };

      addTransaction(transaction);
      setShowPayment(true);
    } catch (err) {
      setError("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    // TODO: Update transaction status to completed
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
                    Please connect your wallet to mint IDRA tokens.
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

  const renderPaymentFlow = showPayment ? (
    <div className="p-6">
      <PaymentFlow
        amountIdr={(idrToPay as any).toString()}
        amountIdra={idraAmount || "0"}
        paymentMethod={form.watch("paymentMethod") as any}
        onDone={() => router.push("/history")}
        onMintMore={() => setShowPayment(false)}
      />
    </div>
  ) : null;

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {renderPaymentFlow}
        {/* Header */}
        {!showPayment && (
          <div>
            <h1 className="text-3xl font-bold">Mint IDRA Tokens</h1>
            <p className="text-muted-foreground">
              Convert IDR to IDRA stablecoins using your preferred payment
              method.
            </p>
          </div>
        )}

        {!showPayment && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Mint Form */}
            <Card>
              <CardHeader>
                <CardTitle>Mint Tokens</CardTitle>
                <CardDescription>
                  Enter how much IDRA you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Wallet Address */}
                  <div className="space-y-2">
                    <Label htmlFor="walletAddress">Wallet Address</Label>
                    <Input
                      id="walletAddress"
                      placeholder="0x..."
                      {...form.register("walletAddress")}
                    />
                    {form.formState.errors.walletAddress && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.walletAddress.message}
                      </p>
                    )}
                  </div>

                  {/* IDRA Amount Input */}
                  <div className="space-y-2">
                    <Label htmlFor="idraAmount">Amount (IDRA)</Label>
                    <Input
                      id="idraAmount"
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="0.00"
                      leftElement={<DollarSign className="h-4 w-4" />}
                      {...form.register("idraAmount")}
                    />
                    {form.formState.errors.idraAmount && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.idraAmount.message}
                      </p>
                    )}
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="space-y-2">
                    <Label>Quick Amounts</Label>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant="outline"
                          className="px-2"
                          size="sm"
                          onClick={() => handleQuickAmount(amount)}
                        >
                          {formatIDR(amount)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={form.watch("paymentMethod")}
                      onValueChange={(value) =>
                        form.setValue(
                          "paymentMethod",
                          value as "qris" | "va_bri" | "va_bca" | "va_bni"
                        )
                      }
                      className="grid gap-3 sm:grid-cols-2 items-stretch"
                    >
                      <PaymentMethodItem
                        value="qris"
                        title="QRIS"
                        description="Scan with any supported bank app"
                        icon={<QrCode className="h-5 w-5" />}
                      />
                      <PaymentMethodItem
                        value="va_bri"
                        title="Virtual Account BRI"
                        description="Pay via BRI virtual account"
                        icon={<Building2 className="h-5 w-5" />}
                      />
                      <PaymentMethodItem
                        value="va_bca"
                        title="Virtual Account BCA"
                        description="Pay via BCA virtual account"
                        icon={<Building2 className="h-5 w-5" />}
                      />
                      <PaymentMethodItem
                        value="va_bni"
                        title="Virtual Account BNI"
                        description="Pay via BNI virtual account"
                        icon={<Building2 className="h-5 w-5" />}
                      />
                    </RadioGroup>
                  </div>

                  {/* Transaction Summary */}
                  {idraAmount && (
                    <div className="space-y-2 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium">Transaction Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>You pay</span>
                          <span>
                            {formatIDR(
                              parseFloat((idrToPay || "0").toString())
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fee (2%)</span>
                          <span>
                            {formatIDR(parseFloat((fee || "0").toString()))}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>
                            {formatIDR(
                              parseFloat((totalAmount || "0").toString())
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>You'll receive</span>
                          <span>{idraAmount} IDRA</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      isProcessing ||
                      !idraAmount ||
                      !form.watch("walletAddress") ||
                      !/^0x[a-fA-F0-9]{40}$/.test(form.watch("walletAddress"))
                    }
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="mr-2 h-4 w-4" />
                        Processing...
                      </>
                    ) : (
                      "Continue to Payment"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Mints */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Mints</CardTitle>
                <CardDescription>
                  Your recent minting transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground py-8">
                    <DollarSign className="h-8 w-8 mx-auto mb-2" />
                    <p>No recent mints</p>
                    <p className="text-sm">
                      Your minting history will appear here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
