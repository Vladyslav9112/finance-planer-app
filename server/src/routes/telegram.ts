import { Router } from "express";
import { sendMessageToChannel } from "../services/telegramBot";

export const telegramRouter = Router();

telegramRouter.post("/send-plan", async (req, res) => {
  try {
    const { plan } = req.body as { plan: { title: string; description: string; date: string; time: string } };
    const text = `План: ${plan.title}\n${plan.description}\n${plan.date} ${plan.time}`;
    await sendMessageToChannel(text);
    res.json({ success: true, message: "Sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed", error: String(error) });
  }
});

