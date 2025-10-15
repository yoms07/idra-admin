"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { TransactionList } from "@/features/transactions/components/transaction-list";
import { RequireAuthentication } from "@/features/auth/components/auth-wrapper";

function TransactionsPage() {
  const handleViewDetails = (id: string) => {
    console.log("View details for transaction:", id);
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all your transaction history
          </p>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <TransactionList
            onViewDetails={handleViewDetails}
            showFilters={true}
            limit={10}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default function () {
  return (
    <RequireAuthentication>
      <TransactionsPage />
    </RequireAuthentication>
  );
}
