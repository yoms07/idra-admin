"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "@/components/common/Loader";
import { useUserChainBalances, useSyncOnchainBalance } from "../hooks/useUser";
import { formatIDRA } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { RefreshCw, ArrowDown } from "lucide-react";
import { PullIdraModal } from "./pull-idra-modal";

interface UserChainBalancesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}

export function UserChainBalancesModal({
  open,
  onOpenChange,
  userId,
  userName,
}: UserChainBalancesModalProps) {
  const { data, isLoading, error } = useUserChainBalances(
    open ? userId : undefined
  );
  const { mutateAsync: syncBalance, isPending: isSyncing } =
    useSyncOnchainBalance();
  const [syncingChainId, setSyncingChainId] = useState<number | null>(null);
  const [pullIdraModalOpen, setPullIdraModalOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<{
    chainId: number;
    chainName: string;
  } | null>(null);

  const handleSync = async (chainId: number) => {
    setSyncingChainId(chainId);
    try {
      const result = await syncBalance({ userId, chainId });
      toast.success(result.data.message || "Balance synced successfully");
    } catch (error) {
      toast.error("Failed to sync balance. Please try again.");
    } finally {
      setSyncingChainId(null);
    }
  };

  const handlePullIdra = (chainId: number, chainName: string) => {
    setSelectedChain({ chainId, chainName });
    setPullIdraModalOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Onchain Balances - {userName}</DialogTitle>
          <DialogDescription>
            View all onchain balances across different chains for this user
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12 text-destructive">
            Failed to load chain balances
          </div>
        ) : !data?.data.chainBalances.length ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            No onchain balances found
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border bg-white">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
                    <TableHead>Chain</TableHead>
                    <TableHead>Chain ID</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Last Synced</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.chainBalances.map((balance) => {
                    const isSyncingThis = syncingChainId === balance.chainId;
                    return (
                      <TableRow
                        key={balance.id}
                        className="h-14 hover:bg-[#F5F5F5]"
                      >
                        <TableCell className="font-medium">
                          {balance.chainName}
                        </TableCell>
                        <TableCell>{balance.chainId}</TableCell>
                        <TableCell>
                          {formatIDRA(parseFloat(balance.onchainBalance))}
                        </TableCell>
                        <TableCell>
                          {balance.lastSyncedAt
                            ? formatDate(balance.lastSyncedAt)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSync(balance.chainId)}
                              disabled={isSyncingThis || isSyncing}
                            >
                              <RefreshCw
                                className={`size-4 mr-2 ${
                                  isSyncingThis ? "animate-spin" : ""
                                }`}
                              />
                              Sync
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() =>
                                handlePullIdra(
                                  balance.chainId,
                                  balance.chainName
                                )
                              }
                            >
                              <ArrowDown className="size-4 mr-2" />
                              Pull IDRA
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </DialogContent>

      {selectedChain && (
        <PullIdraModal
          open={pullIdraModalOpen}
          onOpenChange={setPullIdraModalOpen}
          userId={userId}
          userName={userName}
          chainId={selectedChain.chainId}
          chainName={selectedChain.chainName}
        />
      )}
    </Dialog>
  );
}
