"use client";

import { Loader } from "@/components/common/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRedeemList } from "@/features/redeem/hooks/useRedeem";
import { RedeemData } from "@/features/redeem/schema/redeem";
import { formatIDR } from "@/lib/utils";
import { PaymentStatusBadge } from "@/components/common/payment-status-badge";
import { Minus } from "lucide-react";

const RecentRedemptionCard = ({
  redemption: rd,
}: {
  redemption: RedeemData;
}) => {
  return (
    <div
      key={rd.id}
      className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 space-y-2"
    >
      <div className="space-y-2">
        <div className="font-medium">
          {rd.recipientBank.bankName.toUpperCase()} -{" "}
          {formatIDR(parseFloat(rd.amountIdr))}
        </div>
        <div className="text-xs text-muted-foreground">
          <PaymentStatusBadge status={rd.status} /> -{" "}
          {new Date(rd.createdAt).toLocaleString()}
        </div>
        <div
          className="text-xs text-muted-foreground font-mono truncate"
          title={rd.disbursementId || "—"}
        >
          {rd.disbursementId || "—"}
        </div>
      </div>
    </div>
  );
};

export function RecentRedemptions() {
  const { data: redeemList, isLoading: isLoadingRedeems } = useRedeemList({
    page: 1,
    limit: 5,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Redemptions</CardTitle>
        <CardDescription>Your recent redemption transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoadingRedeems ? (
            <div className="text-center text-muted-foreground py-8">
              <Loader className="h-6 w-6 mx-auto mb-2" />
              <p>Loading recent redemptions...</p>
            </div>
          ) : !redeemList || redeemList.items.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Minus className="h-8 w-8 mx-auto mb-2" />
              <p>No recent redemptions</p>
              <p className="text-sm">
                Your redemption history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {redeemList.items.map((rd) => (
                <RecentRedemptionCard key={rd.id} redemption={rd} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
