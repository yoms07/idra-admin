"use client";

import { useState } from "react";
import { useTransactionList } from "../hooks/useTransactions";
import { TransactionCard } from "./transaction-card";
import { Loader } from "@/components/common/Loader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Search, Filter, RefreshCw } from "lucide-react";
import {
  type TransactionType,
  type TransactionStatus,
} from "../schema/transaction";

interface TransactionListProps {
  onViewDetails?: (id: string) => void;
  showFilters?: boolean;
  limit?: number;
}

type TransactionTypeFilter = TransactionType | "all";
type TransactionStatusFilter = TransactionStatus | "all";

export function TransactionList({
  onViewDetails,
  showFilters = true,
  limit = 10,
}: TransactionListProps) {
  const [filters, setFilters] = useState<{
    type: TransactionTypeFilter;
    status: TransactionStatusFilter;
    search: string;
    page: number;
  }>({
    type: "all",
    status: "all",
    search: "",
    page: 1,
  });

  const {
    data: transactionData,
    isLoading,
    error,
    refetch,
  } = useTransactionList({
    ...filters,
    limit,
    page: filters.page,
    type:
      filters.type === "all" ? undefined : (filters.type as TransactionType),
    status:
      filters.status === "all"
        ? undefined
        : (filters.status as TransactionStatus),
  });
  console.error(error);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Failed to load transactions
        </p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!transactionData || transactionData.data.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-8 w-8" />}
        title="No transactions found"
        description="No transactions match your current filters"
        action={
          <Button
            onClick={() =>
              setFilters({
                type: "all",
                status: "all",
                search: "",
                page: 1,
              })
            }
          >
            Clear Filters
          </Button>
        }
      />
    );
  }

  const { data: transactions, pagination } = transactionData;

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex-1">
            <Input
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mint">Mint</SelectItem>
                <SelectItem value="redeem">Redeem</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="burn">Burn</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} transactions
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (filters.page > 1) {
                      handlePageChange(filters.page - 1);
                    }
                  }}
                  className={
                    filters.page <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Page numbers */}
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const pageNumber = i + 1;
                  const isActive = pageNumber === filters.page;

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={isActive}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}

              {pagination.totalPages > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (filters.page < pagination.totalPages) {
                      handlePageChange(filters.page + 1);
                    }
                  }}
                  className={
                    filters.page >= pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
