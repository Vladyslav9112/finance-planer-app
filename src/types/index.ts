// ─── Plan ──────────────────────────────────────────────────────────────────────

export type PlanStatus = "scheduled" | "completed" | "cancelled";
export type PlanPriority = "low" | "medium" | "high";

export interface Plan {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  status: PlanStatus;
  priority: PlanPriority;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Finance ───────────────────────────────────────────────────────────────────

export type IncomeType =
  | "salary_payout"
  | "freelance"
  | "business"
  | "investment"
  | "bonus"
  | "other";

export interface Income {
  id: string;
  amount: number;
  source: string;
  comment?: string;
  date: string; // YYYY-MM-DD
  type: IncomeType;
  relatedSalaryPayoutId?: string; // Links to SalaryPayout if type === 'salary_payout'
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  comment?: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

// ─── Warehouse / Tara / Salary ─────────────────────────────────────────────────

export type TaraRate = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface TaraEntry {
  rate: TaraRate;
  quantity: number;
  amount: number; // rate × quantity
}

export interface EarningsRecord {
  id: string;
  date: string; // YYYY-MM-DD
  entries: TaraEntry[];
  totalAmount: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryPayout {
  id: string;
  source: string;
  amount: number;
  date: string; // YYYY-MM-DD
  comment?: string;
  relatedIncomeId?: string; // Auto-created income record
  createdAt: string;
  updatedAt: string;
}

export interface AmountOwedLedger {
  totalEarned: number;
  totalPaidOut: number;
  totalOwed: number;
}

// ─── Stats ─────────────────────────────────────────────────────────────────────

export interface StatsSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  totalPaidOut: number;
  totalAmountOwedToMe: number;
  totalEarningsFromTara: number;
  totalPlans: number;
  completedPlans: number;
  activePlans: number;
}

// ─── UI Helpers ────────────────────────────────────────────────────────────────

export type PeriodOption = "3" | "7" | "14" | "21" | "30" | "custom";

export interface DateRange {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// ─── Telegram ──────────────────────────────────────────────────────────────────

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (fn: () => void) => void;
    offClick: (fn: () => void) => void;
    enable: () => void;
    disable: () => void;
  };
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };
  };
  version: string;
  platform: string;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
