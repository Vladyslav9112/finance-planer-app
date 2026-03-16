export const appEnv = {
  appName: import.meta.env.VITE_APP_NAME || "My Finance Mini App",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8787/api",
  telegramBotToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
  telegramChannelId: import.meta.env.VITE_TELEGRAM_CHANNEL_ID,
};

