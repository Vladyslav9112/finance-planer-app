import { prisma } from "../_lib/prisma.js";
import { allowMethods, json, parseBody } from "../_lib/http.js";
import { serializePlan } from "../_lib/serializers.js";

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["GET", "POST"])) return;

  try {
    if (req.method === "GET") {
      const rows = await prisma.plan.findMany({ orderBy: { createdAt: "desc" } });
      return json(res, 200, rows.map(serializePlan));
    }

    const body = parseBody<any>(req);
    const created = await prisma.plan.create({
      data: {
        ...(body.id ? { id: body.id } : {}),
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        time: body.time,
        status: body.status,
        priority: body.priority,
        category: body.category,
        notifyToChannel: Boolean(body.notifyToChannel),
      },
    });
    return json(res, 201, serializePlan(created));
  } catch (error) {
    return json(res, 500, { error: "Failed to process plans request", details: String(error) });
  }
}

