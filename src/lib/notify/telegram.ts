import type { BookingNotification } from "./types";

/**
 * Sends the new-booking alert to Telegram. TELEGRAM_BOT_TOKEN /
 * TELEGRAM_CHAT_ID are intentionally left blank in .env.local until a real
 * bot exists (see docs/business-requirements.md) — until then this just
 * logs and returns, so bookings still succeed.
 */
export async function sendTelegramNotification(
  details: BookingNotification,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("[notify:telegram] not configured, skipping", details.id);
    return;
  }

  const text = [
    "🪒 New booking — Sports Cave Barbershop",
    `Service: ${details.serviceName}`,
    `Barber: ${details.masterName}`,
    `When: ${details.date} at ${details.time}`,
    `Client: ${details.customerName} (${details.customerPhone})`,
  ].join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    },
  );

  if (!response.ok) {
    throw new Error(`Telegram API responded with ${response.status}`);
  }
}
