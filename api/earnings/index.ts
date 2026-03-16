import { prisma } from "../_lib/prisma.js";
import { allowMethods, json, parseBody, toNumber } from "../_lib/http.js";
import { serializeEarnings } from "../_lib/serializers.js";

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["GET", "POST"])) return;

  try {
    if (req.method === "GET") {
      const rows = await prisma.earningsRecord.findMany({
        orderBy: { createdAt: "desc" },
        include: { entries: true },
      });
      return json(res, 200, rows.map(serializeEarnings));
    }

    const body = parseBody<any>(req);
    const entries = (body.entries || []).map((entry: any) => ({
      rate: toNumber(entry.rate),
      quantity: toNumber(entry.quantity),
      sum: toNumber(entry.sum),
    }));
    const totalAmount = entries.reduce((acc: number, item: { sum: number }) => acc + item.sum, 0);

    const created = await prisma.earningsRecord.create({
      data: {
        ...(body.id ? { id: body.id } : {}),
        date: new Date(body.date),
        comment: body.comment || null,
        totalAmount,
        entries: {
          create: entries,
        },
      },
      include: { entries: true },
    });

    return json(res, 201, serializeEarnings(created));
  } catch (error) {
    return json(res, 500, { error: "Failed to process earnings request", details: String(error) });
  }
}

