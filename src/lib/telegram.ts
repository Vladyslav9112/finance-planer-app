import type { Plan } from "../types/entities";
import { appEnv } from "./env";

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  colorScheme?: "light" | "dark";
  themeParams?: Record<string, string>;
  MainButton?: {
    text: string;
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
  };
};

const getTelegram = (): TelegramWebApp | undefined => {
  return (window as Window & { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp;
};

export const initTelegramWebApp = () => {
  const webApp = getTelegram();
  if (!webApp) return null;

  webApp.ready();
  webApp.expand();
  return webApp;
};

export const getTelegramTheme = () => getTelegram()?.colorScheme ?? "dark";

export const sendPlanToChannel = async (plan: Plan) => {
  const endpoint = `${appEnv.apiBaseUrl}/telegram/send-plan`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });

  const parsePayload = async () => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const payload = await parsePayload();

  if (!res.ok || payload?.success === false) {
    const details = [payload?.message, payload?.error, payload?.details].filter(Boolean).join(" | ");
    throw new Error(details || "Не вдалося надіслати план у Telegram-канал");
  }

  return payload;
};
