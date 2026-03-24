/**
 * financeService — abstraction layer for income / expense operations.
 */
import type { Income, Expense } from "../types";
import { useFinanceStore } from "../store/useFinanceStore";

export const financeService = {
  getAllIncomes: (): Income[] => useFinanceStore.getState().incomes,
  getAllExpenses: (): Expense[] => useFinanceStore.getState().expenses,

  addIncome: (data: Omit<Income, "id" | "createdAt" | "updatedAt">): string =>
    useFinanceStore.getState().addIncome(data),

  updateIncome: (
    id: string,
    data: Partial<Omit<Income, "id" | "createdAt">>,
  ): void => useFinanceStore.getState().updateIncome(id, data),

  deleteIncome: (id: string): void =>
    useFinanceStore.getState().deleteIncome(id),

  addExpense: (data: Omit<Expense, "id" | "createdAt" | "updatedAt">): string =>
    useFinanceStore.getState().addExpense(data),

  updateExpense: (
    id: string,
    data: Partial<Omit<Expense, "id" | "createdAt">>,
  ): void => useFinanceStore.getState().updateExpense(id, data),

  deleteExpense: (id: string): void =>
    useFinanceStore.getState().deleteExpense(id),
};
