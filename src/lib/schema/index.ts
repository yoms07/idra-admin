import { z } from "zod";

// User schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Transaction types
export const TransactionTypeSchema = z.enum([
  "mint",
  "redeem",
  "send",
  "receive",
]);

export const TransactionStatusSchema = z.enum([
  "pending",
  "completed",
  "failed",
]);

// Transaction schema
export const TransactionSchema = z.object({
  id: z.string(),
  type: TransactionTypeSchema,
  status: TransactionStatusSchema,
  amount: z.string(), // IDRA amount
  amountUSD: z.string(), // IDR equivalent
  from: z.string().optional(), // Sender address
  to: z.string().optional(), // Recipient address
  txHash: z.string().optional(), // Transaction hash
  paymentId: z.string().optional(), // Payment gateway ID
  networkFee: z.string().optional(), // Network fee in IDRA
  createdAt: z.date(),
  completedAt: z.date().optional(),
  note: z.string().optional(),
});

// Bank account schema for redemptions
export const BankAccountSchema = z.object({
  id: z.string(),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  routingNumber: z.string().optional(),
  isDefault: z.boolean().default(false),
  createdAt: z.date(),
});

// Notification schema
export const NotificationSchema = z.object({
  id: z.string(),
  type: z.enum(["transaction", "system", "marketing"]),
  title: z.string(),
  message: z.string(),
  isRead: z.boolean().default(false),
  createdAt: z.date(),
  actionUrl: z.string().optional(),
});

// Form validation schemas
export const MintFormSchema = z.object({
  idraAmount: z.string().min(1, "Amount is required"),
  paymentMethod: z.enum(["qris", "va_bri", "va_bca", "va_bni"]),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
});

export const RedeemFormSchema = z.object({
  idraAmount: z.string().min(1, "Amount is required"),
  bankAccountId: z.string().min(1, "Bank account is required"),
  saveBankDetails: z.boolean().optional().default(false),
});

export const SendFormSchema = z.object({
  recipientAddress: z.string().min(42, "Invalid wallet address"),
  idraAmount: z.string().min(1, "Amount is required"),
  note: z.string().optional(),
});

export const BankAccountFormSchema = z.object({
  accountHolderName: z.string().min(1, "Account holder name is required"),
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  routingNumber: z.string().optional(),
  isDefault: z.boolean().default(false),
});

// API response schemas
export const BalanceResponseSchema = z.object({
  idra: z.string(),
  usd: z.string(),
});

export const TransactionResponseSchema = z.object({
  transactions: z.array(TransactionSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type TransactionType = z.infer<typeof TransactionTypeSchema>;
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;
export type BankAccount = z.infer<typeof BankAccountSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type MintForm = z.infer<typeof MintFormSchema>;
export type RedeemForm = z.infer<typeof RedeemFormSchema>;
export type SendForm = z.infer<typeof SendFormSchema>;
export type BankAccountForm = z.infer<typeof BankAccountFormSchema>;
export type BalanceResponse = z.infer<typeof BalanceResponseSchema>;
export type TransactionResponse = z.infer<typeof TransactionResponseSchema>;
