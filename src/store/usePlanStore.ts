import { create } from "zustand";
import type { Plan, PlanStatus, PlanPriority } from "../types";
import { generateId, today } from "../lib/utils";
import { apiPlans } from "../lib/apiClient";
import { useAppStore } from "./useAppStore";

export interface PlanFilters {
  status?: PlanStatus | "all";
  priority?: PlanPriority | "all";
  dateFrom?: string;
  dateTo?: string;
  searchText?: string;
}

interface PlanState {
  plans: Plan[];
  filters: PlanFilters;
  initialized: boolean;
  init: () => Promise<void>;
  addPlan: (data: Omit<Plan, "id" | "createdAt" | "updatedAt">) => string;
  updatePlan: (
    id: string,
    data: Partial<Omit<Plan, "id" | "createdAt">>,
  ) => void;
  deletePlan: (id: string) => void;
  markComplete: (id: string) => void;
  setFilters: (filters: Partial<PlanFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: PlanFilters = {
  status: "all",
  priority: "all",
  searchText: "",
};

export const usePlanStore = create<PlanState>()((set, get) => ({
  plans: [],
  filters: defaultFilters,
  initialized: false,

  init: async () => {
    try {
      const plans = await apiPlans.getAll();
      set({ plans, initialized: true });
    } catch (e: any) {
      console.error("[usePlanStore] init error:", e);
      set({ initialized: true });
    }
  },

  addPlan: (data) => {
    const id = generateId();
    const now = new Date().toISOString();
    const plan: Plan = { ...data, id, createdAt: now, updatedAt: now };
    set((s) => ({ plans: [plan, ...s.plans] }));
    apiPlans
      .create({ ...data, id })
      .then((created) => {
        set((s) => ({
          plans: s.plans.map((p) => (p.id === id ? created : p)),
        }));
      })
      .catch((e) => {
        set((s) => ({ plans: s.plans.filter((p) => p.id !== id) }));
        useAppStore
          .getState()
          .addToast("Помилка збереження плану: " + e.message, "error");
      });
    return id;
  },

  updatePlan: (id, data) => {
    const prev = get().plans.find((p) => p.id === id);
    const now = new Date().toISOString();
    set((s) => ({
      plans: s.plans.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: now } : p,
      ),
    }));
    apiPlans
      .update(id, data)
      .then((updated) => {
        set((s) => ({
          plans: s.plans.map((p) => (p.id === id ? updated : p)),
        }));
      })
      .catch((e) => {
        if (prev)
          set((s) => ({ plans: s.plans.map((p) => (p.id === id ? prev : p)) }));
        useAppStore
          .getState()
          .addToast("Помилка оновлення плану: " + e.message, "error");
      });
  },

  deletePlan: (id) => {
    const prev = get().plans;
    set((s) => ({ plans: s.plans.filter((p) => p.id !== id) }));
    apiPlans.remove(id).catch((e) => {
      set({ plans: prev });
      useAppStore
        .getState()
        .addToast("Помилка видалення плану: " + e.message, "error");
    });
  },

  markComplete: (id) => {
    const now = new Date().toISOString();
    const prev = get().plans.find((p) => p.id === id);
    set((s) => ({
      plans: s.plans.map((p) =>
        p.id === id ? { ...p, status: "completed", updatedAt: now } : p,
      ),
    }));
    apiPlans.update(id, { status: "completed" }).catch((e) => {
      if (prev)
        set((s) => ({ plans: s.plans.map((p) => (p.id === id ? prev : p)) }));
      useAppStore
        .getState()
        .addToast("Помилка оновлення плану: " + e.message, "error");
    });
  },

  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectFilteredPlans = (state: PlanState): Plan[] => {
  const { plans, filters } = state;
  return plans.filter((p) => {
    if (
      filters.status &&
      filters.status !== "all" &&
      p.status !== filters.status
    )
      return false;
    if (
      filters.priority &&
      filters.priority !== "all" &&
      p.priority !== filters.priority
    )
      return false;
    if (filters.dateFrom && p.date < filters.dateFrom) return false;
    if (filters.dateTo && p.date > filters.dateTo) return false;
    if (
      filters.searchText &&
      !p.title.toLowerCase().includes(filters.searchText.toLowerCase()) &&
      !p.description?.toLowerCase().includes(filters.searchText.toLowerCase())
    )
      return false;
    return true;
  });
};

export const selectTodayPlans = (state: PlanState): Plan[] => {
  const t = today();
  return state.plans.filter((p) => p.date === t && p.status === "scheduled");
};
