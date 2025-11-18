"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Info, Send } from "lucide-react";
import * as React from "react";
import { DepositModal } from "@/components/modals/deposit-modal/deposit-modal";
import TransferModal from "@/components/modals/transfer-modal/transfer-modal";
import { RequireAuthentication } from "@/features/auth/components/auth-wrapper";
import { useMe } from "@/features/auth";
import { formatIDRA } from "@/lib/utils";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";

function DashboardPage() {
  const me = useMe();
  const [depositOpen, setDepositOpen] = React.useState(false);
  const [transferOpen, setTransferOpen] = React.useState(false);
  return (
    <MainLayout>
      <div className="space-y-6 p-4">
        {/* Overview card */}
        <div className="rounded-xl p-5 bg-[#123033] text-white">
          <div className="flex-col md:flex md:flex-row items-start justify-between">
            <div>
              <p className="text-md font-semibold">Hello, {me.data?.name}</p>
              <p className="text-xs mt-2 flex items-center gap-1">
                Total Balance <Info size={14} />
              </p>
              <h2 className="text-4xl font-semibold mt-1">
                {formatIDRA(me.data?.offchainBalance || 0)}
              </h2>
            </div>
            <div className="flex gap-3 mt-4  md:mt-0">
              <Button
                className="gap-2 bg-transparent text-white border-white"
                variant="secondary"
                onClick={() => setTransferOpen(true)}
              >
                <Send className="size-4" />
                Transfer
              </Button>
              <Button className="gap-3" onClick={() => setDepositOpen(true)}>
                <ArrowDownToLine className="size-4" />
                Deposit
              </Button>
            </div>
          </div>
        </div>

        <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
        <TransferModal open={transferOpen} onOpenChange={setTransferOpen} />

        <TransactionsTable title="Transaction" />
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
