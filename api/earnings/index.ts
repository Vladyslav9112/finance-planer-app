import { prisma } from "../_lib/prisma.js";
import { allowMethods, json, parseBody, toNumber } from "../_lib/http.js";
import { serializeEarnings } from "../_lib/serializers.js";

const earningsMarker = (earningsId: string) => `[earnings:${earningsId}]`;

const toSalaryComment = (earningsId: string, comment?: string | null) =>
  [earningsMarker(earningsId), comment?.trim()].filter(Boolean).join(" ");

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
    const earningsId = body.id || crypto.randomUUID();

    const created = await prisma.$transaction(async (tx) => {
      const earnings = await tx.earningsRecord.create({
        data: {
          id: earningsId,
          date: new Date(body.date),
          comment: body.comment || null,
          totalAmount,
          entries: {
            create: entries,
          },
        },
        include: { entries: true },
      });

      await tx.salaryRecord.create({
        data: {
          source: `Склад / тара ${body.date}`,
          totalAmount,
          alreadyPaid: 0,
          expectedToReceive: totalAmount,
          comment: toSalaryComment(earningsId, body.comment),
          date: new Date(body.date),
          status: "awaiting",
        },
      });

      return earnings;
    });

    return json(res, 201, serializeEarnings(created));
  } catch (error) {
    return json(res, 500, { error: "Failed to process earnings request", details: String(error) });
  }
}
