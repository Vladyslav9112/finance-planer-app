import type { TaraRate, IncomeType, PlanPriority, PlanStatus } from "../types";

export const TARA_RATES: TaraRate[] = [2, 3, 4, 5, 6, 7];

export const EXPENSE_CATEGORIES = [
  "Їжа та продукти",
  "Транспорт",
  "Комунальні послуги",
  "Розваги",
  "Одяг",
  "Здоров'я",
  "Техніка",
  "Навчання",
  "Зв'язок",
  "Інше",
];

export const INCOME_TYPES: { value: IncomeType; label: string }[] = [
  { value: "salary_payout", label: "Виплата ЗП" },
  { value: "freelance", label: "Фріланс" },
  { value: "business", label: "Бізнес" },
  { value: "investment", label: "Інвестиції" },
  { value: "bonus", label: "Бонус" },
  { value: "other", label: "Інше" },
];

export const INCOME_TYPE_LABELS: Record<IncomeType, string> = {
  salary_payout: "Виплата ЗП",
  freelance: "Фріланс",
  business: "Бізнес",
  investment: "Інвестиції",
  bonus: "Бонус",
  other: "Інше",
};

export const PLAN_CATEGORIES = [
  "Робота",
  "Особисте",
  "Здоров'я",
  "Фінанси",
  "Навчання",
  "Сім'я",
  "Покупки",
  "Інше",
];

export const PRIORITY_LABELS: Record<PlanPriority, string> = {
  low: "Низький",
  medium: "Середній",
  high: "Високий",
};

export const PRIORITY_COLORS: Record<PlanPriority, string> = {
  low: "text-accent-teal bg-accent-teal/10 border-accent-teal/20",
  medium: "text-accent-lime bg-accent-lime/10 border-accent-lime/20",
  high: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export const STATUS_LABELS: Record<PlanStatus, string> = {
  scheduled: "Заплановано",
  completed: "Виконано",
  cancelled: "Скасовано",
};

export const STATUS_COLORS: Record<PlanStatus, string> = {
  scheduled: "text-accent-teal bg-accent-teal/10 border-accent-teal/20",
  completed: "text-accent-lime bg-accent-lime/10 border-accent-lime/20",
  cancelled: "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

export const PERIOD_OPTIONS = [
  { value: "3", label: "3 дні" },
  { value: "7", label: "7 днів" },
  { value: "14", label: "14 днів" },
  { value: "21", label: "21 день" },
  { value: "30", label: "30 днів" },
  { value: "custom", label: "Свій" },
] as const;

export const NAV_ITEMS = [
  { path: "/", label: "Головна", icon: "Home" },
  { path: "/planner", label: "Планер", icon: "CalendarCheck" },
  { path: "/finance", label: "Фінанси", icon: "Wallet" },
  { path: "/warehouse", label: "Склад", icon: "Package" },
  { path: "/stats", label: "Статистика", icon: "BarChart2" },
] as const;
