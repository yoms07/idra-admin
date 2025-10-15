"use client";

import { Loader } from "@/components/common/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMintList } from "@/features/mint/hooks/useMint";
import { formatIDR } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { MintData } from "@/features/mint/schema/mint";
import { PaymentStatusBadge } from "@/components/common/payment-status-badge";

const RecentMintCard = ({ mint }: { mint: MintData }) => {
  return (
    <div
      key={mint.id}
      className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 space-y-2"
    >
      <div className="space-y-2">
        <div className="font-medium">
          {mint.paymentMethod.toUpperCase()} -{" "}
          {formatIDR(parseFloat(mint.amount || "0"))}
        </div>
        <div className="text-xs text-muted-foreground">
          <PaymentStatusBadge status={mint.paymentStatus} /> -{" "}
          {new Date(mint.createdAt).toLocaleString()}
        </div>
        <div
          className="text-xs text-muted-foreground font-mono truncate"
          title={mint.paymentReference}
        >
          {mint.paymentReference}
        </div>
      </div>
    </div>
  );
};

export function RecentMints() {
  const { data: mintList, isLoading: isLoadingMints } = useMintList({
    limit: 5,
    page: 1,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Mints</CardTitle>
        <CardDescription>Your recent minting transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoadingMints && (
            <div className="text-center text-muted-foreground py-8">
              <Loader className="h-6 w-6 mx-auto mb-2" />
              <p>Loading recent mints...</p>
            </div>
          )}

          {!isLoadingMints && (!mintList || mintList.items.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              <DollarSign className="h-8 w-8 mx-auto mb-2" />
              <p>No recent mints</p>
              <p className="text-sm">Your minting history will appear here</p>
            </div>
          )}

          {!isLoadingMints && mintList && mintList.items.length > 0 && (
            <div className="space-y-3">
              {mintList.items.map((mint) => (
                <RecentMintCard key={mint.id} mint={mint} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
