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
import { useInfiniteAdminTransactionList } from "@/features/transactions/hooks/useTransactions";
import { formatDate, formatIDRA } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RequireAdmin } from "@/features/auth/components/auth-wrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import type {
  TransactionType,
  TransactionStatus,
} from "@/features/transactions/schema/transaction";

function AdminTransactionsPage() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [limit] = useState(20);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [emailFilter, setEmailFilter] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();

  const queryParams = useMemo(() => {
    const params: {
      limit?: number;
      type?: "deposit" | "transfer" | "withdraw" | "onchain_deposit";
      status?: "pending" | "processing" | "completed" | "failed";
      email?: string;
      startDate?: string;
      endDate?: string;
    } = {
      limit,
    };

    if (typeFilter !== "all") {
      params.type = typeFilter as
        | "deposit"
        | "transfer"
        | "withdraw"
        | "onchain_deposit";
    }

    if (statusFilter !== "all") {
      params.status = statusFilter as
        | "pending"
        | "processing"
        | "completed"
        | "failed";
    }

    if (emailFilter) {
      params.email = emailFilter;
    }

    if (date?.from) {
      params.startDate = date.from.toISOString().split("T")[0];
    }

    if (date?.to) {
      params.endDate = date.to.toISOString().split("T")[0];
    }

    return params;
  }, [limit, typeFilter, statusFilter, emailFilter, date]);

  const {
    data: transactionsPages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAdminTransactionList(queryParams);

  useEffect(() => {
    setCurrentPageIndex(0);
  }, [typeFilter, statusFilter, emailFilter, date]);

  const totalFetchedPages = transactionsPages?.pages.length ?? 0;
  const effectivePageIndex =
    totalFetchedPages === 0
      ? 0
      : Math.min(currentPageIndex, totalFetchedPages - 1);
  const currentPage =
    totalFetchedPages > 0
      ? transactionsPages?.pages[effectivePageIndex]
      : undefined;
  const transactions = currentPage?.data ?? [];
  const pagination = currentPage?.pagination;
  const canGoToPrevious = effectivePageIndex > 0;
  const canGoToNext =
    effectivePageIndex < totalFetchedPages - 1 || Boolean(hasNextPage);

  const goToPage = (index: number) => setCurrentPageIndex(index);

  const handlePreviousPage = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (canGoToPrevious) {
      setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleNextPage = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (!canGoToNext || isFetchingNextPage) return;

    const nextIndex = effectivePageIndex + 1;

    if (nextIndex < totalFetchedPages) {
      setCurrentPageIndex(nextIndex);
      return;
    }

    if (hasNextPage) {
      try {
        await fetchNextPage();
        setCurrentPageIndex((prev) => prev + 1);
      } catch {
        /* handled elsewhere */
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; label: string }> = {
      pending: {
        className: "bg-warning-100 text-warning-700 border-transparent",
        label: "Pending",
      },
      processing: {
        className: "bg-blue-100 text-blue-700 border-transparent",
        label: "Processing",
      },
      completed: {
        className: "bg-success-100 text-success-700 border-transparent",
        label: "Completed",
      },
      failed: {
        className: "bg-destructive/10 text-destructive border-transparent",
        label: "Failed",
      },
      cancelled: {
        className: "bg-gray-100 text-gray-700 border-transparent",
        label: "Cancelled",
      },
      expired: {
        className: "bg-gray-100 text-gray-700 border-transparent",
        label: "Expired",
      },
    };

    const config = statusMap[status] || {
      className: "bg-gray-100 text-gray-700 border-transparent",
      label: status,
    };

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      deposit: "Deposit",
      transfer: "Transfer",
      withdraw: "Withdraw",
      onchain_deposit: "OnChain Deposit",
    };
    return typeMap[type] || type;
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold">Transactions</h1>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              value={emailFilter}
              onChange={(e) => {
                setEmailFilter(e.target.value);
                setCurrentPageIndex(0);
              }}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
              <SelectItem value="withdraw">Withdraw</SelectItem>
              <SelectItem value="onchain_deposit">OnChain Deposit</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-48 justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {date.from.toLocaleDateString()} -{" "}
                      {date.to.toLocaleDateString()}
                    </>
                  ) : (
                    date.from.toLocaleDateString()
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                numberOfMonths={2}
                selected={date}
                onSelect={setDate}
              />
              {date?.from && (
                <div className="border-t">
                  <Button
                    variant="ghost"
                    className="w-full text-sm"
                    onClick={() => setDate(undefined)}
                  >
                    Clear filter
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div className="rounded-xl border bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              No transactions found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
                      <TableHead className="md:pl-8">User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="h-14 hover:bg-[#F5F5F5]"
                      >
                        <TableCell className="md:pl-8">
                          <div>
                            <p className="text-sm font-semibold text-[#0F172A]">
                              {transaction.userName}
                            </p>
                            <p className="text-xs text-[#475467]">
                              {transaction.userEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getTypeLabel(transaction.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatIDRA(parseFloat(transaction.amount))}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell>
                          {transaction.paymentStatus ? (
                            <Badge
                              className={
                                transaction.paymentStatus === "completed"
                                  ? "bg-success-100 text-success-700 border-transparent"
                                  : "bg-warning-100 text-warning-700 border-transparent"
                              }
                            >
                              {transaction.paymentStatus}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDate(new Date(transaction.createdAt))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col gap-3 border-t px-6 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                  <p>
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} transactions
                  </p>
                  <Pagination className="justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={handlePreviousPage}
                          className={
                            !canGoToPrevious
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: pagination.totalPages }, (_, i) => {
                        const pageNum = i + 1;
                        const pageIndex = pageNum - 1;
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          (pageNum >= pagination.page - 1 &&
                            pageNum <= pagination.page + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                href="#"
                                isActive={pageNum === pagination.page}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (pageIndex < totalFetchedPages) {
                                    goToPage(pageIndex);
                                  } else if (hasNextPage) {
                                    fetchNextPage().then(() => {
                                      goToPage(pageIndex);
                                    });
                                  }
                                }}
                                className="cursor-pointer"
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        if (
                          pageNum === pagination.page - 2 ||
                          pageNum === pagination.page + 2
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <span className="px-2">...</span>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={handleNextPage}
                          className={
                            !canGoToNext
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function () {
  return (
    <RequireAdmin>
      <AdminTransactionsPage />
    </RequireAdmin>
  );
}
