import { prisma } from "../../../lib/prisma";

function serialize(r: any) {
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
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-telegram-id");
  if (req.method === "OPTIONS") return res.status(200).end();

  const telegramId = req.headers["x-telegram-id"] as string | undefined;
  if (!telegramId) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query as { id: string };

  try {
    if (req.method === "PUT") {
      const { amount, source, comment, date, type } = req.body as Record<
        string,
        any
      >;
      const result = await prisma.income.updateMany({
        where: { id, telegramId },
        data: {
          amount: amount !== undefined ? Number(amount) : undefined,
          source,
          comment,
          date,
          type: type as any,
        },
      });
      if (result.count === 0)
        return res.status(404).json({ error: "Not found" });
      const updated = await prisma.income.findUnique({ where: { id } });
      return res.status(200).json(serialize(updated));
    }

    if (req.method === "DELETE") {
      await prisma.income.deleteMany({ where: { id, telegramId } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("[api/incomes/[id]]", e);
    return res.status(500).json({ error: e.message });
  }
}
