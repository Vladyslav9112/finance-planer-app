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
  res.setHeader("Access-Control-Allow-Methods", "PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query as { id: string };

  try {
    if (req.method === "PUT") {
      const { source, amount, date, comment } = req.body as Record<string, any>;
      const numAmount = amount !== undefined ? Number(amount) : undefined;

      const existing = await prisma.salaryPayout.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Not found" });

      if (numAmount !== undefined && numAmount !== existing.amount) {
        const [earningsAgg, payoutsAgg] = await Promise.all([
          prisma.earningsRecord.aggregate({ _sum: { totalAmount: true } }),
          prisma.salaryPayout.aggregate({
            _sum: { amount: true },
            where: { id: { not: id } },
          }),
        ]);
        const totalEarned = earningsAgg._sum.totalAmount ?? 0;
        const otherPaid = payoutsAgg._sum.amount ?? 0;
        if (otherPaid + numAmount > totalEarned) {
          return res
            .status(422)
            .json({ error: "Загальна сума виплат перевищує зароблену суму" });
        }
      }

      const { payout, income } = await prisma.$transaction(async (tx: any) => {
        const payout = await tx.salaryPayout.update({
          where: { id },
          data: { source, amount: numAmount, date, comment },
        });
        let income = null;
        if (existing.relatedIncomeId) {
          income = await tx.income.update({
            where: { id: existing.relatedIncomeId },
            data: {
              amount: numAmount ?? existing.amount,
              source: source ?? existing.source,
              date: date ?? existing.date,
              comment: `Виплата ЗП: ${comment ?? existing.comment ?? source ?? existing.source}`,
            },
          });
        }
        return { payout, income };
      });

      return res.status(200).json({
        payout: serializeRow(payout),
        income: income ? serializeRow(income) : null,
      });
    }

    if (req.method === "DELETE") {
      const existing = await prisma.salaryPayout.findUnique({ where: { id } });
      await prisma.$transaction(async (tx: any) => {
        if (existing?.relatedIncomeId) {
          await tx.income.deleteMany({ where: { relatedSalaryPayoutId: id } });
        }
        await tx.salaryPayout.delete({ where: { id } });
      });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("[api/salary-payouts/[id]]", e);
    return res.status(500).json({ error: e.message });
  }
}
