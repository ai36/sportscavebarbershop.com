import type { BookingNotification } from "./types";
import { sendTelegramNotification } from "./telegram";

/**
 * Fan-out point for booking alerts. Telegram is the only channel today; add
 * a WhatsApp sender in this file (e.g. `sendWhatsAppNotification`) and
 * include it below when that integration is ready — the booking flow and
 * API route don't need to change.
 *
 * Each channel is isolated: a failing channel is logged, not thrown, so it
 * never fails the booking itself (the DB row is already committed by then).
 */
export async function notifyNewBooking(
  details: BookingNotification,
): Promise<void> {
  const channels = [sendTelegramNotification];

  await Promise.all(
    channels.map((send) =>
      send(details).catch((error) =>
        console.error("[notify] channel failed", error),
      ),
    ),
  );
}

export type { BookingNotification };
