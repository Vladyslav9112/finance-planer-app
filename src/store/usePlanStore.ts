import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Plan, PlanStatus, PlanPriority } from "../types";
import { generateId, today } from "../lib/utils";
import { mockPlans } from "../data/mockData";

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
  // Actions
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

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      plans: mockPlans,
      filters: defaultFilters,

      addPlan: (data) => {
        const id = generateId();
        const now = new Date().toISOString();
        set((s) => ({
          plans: [{ ...data, id, createdAt: now, updatedAt: now }, ...s.plans],
        }));
        return id;
      },

      updatePlan: (id, data) => {
        const now = new Date().toISOString();
        set((s) => ({
          plans: s.plans.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: now } : p,
          ),
        }));
      },

      deletePlan: (id) =>
        set((s) => ({ plans: s.plans.filter((p) => p.id !== id) })),

      markComplete: (id) => {
        const now = new Date().toISOString();
        set((s) => ({
          plans: s.plans.map((p) =>
            p.id === id ? { ...p, status: "completed", updatedAt: now } : p,
          ),
        }));
      },

      setFilters: (filters) =>
        set((s) => ({ filters: { ...s.filters, ...filters } })),

      resetFilters: () => set({ filters: defaultFilters }),
    }),
    { name: "finance-planner-plans" },
  ),
);

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
