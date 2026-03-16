import { prisma } from "../../_lib/prisma.js";
import { allowMethods, json, parseBody, toNumber } from "../../_lib/http.js";
import { serializeSalaryRecord } from "../../_lib/serializers.js";

function resolveStatus(totalAmount: number, alreadyPaid: number, owed: number) {
  if (alreadyPaid <= 0) return "awaiting";
  if (alreadyPaid >= totalAmount || owed <= 0) return "paid";
  return "partially_paid";
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["GET", "POST"])) return;

  try {
    if (req.method === "GET") {
      const rows = await prisma.salaryRecord.findMany({ orderBy: { createdAt: "desc" } });
      return json(res, 200, rows.map(serializeSalaryRecord));
    }

    const body = parseBody<any>(req);
    const totalAmount = toNumber(body.totalAmount);
    const alreadyPaid = toNumber(body.alreadyPaid);
    const manualExpected =
      body.expectedToReceive === null || body.expectedToReceive === undefined || body.expectedToReceive === ""
        ? null
        : toNumber(body.expectedToReceive);
    const owed = manualExpected ?? Math.max(totalAmount - alreadyPaid, 0);

    const created = await prisma.salaryRecord.create({
      data: {
        ...(body.id ? { id: body.id } : {}),
        source: body.source,
        totalAmount,
        alreadyPaid,
        expectedToReceive: manualExpected,
        comment: body.comment || null,
        date: new Date(body.date),
        status: resolveStatus(totalAmount, alreadyPaid, owed),
      },
    });

    return json(res, 201, serializeSalaryRecord(created));
  } catch (error) {
    return json(res, 500, { error: "Failed to process salary records request", details: String(error) });
  }
}

