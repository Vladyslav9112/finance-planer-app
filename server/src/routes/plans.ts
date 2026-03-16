import { Router } from "express";

export const plansRouter = Router();

plansRouter.get("/", async (_, res) => {
  res.json([]);
});

plansRouter.post("/", async (req, res) => {
  res.status(201).json({ ...req.body, id: "generated-on-backend" });
});

plansRouter.patch("/:id", async (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

plansRouter.delete("/:id", async (_, res) => {
  res.json({ success: true });
});

