"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useTransactionList } from "@/features/transactions";
import { formatIDRA, formatIDR } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  ExternalLink,
  Eye,
} from "lucide-react";
import type {
  TransactionType,
  TransactionStatus,
} from "@/features/transactions/schema/transaction";
import { MintSymbol } from "../icons/mint-symbol";
import { RedeemSymbol } from "../icons/redeem-symbol";
import { PaymentStatusBadge } from "../common/payment-status-badge";

const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case "mint":
      return MintSymbol;
    case "redeem":
      return RedeemSymbol;
    default:
      return ArrowUpRight;
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

interface RecentTransactionsProps {
  isLoading?: boolean;
}

export function RecentTransactions({
  isLoading = false,
}: RecentTransactionsProps) {
  const { data: transactionData, isLoading: apiLoading } = useTransactionList({
    limit: 5,
    page: 1,
  });

  const recentTransactions = transactionData?.data || [];
  const isActuallyLoading = isLoading || apiLoading;

  if (isActuallyLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (recentTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<ArrowUpRight className="h-4 w-4" />}
            title="No transactions yet"
            description="Your recent transactions will appear here"
            action={
              <Button asChild>
                <Link href="/mint">
                  <Plus className="mr-2 h-4 w-4" />
                  Start Minting
                </Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/transactions">
            <Eye className="mr-2 h-4 w-4" />
            View All
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTransactions.slice(0, 5).map((transaction) => {
          const Icon = getTransactionIcon(transaction.type);
          const isOutgoing =
            transaction.type === "transfer" || transaction.type === "redeem";

          return (
            <div key={transaction.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium capitalize truncate">
                    {transaction.type}
                  </p>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        isOutgoing ? "text-destructive" : "text-green-600"
                      }`}
                    >
                      {isOutgoing ? "-" : "+"}
                      {formatIDRA(transaction.amountIdr)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-2">
                    <PaymentStatusBadge status={transaction.status} />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.createdAt)}
                    </span>
                  </div>

                  {transaction.transactionHash && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      asChild
                    >
                      <a
                        href={`https://etherscan.io/tx/${transaction.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
