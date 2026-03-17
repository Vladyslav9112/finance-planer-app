import { Router } from "express";
import { prisma } from "../db/client.js";

const earningsMarker = (earningsId: string) => `[earnings:${earningsId}]`;

const toSalaryComment = (earningsId: string, comment?: string | null) =>
  [earningsMarker(earningsId), comment?.trim()].filter(Boolean).join(" ");

const resolveStatus = (totalAmount: number, alreadyPaid: number, owed: number) => {
  if (alreadyPaid <= 0) return "awaiting";
  if (alreadyPaid >= totalAmount || owed <= 0) return "paid";
  return "partially_paid";
};

export const earningsRouter = Router();

earningsRouter.get("/", async (_, res) => {
  const rows = await prisma.earningsRecord.findMany({
    orderBy: { createdAt: "desc" },
    include: { entries: true },
  });

  res.json(
    rows.map((item) => ({
      id: item.id,
      date: item.date.toISOString().slice(0, 10),
      entries: item.entries.map((entry) => ({
        rate: entry.rate,
        quantity: entry.quantity,
        sum: Number(entry.sum),
      })),
      totalAmount: Number(item.totalAmount),
      comment: item.comment || undefined,
      createdAt: item.createdAt.toISOString(),
    })),
  );
});

earningsRouter.post("/", async (req, res) => {
  const body = req.body;
  const entries = (body.entries || []).map((entry: any) => ({
    rate: Number(entry.rate || 0),
    quantity: Number(entry.quantity || 0),
    sum: Number(entry.sum || 0),
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
        entries: { create: entries },
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

  res.status(201).json({
    id: created.id,
    date: created.date.toISOString().slice(0, 10),
    entries: created.entries.map((entry) => ({
      rate: entry.rate,
      quantity: entry.quantity,
      sum: Number(entry.sum),
    })),
    totalAmount: Number(created.totalAmount),
    comment: created.comment || undefined,
    createdAt: created.createdAt.toISOString(),
  });
});

earningsRouter.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const entries = (body.entries || []).map((entry: any) => ({
    rate: Number(entry.rate || 0),
    quantity: Number(entry.quantity || 0),
    sum: Number(entry.sum || 0),
  }));
  const totalAmount = entries.reduce((acc: number, item: { sum: number }) => acc + item.sum, 0);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.taraEntry.deleteMany({ where: { earningsRecordId: id } });

    const earnings = await tx.earningsRecord.update({
      where: { id },
      data: {
        date: new Date(body.date),
        comment: body.comment || null,
        totalAmount,
        entries: { create: entries },
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
          status: resolveStatus(totalAmount, alreadyPaid, expectedToReceive),
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

  res.json({
    id: updated.id,
    date: updated.date.toISOString().slice(0, 10),
    entries: updated.entries.map((entry) => ({
      rate: entry.rate,
      quantity: entry.quantity,
      sum: Number(entry.sum),
    })),
    totalAmount: Number(updated.totalAmount),
    comment: updated.comment || undefined,
    createdAt: updated.createdAt.toISOString(),
  });
});

earningsRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;

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

  res.json({ success: true });
});
