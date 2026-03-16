import { Router } from "express";

export const financeRouter = Router();

financeRouter.get("/incomes", async (_, res) => {
  res.json([]);
});

financeRouter.post("/incomes", async (req, res) => {
  res.status(201).json({ ...req.body, id: "income-created" });
});

financeRouter.get("/expenses", async (_, res) => {
  res.json([]);
});

financeRouter.post("/expenses", async (req, res) => {
  res.status(201).json({ ...req.body, id: "expense-created" });
});

