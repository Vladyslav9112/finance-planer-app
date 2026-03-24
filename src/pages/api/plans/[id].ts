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
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query as { id: string };

  try {
    if (req.method === "PUT") {
      const { title, description, date, time, status, priority, category } =
        req.body as Record<string, string>;
      const plan = await prisma.plan.update({
        where: { id },
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
      return res.status(200).json(serialize(plan));
    }

    if (req.method === "DELETE") {
      await prisma.plan.delete({ where: { id } });
      return res.status(204).end();
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("[api/plans/[id]]", e);
    return res.status(500).json({ error: e.message });
  }
}
