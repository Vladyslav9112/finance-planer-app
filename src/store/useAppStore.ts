import { create } from "zustand";
import { generateId } from "../lib/utils";
import type { ToastMessage, ToastType } from "../types";

interface AppState {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  toasts: [],

  addToast: (message, type = "success") => {
    const id = generateId();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
