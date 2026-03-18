import type { Plan } from "../types/entities";
import { apiClient } from "./apiClient";

export const plansService = {
  list: () => apiClient<Plan[]>("/plans"),
  create: (payload: Partial<Plan>) =>
    apiClient<Plan>("/plans", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<Plan>) =>
    apiClient<Plan>(`/plans/${id}`, {
      method: "POST",
      body: JSON.stringify({ ...payload, action: "patch" }),
    }),
  remove: (id: string) =>
    apiClient<{ success: boolean }>(`/plans/${id}`, {
      method: "POST",
      body: JSON.stringify({ action: "delete" }),
    }),
};
