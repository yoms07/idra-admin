"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/state/stores/appStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  ExternalLink,
  Eye,
} from "lucide-react";
import type { Transaction, TransactionType } from "@/lib/schema";

const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case "mint":
      return Plus;
    case "redeem":
      return Minus;
    case "send":
      return ArrowUpRight;
    case "receive":
      return ArrowDownLeft;
    default:
      return ArrowUpRight;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const formatAmount = (amount: string) => {
  return parseFloat(amount).toFixed(2);
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
  const recentTransactions: Transaction[] = [];

  if (isLoading) {
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
          <Link href="/history">
            <Eye className="mr-2 h-4 w-4" />
            View All
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTransactions.slice(0, 5).map((transaction) => {
          const Icon = getTransactionIcon(transaction.type);
          const isOutgoing =
            transaction.type === "send" || transaction.type === "redeem";

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
                      {formatAmount(transaction.amount)} IDRA
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Rp{formatAmount(transaction.amountUSD)} IDR
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getStatusColor(transaction.status)}`}
                    >
                      {transaction.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.createdAt)}
                    </span>
                  </div>

                  {transaction.txHash && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      asChild
                    >
                      <a
                        href={`https://etherscan.io/tx/${transaction.txHash}`}
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
