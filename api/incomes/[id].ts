import { prisma } from "../lib/prisma.js";

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
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query as { id: string };

  try {
    if (req.method === "PUT") {
      const { amount, source, comment, date, type } = req.body as Record<
        string,
        any
      >;
      const income = await prisma.income.update({
        where: { id },
        data: {
          amount: amount !== undefined ? Number(amount) : undefined,
          source,
          comment,
          date,
          type: type as any,
        },
      });
      return res.status(200).json(serialize(income));
    }

    if (req.method === "DELETE") {
      await prisma.income.delete({ where: { id } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("[api/incomes/[id]]", e);
    return res.status(500).json({ error: e.message });
  }
}
