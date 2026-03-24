import type {
  Income,
  Expense,
  Plan,
  EarningsRecord,
  SalaryPayout,
} from "../types";

const BASE = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return undefined as T;
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? res.statusText);
  return json as T;
}

// ─── Plans ─────────────────────────────────────────────────────────────────────

export const apiPlans = {
  getAll: () => request<Plan[]>("/plans"),
  create: (data: Omit<Plan, "createdAt" | "updatedAt">) =>
    request<Plan>("/plans", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Omit<Plan, "id" | "createdAt">>) =>
    request<Plan>(`/plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) => request<void>(`/plans/${id}`, { method: "DELETE" }),
};

// ─── Incomes ────────────────────────────────────────────────────────────────────

export const apiIncomes = {
  getAll: () => request<Income[]>("/incomes"),
  create: (data: Omit<Income, "createdAt" | "updatedAt">) =>
    request<Income>("/incomes", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Omit<Income, "id" | "createdAt">>) =>
    request<Income>(`/incomes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) => request<void>(`/incomes/${id}`, { method: "DELETE" }),
};

// ─── Expenses ──────────────────────────────────────────────────────────────────

export const apiExpenses = {
  getAll: () => request<Expense[]>("/expenses"),
  create: (data: Omit<Expense, "createdAt" | "updatedAt">) =>
    request<Expense>("/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Omit<Expense, "id" | "createdAt">>) =>
    request<Expense>(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<void>(`/expenses/${id}`, { method: "DELETE" }),
};

// ─── Earnings Records ──────────────────────────────────────────────────────────

export const apiEarnings = {
  getAll: () => request<EarningsRecord[]>("/earnings"),
  create: (data: Omit<EarningsRecord, "createdAt" | "updatedAt">) =>
    request<EarningsRecord>("/earnings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: Partial<Omit<EarningsRecord, "id" | "createdAt">>,
  ) =>
    request<EarningsRecord>(`/earnings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<void>(`/earnings/${id}`, { method: "DELETE" }),
};

// ─── Salary Payouts ────────────────────────────────────────────────────────────

export const apiSalaryPayouts = {
  getAll: () => request<SalaryPayout[]>("/salary-payouts"),
  create: (
    data: Omit<SalaryPayout, "createdAt" | "updatedAt" | "relatedIncomeId"> & {
      incomeId: string;
    },
  ) =>
    request<{ payout: SalaryPayout; income: Income }>("/salary-payouts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: Partial<Omit<SalaryPayout, "id" | "createdAt" | "relatedIncomeId">>,
  ) =>
    request<{ payout: SalaryPayout; income: Income | null }>(
      `/salary-payouts/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    ),
  remove: (id: string) =>
    request<void>(`/salary-payouts/${id}`, { method: "DELETE" }),
};
