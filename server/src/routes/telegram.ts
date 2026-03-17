import { Router } from "express";
import { sendMessageToChannel } from "../services/telegramBot.js";

export const telegramRouter = Router();

telegramRouter.post("/send-plan", async (req, res) => {
  try {
    const { plan } = req.body as { plan: { title: string; description: string; date: string; time: string; status?: string; priority?: string; category?: string } };
    const text = [
      "Новий план",
      `Назва: ${plan.title}`,
      `Опис: ${plan.description}`,
      `Дата: ${plan.date} ${plan.time}`,
      `Статус: ${plan.status || "-"}`,
      `Пріоритет: ${plan.priority || "-"}`,
      `Категорія: ${plan.category || "-"}`,
    ].join("\n");

    await sendMessageToChannel(text);
    res.json({ success: true, message: "Sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed", details: String(error) });
  }
});
