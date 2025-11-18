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
import {
  useInfiniteAdminUserList,
  useVerifyUser,
  useUnverifyUser,
} from "@/features/user/hooks/useUser";
import { formatDate } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RequireAdmin } from "@/features/auth/components/auth-wrapper";
import { type Role, RoleEnum } from "@/features/user/schema/user";

function AdminUsersPage() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [limit] = useState(20);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const queryParams = useMemo(() => {
    const params: {
      limit?: number;
      role?: Role;
      isVerified?: boolean;
      search?: string;
    } = {
      limit,
    };

    if (roleFilter !== "all") {
      params.role = roleFilter as Role;
    }

    if (verifiedFilter !== "all") {
      params.isVerified = verifiedFilter === "verified";
    }

    if (searchQuery) {
      params.search = searchQuery;
    }

    return params;
  }, [limit, roleFilter, verifiedFilter, searchQuery]);

  const {
    data: usersPages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAdminUserList(queryParams);

  useEffect(() => {
    setCurrentPageIndex(0);
  }, [roleFilter, verifiedFilter, searchQuery]);

  const { mutateAsync: verifyUser, isPending: isVerifying } = useVerifyUser();
  const { mutateAsync: unverifyUser, isPending: isUnverifying } =
    useUnverifyUser();

  const handleToggleVerification = async (
    userId: string,
    currentStatus: boolean
  ) => {
    if (currentStatus) {
      await unverifyUser(userId);
    } else {
      await verifyUser(userId);
    }
  };

  const totalFetchedPages = usersPages?.pages.length ?? 0;
  const effectivePageIndex =
    totalFetchedPages === 0
      ? 0
      : Math.min(currentPageIndex, totalFetchedPages - 1);
  const currentPage =
    totalFetchedPages > 0 ? usersPages?.pages[effectivePageIndex] : undefined;
  const users = currentPage?.data ?? [];
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

  return (
    <MainLayout>
      <div className="space-y-6 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold">Users</h1>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPageIndex(0);
              }}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              No users found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
                    <TableHead className="md:pl-8">Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="h-14 hover:bg-[#F5F5F5]">
                      <TableCell className="md:pl-8">{user.email}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === RoleEnum.enum.ADMIN
                              ? "default"
                              : "outline"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isVerified ? (
                          <Badge className="bg-success-100 text-success-700 border-transparent">
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-warning-100 text-warning-700 border-transparent">
                            Unverified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDate(new Date(user.createdAt))}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={user.isVerified ? "destructive" : "default"}
                          onClick={() =>
                            handleToggleVerification(user.id, user.isVerified)
                          }
                          disabled={isVerifying || isUnverifying}
                        >
                          {user.isVerified ? "Unverify" : "Verify"}
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
                    of {pagination.total} users
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
      <AdminUsersPage />
    </RequireAdmin>
  );
}
