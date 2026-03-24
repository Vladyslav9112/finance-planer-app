import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Income, Expense, IncomeType } from "../types";
import { generateId, isInRange } from "../lib/utils";
import { mockIncomes, mockExpenses } from "../data/mockData";

interface FinanceState {
  incomes: Income[];
  expenses: Expense[];
  // Public actions
  addIncome: (data: Omit<Income, "id" | "createdAt" | "updatedAt">) => string;
  updateIncome: (
    id: string,
    data: Partial<Omit<Income, "id" | "createdAt">>,
  ) => void;
  deleteIncome: (id: string) => void;
  addExpense: (data: Omit<Expense, "id" | "createdAt" | "updatedAt">) => string;
  updateExpense: (
    id: string,
    data: Partial<Omit<Expense, "id" | "createdAt">>,
  ) => void;
  deleteExpense: (id: string) => void;
  // Internal (called from warehouse store)
  _addIncomeInternal: (income: Income) => void;
  _updateIncomeInternal: (id: string, data: Partial<Income>) => void;
  _deleteIncomeByPayoutId: (salaryPayoutId: string) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      incomes: mockIncomes,
      expenses: mockExpenses,

      addIncome: (data) => {
        const id = generateId();
        const now = new Date().toISOString();
        const income: Income = { ...data, id, createdAt: now, updatedAt: now };
        set((s) => ({ incomes: [income, ...s.incomes] }));
        return id;
      },

      updateIncome: (id, data) => {
        const now = new Date().toISOString();
        set((s) => ({
          incomes: s.incomes.map((inc) =>
            inc.id === id ? { ...inc, ...data, updatedAt: now } : inc,
          ),
        }));
      },

      deleteIncome: (id) =>
        set((s) => ({ incomes: s.incomes.filter((i) => i.id !== id) })),

      addExpense: (data) => {
        const id = generateId();
        const now = new Date().toISOString();
        const expense: Expense = {
          ...data,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ expenses: [expense, ...s.expenses] }));
        return id;
      },

      updateExpense: (id, data) => {
        const now = new Date().toISOString();
        set((s) => ({
          expenses: s.expenses.map((e) =>
            e.id === id ? { ...e, ...data, updatedAt: now } : e,
          ),
        }));
      },

      deleteExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      _addIncomeInternal: (income) =>
        set((s) => ({ incomes: [income, ...s.incomes] })),

      _updateIncomeInternal: (id, data) => {
        const now = new Date().toISOString();
        set((s) => ({
          incomes: s.incomes.map((inc) =>
            inc.id === id ? { ...inc, ...data, updatedAt: now } : inc,
          ),
        }));
      },

      _deleteIncomeByPayoutId: (salaryPayoutId) =>
        set((s) => ({
          incomes: s.incomes.filter(
            (i) => i.relatedSalaryPayoutId !== salaryPayoutId,
          ),
        })),
    }),
    { name: "finance-planner-finance" },
  ),
);

// ─── Selectors ─────────────────────────────────────────────────────────────────

export const selectIncomesInRange = (
  incomes: Income[],
  from: string,
  to: string,
): Income[] => incomes.filter((i) => isInRange(i.date, from, to));

export const selectExpensesInRange = (
  expenses: Expense[],
  from: string,
  to: string,
): Expense[] => expenses.filter((e) => isInRange(e.date, from, to));

export const selectTotalIncome = (incomes: Income[]): number =>
  incomes.reduce((s, i) => s + i.amount, 0);

export const selectTotalExpenses = (expenses: Expense[]): number =>
  expenses.reduce((s, e) => s + e.amount, 0);

export const selectIncomesByType = (
  incomes: Income[],
  type: IncomeType,
): Income[] => incomes.filter((i) => i.type === type);
