import "dotenv/config";
import express from "express";
import cors from "cors";
import { plansRouter } from "./routes/plans.js";
import { financeRouter } from "./routes/finance.js";
import { salaryRouter } from "./routes/salary.js";
import { earningsRouter } from "./routes/earnings.js";
import { telegramRouter } from "./routes/telegram.js";
const app = express();
const port = Number(process.env.PORT || 8787);
app.use(cors());
app.use(express.json());
app.get("/api/health", (_, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
});
app.use("/api/plans", plansRouter);
app.use("/api", financeRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/earnings", earningsRouter);
app.use("/api/telegram", telegramRouter);
app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
});
