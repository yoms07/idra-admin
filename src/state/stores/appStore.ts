import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  User,
  Transaction,
  BankAccount,
  Notification,
} from "@/lib/schema";

interface AppState {
  // User state
  user: User | null;
  // wallet state moved to wagmi hooks

  // Balance state
  balance: string;
  balanceUSD: string;

  // Transactions state
  pendingTransactions: Transaction[];
  recentTransactions: Transaction[];

  // UI state
  notifications: Notification[];
  unreadNotifications: number;

  // Bank accounts
  bankAccounts: BankAccount[];

  // Actions
  setUser: (user: User | null) => void;
  setBalance: (msc: string, usd: string) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  setRecentTransactions: (transactions: Transaction[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addBankAccount: (account: BankAccount) => void;
  removeBankAccount: (id: string) => void;
  setDefaultBankAccount: (id: string) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  balance: "0",
  balanceUSD: "0",
  pendingTransactions: [],
  recentTransactions: [],
  notifications: [],
  unreadNotifications: 0,
  bankAccounts: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      setBalance: (balance, balanceUSD) => set({ balance, balanceUSD }),

      addTransaction: (transaction) =>
        set((state) => ({
          pendingTransactions: [...state.pendingTransactions, transaction],
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          pendingTransactions: state.pendingTransactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
          recentTransactions: state.recentTransactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        })),

      setRecentTransactions: (recentTransactions) =>
        set({ recentTransactions }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadNotifications: state.unreadNotifications + 1,
        })),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif
          ),
          unreadNotifications: Math.max(0, state.unreadNotifications - 1),
        })),

      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notif) => ({
            ...notif,
            isRead: true,
          })),
          unreadNotifications: 0,
        })),

      addBankAccount: (account) =>
        set((state) => ({
          bankAccounts: [...state.bankAccounts, account],
        })),

      removeBankAccount: (id) =>
        set((state) => ({
          bankAccounts: state.bankAccounts.filter(
            (account) => account.id !== id
          ),
        })),

      setDefaultBankAccount: (id) =>
        set((state) => ({
          bankAccounts: state.bankAccounts.map((account) => ({
            ...account,
            isDefault: account.id === id,
          })),
        })),

      reset: () => set(initialState),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        user: state.user,
        bankAccounts: state.bankAccounts,
      }),
    }
  )
);
