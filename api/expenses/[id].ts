import { prisma } from "../lib/prisma";

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
      const { amount, category, comment, date } = req.body as Record<
        string,
        any
      >;
      const expense = await prisma.expense.update({
        where: { id },
        data: {
          amount: amount !== undefined ? Number(amount) : undefined,
          category,
          comment,
          date,
        },
      });
      return res.status(200).json(serialize(expense));
    }

    if (req.method === "DELETE") {
      await prisma.expense.delete({ where: { id } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("[api/expenses/[id]]", e);
    return res.status(500).json({ error: e.message });
  }
}
