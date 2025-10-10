"use client";

import { useRef, useState } from "react";
import { useAppStore } from "@/state/stores/appStore";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useBankAccounts,
  useCreateBankAccount,
  useSupportedBanks,
  useDeleteBankAccount,
} from "@/features/bank-accounts/hooks/useBankAccounts";
import { Trash2 } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useAppStore();

  // Bank accounts data via API
  const { data: accounts, isLoading: isLoadingAccounts } = useBankAccounts();
  const { data: supportedBanks, isLoading: isLoadingBanks } =
    useSupportedBanks();
  const { mutate: createAccount, isPending: isCreatingAccount } =
    useCreateBankAccount();
  const { mutate: deleteAccount, isPending: isDeleting } =
    useDeleteBankAccount();

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  };

  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState(""); // holds bankCode
  const [accountNumber, setAccountNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      setUser({
        id: user?.id || "",
        email: email,
        name: name,
        avatar: avatarUrl,
        createdAt: user?.createdAt || new Date(),
        updatedAt: new Date(),
      } as any);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBankAccount = async () => {
    if (!accountHolderName || !bankName || !accountNumber) return;
    setIsAddingAccount(true);
    try {
      await new Promise<void>((resolve, reject) => {
        createAccount(
          {
            accountHolderName,
            bankName, // send bank code expected by API
            accountNumber,
            isDefault: false,
          },
          {
            onSuccess: () => resolve(),
            onError: () => reject(new Error("failed")),
          }
        );
      });
      setAccountHolderName("");
      setBankName("");
      setAccountNumber("");
      setIsAddModalOpen(false);
    } finally {
      setIsAddingAccount(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile and bank accounts
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your picture and personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative group h-16 w-16">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatarUrl} alt={name || email} />
                  <AvatarFallback>
                    {(name?.charAt(0) || email?.charAt(0) || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="absolute inset-0 hidden items-center justify-center rounded-full bg-black/40 text-white group-hover:flex"
                  aria-label="Edit profile picture"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </div>
              <div className="flex-1 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bank Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Bank Accounts</CardTitle>
            <CardDescription>Add and manage your bank accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {isLoadingAccounts ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : !accounts || accounts.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No bank accounts added yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="min-w-0">
                        <div className="font-medium truncate">
                          {acc.bankName} • ****{acc.accountNumberLast4}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {acc.accountHolderName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-muted-foreground">
                          {acc.isDefault ? "Default" : ""}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteAccount(acc.id)}
                          disabled={isDeleting}
                          aria-label="Delete bank account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />
            <div className="flex justify-end">
              <Button onClick={() => setIsAddModalOpen(true)}>
                Add Bank Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Add Bank Account Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogDescription>Provide your bank details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-2">
              <Label htmlFor="holder">Account Holder</Label>
              <Input
                id="holder"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="bank">Bank Name</Label>
              <Select value={bankName} onValueChange={setBankName}>
                <SelectTrigger id="bank" className="w-full">
                  <SelectValue
                    placeholder={
                      isLoadingBanks ? "Loading..." : "Select a bank"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {supportedBanks?.map((b) => (
                    <SelectItem key={b.bankCode} value={b.bankCode}>
                      {b.bankName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Account Number</Label>
              <Input
                id="number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddBankAccount}
              disabled={
                isAddingAccount ||
                isCreatingAccount ||
                !accountHolderName ||
                !bankName ||
                !accountNumber
              }
            >
              {isAddingAccount || isCreatingAccount ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
