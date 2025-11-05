"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDownToLine, Send } from "lucide-react";

function DashboardPage() {
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
        <div className="rounded-xl border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Hello, Dimas Indra
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Total Balance
              </p>
              <h2 className="text-4xl font-semibold mt-1">1.000.000 IDR</h2>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Send className="size-4" />
                Transfer
              </Button>
              <Button className="gap-2">
                <ArrowDownToLine className="size-4" />
                Deposit
              </Button>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Transaction</h3>

          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>
                      {r.amount}{" "}
                      <span className="text-muted-foreground">{r.asset}</span>
                    </TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.method}</TableCell>
                    <TableCell className="text-right">
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
