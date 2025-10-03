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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "@/components/common/Loader";
import { RedeemFormSchema, type RedeemForm } from "@/lib/schema";
import {
  Minus,
  DollarSign,
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

const percentageButtons = [25, 50, 75];

export default function RedeemPage() {
  const router = useRouter();
  const {
    walletConnected,
    balance,
    balanceUSD,
    bankAccounts,
    addBankAccount,
    addTransaction,
  } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(RedeemFormSchema),
    defaultValues: {
      mscAmount: "",
      bankAccountId: "",
      saveBankDetails: false,
    },
  });

  const mscAmount = form.watch("mscAmount");
  const usdAmount = mscAmount ? (parseFloat(mscAmount) * 1).toFixed(2) : "0"; // 1:1 ratio for now
  const selectedBankAccount = bankAccounts.find(
    (acc) => acc.id === form.watch("bankAccountId")
  );

  const handlePercentage = (percentage: number) => {
    const amount = ((parseFloat(balance) * percentage) / 100).toFixed(2);
    form.setValue("mscAmount", amount);
  };

  const handleMax = () => {
    form.setValue("mscAmount", balance);
  };

  const onSubmit = async (data: RedeemForm) => {
    if (!walletConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (parseFloat(data.mscAmount) > parseFloat(balance)) {
      setError("Insufficient balance");
      return;
    }

    if (!selectedBankAccount) {
      setError("Please select a bank account");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // TODO: Implement actual burn transaction and redemption request
      // For now, simulate processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create pending transaction
      const transaction = {
        id: Date.now().toString(),
        type: "redeem" as const,
        status: "pending" as const,
        amount: data.mscAmount,
        amountUSD: usdAmount,
        createdAt: new Date(),
      };

      addTransaction(transaction);
      setShowConfirmation(true);
    } catch (err) {
      setError("Redemption failed. Please try again.");
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
                    Please connect your wallet to redeem IDRA tokens.
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
              <CardTitle>Redemption Initiated</CardTitle>
              <CardDescription>
                Your IDRA tokens have been burned and redemption request
                created.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold">{mscAmount} IDRA</div>
                <div className="text-muted-foreground">Rp{usdAmount} IDR</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Amount</span>
                  <span>{mscAmount} IDRA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>USD Value</span>
                  <span>${usdAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bank Account</span>
                  <span className="text-right">
                    {selectedBankAccount?.accountHolderName}
                    <br />
                    {selectedBankAccount?.bankName}
                  </span>
                </div>
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Processing time: 1-3 business days
                </AlertDescription>
              </Alert>

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
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Redeem IDRA Tokens</h1>
          <p className="text-muted-foreground">
            Convert IDRA tokens back to IDR and receive funds in your bank
            account.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Redeem Form */}
          <Card>
            <CardHeader>
              <CardTitle>Redeem Tokens</CardTitle>
              <CardDescription>
                Enter the amount you'd like to redeem
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

                {/* Available Balance */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Available Balance
                    </span>
                    <div className="text-right">
                      <div className="font-bold">
                        {parseFloat(balance).toFixed(2)} IDRA
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Rp{parseFloat(balanceUSD).toFixed(2)} IDR
                      </div>
                    </div>
                  </div>
                </div>

                {/* IDRA Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="mscAmount">You will redeem</Label>
                  <Input
                    id="mscAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={balance}
                    placeholder="0.00"
                    leftElement={<p className="text-sm">Rp</p>}
                    rightElement={
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={handleMax}
                      >
                        Max
                      </Button>
                    }
                    {...form.register("mscAmount")}
                  />
                  {form.formState.errors.mscAmount && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.mscAmount.message}
                    </p>
                  )}
                </div>

                {/* Percentage Buttons */}
                <div className="space-y-2">
                  <Label>Quick Amounts</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {percentageButtons.map((percentage) => (
                      <Button
                        key={percentage}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePercentage(percentage)}
                      >
                        {percentage}%
                      </Button>
                    ))}
                  </div>
                </div>

                {/* IDR Equivalent */}
                {mscAmount && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex text-sm gap-1">
                      <span>You will receive</span>
                      <span className="font-medium">Rp{usdAmount}</span>
                      <span>sent to your bank account</span>
                    </div>
                  </div>
                )}

                {/* Bank Account Selection */}
                <div className="space-y-3">
                  <Label>Bank Account</Label>
                  {bankAccounts.length === 0 ? (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        No bank accounts found. Please add a bank account first.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-2">
                      {bankAccounts.map((account) => (
                        <div
                          key={account.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            form.watch("bankAccountId") === account.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-muted"
                          }`}
                          onClick={() =>
                            form.setValue("bankAccountId", account.id)
                          }
                        >
                          <div className="flex items-center">
                            <div className="flex-1">
                              <div className="font-medium">
                                {account.accountHolderName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {account.bankName} • ****
                                {account.accountNumber.slice(-4)}
                              </div>
                            </div>
                            {account.isDefault && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button type="button" variant="outline" className="w-full">
                    <Building2 className="mr-2 h-4 w-4" />
                    Add New Bank Account
                  </Button>
                </div>

                {/* Save Bank Details */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveBankDetails"
                    checked={form.watch("saveBankDetails")}
                    onCheckedChange={(checked) =>
                      form.setValue("saveBankDetails", !!checked)
                    }
                  />
                  <Label htmlFor="saveBankDetails" className="text-sm">
                    Save bank account details for future redemptions
                  </Label>
                </div>

                {/* Processing Time Warning */}
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Processing time: 1-3 business days. You will receive an
                    email confirmation once processed.
                  </AlertDescription>
                </Alert>

                {/* Transaction Summary */}
                {mscAmount && selectedBankAccount && (
                  <div className="space-y-2 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium">Redemption Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Amount to redeem</span>
                        <span>{mscAmount} MSC</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IDR Value</span>
                        <span>Rp{usdAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bank Account</span>
                        <span className="text-right">
                          {selectedBankAccount.accountHolderName}
                          <br />
                          {selectedBankAccount.bankName}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isProcessing || !mscAmount || !selectedBankAccount}
                >
                  {isProcessing ? (
                    <>
                      <Loader className="mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Redemption"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Redemptions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Redemptions</CardTitle>
              <CardDescription>
                Your recent redemption transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-muted-foreground py-8">
                  <Minus className="h-8 w-8 mx-auto mb-2" />
                  <p>No recent redemptions</p>
                  <p className="text-sm">
                    Your redemption history will appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
