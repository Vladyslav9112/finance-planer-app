import { prisma } from "../../../lib/prisma";

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

      // Transaction: create payout first (avoids circular FK), then income, then link back
      const { payout, income } = await prisma.$transaction(async (tx: any) => {
        // 1. Create payout without relatedIncomeId (Income FK to SalaryPayout must exist first)
        const payout = await tx.salaryPayout.create({
          data: { id, source, amount: numAmount, date, comment },
        });
        // 2. Create income referencing the now-existing payout
        const income = await tx.income.create({
          data: {
            id: incomeId,
            amount: numAmount,
            source,
            // Записується автоматично як "Виплата ЗП" — коментар для ідентифікації
            comment: `Виплата ЗП: ${comment || source}`,
            date,
            type: "salary_payout",
            relatedSalaryPayoutId: id,
          },
        });
        // 3. Link payout back to income
        const updatedPayout = await tx.salaryPayout.update({
          where: { id },
          data: { relatedIncomeId: incomeId },
        });
        return { payout: updatedPayout, income };
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
