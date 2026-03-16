import { z } from "zod";

export const planSchema = z.object({
  title: z.string().min(2, "Мінімум 2 символи"),
  description: z.string().min(2, "Додайте короткий опис"),
  date: z.string().min(1, "Оберіть дату"),
  time: z.string().min(1, "Оберіть час"),
  status: z.enum(["planned", "done", "cancelled"]),
  priority: z.enum(["low", "medium", "high"]),
  category: z.string().min(2, "Вкажіть категорію"),
  notifyToChannel: z.boolean(),
});

export const incomeSchema = z.object({
  amount: z.coerce.number().positive("Сума має бути більшою за 0"),
  source: z.string().min(2, "Вкажіть джерело"),
  comment: z.string().optional(),
  date: z.string().min(1, "Оберіть дату"),
  incomeType: z.enum(["salary", "salary_payout", "freelance", "gift", "other"]),
  status: z.enum(["pending", "received"]).optional(),
});

export const expenseSchema = z.object({
  amount: z.coerce.number().positive("Сума має бути більшою за 0"),
  category: z.string().min(2, "Вкажіть категорію"),
  comment: z.string().optional(),
  date: z.string().min(1, "Оберіть дату"),
});

export const salarySchema = z.object({
  source: z.string().min(2, "Вкажіть джерело"),
  totalAmount: z.coerce.number().positive("Сума має бути більшою за 0"),
  alreadyPaid: z.coerce.number().min(0, "Не може бути від'ємною"),
  expectedToReceive: z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : Number(value)),
    z.number().min(0).optional(),
  ),
  comment: z.string().optional(),
  date: z.string().min(1, "Оберіть дату"),
});

export const salaryPayoutSchema = z.object({
  salaryRecordId: z.string().min(1),
  amount: z.coerce.number().positive("Сума має бути більшою за 0"),
  payoutDate: z.string().min(1, "Оберіть дату"),
  comment: z.string().optional(),
});

export const earningsSchema = z.object({
  date: z.string().min(1, "Оберіть дату"),
  comment: z.string().optional(),
  quantities: z.record(z.coerce.number().min(0)),
});

export type PlanFormValues = z.infer<typeof planSchema>;
export type IncomeFormValues = z.infer<typeof incomeSchema>;
export type ExpenseFormValues = z.infer<typeof expenseSchema>;
export type SalaryFormValues = z.infer<typeof salarySchema>;
export type SalaryPayoutFormValues = z.infer<typeof salaryPayoutSchema>;
export type EarningsFormValues = z.infer<typeof earningsSchema>;

