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
    // Strip internal DB fields from entries, keep only what the client needs
    entries: (r.entries ?? []).map((e: any) => ({
      rate: e.rate,
      quantity: e.quantity,
      amount: e.amount,
    })),
  };
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-telegram-id");
  if (req.method === "OPTIONS") return res.status(200).end();

  const telegramId = req.headers["x-telegram-id"] as string | undefined;
  if (!telegramId) return res.status(401).json({ error: "Unauthorized" });

  try {
    if (req.method === "GET") {
      const records = await prisma.earningsRecord.findMany({
        where: { telegramId },
        include: { entries: true },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      });
      return res.status(200).json(records.map(serializeRecord));
    }

    if (req.method === "POST") {
      const { id, date, entries, totalAmount, comment } = req.body as Record<
        string,
        any
      >;
      const record = await prisma.earningsRecord.create({
        data: {
          id,
          telegramId,
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
      return res.status(201).json(serializeRecord(record));
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("[api/earnings]", e);
    return res.status(500).json({ error: e.message });
  }
}
