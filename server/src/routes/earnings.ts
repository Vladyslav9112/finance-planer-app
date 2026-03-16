import { Router } from "express";

export const earningsRouter = Router();

earningsRouter.get("/", async (_, res) => {
  res.json([]);
});

earningsRouter.post("/", async (req, res) => {
  res.status(201).json({ ...req.body, id: "earnings-created" });
});

