import { allowMethods, json, parseBody } from "../_lib/http.js";

function formatPlanText(plan: any) {
  return [
    "Новий план",
    `Назва: ${plan.title}`,
    `Опис: ${plan.description}`,
    `Дата: ${plan.date} ${plan.time}`,
    `Статус: ${plan.status}`,
    `Пріоритет: ${plan.priority}`,
    `Категорія: ${plan.category}`,
  ].join("\n");
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["POST"])) return;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  if (!botToken || !channelId) {
    return json(res, 500, {
      success: false,
      message: "Telegram env vars are missing on server",
      details: "Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID",
    });
  }

  try {
    const body = parseBody<any>(req);
    const plan = body.plan;
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: channelId,
          text: formatPlanText(plan),
        }),
      },
    );
    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.ok === false) {
      console.error("Telegram API error:", payload);
      return json(res, 500, {
        success: false,
        message: "Telegram API error",
        details:
          payload?.description ||
          `Telegram API failed with status ${response.status}`,
        telegramPayload: payload,
      });
    }
    return json(res, 200, { success: true, telegramPayload: payload });

    const telegramPayload = await response.json().catch(() => null);

    if (!response.ok || telegramPayload?.ok === false) {
      return json(res, 500, {
        success: false,
        message: "Telegram API failed",
        details: telegramPayload?.description || `HTTP ${response.status}`,
      });
    }

    return json(res, 200, { success: true, message: "Sent" });
  } catch (error) {
    return json(res, 500, {
      success: false,
      message: "Failed",
      details: String(error),
    });
  }
}
