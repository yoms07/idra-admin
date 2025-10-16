"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatIDRA, getExplorerTxUrl } from "@/lib/utils";
import {
  type UnifiedTransaction,
  type TransactionType,
} from "../schema/transaction";
import { Minus, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MintSymbol } from "@/components/icons/mint-symbol";
import { RedeemSymbol } from "@/components/icons/redeem-symbol";
import { PaymentStatusBadge } from "@/components/common/payment-status-badge";
import { MintDetailModal } from "@/features/transactions/components/mint-detail-modal";
import { RedeemDetailModal } from "@/features/transactions/components/redeem-detail-modal";

interface TransactionCardProps {
  transaction: UnifiedTransaction;
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
  return formatIDRA(transaction.amount || "0");
};

export function TransactionCard({ transaction }: TransactionCardProps) {
  const [open, setOpen] = useState(false);
  const amount = formatTransactionAmount(transaction);
  const date = new Date(transaction.createdAt).toLocaleDateString();
  const time = new Date(transaction.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const explorerUrl =
    getExplorerTxUrl(
      transaction.chainId,
      transaction.transactionHash || transaction.burnTxHash || ""
    ) || undefined;

  return (
    <>
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
                {transaction.type === "redeem" && transaction.fromAddress && (
                  <div className="text-[11px] text-muted-foreground font-mono truncate max-w-[160px]">
                    From: {transaction.fromAddress}
                  </div>
                )}
                {(transaction.paymentReference ||
                  transaction.transactionHash) && (
                  <div className="text-xs text-muted-foreground font-mono truncate max-w-[120px]">
                    {transaction.paymentReference
                      ? `Ref: ${transaction.paymentReference.slice(0, 8)}...`
                      : `Tx: ${transaction.transactionHash?.slice(0, 8)}...`}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(true)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (explorerUrl) {
                      window.open(explorerUrl, "_blank", "noopener,noreferrer");
                      return;
                    }
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <TransactionDetailModals
        transaction={transaction}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

export function TransactionDetailModals({
  transaction,
  open,
  onOpenChange,
}: {
  transaction: UnifiedTransaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return transaction.type === "mint" ? (
    <MintDetailModal
      open={open}
      onOpenChange={onOpenChange}
      mintId={transaction.id}
    />
  ) : (
    <RedeemDetailModal
      open={open}
      onOpenChange={onOpenChange}
      redeemId={transaction.id}
    />
  );
}
