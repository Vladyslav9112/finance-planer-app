import { Router } from "express";
import { prisma } from "../db/client.js";

export const plansRouter = Router();

plansRouter.get("/", async (_, res) => {
  const rows = await prisma.plan.findMany({ orderBy: { createdAt: "desc" } });
  res.json(
    rows.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      date: item.date.toISOString().slice(0, 10),
      time: item.time,
      status: item.status,
      priority: item.priority,
      category: item.category,
      notifyToChannel: item.notifyToChannel,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
  );
});

plansRouter.post("/", async (req, res) => {
  const body = req.body;
  const created = await prisma.plan.create({
    data: {
      ...(body.id ? { id: body.id } : {}),
      title: body.title,
      description: body.description,
      date: new Date(body.date),
      time: body.time,
      status: body.status,
      priority: body.priority,
      category: body.category,
      notifyToChannel: Boolean(body.notifyToChannel),
    },
  });

  res.status(201).json({
    id: created.id,
    title: created.title,
    description: created.description,
    date: created.date.toISOString().slice(0, 10),
    time: created.time,
    status: created.status,
    priority: created.priority,
    category: created.category,
    notifyToChannel: created.notifyToChannel,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  });
});

plansRouter.patch("/:id", async (req, res) => {
  const body = req.body;
  const updated = await prisma.plan.update({
    where: { id: req.params.id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.date !== undefined ? { date: new Date(body.date) } : {}),
      ...(body.time !== undefined ? { time: body.time } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.priority !== undefined ? { priority: body.priority } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.notifyToChannel !== undefined ? { notifyToChannel: Boolean(body.notifyToChannel) } : {}),
    },
  });

  res.json({
    id: updated.id,
    title: updated.title,
    description: updated.description,
    date: updated.date.toISOString().slice(0, 10),
    time: updated.time,
    status: updated.status,
    priority: updated.priority,
    category: updated.category,
    notifyToChannel: updated.notifyToChannel,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
});

plansRouter.delete("/:id", async (req, res) => {
  await prisma.plan.deleteMany({ where: { id: req.params.id } });
  res.json({ success: true });
});
