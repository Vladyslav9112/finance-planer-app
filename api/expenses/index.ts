import { prisma } from "../_lib/prisma";
import { allowMethods, json, parseBody, toNumber } from "../_lib/http";
import { serializeExpense } from "../_lib/serializers";

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["GET", "POST"])) return;

  try {
    if (req.method === "GET") {
      const rows = await prisma.expense.findMany({ orderBy: { createdAt: "desc" } });
      return json(res, 200, rows.map(serializeExpense));
    }

    const body = parseBody<any>(req);
    const created = await prisma.expense.create({
      data: {
        ...(body.id ? { id: body.id } : {}),
        amount: toNumber(body.amount),
        category: body.category,
        comment: body.comment || null,
        date: new Date(body.date),
      },
    });
    return json(res, 201, serializeExpense(created));
  } catch (error) {
    return json(res, 500, { error: "Failed to process expenses request", details: String(error) });
  }
}
