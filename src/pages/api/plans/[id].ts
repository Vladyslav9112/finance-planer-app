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
  res.setHeader("Access-Control-Allow-Methods", "PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-telegram-id");
  if (req.method === "OPTIONS") return res.status(200).end();

  const telegramId = req.headers["x-telegram-id"] as string | undefined;
  if (!telegramId) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query as { id: string };

  try {
    if (req.method === "PUT") {
      const { title, description, date, time, status, priority, category } =
        req.body as Record<string, string>;
      const plan = await prisma.plan.updateMany({
        where: { id, telegramId },
        data: {
          title,
          description,
          date,
          time,
          status: status as any,
          priority: priority as any,
          category,
        },
      });
      if (plan.count === 0) return res.status(404).json({ error: "Not found" });
      const updated = await prisma.plan.findUnique({ where: { id } });
      return res.status(200).json(serialize(updated));
    }

    if (req.method === "DELETE") {
      await prisma.plan.deleteMany({ where: { id, telegramId } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("[api/plans/[id]]", e);
    return res.status(500).json({ error: e.message });
  }
}
