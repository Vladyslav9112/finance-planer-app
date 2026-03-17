const getBotToken = () => process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN || "";
const getChannelId = () => process.env.TELEGRAM_CHANNEL_ID || process.env.VITE_TELEGRAM_CHANNEL_ID || "";
export async function sendMessageToChannel(text) {
    const botToken = getBotToken();
    const chatId = getChannelId();
    if (!botToken || !chatId) {
        throw new Error("Telegram env vars are missing");
    }
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.description || `Telegram API failed with status ${response.status}`);
    }
    return payload;
}
