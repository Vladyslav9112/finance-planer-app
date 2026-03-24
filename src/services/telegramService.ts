import type { Plan } from "../types";

const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_ID;

const isTelegramConfigured = () =>
  Boolean(BOT_TOKEN && CHANNEL_ID && BOT_TOKEN !== "" && CHANNEL_ID !== "");

// ─── Diagnostics ──────────────────────────────────────────────────────────────

export const diagnoseTelegram = async (): Promise<void> => {
  const prefix = "[TelegramDiagnostic]";

  if (!BOT_TOKEN || BOT_TOKEN === "") {
    console.error(`${prefix} ❌ VITE_TELEGRAM_BOT_TOKEN is not set`);
    return;
  }
  if (!CHANNEL_ID || CHANNEL_ID === "") {
    console.error(`${prefix} ❌ VITE_TELEGRAM_CHANNEL_ID is not set`);
    return;
  }

  // Verify token via getMe
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const me = await meRes.json();
    if (me.ok) {
      console.info(
        `${prefix} ✅ Token valid. Bot: @${me.result.username} (${me.result.first_name})`,
      );
    } else {
      console.error(`${prefix} ❌ Token invalid:`, me.description);
      return;
    }
  } catch (e) {
    console.error(`${prefix} ❌ getMe network error:`, e);
    return;
  }

  // Verify channel/chat
  try {
    const chatRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHANNEL_ID }),
      },
    );
    const chat = await chatRes.json();
    if (chat.ok) {
      console.info(
        `${prefix} ✅ Chat found: "${chat.result.title ?? chat.result.username ?? CHANNEL_ID}" (type: ${chat.result.type})`,
      );
    } else {
      console.error(
        `${prefix} ❌ Chat not found (id: ${CHANNEL_ID}):`,
        chat.description,
      );
    }
  } catch (e) {
    console.error(`${prefix} ❌ getChat network error:`, e);
  }
};

// ─── Core sender ──────────────────────────────────────────────────────────────

export const sendMessageToChannel = async (text: string): Promise<boolean> => {
  if (!isTelegramConfigured()) {
    console.warn("[TelegramService] Not configured. Message skipped:", text);
    return false;
  }
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHANNEL_ID,
          text,
          parse_mode: "HTML",
        }),
      },
    );
    if (!res.ok) {
      const err = await res.json();
      console.error("[TelegramService] API error:", err);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[TelegramService] Network error:", e);
    return false;
  }
};

// ─── Domain helpers ────────────────────────────────────────────────────────────

export const sendPlanToChannel = async (plan: Plan): Promise<boolean> => {
  const priorityEmoji =
    plan.priority === "high" ? "🔴" : plan.priority === "medium" ? "🟡" : "🟢";
  const statusEmoji =
    plan.status === "completed"
      ? "✅"
      : plan.status === "cancelled"
        ? "❌"
        : "📋";

  const text = [
    `${statusEmoji} <b>${plan.title}</b>`,
    plan.description ? `📝 ${plan.description}` : "",
    `📅 ${plan.date}${plan.time ? ` о ${plan.time}` : ""}`,
    `${priorityEmoji} Пріоритет: ${
      plan.priority === "high"
        ? "Високий"
        : plan.priority === "medium"
          ? "Середній"
          : "Низький"
    }`,
    plan.category ? `🏷️ Категорія: ${plan.category}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return sendMessageToChannel(text);
};

export const sendSalaryPayoutNotification = async (
  amount: number,
  source: string,
  date: string,
): Promise<boolean> => {
  const text = `💸 <b>Виплата зарплати</b>\n💰 Сума: ${amount} ₴\n🏢 Джерело: ${source}\n📅 Дата: ${date}`;
  return sendMessageToChannel(text);
};

export const sendEarningsNotification = async (
  totalAmount: number,
  date: string,
): Promise<boolean> => {
  const text = `📦 <b>Заробіток по тарі</b>\n💰 Сума: ${totalAmount} ₴\n📅 Дата: ${date}`;
  return sendMessageToChannel(text);
};

// ─── Today's plans reminder ────────────────────────────────────────────────────

export const sendTodayPlansReminder = async (
  plans: Plan[],
): Promise<boolean> => {
  if (plans.length === 0) {
    return sendMessageToChannel(
      `🔔 <b>Нагадування на сьогодні</b>\n\n📭 Активних планів на сьогодні немає.`,
    );
  }

  const priorityEmoji = (p: Plan["priority"]) =>
    p === "high" ? "🔴" : p === "medium" ? "🟡" : "🟢";

  const lines = plans.map((plan) => {
    const time = plan.time ? ` о ${plan.time}` : "";
    const cat = plan.category ? ` [${plan.category}]` : "";
    return `${priorityEmoji(plan.priority)} <b>${plan.title}</b>${cat}${time}${plan.description ? `\n    📝 ${plan.description}` : ""}`;
  });

  const text = [
    `🔔 <b>Нагадування на сьогодні</b>`,
    `📅 Активних планів: ${plans.length}`,
    ``,
    ...lines,
  ].join("\n");

  return sendMessageToChannel(text);
};
