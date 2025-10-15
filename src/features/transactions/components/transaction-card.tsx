"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatIDR } from "@/lib/utils";
import {
  type UnifiedTransaction,
  type TransactionType,
  type TransactionStatus,
} from "../schema/transaction";
import { ArrowUpRight, ArrowDownLeft, Minus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionCardProps {
  transaction: UnifiedTransaction;
  onViewDetails?: (id: string) => void;
}

const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case "mint":
      return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
    case "redeem":
      return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
    case "transfer":
      return <ArrowUpRight className="h-4 w-4 text-purple-600" />;
    case "burn":
      return <Minus className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "cancelled":
      return "bg-gray-100 text-gray-800";
    case "expired":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatTransactionAmount = (transaction: UnifiedTransaction) => {
  if (transaction.amountIdr) {
    return `Rp${formatIDR(parseFloat(transaction.amountIdr))}`;
  }
  if (transaction.amountUsd) {
    return `$${parseFloat(transaction.amountUsd).toFixed(2)}`;
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
  const date = new Date(transaction.createdAt).toLocaleString();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              {getTransactionIcon(transaction.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium capitalize">{transaction.type}</h3>
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{date}</p>
              <div className="text-lg font-semibold">{amount}</div>
              {transaction.paymentReference && (
                <p className="text-xs text-muted-foreground mt-1">
                  Ref: {transaction.paymentReference}
                </p>
              )}
              {transaction.transactionHash && (
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  Tx: {transaction.transactionHash.slice(0, 8)}...
                </p>
              )}
            </div>
          </div>
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(transaction.id)}
              className="flex-shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
