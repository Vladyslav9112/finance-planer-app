import { prisma } from "../_lib/prisma";
import { allowMethods, json, parseBody } from "../_lib/http";
import { serializePlan } from "../_lib/serializers";

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["PATCH", "DELETE"])) return;
  const id = req.query.id as string;

  try {
    if (req.method === "DELETE") {
      await prisma.plan.delete({ where: { id } });
      return json(res, 200, { success: true });
    }

    const body = parseBody<any>(req);
    const updated = await prisma.plan.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.date !== undefined ? { date: new Date(body.date) } : {}),
        ...(body.time !== undefined ? { time: body.time } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.priority !== undefined ? { priority: body.priority } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.notifyToChannel !== undefined ? { notifyToChannel: Boolean(body.notifyToChannel) } : {}),
      },
    });

    return json(res, 200, serializePlan(updated));
  } catch (error) {
    return json(res, 500, { error: "Failed to process plan request", details: String(error) });
  }
}

