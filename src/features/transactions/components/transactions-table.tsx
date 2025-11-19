"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { cn, formatDate, formatIDRA } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { useInfiniteTransactionList } from "@/features/transactions/hooks/useTransactions";
import type {
  TransactionType,
  UnifiedTransaction,
} from "@/features/transactions/schema/transaction";
import { Loader } from "@/components/common/Loader";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type TransactionsTableProps = {
  title?: string;
  showFilters?: boolean;
  pageSize?: number;
  className?: string;
};

export function TransactionsTable({
  title = "Transactions",
  showFilters = true,
  pageSize = 10,
  className,
}: TransactionsTableProps) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);

  const queryParams = React.useMemo(() => {
    const params: {
      limit?: number;
      type?: TransactionType;
      startDate?: string;
      endDate?: string;
    } = {
      limit: pageSize,
    };

    if (selectedType !== "all") {
      params.type =
        selectedType === "send"
          ? "transfer"
          : (selectedType as TransactionType);
    }

    if (date?.from) {
      params.startDate = date.from.toISOString().split("T")[0];
    }
    if (date?.to) {
      params.endDate = date.to.toISOString().split("T")[0];
    }

    return params;
  }, [selectedType, date, pageSize]);

  const {
    data: transactionsPages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteTransactionList(queryParams);

  React.useEffect(() => {
    setCurrentPageIndex(0);
  }, [selectedType, date?.from?.getTime(), date?.to?.getTime()]);

  const totalFetchedPages = transactionsPages?.pages.length ?? 0;
  const effectivePageIndex =
    totalFetchedPages === 0
      ? 0
      : Math.min(currentPageIndex, totalFetchedPages - 1);
  const currentPage =
    totalFetchedPages > 0
      ? transactionsPages?.pages[effectivePageIndex]
      : undefined;
  const currentTransactions = currentPage?.data ?? [];
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

  const formatTransactionType = (type: TransactionType): string => {
    switch (type) {
      case "transfer":
        return "Send On-Chain";
      case "deposit":
        return "Deposit";
      case "withdraw":
        return "Withdraw";
      case "onchain_deposit":
        return "OnChain Deposit";
      default:
        return type;
    }
  };

  const formatTransactionMethod = (transaction: UnifiedTransaction): string => {
    if (transaction.type === "transfer") {
      return "Blockchain Wallet";
    }
    if (transaction.type === "deposit") {
      if (transaction.paymentMethod === "qris") {
        return "QRIS";
      }
      if (transaction.paymentMethod?.startsWith("va_")) {
        return "Virtual Account";
      }
      return transaction.paymentMethod || "Bank Transfer";
    }
    if (transaction.type === "withdraw") {
      return transaction.recipientBank?.bankName || "Bank Transfer";
    }
    if (transaction.type === "onchain_deposit") {
      return "Token Transfer";
    }
    return "-";
  };

  const formatStatus = (status: string): string => {
    switch (status) {
      case "completed":
        return "Success";
      case "pending":
      case "processing":
        return "In Progress";
      case "failed":
        return "Failed";
      case "awaiting_otp":
        return "Waiting OTP Confirmation";
      default:
        return status;
    }
  };

  const getPaginationSummary = React.useCallback(() => {
    if (!currentPage?.pagination) {
      return "No transaction data to display";
    }
    const { page, limit, total } = currentPage.pagination;
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return `Showing ${start} to ${end} of ${total} transactions`;
  }, [currentPage?.pagination]);

  return (
    <div className={cn("space-y-3", className)}>
      {showFilters && (
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="mt-2 flex items-center gap-4 md:mt-0">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-12 rounded-lg text-black md:w-48">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="all"
                  className="focus:bg-primary focus:text-white"
                >
                  All
                </SelectItem>
                <SelectItem
                  value="deposit"
                  className="focus:bg-primary focus:text-white"
                >
                  Wallet Deposit
                </SelectItem>
                <SelectItem
                  value="onchain_deposit"
                  className="focus:bg-primary focus:text-white"
                >
                  OnChain Deposit
                </SelectItem>
                <SelectItem
                  value="send"
                  className="focus:bg-primary focus:text-white"
                >
                  Send On-Chain
                </SelectItem>
                <SelectItem
                  value="withdraw"
                  className="focus:bg-primary focus:text-white"
                >
                  Withdraw
                </SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-fit flex-1 justify-start gap-2 overflow-hidden rounded-lg border border-border font-light text-sm",
                    date?.from && date?.to
                      ? "text-black"
                      : "text-muted-foreground"
                  )}
                >
                  {date?.from ? (
                    date.to ? (
                      <span>
                        {date.from.toLocaleDateString()} →{" "}
                        {date.to.toLocaleDateString()}
                      </span>
                    ) : (
                      <span>{date.from.toLocaleDateString()}</span>
                    )
                  ) : (
                    <span>DD/MM/YYYY → DD/MM/YYYY</span>
                  )}
                  <Calendar className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="range"
                  numberOfMonths={2}
                  selected={date}
                  onSelect={setDate}
                  classNames={{
                    day_button:
                      "data-[range-middle=true]:bg-primary-100 data-[range-middle=true]:text-black",
                    day: "hello world",
                    range_start: "bg-primary-100 rounded-l-md",
                    range_end: "bg-primary-100 rounded-r-md",
                  }}
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
        </div>
      )}

      <div className="rounded-xl border bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        ) : currentTransactions.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            No transactions found
          </div>
        ) : (
          <>
            <Table className="overflow-hidden">
              <TableHeader className="overflow-hidden">
                <TableRow className="rounded-full overflow-hidden bg-[#E5E5E5] font-bold hover:bg-[#E5E5E5]">
                  <TableHead className="md:pl-8 rounded-tl-xl">
                    Transaction Type
                  </TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="rounded-tr-xl">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => {
                  const status = formatStatus(transaction.status);
                  const amount = formatIDRA(transaction.amount);
                  return (
                    <TableRow
                      key={transaction.id}
                      className="h-14 hover:bg-[#F5F5F5]"
                    >
                      <TableCell className="md:pl-8">
                        {formatTransactionType(transaction.type)}
                      </TableCell>
                      <TableCell>
                        {amount.split(" ")[0]}{" "}
                        <span className="text-muted-foreground">
                          {amount.split(" ")[1]}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                      <TableCell>
                        {formatTransactionMethod(transaction)}
                      </TableCell>
                      <TableCell>
                        {status === "Success" ? (
                          <Badge className="border-transparent bg-success-100 text-success-700">
                            Success
                          </Badge>
                        ) : status === "In Progress" ? (
                          <Badge className="border-transparent bg-warning-100 text-warning-700">
                            In Progress
                          </Badge>
                        ) : (
                          <Badge className="border-transparent bg-red-100 text-red-700">
                            {status}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-3 border-t px-6 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
              <p>{getPaginationSummary()}</p>
              <Pagination className="justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={handlePreviousPage}
                      className={
                        canGoToPrevious
                          ? "cursor-pointer"
                          : "pointer-events-none opacity-50"
                      }
                    />
                  </PaginationItem>
                  {transactionsPages?.pages.map((page, index) => (
                    <PaginationItem key={page.pagination.page}>
                      <PaginationLink
                        href="#"
                        isActive={index === effectivePageIndex}
                        onClick={(event) => {
                          event.preventDefault();
                          goToPage(index);
                        }}
                        className="cursor-pointer"
                      >
                        {page.pagination.page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {hasNextPage && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={handleNextPage}
                      className={
                        canGoToNext
                          ? "cursor-pointer"
                          : "pointer-events-none opacity-50"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TransactionsTable;
