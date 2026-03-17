import { Router } from "express";
import { prisma } from "../db/client.js";
export const financeRouter = Router();
financeRouter.get("/incomes", async (_, res) => {
    const rows = await prisma.income.findMany({ orderBy: { createdAt: "desc" } });
    res.json(rows.map((item) => ({
        id: item.id,
        amount: Number(item.amount),
        source: item.source,
        comment: item.comment || undefined,
        date: item.date.toISOString().slice(0, 10),
        incomeType: item.incomeType,
        status: item.status || undefined,
        linkedSalaryPayoutId: item.linkedSalaryPayoutId || undefined,
        createdAt: item.createdAt.toISOString(),
    })));
});
financeRouter.post("/incomes", async (req, res) => {
    const body = req.body;
    const created = await prisma.income.create({
        data: {
            ...(body.id ? { id: body.id } : {}),
            amount: Number(body.amount || 0),
            source: body.source,
            comment: body.comment || null,
            date: new Date(body.date),
            incomeType: body.incomeType,
            status: body.status || null,
        },
    });
    res.status(201).json({
        id: created.id,
        amount: Number(created.amount),
        source: created.source,
        comment: created.comment || undefined,
        date: created.date.toISOString().slice(0, 10),
        incomeType: created.incomeType,
        status: created.status || undefined,
        linkedSalaryPayoutId: created.linkedSalaryPayoutId || undefined,
        createdAt: created.createdAt.toISOString(),
    });
});
financeRouter.delete("/incomes/:id", async (req, res) => {
    await prisma.income.deleteMany({ where: { id: req.params.id } });
    res.json({ success: true });
});
financeRouter.get("/expenses", async (_, res) => {
    const rows = await prisma.expense.findMany({ orderBy: { createdAt: "desc" } });
    res.json(rows.map((item) => ({
        id: item.id,
        amount: Number(item.amount),
        category: item.category,
        comment: item.comment || undefined,
        date: item.date.toISOString().slice(0, 10),
        createdAt: item.createdAt.toISOString(),
    })));
});
financeRouter.post("/expenses", async (req, res) => {
    const body = req.body;
    const created = await prisma.expense.create({
        data: {
            ...(body.id ? { id: body.id } : {}),
            amount: Number(body.amount || 0),
            category: body.category,
            comment: body.comment || null,
            date: new Date(body.date),
        },
    });
    res.status(201).json({
        id: created.id,
        amount: Number(created.amount),
        category: created.category,
        comment: created.comment || undefined,
        date: created.date.toISOString().slice(0, 10),
        createdAt: created.createdAt.toISOString(),
    });
});
financeRouter.delete("/expenses/:id", async (req, res) => {
    await prisma.expense.deleteMany({ where: { id: req.params.id } });
    res.json({ success: true });
});
