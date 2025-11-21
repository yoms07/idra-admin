"use client";

import { MainLayout } from "@/components/layout/main-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/common/Loader";
import { RequireAdmin } from "@/features/auth/components/auth-wrapper";
import {
  useOnchainLiquidity,
  useGasTanks,
  useDepositStats,
} from "@/features/liquidity";
import { formatIDRA } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Wallet, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { liquidityKeys } from "@/features/liquidity/queryKeys";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AdminLiquidityPage() {
  const queryClient = useQueryClient();
  const {
    data: onchainLiquidityData,
    isLoading: isLoadingOnchain,
    isRefetching: isRefetchingOnchain,
  } = useOnchainLiquidity();
  const {
    data: gasTanksData,
    isLoading: isLoadingGas,
    isRefetching: isRefetchingGas,
  } = useGasTanks();
  const {
    data: depositStatsData,
    isLoading: isLoadingDepositStats,
    isRefetching: isRefetchingDepositStats,
  } = useDepositStats();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: liquidityKeys.all });
  };

  const onchainLiquidity = onchainLiquidityData?.data ?? [];
  const gasTanks = gasTanksData?.data ?? [];
  const depositStats = depositStatsData?.data ?? {
    totalOffchainBalance: "0",
    totalPendingDeposits: "0",
  };

  const isRefreshLoading =
    isRefetchingOnchain || isRefetchingGas || isRefetchingDepositStats;

  return (
    <MainLayout>
      <div className="space-y-6 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold">Liquidity Management</h1>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={isRefreshLoading}
          >
            <RefreshCw className="size-4" />
            {isRefreshLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Offchain Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingDepositStats ? (
                <Loader className="h-8 w-32" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatIDRA(parseFloat(depositStats.totalOffchainBalance))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Combined balance of all users
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pending Deposits
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingDepositStats ? (
                <Loader className="h-8 w-32" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatIDRA(parseFloat(depositStats.totalPendingDeposits))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total pending deposit amount
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="onchain" className="w-full">
          <TabsList>
            <TabsTrigger value="onchain">On-Chain Liquidity</TabsTrigger>
            <TabsTrigger value="gas">Gas Tanks</TabsTrigger>
          </TabsList>

          <TabsContent value="onchain" className="space-y-4">
            <div className="rounded-xl border bg-white">
              {isLoadingOnchain ? (
                <div className="flex items-center justify-center py-12">
                  <Loader />
                </div>
              ) : onchainLiquidity.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  No liquidity data available
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
                      <TableHead className="md:pl-8">Chain</TableHead>
                      <TableHead>Chain ID</TableHead>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead className="text-right">
                        Balance (IDRA)
                      </TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {onchainLiquidity.map((item) => (
                      <TableRow
                        key={item.chainId}
                        className="h-14 hover:bg-[#F5F5F5]"
                      >
                        <TableCell className="md:pl-8 font-medium">
                          {item.chainName}
                        </TableCell>
                        <TableCell>{item.chainId}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.walletAddress || "N/A"}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatIDRA(parseFloat(item.balance))}
                        </TableCell>
                        <TableCell>
                          {item.error ? (
                            <Badge
                              variant="destructive"
                              className="bg-error-100 text-error-700 border-transparent"
                            >
                              Error
                            </Badge>
                          ) : (
                            <Badge className="bg-success-100 text-success-700 border-transparent">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {onchainLiquidity.some((item) => item.error) && (
                <div className="border-t p-4 space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Errors:
                  </p>
                  {onchainLiquidity
                    .filter((item) => item.error)
                    .map((item) => (
                      <div
                        key={item.chainId}
                        className="text-sm text-destructive"
                      >
                        <span className="font-medium">{item.chainName}:</span>{" "}
                        {item.error}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="gas" className="space-y-4">
            <div className="rounded-xl border bg-white">
              {isLoadingGas ? (
                <div className="flex items-center justify-center py-12">
                  <Loader />
                </div>
              ) : gasTanks.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  No gas tank data available
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
                      <TableHead className="md:pl-8">Chain</TableHead>
                      <TableHead>Chain ID</TableHead>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead className="text-right">
                        Balance (ETH)
                      </TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gasTanks.map((item) => (
                      <TableRow
                        key={item.chainId}
                        className="h-14 hover:bg-[#F5F5F5]"
                      >
                        <TableCell className="md:pl-8 font-medium">
                          {item.chainName}
                        </TableCell>
                        <TableCell>{item.chainId}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.walletAddress || "N/A"}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {parseFloat(item.balance).toFixed(6)} ETH
                        </TableCell>
                        <TableCell>
                          {item.error ? (
                            <Badge
                              variant="destructive"
                              className="bg-error-100 text-error-700 border-transparent"
                            >
                              Error
                            </Badge>
                          ) : (
                            <Badge className="bg-success-100 text-success-700 border-transparent">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {gasTanks.some((item) => item.error) && (
                <div className="border-t p-4 space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Errors:
                  </p>
                  {gasTanks
                    .filter((item) => item.error)
                    .map((item) => (
                      <div
                        key={item.chainId}
                        className="text-sm text-destructive"
                      >
                        <span className="font-medium">{item.chainName}:</span>{" "}
                        {item.error}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

export default function () {
  return (
    <RequireAdmin>
      <AdminLiquidityPage />
    </RequireAdmin>
  );
}
