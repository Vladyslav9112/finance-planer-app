import { prisma } from "../lib/prisma.js";

function serializeRow(r: any) {
  return {
    ...r,
    createdAt:
      r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    updatedAt:
      r.updatedAt instanceof Date ? r.updatedAt.toISOString() : r.updatedAt,
  };
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const payouts = await prisma.salaryPayout.findMany({
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      });
      return res.status(200).json(payouts.map(serializeRow));
    }

    if (req.method === "POST") {
      // Validate: amount must not exceed owed amount (totalEarnings - totalPaidOut)
      const { id, source, amount, date, comment, incomeId } =
        req.body as Record<string, any>;
      const numAmount = Number(amount);

      const [earningsAgg, payoutsAgg] = await Promise.all([
        prisma.earningsRecord.aggregate({ _sum: { totalAmount: true } }),
        prisma.salaryPayout.aggregate({ _sum: { amount: true } }),
      ]);
      const totalEarned = earningsAgg._sum.totalAmount ?? 0;
      const totalPaid = payoutsAgg._sum.amount ?? 0;
      const owed = totalEarned - totalPaid;

      if (numAmount > owed) {
        return res.status(422).json({
          error: `Сума виплати (${numAmount}) перевищує залишок до видачі (${owed})`,
        });
      }

      // Transaction: create payout + income together
      const { payout, income } = await prisma.$transaction(async (tx: any) => {
        const income = await tx.income.create({
          data: {
            id: incomeId,
            amount: numAmount,
            source,
            comment: `Виплата ЗП: ${comment || source}`,
            date,
            type: "salary_payout",
            relatedSalaryPayoutId: id,
          },
        });
        const payout = await tx.salaryPayout.create({
          data: {
            id,
            source,
            amount: numAmount,
            date,
            comment,
            relatedIncomeId: incomeId,
          },
        });
        return { payout, income };
      });

      return res.status(201).json({
        payout: serializeRow(payout),
        income: serializeRow(income),
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("[api/salary-payouts]", e);
    return res.status(500).json({ error: e.message });
  }
}
