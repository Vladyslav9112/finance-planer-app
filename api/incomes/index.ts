import { prisma } from "../_lib/prisma";
import { allowMethods, json, parseBody, toNumber } from "../_lib/http";
import { serializeIncome } from "../_lib/serializers";

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["GET", "POST"])) return;

  try {
    if (req.method === "GET") {
      const rows = await prisma.income.findMany({ orderBy: { createdAt: "desc" } });
      return json(res, 200, rows.map(serializeIncome));
    }

    const body = parseBody<any>(req);
    const created = await prisma.income.create({
      data: {
        ...(body.id ? { id: body.id } : {}),
        amount: toNumber(body.amount),
        source: body.source,
        comment: body.comment || null,
        date: new Date(body.date),
        incomeType: body.incomeType,
        status: body.status || null,
      },
    });
    return json(res, 201, serializeIncome(created));
  } catch (error) {
    return json(res, 500, { error: "Failed to process incomes request", details: String(error) });
  }
}
