import type {
  Plan,
  Income,
  Expense,
  EarningsRecord,
  SalaryPayout,
} from "../types";

const now = new Date().toISOString();

// ─── Plans ────────────────────────────────────────────────────────────────────

export const mockPlans: Plan[] = [
  {
    id: "plan-1",
    title: "Зустріч з командою",
    description: "Обговорення планів на наступний квартал",
    date: "2026-03-24",
    time: "10:00",
    status: "scheduled",
    priority: "high",
    category: "Робота",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "plan-2",
    title: "Оплатити комунальні",
    description: "Квартплата та електрика за лютий",
    date: "2026-03-22",
    time: "12:00",
    status: "completed",
    priority: "medium",
    category: "Фінанси",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "plan-3",
    title: "Записатися до лікаря",
    description: "Планова перевірка",
    date: "2026-03-25",
    status: "scheduled",
    priority: "low",
    category: "Здоров'я",
    createdAt: now,
    updatedAt: now,
  },
];

// ─── Earnings Records (Tara) ──────────────────────────────────────────────────

export const mockEarningsRecords: EarningsRecord[] = [
  {
    id: "earn-1",
    date: "2026-03-20",
    entries: [
      { rate: 2, quantity: 50, amount: 100 },
      { rate: 3, quantity: 30, amount: 90 },
      { rate: 5, quantity: 20, amount: 100 },
    ],
    totalAmount: 290,
    comment: "Зміна 1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "earn-2",
    date: "2026-03-22",
    entries: [
      { rate: 3, quantity: 40, amount: 120 },
      { rate: 4, quantity: 25, amount: 100 },
      { rate: 6, quantity: 15, amount: 90 },
    ],
    totalAmount: 310,
    comment: "Зміна 2",
    createdAt: now,
    updatedAt: now,
  },
];

// ─── Salary Payouts ────────────────────────────────────────────────────────────

export const mockSalaryPayouts: SalaryPayout[] = [
  {
    id: "pay-1",
    source: 'Підприємство "Альфа"',
    amount: 400,
    date: "2026-03-21",
    comment: "Аванс за березень",
    relatedIncomeId: "inc-1",
    createdAt: now,
    updatedAt: now,
  },
];

// ─── Incomes ────────────────────────────────────────────────────────────────────

export const mockIncomes: Income[] = [
  {
    id: "inc-1",
    amount: 400,
    source: 'Підприємство "Альфа"',
    comment: "Виплата ЗП: Аванс за березень",
    date: "2026-03-21",
    type: "salary_payout",
    relatedSalaryPayoutId: "pay-1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "inc-2",
    amount: 1500,
    source: "Freelance проєкт",
    comment: "Розробка сайту для клієнта",
    date: "2026-03-18",
    type: "freelance",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "inc-3",
    amount: 200,
    source: "Бонус",
    comment: "Премія за виконання KPI",
    date: "2026-03-15",
    type: "bonus",
    createdAt: now,
    updatedAt: now,
  },
];

// ─── Expenses ──────────────────────────────────────────────────────────────────

export const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    amount: 450,
    category: "Їжа та продукти",
    comment: "Тижневий запас",
    date: "2026-03-23",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "exp-2",
    amount: 120,
    category: "Транспорт",
    comment: "Проїзд на тиждень",
    date: "2026-03-22",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "exp-3",
    amount: 320,
    category: "Комунальні послуги",
    comment: "Електрика + газ",
    date: "2026-03-20",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "exp-4",
    amount: 85,
    category: "Зв'язок",
    comment: "Мобільний та інтернет",
    date: "2026-03-19",
    createdAt: now,
    updatedAt: now,
  },
];
