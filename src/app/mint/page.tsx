"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "@/state/stores/appStore";
import { useAccount } from "wagmi";
import { useCreateMint } from "@/features/mint/hooks/useMint";
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
import { RadioGroup } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "@/components/common/Loader";
import { WalletNotConnected } from "@/components/common/wallet-not-connected";
import { PaymentFlow } from "./PaymentFlow";
import { PaymentMethodItem } from "./PaymentMethodItem";
import { RecentMints } from "./recent-mints";
import { MintFormSchema, type MintForm } from "@/lib/schema";
import { DollarSign, Building2, AlertCircle, QrCode } from "lucide-react";
import { formatIDR, formatIDRA } from "@/lib/utils";
import { RequireAuthentication } from "@/features/auth/components/auth-wrapper";
import { useMe } from "@/features/auth";

const quickAmounts = [20000, 50000, 100000, 500000, 1000000];

function MintPage() {
  const router = useRouter();
  const {} = useAppStore();
  const { address, isConnected } = useAccount();
  const { mutate: createMint } = useCreateMint();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [qrData, setQrData] = useState<string | undefined>(undefined);
  const [mintId, setMintId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const { data: user } = useMe();

  const form = useForm<MintForm>({
    resolver: zodResolver(MintFormSchema),
    defaultValues: {
      idraAmount: "",
      paymentMethod: "qris",
      walletAddress: user?.walletAddress,
    },
  });

  const idraAmount = form.watch("idraAmount");
  const idrToPay = idraAmount ? parseFloat(idraAmount) * 1 : 0; // 1:1 IDRA↔IDR for now
  const totalAmount = idraAmount ? idrToPay : 0;

  const handleQuickAmount = (amount: number) => {
    form.setValue("idraAmount", amount.toString());
  };

  const onSubmit = async (data: MintForm) => {
    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Call API to create mint request
      createMint(
        {
          mintAddress: address,
          amountIdr: (idrToPay as any).toString(),
          paymentMethod: data.paymentMethod,
          chainId: 84532,
        },
        {
          onSuccess: (res) => {
            if (res.paymentMethod === "qris") {
              setQrData(res.paymentInstructions.qrData);
            }
            setMintId(res.id);
            setShowPayment(true);
          },
          onError: (e) => {
            setError("Failed to create mint request. Please try again.");
          },
        }
      );
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

  if (!isConnected) {
    return (
      <MainLayout>
        <div className="p-6">
          <WalletNotConnected
            title="Wallet Required"
            description="Please connect your wallet to mint IDRA tokens."
            actionText="Connect Wallet"
            actionHref="/login"
          />
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
        qrData={qrData}
        mintId={mintId}
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
                          value as "qris" | "va_bri" | "va_bni" | "va_permata"
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
                          <span>{formatIDR(idrToPay)}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>{formatIDR(totalAmount)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>You'll receive</span>
                          <span>{formatIDRA(idraAmount)}</span>
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

            <RecentMints />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function () {
  return (
    <RequireAuthentication>
      <MintPage />
    </RequireAuthentication>
  );
}
