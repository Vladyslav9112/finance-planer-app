import type { Plan } from "../types";

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = import.meta.env.VITE_TELEGRAM_CHANNEL_ID;

const isTelegramConfigured = () =>
  Boolean(BOT_TOKEN && CHANNEL_ID && BOT_TOKEN !== "" && CHANNEL_ID !== "");

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
