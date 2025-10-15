"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatIDR } from "@/lib/utils";
import {
  type UnifiedTransaction,
  type TransactionType,
} from "../schema/transaction";
import { Minus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MintSymbol } from "@/components/icons/mint-symbol";
import { RedeemSymbol } from "@/components/icons/redeem-symbol";
import { PaymentStatusBadge } from "@/components/common/payment-status-badge";

interface TransactionCardProps {
  transaction: UnifiedTransaction;
  onViewDetails?: (id: string) => void;
}

const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case "mint":
      return <MintSymbol className="h-4 w-4 text-green-600" />;
    case "redeem":
      return <RedeemSymbol className="h-4 w-4 text-blue-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-600" />;
  }
};

const formatTransactionAmount = (transaction: UnifiedTransaction) => {
  if (transaction.amountIdr) {
    return `Rp${formatIDR(parseFloat(transaction.amountIdr))}`;
  }
  if (transaction.amountIdr) {
    return `$${parseFloat(transaction.amountIdr).toFixed(2)}`;
  }
  if (transaction.amount) {
    return `${transaction.amount} IDRA`;
  }
  return "—";
};

export function TransactionCard({
  transaction,
  onViewDetails,
}: TransactionCardProps) {
  const amount = formatTransactionAmount(transaction);
  const date = new Date(transaction.createdAt).toLocaleDateString();
  const time = new Date(transaction.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {getTransactionIcon(transaction.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium capitalize text-sm">
                  {transaction.type}
                </span>
                <PaymentStatusBadge status={transaction.status} />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{date}</span>
                <span>•</span>
                <span>{time}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="font-semibold text-sm">{amount}</div>
              {(transaction.paymentReference ||
                transaction.transactionHash) && (
                <div className="text-xs text-muted-foreground font-mono truncate max-w-[120px]">
                  {transaction.paymentReference
                    ? `Ref: ${transaction.paymentReference.slice(0, 8)}...`
                    : `Tx: ${transaction.transactionHash?.slice(0, 8)}...`}
                </div>
              )}
            </div>
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(transaction.id)}
                className="h-8 w-8 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
