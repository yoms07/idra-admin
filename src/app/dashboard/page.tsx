"use client";

import { useAccount } from "wagmi";
import { MainLayout } from "@/components/layout/main-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIDRABalance } from "@/features/balance/hooks/useBalance";
import { useTransactionStats } from "@/features/transactions";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Send,
  ArrowRight,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { RequireAuthentication } from "@/features/auth/components/auth-wrapper";
import { formatIDR, formatIDRA } from "@/lib/utils";
import { RedeemSymbol } from "@/components/icons/redeem-symbol";
import { MintSymbol } from "@/components/icons/mint-symbol";

function DashboardPage() {
  const { isConnected } = useAccount();
  const { formatted: idraBalance } = useIDRABalance();
  const { data: stats, isLoading: statsLoading } = useTransactionStats();

  const totalMinted = stats?.data?.byType?.mint?.amount || 0;
  const totalRedeemed = stats?.data?.byType?.redeem?.amount || 0;
  const totalTransactions = stats?.data?.total || 0;
  const totalAmount = stats?.data?.totalAmount || 0;

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your IDRA overview.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Balance"
            value={formatIDRA(idraBalance || "0")}
            subtitle={formatIDR(idraBalance || "0")}
            icon={DollarSign}
            isLoading={statsLoading}
          />
          <StatCard
            title="Total Minted"
            value={formatIDRA(totalMinted)}
            subtitle={`${stats?.data?.byType?.mint?.total || 0} transactions`}
            icon={TrendingUp}
            isLoading={statsLoading}
          />
          <StatCard
            title="Total Redeemed"
            value={formatIDR(totalRedeemed)}
            subtitle={`${stats?.data?.byType?.redeem?.total || 0} transactions`}
            icon={TrendingDown}
            isLoading={statsLoading}
          />
          <StatCard
            title="Total Transactions"
            value={totalTransactions.toString()}
            subtitle={`${formatIDRA(totalAmount)} total value`}
            icon={DollarSign}
            isLoading={statsLoading}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button
                asChild
                className="h-20 flex-col space-y-2"
                disabled={!isConnected}
              >
                <Link href="/mint">
                  <MintSymbol className="h-6 w-6" />
                  <span>Mint</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-20 flex-col space-y-2"
                disabled={!isConnected}
              >
                <Link href="/redeem">
                  <RedeemSymbol className="h-6 w-6" />
                  <span>Redeem</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-20 flex-col space-y-2"
                disabled={!isConnected}
              >
                <Link href="/send">
                  <Send className="h-6 w-6" />
                  <span>Send</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                disabled
              >
                <ArrowRight className="h-6 w-6" />
                <span>Bridge (Coming Soon)</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <RecentTransactions isLoading={statsLoading} />

        {!isConnected && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h3 className="font-semibold">Wallet Not Connected</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your wallet to start minting, redeeming, and sending
                    IDRA tokens.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/connect-wallet">Connect Wallet</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

export default function () {
  return (
    <RequireAuthentication>
      <DashboardPage />
    </RequireAuthentication>
  );
}
