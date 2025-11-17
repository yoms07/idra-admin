"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SolidAvatar } from "@/components/ui/solid-avatar";
import { RequireAuthentication } from "@/features/auth/components/auth-wrapper";
import { useMe } from "@/features/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useBankAccounts,
  useDeleteBankAccount,
} from "@/features/bank-accounts/hooks/useBankAccounts";
import { Loader } from "@/components/common/Loader";
import { MoreVertical, Plus } from "lucide-react";
import { bankAccountService } from "@/features/bank-accounts/services/bankAccountService";

const ProfileContent = () => {
  const me = useMe();
  const { data: bankAccounts, isLoading } = useBankAccounts();
  const { mutateAsync: deleteBankAccount, isPending: isDeleting } =
    useDeleteBankAccount();

  const handleDeleteAccount = async (id: string) => {
    await deleteBankAccount(id);
  };

  return (
    <MainLayout>
      <div className="space-y-6 px-4 py-6 md:px-8">
        <section className="rounded-xl bg-white p-6 md:p-8 shadow-[0px_12px_40px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-[#1D4ED8] text-xl font-semibold text-white md:size-20 md:text-2xl">
                <SolidAvatar
                  name={me?.data?.name || ""}
                  className="size-16 text-xl text-white md:size-20 md:text-2xl"
                />
              </div>
            </div>

            <div className="grid gap-6 text-lg text-[#4A5565] md:w-full md:grid-cols-2">
              <div>
                <p className="text-base font-medium tracking-wide text-[#98A2B3]">
                  Full Name
                </p>
                <p className="mt-1 text-lg font-semibold text-[#0F172A]">
                  {me?.data?.name ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-base font-medium tracking-wide text-[#98A2B3]">
                  Email
                </p>
                <p className="mt-1 text-lg font-semibold text-[#0F172A]">
                  {me?.data?.email ?? "—"}
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="bank" className="mt-8">
            <TabsList className="flex border-b bg-transparent px-0 pb-0 gap-4 rounded-none">
              {[
                { label: "Bank Account", value: "bank" },
                { label: "History Transaction", value: "history" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-primary data-[state=active]:border-b-primary data-[state=active]:border-b-1 rounded-none border-b-1"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="bank" className="mt-4 space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h3 className="text-2xl font-semibold text-[#0F172A]">
                  Bank Account
                </h3>
                <Button className="gap-2 rounded-lg">
                  <Plus className="size-4" />
                  Add Bank Account
                </Button>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader />
                  </div>
                ) : !bankAccounts || bankAccounts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#E4E7EC] bg-white p-8 text-center text-sm text-[#98A2B3]">
                    You have not added any bank accounts yet.
                  </div>
                ) : (
                  bankAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-transparent px-4 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-[#F3F4F6] text-xl font-semibold uppercase">
                          {bankAccountService.isEWallet(account.bankCode)
                            ? "💳"
                            : "🏦"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A]">
                            {account.accountHolderName}
                          </p>
                          <p className="text-xs text-[#475467]">
                            {account.bankName} - {account.accountNumber}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="text-[#98A2B3] hover:text-[#475467] cursor-pointer hover-bg-p"
                            aria-label="More options"
                          >
                            <MoreVertical className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            className="text-primary cursor-pointer focus:bg-primary hover:bg-primary hover:text-white focus:text-white"
                            onClick={() => handleDeleteAccount(account.id)}
                            disabled={isDeleting}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="history"
              className="rounded-2xl border border-dashed border-[#E4E7EC] bg-white p-8 text-center text-sm text-[#98A2B3]"
            >
              No transactions yet.
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </MainLayout>
  );
};

export default function ProfilePage() {
  return (
    <RequireAuthentication>
      <ProfileContent />
    </RequireAuthentication>
  );
}
