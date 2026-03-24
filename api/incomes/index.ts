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
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const incomes = await prisma.income.findMany({
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      });
      return res.status(200).json(incomes.map(serialize));
    }

    if (req.method === "POST") {
      const { id, amount, source, comment, date, type, relatedSalaryPayoutId } =
        req.body as Record<string, any>;
      const income = await prisma.income.create({
        data: {
          id,
          amount: Number(amount),
          source,
          comment,
          date,
          type: type || "other",
          relatedSalaryPayoutId,
        },
      });
      return res.status(201).json(serialize(income));
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("[api/incomes]", e);
    return res.status(500).json({ error: e.message });
  }
}
