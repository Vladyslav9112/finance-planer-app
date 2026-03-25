import { prisma } from "../../../lib/prisma";

function serializeRecord(r: any) {
  return {
    id: r.id,
    date: r.date,
    totalAmount: r.totalAmount,
    comment: r.comment,
    createdAt:
      r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    updatedAt:
      r.updatedAt instanceof Date ? r.updatedAt.toISOString() : r.updatedAt,
    entries: (r.entries ?? []).map((e: any) => ({
      rate: e.rate,
      quantity: e.quantity,
      amount: e.amount,
    })),
  };
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-telegram-id");
  if (req.method === "OPTIONS") return res.status(200).end();

  const telegramId = req.headers["x-telegram-id"] as string | undefined;
  if (!telegramId) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query as { id: string };

  try {
    if (req.method === "PUT") {
      const { date, entries, totalAmount, comment } = req.body as Record<
        string,
        any
      >;
      // Verify ownership first
      const existing = await prisma.earningsRecord.findFirst({
        where: { id, telegramId },
      });
      if (!existing) return res.status(404).json({ error: "Not found" });

      const record = await prisma.$transaction(async (tx: any) => {
        await tx.taraEntry.deleteMany({ where: { earningsRecordId: id } });
        return tx.earningsRecord.update({
          where: { id },
          data: {
            date,
            totalAmount: Number(totalAmount),
            comment,
            entries: {
              create: (entries as any[]).map((e) => ({
                rate: Number(e.rate),
                quantity: Number(e.quantity),
                amount: Number(e.amount),
              })),
            },
          },
          include: { entries: true },
        });
      });
      return res.status(200).json(serializeRecord(record));
    }

    if (req.method === "DELETE") {
      await prisma.earningsRecord.deleteMany({ where: { id, telegramId } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("[api/earnings/[id]]", e);
    return res.status(500).json({ error: e.message });
  }
}
