import type { EarningsRecord } from "../types/entities";
import { apiClient } from "./apiClient";

export const earningsService = {
  list: () => apiClient<EarningsRecord[]>("/earnings"),
  create: (payload: Partial<EarningsRecord>) =>
    apiClient<EarningsRecord>("/earnings", { method: "POST", body: JSON.stringify(payload) }),
};

