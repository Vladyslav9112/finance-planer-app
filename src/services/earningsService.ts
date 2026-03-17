import type { EarningsRecord } from "../types/entities";
import { apiClient } from "./apiClient";

export const earningsService = {
  list: () => apiClient<EarningsRecord[]>("/earnings"),
  create: (payload: Partial<EarningsRecord>) =>
    apiClient<EarningsRecord>("/earnings", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: string, payload: Partial<EarningsRecord>) =>
    apiClient<EarningsRecord>(`/earnings/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  remove: (id: string) => apiClient<{ success: boolean }>(`/earnings/${id}`, { method: "DELETE" }),
};
