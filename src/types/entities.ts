export type ID = string;

export type PlanStatus = "planned" | "done" | "cancelled";
export type PlanPriority = "low" | "medium" | "high";

export interface Plan {
  id: ID;
  title: string;
  description: string;
  date: string;
  time: string;
  status: PlanStatus;
  priority: PlanPriority;
  category: string;
  notifyToChannel: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IncomeType = "salary" | "salary_payout" | "freelance" | "gift" | "other";

export interface Income {
  id: ID;
  amount: number;
  source: string;
  comment?: string;
  date: string;
  incomeType: IncomeType;
  status?: "pending" | "received";
  linkedSalaryPayoutId?: ID;
  createdAt: string;
}

export interface Expense {
  id: ID;
  amount: number;
  category: string;
  comment?: string;
  date: string;
  createdAt: string;
}

export type SalaryStatus = "awaiting" | "partially_paid" | "paid";

export interface SalaryRecord {
  id: ID;
  source: string;
  totalAmount: number;
  alreadyPaid: number;
  expectedToReceive?: number | null;
  comment?: string;
  date: string;
  status: SalaryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryPayout {
  id: ID;
  salaryRecordId: ID;
  amount: number;
  payoutDate: string;
  comment?: string;
  createdAt: string;
}

export type TaraRate = 2 | 3 | 4 | 5 | 6 | 7;

export interface TaraEntry {
  rate: TaraRate;
  quantity: number;
  sum: number;
}

export interface EarningsRecord {
  id: ID;
  date: string;
  entries: TaraEntry[];
  totalAmount: number;
  comment?: string;
  createdAt: string;
}

export interface StatsSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  totalSalaryPlanned: number;
  totalSalaryPaid: number;
  totalSalaryOwed: number;
  totalEarnings: number;
  totalPlans: number;
  completedPlans: number;
  activePlans: number;
}

export type AppTab = "home" | "planner" | "finance" | "salary" | "stats";

export interface SalaryPayoutInput {
  salaryRecordId: ID;
  amount: number;
  payoutDate?: string;
  comment?: string;
}

