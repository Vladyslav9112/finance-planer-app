import { prisma } from "../../../lib/prisma";

function serialize(p: any) {
  return {
    ...p,
    createdAt:
      p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt:
      p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
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
      const plans = await prisma.plan.findMany({
        where: { telegramId },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      });
      return res.status(200).json(plans.map(serialize));
    }

    if (req.method === "POST") {
      const { id, title, description, date, time, status, priority, category } =
        req.body as Record<string, string>;
      const plan = await prisma.plan.create({
        data: {
          id,
          telegramId,
          title,
          description,
          date,
          time,
          status: (status as any) || "scheduled",
          priority: (priority as any) || "medium",
          category,
        },
      });
      return res.status(201).json(serialize(plan));
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("[api/plans]", e);
    return res.status(500).json({ error: e.message });
  }
}
