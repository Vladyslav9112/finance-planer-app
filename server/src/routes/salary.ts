import { Router } from "express";

export const salaryRouter = Router();

salaryRouter.get("/records", async (_, res) => {
  res.json([]);
});

salaryRouter.post("/records", async (req, res) => {
  res.status(201).json({ ...req.body, id: "salary-record-created" });
});

salaryRouter.post("/payouts", async (req, res) => {
  res.status(201).json({ ...req.body, id: "salary-payout-created" });
});

