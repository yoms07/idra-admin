"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/state/stores/appStore";
import { MainLayout } from "@/components/layout/main-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function DashboardPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    walletConnected,
    balance,
    balanceUSD,
    setBalance,
    setRecentTransactions,
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);

      try {
        // TODO: Replace with actual API calls
        // Simulate loading dashboard data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for now
        setBalance("1250.50", "1250.50");

        const mockTransactions = [
          {
            id: "1",
            type: "mint" as const,
            status: "completed" as const,
            amount: "100.00",
            amountUSD: "100.00",
            txHash: "0x1234567890abcdef",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          },
          {
            id: "2",
            type: "send" as const,
            status: "completed" as const,
            amount: "50.00",
            amountUSD: "50.00",
            to: "0x9876543210fedcba",
            txHash: "0xabcdef1234567890",
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          },
          {
            id: "3",
            type: "mint" as const,
            status: "pending" as const,
            amount: "200.00",
            amountUSD: "200.00",
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          },
        ];

        setRecentTransactions(mockTransactions);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, setBalance, setRecentTransactions]);

  if (!isAuthenticated) {
    return null;
  }

  const totalMinted = "1500.00"; // TODO: Calculate from transactions
  const totalRedeemed = "250.00"; // TODO: Calculate from transactions

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your IDRA overview.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Balance"
            value={`${parseFloat(balance).toFixed(2)} IDRA`}
            subtitle={`Rp${parseFloat(balanceUSD).toFixed(2)} IDR`}
            icon={DollarSign}
            isLoading={isLoading}
          />
          <StatCard
            title="Total Minted"
            value={`${totalMinted} IDRA`}
            subtitle="All time"
            icon={TrendingUp}
            isLoading={isLoading}
          />
          <StatCard
            title="Total Redeemed"
            value={`${totalRedeemed} IDRA`}
            subtitle="All time"
            icon={TrendingDown}
            isLoading={isLoading}
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button
                asChild
                className="h-20 flex-col space-y-2"
                disabled={!walletConnected}
              >
                <Link href="/mint">
                  <Plus className="h-6 w-6" />
                  <span>Mint</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-20 flex-col space-y-2"
                disabled={!walletConnected}
              >
                <Link href="/redeem">
                  <Minus className="h-6 w-6" />
                  <span>Redeem</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-20 flex-col space-y-2"
                disabled={!walletConnected}
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
                <span>Bridge</span>
                <span className="text-xs text-muted-foreground">
                  Coming Soon
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <RecentTransactions isLoading={isLoading} />

        {/* Wallet Connection Prompt */}
        {!walletConnected && (
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
