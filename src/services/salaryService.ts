import type { SalaryPayout, SalaryRecord } from "../types/entities";
import { apiClient } from "./apiClient";

export const salaryService = {
  records: {
    list: () => apiClient<SalaryRecord[]>("/salary/records"),
    create: (payload: Partial<SalaryRecord>) => apiClient<SalaryRecord>("/salary/records", { method: "POST", body: JSON.stringify(payload) }),
  },
  payouts: {
    create: (payload: Partial<SalaryPayout>) => apiClient<SalaryPayout>("/salary/payouts", { method: "POST", body: JSON.stringify(payload) }),
  },
};

