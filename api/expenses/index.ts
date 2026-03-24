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
      const expenses = await prisma.expense.findMany({
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      });
      return res.status(200).json(expenses.map(serialize));
    }

    if (req.method === "POST") {
      const { id, amount, category, comment, date } = req.body as Record<
        string,
        any
      >;
      const expense = await prisma.expense.create({
        data: { id, amount: Number(amount), category, comment, date },
      });
      return res.status(201).json(serialize(expense));
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("[api/expenses]", e);
    return res.status(500).json({ error: e.message });
  }
}
