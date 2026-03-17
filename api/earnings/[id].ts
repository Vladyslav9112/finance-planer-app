import { prisma } from "../_lib/prisma.js";
import { allowMethods, json, parseBody, toNumber } from "../_lib/http.js";
import { serializeEarnings } from "../_lib/serializers.js";

const earningsMarker = (earningsId: string) => `[earnings:${earningsId}]`;

const toSalaryComment = (earningsId: string, comment?: string | null) =>
  [earningsMarker(earningsId), comment?.trim()].filter(Boolean).join(" ");

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["PATCH", "DELETE"])) return;

  const id = req.query.id as string;

  try {
    if (req.method === "DELETE") {
      const earnings = await prisma.earningsRecord.findUnique({ where: { id } });
      if (!earnings) {
        return json(res, 404, { error: "Earnings record not found" });
      }
      await prisma.$transaction(async (tx) => {
        await tx.salaryRecord.deleteMany({
          where: {
            comment: {
              contains: earningsMarker(id),
            },
          },
        });
        await tx.taraEntry.deleteMany({ where: { earningsRecordId: id } });
        await tx.earningsRecord.deleteMany({ where: { id } });
      });
      return json(res, 200, { success: true });
    }

    const body = parseBody<any>(req);
    const entries = (body.entries || []).map((entry: any) => ({
      rate: toNumber(entry.rate),
      quantity: toNumber(entry.quantity),
      sum: toNumber(entry.sum),
    }));
    const totalAmount = entries.reduce((acc: number, item: { sum: number }) => acc + item.sum, 0);

    const earnings = await prisma.earningsRecord.findUnique({ where: { id } });
    if (!earnings) {
      return json(res, 404, { error: "Earnings record not found" });
    }
    const updated = await prisma.$transaction(async (tx) => {
      await tx.taraEntry.deleteMany({ where: { earningsRecordId: id } });
      const earnings = await tx.earningsRecord.update({
        where: { id },
        data: {
          date: new Date(body.date),
          comment: body.comment || null,
          totalAmount,
          entries: {
            create: entries,
          },
        },
        include: { entries: true },
      });
      const linkedSalary = await tx.salaryRecord.findFirst({
        where: {
          comment: {
            contains: earningsMarker(id),
          },
        },
      });
      // ...existing code...
      return earnings;
    });
    return json(res, 200, serializeEarnings(updated));
  } catch (error) {
    console.error('Earnings API error:', error);
    return json(res, 500, { error: "Failed to process earnings item", details: error instanceof Error ? error.message : String(error) });
  }

      if (linkedSalary) {
        const alreadyPaid = Number(linkedSalary.alreadyPaid);
        const expectedToReceive = Math.max(totalAmount - alreadyPaid, 0);

        await tx.salaryRecord.update({
          where: { id: linkedSalary.id },
          data: {
            source: `Склад / тара ${body.date}`,
            totalAmount,
            expectedToReceive,
            comment: toSalaryComment(id, body.comment),
            date: new Date(body.date),
            status:
              alreadyPaid <= 0
                ? "awaiting"
                : expectedToReceive <= 0 || alreadyPaid >= totalAmount
                  ? "paid"
                  : "partially_paid",
          },
        });
      } else {
        await tx.salaryRecord.create({
          data: {
            source: `Склад / тара ${body.date}`,
            totalAmount,
            alreadyPaid: 0,
            expectedToReceive: totalAmount,
            comment: toSalaryComment(id, body.comment),
            date: new Date(body.date),
            status: "awaiting",
          },
        });
      }

      return earnings;
    });

    return json(res, 200, serializeEarnings(updated));
  } catch (error) {
    return json(res, 500, { error: "Failed to process earnings item", details: String(error) });
  }
}
