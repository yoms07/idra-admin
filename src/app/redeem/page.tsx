"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount, useChainId } from "wagmi";
import { useBankAccounts } from "@/features/bank-accounts/hooks/useBankAccounts";
import { useIDRABalance } from "@/features/balance/hooks/useBalance";
import {
  useCreateRedeem,
  useEstimateRedeem,
} from "@/features/redeem/hooks/useRedeem";
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
import { WalletNotConnected } from "@/components/common/wallet-not-connected";
import { RedeemConfirmation } from "./confirmation";
import { RecentRedemptions } from "./recent-redemptions";
import { RedeemFormSchema, type RedeemForm } from "@/lib/schema";
import { Building2, AlertCircle, Clock, AlertTriangle } from "lucide-react";
import { formatIDRA, formatIDR } from "@/lib/utils";
import { Currency } from "@/features/mint/schema/mint";
import { useDebounce } from "@/hooks/useDebounce";
import { type RedeemCreateBody } from "@/features/redeem/schema/redeem";
import { RequireAuthentication } from "@/features/auth/components/auth-wrapper";

const percentageButtons = [25, 50, 75];

function RedeemPage() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { data: bankAccounts = [] } = useBankAccounts();
  const { formatted: balanceFormatted } = useIDRABalance();
  const balance = balanceFormatted || "0";
  const { mutate: createRedeem, isPending: isCreatingRedeem } =
    useCreateRedeem();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(RedeemFormSchema),
    defaultValues: {
      idraAmount: "",
      bankAccountId: "",
      saveBankDetails: false,
    },
  });

  const idraAmount = form.watch("idraAmount");
  const debouncedIdraAmount = useDebounce(idraAmount, 400);
  const debouncedAddress = useDebounce(address, 400);
  const selectedBankAccount = bankAccounts.find(
    (acc: any) => acc.id === form.watch("bankAccountId")
  );

  const estimateInput: RedeemCreateBody | undefined =
    debouncedAddress && debouncedIdraAmount && selectedBankAccount
      ? {
          fromAddress: debouncedAddress as `0x${string}`,
          originalAmount: debouncedIdraAmount.toString(),
          inputCurrency: Currency.IDRA,
          redeemCurrency: Currency.IDR,
          chainId,
          recipient: {
            bankCode: selectedBankAccount.bankName,
            bankName: selectedBankAccount.bankName,
            accountName: selectedBankAccount.accountHolderName,
            accountNumber: `****${selectedBankAccount.accountNumberLast4}`,
          },
        }
      : undefined;

  const { data: estimate, isFetching: isEstimating } =
    useEstimateRedeem(estimateInput);

  const handlePercentage = (percentage: number) => {
    const amount = ((parseFloat(balance) * percentage) / 100).toFixed(2);
    form.setValue("idraAmount", amount);
  };

  const handleMax = () => {
    form.setValue("idraAmount", balance);
  };

  const onSubmit = async (data: RedeemForm) => {
    console.log({ data });
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (parseFloat(data.idraAmount) > parseFloat(balance)) {
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
      if (isEstimating) return;

      const body: RedeemCreateBody = {
        fromAddress: address as `0x${string}`,
        originalAmount: (idraAmount || "0").toString(),
        inputCurrency: Currency.IDRA,
        redeemCurrency: Currency.IDR,
        chainId,
        recipient: {
          bankCode: selectedBankAccount.bankName,
          bankName: selectedBankAccount.bankName,
          accountName: selectedBankAccount.accountHolderName,
          accountNumber: selectedBankAccount.accountNumber,
        },
      };

      createRedeem(body, {
        onSuccess: () => {
          setError(null);
          setShowConfirmation(true);
        },
        onError: () => setError("Redemption failed. Please try again."),
      });
    } catch (err) {
      setError("Redemption failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmation = () => {
    router.push("/dashboard");
  };

  if (!isConnected) {
    return (
      <MainLayout>
        <div className="p-6">
          <WalletNotConnected
            title="Wallet Required"
            description="Please connect your wallet to redeem IDRA tokens."
            actionText="Connect Wallet"
            actionHref="/login"
          />
        </div>
      </MainLayout>
    );
  }

  if (showConfirmation) {
    return (
      <MainLayout>
        <div className="p-6">
          <RedeemConfirmation
            idraAmount={idraAmount || "0"}
            idrAmount={estimate?.redeemAmount || "0"}
            selectedBankAccount={
              selectedBankAccount || { accountHolderName: "", bankName: "" }
            }
            onConfirm={handleConfirmation}
          />
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
                      <div className="font-bold">{formatIDRA(balance)}</div>
                    </div>
                  </div>
                </div>

                {/* IDRA Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="idraAmount">You will redeem</Label>
                  <Input
                    id="idraAmount"
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
                    {...form.register("idraAmount")}
                  />
                  {form.formState.errors.idraAmount && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.idraAmount.message}
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

                {/* Estimated Summary */}
                {idraAmount && selectedBankAccount && (
                  <div className="space-y-2 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium">Redemption Summary</h4>
                    <div className="space-y-1 text-sm">
                      {estimate ? (
                        <>
                          <div className="flex justify-between">
                            <span>Amount to redeem</span>
                            <span>{formatIDRA(estimate.inputAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>PG fee</span>
                            <span>{formatIDR(estimate.pgFee)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Platform fee</span>
                            <span>{formatIDR(estimate.platformFee)}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>You will receive</span>
                            <span>{formatIDR(estimate.redeemAmount)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Bank Account</span>
                            <span className="text-right">
                              {selectedBankAccount.accountHolderName}
                              <br />
                              {selectedBankAccount.bankName}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span>Amount to redeem</span>
                            <span>{formatIDRA(idraAmount)}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>You will receive</span>
                            <span>{formatIDR(idraAmount)}</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Bank Account</span>
                            <span className="text-right">
                              {selectedBankAccount.accountHolderName}
                              <br />
                              {selectedBankAccount.bankName}
                            </span>
                          </div>
                        </>
                      )}
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
                                {account.accountNumberLast4}
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
                {idraAmount && selectedBankAccount && (
                  <div className="space-y-2 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium">Redemption Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Amount to redeem</span>
                        <span>{formatIDRA(idraAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IDR Value</span>
                        <span>{formatIDR(idraAmount)}</span>
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
                  disabled={
                    isProcessing ||
                    isCreatingRedeem ||
                    !idraAmount ||
                    !selectedBankAccount
                  }
                >
                  {isProcessing || isCreatingRedeem ? (
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
          <RecentRedemptions />
        </div>
      </div>
    </MainLayout>
  );
}

export default function Page() {
  return (
    <RequireAuthentication>
      <RedeemPage />
    </RequireAuthentication>
  );
}
