import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Notification } from "@/lib/schema";

interface AppState {
  // UI-only state kept in app store

  // UI state
  notifications: Notification[];
  unreadNotifications: number;

  // Actions
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  reset: () => void;
}

const initialState = {
  notifications: [],
  unreadNotifications: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

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

      reset: () => set(initialState),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        // keep notifications minimal in storage
        notifications: state.notifications,
        unreadNotifications: state.unreadNotifications,
      }),
    }
  )
);
