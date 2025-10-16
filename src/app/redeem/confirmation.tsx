"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock } from "lucide-react";
import { formatIDR, formatIDRA } from "@/lib/utils";

interface RedeemConfirmationProps {
  idraAmount: string;
  idrAmount: string;
  selectedBankAccount: {
    accountHolderName: string;
    bankName: string;
  };
  onConfirm: () => void;
}

export function RedeemConfirmation({
  idraAmount,
  idrAmount,
  selectedBankAccount,
  onConfirm,
}: RedeemConfirmationProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle>Redemption Initiated</CardTitle>
        <CardDescription>
          Your IDRA tokens have been burned and redemption request created.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold">{formatIDRA(idraAmount)} </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Amount</span>
            <span>{formatIDR(idrAmount)} IDRA</span>
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

        <Button onClick={onConfirm} className="w-full">
          Return to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
