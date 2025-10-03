"use client";

import { useState } from "react";
import { useAppStore } from "@/state/stores/appStore";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EmptyState } from "@/components/common/EmptyState";
import {
  History,
  Search,
  Filter,
  Download,
  ExternalLink,
  Copy,
  Check,
  Calendar as CalendarIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
} from "lucide-react";
import { format } from "date-fns";
import type {
  Transaction,
  TransactionType,
  TransactionStatus,
} from "@/lib/schema";

const transactionTypes: { value: TransactionType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "mint", label: "Mint" },
  { value: "redeem", label: "Redeem" },
  { value: "send", label: "Send" },
  { value: "receive", label: "Receive" },
];

const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case "mint":
      return Plus;
    case "redeem":
      return Minus;
    case "send":
      return ArrowUpRight;
    case "receive":
      return ArrowDownLeft;
    default:
      return ArrowUpRight;
  }
};

const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const formatAmount = (amount: string) => {
  return parseFloat(amount).toFixed(2);
};

const formatDate = (date: Date) => {
  return format(date, "MMM dd, yyyy HH:mm");
};

export default function HistoryPage() {
  const { recentTransactions } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<TransactionType | "all">(
    "all"
  );
  const [selectedStatus, setSelectedStatus] = useState<
    TransactionStatus | "all"
  >("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter transactions
  const filteredTransactions = recentTransactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      transaction.txHash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.from?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === "all" || transaction.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || transaction.status === selectedStatus;

    const matchesDate =
      (!dateFrom || transaction.createdAt >= dateFrom) &&
      (!dateTo || transaction.createdAt <= dateTo);

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const handleExport = (format: "csv" | "pdf") => {
    // TODO: Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground">
              View and manage your IDRA transaction history
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search transactions..."
                  leftElement={<Search className="h-4 w-4" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Transaction Type */}
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={selectedType}
                  onValueChange={(value) =>
                    setSelectedType(value as TransactionType | "all")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(value as TransactionStatus | "all")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "MMM dd") : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              {filteredTransactions.length} transaction(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <EmptyState
                icon={<History />}
                title="No transactions found"
                description="No transactions match your current filters"
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedType("all");
                      setSelectedStatus("all");
                      setDateFrom(undefined);
                      setDateTo(undefined);
                    }}
                  >
                    Clear Filters
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => {
                  const Icon = getTransactionIcon(transaction.type);
                  const isOutgoing =
                    transaction.type === "send" ||
                    transaction.type === "redeem";

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium capitalize">
                              {transaction.type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-sm font-medium ${
                                isOutgoing
                                  ? "text-destructive"
                                  : "text-green-600"
                              }`}
                            >
                              {isOutgoing ? "-" : "+"}
                              {formatAmount(transaction.amount)} IDRA
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Rp{formatAmount(transaction.amountUSD)} IDR
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getStatusColor(transaction.status)}`}
                            >
                              {transaction.status}
                            </Badge>
                            {transaction.txHash && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(transaction.txHash!);
                                }}
                              >
                                {copied ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            )}
                          </div>

                          {transaction.txHash && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  `https://etherscan.io/tx/${transaction.txHash}`,
                                  "_blank"
                                );
                              }}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Detail Modal */}
        <Dialog
          open={!!selectedTransaction}
          onOpenChange={() => setSelectedTransaction(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                View detailed information about this transaction
              </DialogDescription>
            </DialogHeader>

            {selectedTransaction && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {(() => {
                      const Icon = getTransactionIcon(selectedTransaction.type);
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>
                  <div>
                    <p className="font-medium capitalize">
                      {selectedTransaction.type}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getStatusColor(selectedTransaction.status)}`}
                    >
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Amount
                    </span>
                    <span className="font-medium">
                      {formatAmount(selectedTransaction.amount)} IDRA
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      IDR Value
                    </span>
                    <span className="font-medium">
                      Rp{formatAmount(selectedTransaction.amountUSD)} IDR
                    </span>
                  </div>

                  {selectedTransaction.from && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        From
                      </span>
                      <span className="font-mono text-xs">
                        {selectedTransaction.from.slice(0, 6)}...
                        {selectedTransaction.from.slice(-4)}
                      </span>
                    </div>
                  )}

                  {selectedTransaction.to && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">To</span>
                      <span className="font-mono text-xs">
                        {selectedTransaction.to.slice(0, 6)}...
                        {selectedTransaction.to.slice(-4)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="text-sm">
                      {formatDate(selectedTransaction.createdAt)}
                    </span>
                  </div>

                  {selectedTransaction.txHash && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Transaction Hash
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs">
                          {selectedTransaction.txHash.slice(0, 6)}...
                          {selectedTransaction.txHash.slice(-4)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() =>
                            handleCopy(selectedTransaction.txHash!)
                          }
                        >
                          {copied ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedTransaction.networkFee && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Network Fee
                      </span>
                      <span className="text-sm">
                        {selectedTransaction.networkFee} IDRA
                      </span>
                    </div>
                  )}

                  {selectedTransaction.note && (
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">
                        Note
                      </span>
                      <p className="text-sm">{selectedTransaction.note}</p>
                    </div>
                  )}
                </div>

                {selectedTransaction.txHash && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      window.open(
                        `https://etherscan.io/tx/${selectedTransaction.txHash}`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Block Explorer
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
