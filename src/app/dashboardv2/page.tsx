"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownToLine,
  Calendar,
  ChevronDown,
  Info,
  Send,
} from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

function DashboardPage() {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const rows = [
    {
      type: "Send On-Chain",
      amount: "1.000.000.000",
      asset: "$IDRA",
      date: "08/12/2024 | 09:12",
      method: "Blockchain Wallet",
      status: "In Progress",
    },
    {
      type: "Deposit",
      amount: "1.000.000.000",
      asset: "$IDRA",
      date: "08/12/2024 | 09:12",
      method: "Bank Transfer",
      status: "Success",
    },
    {
      type: "Send On-Chain",
      amount: "1.000.000.000",
      asset: "$IDRA",
      date: "08/12/2024 | 09:12",
      method: "Blockchain Wallet",
      status: "Success",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 p-4">
        {/* Overview card */}
        <div className="rounded-xl p-5 bg-[#F5F5F5]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-md font-semibold">Hello, Jason Stanley</p>
              <p className="text-xs mt-2 text-neutral-950 flex items-center gap-1">
                Total Balance <Info size={14} />
              </p>
              <h2 className="text-4xl font-semibold mt-1">1.000.000 IDR</h2>
            </div>
            <div className="flex gap-3">
              <Button className="gap-2 bg-red-100 border-primary-400 border-1 text-primary-400 hover:bg-primary-400 hover:text-white hover:border-primary-500">
                <Send className="size-4" />
                Transfer
              </Button>
              <Button className="gap-3">
                <ArrowDownToLine className="size-4" />
                Deposit
              </Button>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold">Transaction</h3>
            <div className="flex items-center gap-4 w-full max-w-lg">
              {/* Transaction Type Select */}
              <Select>
                <SelectTrigger className="h-12 rounded-lg text-black w-48">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="send">Send On-Chain</SelectItem>
                </SelectContent>
              </Select>

              {/* Date range picker */}
              <Popover>
                <PopoverTrigger asChild className="w-48">
                  <Button
                    variant="secondary"
                    className="flex-1 justify-start rounded-lg text-muted-foreground gap-2 font-light h-9 w-48"
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
                    buttonVariant="ghost"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="font-semibold">
                  <TableHead>Transaction Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i} className="h-14">
                    <TableCell>{r.type}</TableCell>
                    <TableCell>
                      {r.amount}{" "}
                      <span className="text-muted-foreground">{r.asset}</span>
                    </TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.method}</TableCell>
                    <TableCell className="">
                      {r.status === "Success" ? (
                        <Badge className="bg-success-100 text-success-700 border-transparent">
                          Success
                        </Badge>
                      ) : (
                        <Badge className="bg-warning-100 text-warning-700 border-transparent">
                          In Progress
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function () {
  return <DashboardPage />;
}
