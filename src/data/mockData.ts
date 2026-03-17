import type {
  EarningsRecord,
  Expense,
  Income,
  Plan,
  SalaryPayout,
  SalaryRecord,
  TaraRate,
} from "../types/entities";

const now = new Date().toISOString();

export const taraRates: TaraRate[] = [2, 3, 4, 5, 6, 7];

export const mockPlans: Plan[] = [
  {
    id: "plan-1",
    title: "Ранковий огляд фінансів",
    description: "Перевірити доходи/витрати за вихідні",
    date: new Date().toISOString().slice(0, 10),
    time: "09:30",
    status: "planned",
    priority: "high",
    category: "Фінанси",
    notifyToChannel: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockIncomes: Income[] = [
  {
    id: "income-1",
    amount: 4200,
    source: "Підробіток",
    comment: "Клієнтський проєкт",
    date: new Date().toISOString().slice(0, 10),
    incomeType: "freelance",
    status: "received",
    createdAt: now,
  },
];

export const mockExpenses: Expense[] = [
  {
    id: "expense-1",
    amount: 780,
    category: "Пальне",
    comment: "Заправка авто",
    date: new Date().toISOString().slice(0, 10),
    createdAt: now,
  },
];

export const mockSalaryRecords: SalaryRecord[] = [
  {
    id: "salary-1",
    source: "Склад Березень",
    totalAmount: 12000,
    alreadyPaid: 5000,
    expectedToReceive: null,
    comment: "Видача частинами",
    date: new Date().toISOString().slice(0, 10),
    status: "partially_paid",
    createdAt: now,
    updatedAt: now,
  },
];

export const mockSalaryPayouts: SalaryPayout[] = [];

export const mockEarnings: EarningsRecord[] = [
  {
    id: "earning-1",
    date: new Date().toISOString().slice(0, 10),
    entries: [
      { rate: 2, quantity: 10, sum: 40 },
      { rate: 3, quantity: 8, sum: 24 },
      { rate: 4, quantity: 6, sum: 24 },
      { rate: 5, quantity: 0, sum: 0 },
      { rate: 6, quantity: 3, sum: 18 },
      { rate: 7, quantity: 0, sum: 0 },
    ],
    totalAmount: 100,
    comment: "Партія тари",
    createdAt: now,
  },
];
