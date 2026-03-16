import { allowMethods, json, parseBody } from "../_lib/http.js";

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["POST"])) return;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  if (!botToken || !channelId) {
    return json(res, 500, { success: false, message: "Telegram env vars are missing on server" });
  }

  try {
    const body = parseBody<any>(req);
    const plan = body.plan;
    const text = [
      "РќРѕРІРёР№ РїР»Р°РЅ",
      `РќР°Р·РІР°: ${plan.title}`,
      `РћРїРёСЃ: ${plan.description}`,
      `Р”Р°С‚Р°: ${plan.date} ${plan.time}`,
      `РЎС‚Р°С‚СѓСЃ: ${plan.status}`,
      `РџСЂС–РѕСЂРёС‚РµС‚: ${plan.priority}`,
      `РљР°С‚РµРіРѕСЂС–СЏ: ${plan.category}`,
    ].join("\n");

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: channelId,
        text,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return json(res, 500, { success: false, message: "Telegram API failed", details });
    }

    return json(res, 200, { success: true, message: "Sent" });
  } catch (error) {
    return json(res, 500, { success: false, message: "Failed", details: String(error) });
  }
}


