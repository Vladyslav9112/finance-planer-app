import { prisma } from "../_lib/prisma.js";
import { allowMethods, json, parseBody } from "../_lib/http.js";
import { serializePlan } from "../_lib/serializers.js";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["POST"])) return;
  const id = req.query.id as string;

  try {
    const body = parseBody<any>(req);
    const action = body.action;
    if (action === "delete") {
      const plan = await prisma.plan.findUnique({ where: { id } });
      if (!plan) {
        return json(res, 404, { error: "Plan not found" });
      }
      await prisma.plan.delete({ where: { id } });
      return json(res, 200, { success: true });
    }
    if (action === "patch") {
      const plan = await prisma.plan.findUnique({ where: { id } });
      if (!plan) {
        return json(res, 404, { error: "Plan not found" });
      }
      const updated = await prisma.plan.update({
        where: { id },
        data: {
          ...(body.title !== undefined ? { title: body.title } : {}),
          ...(body.description !== undefined
            ? { description: body.description }
            : {}),
          ...(body.date !== undefined ? { date: new Date(body.date) } : {}),
          ...(body.time !== undefined ? { time: body.time } : {}),
          ...(body.status !== undefined ? { status: body.status } : {}),
          ...(body.priority !== undefined ? { priority: body.priority } : {}),
          ...(body.category !== undefined ? { category: body.category } : {}),
          ...(body.notifyToChannel !== undefined
            ? { notifyToChannel: Boolean(body.notifyToChannel) }
            : {}),
        },
      });
      return json(res, 200, serializePlan(updated));
    }
    return json(res, 400, { error: "Unknown action" });
  } catch (error) {
    console.error("Plan API error:", error);
    return json(res, 500, {
      error: "Failed to process plan request",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
