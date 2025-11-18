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
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import { useInfiniteAdminAuditLogList } from "@/features/audit-logs/hooks/useAuditLogs";
import { formatDate } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RequireAdmin } from "@/features/auth/components/auth-wrapper";
import { MetadataDetailModal } from "@/features/audit-logs/components/metadata-detail-modal";
import { Eye } from "lucide-react";

function AdminAuditLogsPage() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [limit] = useState(20);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMetadata, setSelectedMetadata] = useState<Record<
    string,
    any
  > | null>(null);
  const [metadataModalOpen, setMetadataModalOpen] = useState(false);

  const queryParams = useMemo(() => {
    const params: {
      limit?: number;
      action?: string;
      status?: "success" | "failed";
    } = {
      limit,
    };

    if (actionFilter !== "all") {
      params.action = actionFilter;
    }

    if (statusFilter !== "all") {
      params.status = statusFilter as "success" | "failed";
    }

    return params;
  }, [limit, actionFilter, statusFilter]);

  const {
    data: auditLogsPages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteAdminAuditLogList(queryParams);
  console.log({ error });

  useEffect(() => {
    setCurrentPageIndex(0);
  }, [actionFilter, statusFilter]);

  const handleViewMetadata = (metadata: Record<string, any>) => {
    setSelectedMetadata(metadata);
    setMetadataModalOpen(true);
  };

  const totalFetchedPages = auditLogsPages?.pages.length ?? 0;
  const effectivePageIndex =
    totalFetchedPages === 0
      ? 0
      : Math.min(currentPageIndex, totalFetchedPages - 1);
  const currentPage =
    totalFetchedPages > 0
      ? auditLogsPages?.pages[effectivePageIndex]
      : undefined;
  const auditLogs = currentPage?.data ?? [];
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

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("verify") || action.includes("sync")) {
      return "default";
    }
    if (action.includes("pull")) {
      return "outline";
    }
    return "outline";
  };

  const formatAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold">Audit Logs</h1>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="pull_idra">Pull IDRA</SelectItem>
              <SelectItem value="sync_balance">Sync Balance</SelectItem>
              <SelectItem value="verify_user">Verify User</SelectItem>
              <SelectItem value="unverify_user">Unverify User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              No audit logs found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
                    <TableHead className="md:pl-8">Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} className="h-14 hover:bg-[#F5F5F5]">
                      <TableCell className="md:pl-8">
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A]">
                            {log.adminUser.name}
                          </p>
                          <p className="text-xs text-[#475467]">
                            {log.adminUser.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {formatAction(log.action)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-[#0F172A]">
                            {log.resourceType}
                          </p>
                          <p className="text-xs text-[#475467]">
                            {log.resourceId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.status === "success" ? (
                          <Badge className="bg-success-100 text-success-700 border-transparent">
                            Success
                          </Badge>
                        ) : (
                          <Badge className="bg-destructive-100 text-destructive-700 border-transparent">
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDate(new Date(log.createdAt))}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewMetadata(log.metadata)}
                        >
                          <Eye className="size-4 mr-2" />
                          View Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col gap-3 border-t px-6 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                  <p>
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} audit logs
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

      {selectedMetadata && (
        <MetadataDetailModal
          open={metadataModalOpen}
          onOpenChange={setMetadataModalOpen}
          metadata={selectedMetadata}
        />
      )}
    </MainLayout>
  );
}

export default function () {
  return (
    <RequireAdmin>
      <AdminAuditLogsPage />
    </RequireAdmin>
  );
}
