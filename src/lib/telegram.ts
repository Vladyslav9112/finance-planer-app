import type { TelegramWebApp } from "../types";

// ─── Telegram WebApp wrapper ──────────────────────────────────────────────────

export const getTelegramWebApp = (): TelegramWebApp | null => {
  return window.Telegram?.WebApp ?? null;
};

export const initTelegram = (): void => {
  const tg = getTelegramWebApp();
  if (!tg) {
    console.warn(
      "[Telegram] WebApp SDK not available — running in browser mode",
    );
    return;
  }
  tg.ready();
  tg.expand();
  console.info("[Telegram] WebApp initialized, platform:", tg.platform);
};

export const getTelegramUser = () => {
  return getTelegramWebApp()?.initDataUnsafe?.user ?? null;
};

export const getTelegramTheme = (): "light" | "dark" => {
  return getTelegramWebApp()?.colorScheme ?? "dark";
};

export const isRunningInTelegram = (): boolean => {
  return Boolean(window.Telegram?.WebApp?.initData);
};

// ─── Main Button helper ───────────────────────────────────────────────────────

export const showMainButton = (text: string, onClick: () => void): void => {
  const tg = getTelegramWebApp();
  if (!tg) return;
  tg.MainButton.text = text;
  tg.MainButton.show();
  tg.MainButton.onClick(onClick);
};

export const hideMainButton = (): void => {
  getTelegramWebApp()?.MainButton.hide();
};
