"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTransactionStats } from "../hooks/useTransactions";
import { formatIDR } from "@/lib/utils";
import { Loader } from "@/components/common/Loader";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

export function TransactionStats() {
  const { data: stats, isLoading, error } = useTransactionStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Loader className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Loader className="h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Failed to load transaction statistics</p>
      </div>
    );
  }

  const { data } = stats;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp{formatIDR(data.totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">IDR value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mints</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.byType.mint?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Rp{formatIDR(data.byType.mint?.amount || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redemptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.byType.redeem?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Rp{formatIDR(data.byType.redeem?.amount || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* By Type */}
        <Card>
          <CardHeader>
            <CardTitle>By Transaction Type</CardTitle>
            <CardDescription>Breakdown of transactions by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.byType).map(([type, stats]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {stats.total} transactions
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      Rp{formatIDR(stats.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Object.entries(stats.byStatus).map(
                        ([status, statusStats]) => (
                          <span key={status} className="mr-2">
                            {status}: {statusStats.count}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* By Status */}
        <Card>
          <CardHeader>
            <CardTitle>By Status</CardTitle>
            <CardDescription>
              Breakdown of transactions by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.byStatus).map(([status, stats]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={
                        status === "completed"
                          ? "bg-green-100 text-green-800"
                          : status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : status === "failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                      }
                    >
                      {status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {stats.total} transactions
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      Rp{formatIDR(stats.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Object.entries(stats.byType).map(([type, typeStats]) => (
                        <span key={type} className="mr-2">
                          {type}: {typeStats.count}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
