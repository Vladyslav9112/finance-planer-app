import type {
  EarningsRecord,
  Expense,
  Income,
  Plan,
  SalaryPayout,
  SalaryRecord,
  TaraEntry,
} from "../../src/types/entities";

export function serializePlan(item: any): Plan {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    date: item.date.toISOString().slice(0, 10),
    time: item.time,
    status: item.status,
    priority: item.priority,
    category: item.category,
    notifyToChannel: item.notifyToChannel,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export function serializeIncome(item: any): Income {
  return {
    id: item.id,
    amount: Number(item.amount),
    source: item.source,
    comment: item.comment || undefined,
    date: item.date.toISOString().slice(0, 10),
    incomeType: item.incomeType,
    status: item.status || undefined,
    linkedSalaryPayoutId: item.linkedSalaryPayoutId || undefined,
    createdAt: item.createdAt.toISOString(),
  };
}

export function serializeExpense(item: any): Expense {
  return {
    id: item.id,
    amount: Number(item.amount),
    category: item.category,
    comment: item.comment || undefined,
    date: item.date.toISOString().slice(0, 10),
    createdAt: item.createdAt.toISOString(),
  };
}

export function serializeSalaryRecord(item: any): SalaryRecord {
  return {
    id: item.id,
    source: item.source,
    totalAmount: Number(item.totalAmount),
    alreadyPaid: Number(item.alreadyPaid),
    expectedToReceive: item.expectedToReceive === null ? null : Number(item.expectedToReceive),
    comment: item.comment || undefined,
    date: item.date.toISOString().slice(0, 10),
    status: item.status,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export function serializeSalaryPayout(item: any): SalaryPayout {
  return {
    id: item.id,
    salaryRecordId: item.salaryRecordId,
    amount: Number(item.amount),
    payoutDate: item.payoutDate.toISOString().slice(0, 10),
    comment: item.comment || undefined,
    createdAt: item.createdAt.toISOString(),
  };
}

export function serializeEarnings(item: any): EarningsRecord {
  const entries: TaraEntry[] = item.entries.map((entry: any) => ({
    rate: entry.rate,
    quantity: entry.quantity,
    sum: Number(entry.sum),
  }));
  return {
    id: item.id,
    date: item.date.toISOString().slice(0, 10),
    entries,
    totalAmount: Number(item.totalAmount),
    comment: item.comment || undefined,
    createdAt: item.createdAt.toISOString(),
  };
}


