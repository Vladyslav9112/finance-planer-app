import { Router } from "express";
import { prisma } from "../db/client.js";

const resolveStatus = (totalAmount: number, alreadyPaid: number, owed: number) => {
  if (alreadyPaid <= 0) return "awaiting";
  if (alreadyPaid >= totalAmount || owed <= 0) return "paid";
  return "partially_paid";
};

export const salaryRouter = Router();

salaryRouter.get("/records", async (_, res) => {
  const rows = await prisma.salaryRecord.findMany({ orderBy: { createdAt: "desc" } });
  res.json(
    rows.map((item) => ({
      id: item.id,
      source: item.source,
      totalAmount: Number(item.totalAmount),
      alreadyPaid: Number(item.alreadyPaid),
      expectedToReceive: item.expectedToReceive === null ? null : Number(item.expectedToReceive),
      comment: item.comment || undefined,
      date: item.date.toISOString().slice(0, 10),
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
  );
});

salaryRouter.post("/records", async (req, res) => {
  const body = req.body;
  const totalAmount = Number(body.totalAmount || 0);
  const alreadyPaid = Number(body.alreadyPaid || 0);
  const expectedToReceive =
    body.expectedToReceive === null || body.expectedToReceive === undefined || body.expectedToReceive === ""
      ? null
      : Number(body.expectedToReceive);
  const owed = expectedToReceive ?? Math.max(totalAmount - alreadyPaid, 0);

  const created = await prisma.salaryRecord.create({
    data: {
      ...(body.id ? { id: body.id } : {}),
      source: body.source,
      totalAmount,
      alreadyPaid,
      expectedToReceive,
      comment: body.comment || null,
      date: new Date(body.date),
      status: resolveStatus(totalAmount, alreadyPaid, owed),
    },
  });

  res.status(201).json({
    id: created.id,
    source: created.source,
    totalAmount: Number(created.totalAmount),
    alreadyPaid: Number(created.alreadyPaid),
    expectedToReceive: created.expectedToReceive === null ? null : Number(created.expectedToReceive),
    comment: created.comment || undefined,
    date: created.date.toISOString().slice(0, 10),
    status: created.status,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  });
});

salaryRouter.post("/payouts", async (req, res) => {
  const body = req.body;
  const amount = Number(body.amount || 0);
  const payoutDate = new Date(body.payoutDate || new Date().toISOString().slice(0, 10));
  const salaryRecordId = body.salaryRecordId as string;

  const payout = await prisma.$transaction(async (tx) => {
    const record = await tx.salaryRecord.findUnique({ where: { id: salaryRecordId } });
    if (!record) throw new Error("Salary record not found");

    const nextAlreadyPaid = Number(record.alreadyPaid) + amount;
    const manualExpected =
      record.expectedToReceive === null ? null : Math.max(Number(record.expectedToReceive) - amount, 0);
    const autoOwed = Math.max(Number(record.totalAmount) - nextAlreadyPaid, 0);
    const effectiveOwed = manualExpected ?? autoOwed;

    const created = await tx.salaryPayout.create({
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

    return created;
  });

  res.status(201).json({
    id: payout.id,
    salaryRecordId: payout.salaryRecordId,
    amount: Number(payout.amount),
    payoutDate: payout.payoutDate.toISOString().slice(0, 10),
    comment: payout.comment || undefined,
    createdAt: payout.createdAt.toISOString(),
  });
});
