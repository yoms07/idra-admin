import { create } from "zustand";

type UiState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
}));
