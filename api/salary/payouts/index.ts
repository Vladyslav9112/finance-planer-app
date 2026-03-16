import { prisma } from "../../_lib/prisma.js";
import { allowMethods, json, parseBody, toNumber } from "../../_lib/http.js";
import { serializeSalaryPayout } from "../../_lib/serializers.js";

function resolveStatus(totalAmount: number, alreadyPaid: number, owed: number) {
  if (alreadyPaid <= 0) return "awaiting";
  if (alreadyPaid >= totalAmount || owed <= 0) return "paid";
  return "partially_paid";
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["POST"])) return;

  try {
    const body = parseBody<any>(req);
    const amount = toNumber(body.amount);
    const payoutDate = new Date(body.payoutDate);
    const salaryRecordId = body.salaryRecordId as string;

    const result = await prisma.$transaction(async (tx) => {
      const record = await tx.salaryRecord.findUnique({ where: { id: salaryRecordId } });
      if (!record) {
        throw new Error("Salary record not found");
      }

      const nextAlreadyPaid = Number(record.alreadyPaid) + amount;
      const manualExpected =
        record.expectedToReceive === null ? null : Math.max(Number(record.expectedToReceive) - amount, 0);
      const autoOwed = Math.max(Number(record.totalAmount) - nextAlreadyPaid, 0);
      const effectiveOwed = manualExpected ?? autoOwed;

      const payout = await tx.salaryPayout.create({
        data: {
          ...(body.id ? { id: body.id } : {}),
          salaryRecordId,
          amount,
          payoutDate,
          comment: body.comment || null,
        },
      });

      await tx.salaryRecord.update({
        where: { id: salaryRecordId },
        data: {
          alreadyPaid: nextAlreadyPaid,
          expectedToReceive: manualExpected,
          status: resolveStatus(Number(record.totalAmount), nextAlreadyPaid, effectiveOwed),
        },
      });

      await tx.income.create({
        data: {
          amount,
          source: `Р’РёРїР»Р°С‚Р° Р—Рџ: ${record.source} (${salaryRecordId.slice(0, 6)})`,
          comment: body.comment || "РђРІС‚РѕРјР°С‚РёС‡РЅРѕ РґРѕРґР°РЅРѕ РїС–СЃР»СЏ РІРёРґР°С‡С– Р·Р°СЂРїР»Р°С‚Рё",
          date: payoutDate,
          incomeType: "salary_payout",
          status: "received",
          linkedSalaryPayoutId: payout.id,
        },
      });

      return payout;
    });

    return json(res, 201, serializeSalaryPayout(result));
  } catch (error) {
    return json(res, 500, { error: "Failed to process salary payout", details: String(error) });
  }
}

