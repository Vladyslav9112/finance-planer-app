import type { Expense, Income } from "../types/entities";
import { apiClient } from "./apiClient";

export const financeService = {
  incomes: {
    list: () => apiClient<Income[]>("/incomes"),
    create: (payload: Partial<Income>) => apiClient<Income>("/incomes", { method: "POST", body: JSON.stringify(payload) }),
    remove: (id: string) => apiClient<{ success: boolean }>(`/incomes/${id}`, { method: "DELETE" }),
  },
  expenses: {
    list: () => apiClient<Expense[]>("/expenses"),
    create: (payload: Partial<Expense>) => apiClient<Expense>("/expenses", { method: "POST", body: JSON.stringify(payload) }),
    remove: (id: string) => apiClient<{ success: boolean }>(`/expenses/${id}`, { method: "DELETE" }),
  },
};

