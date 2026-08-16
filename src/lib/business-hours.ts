import siteConfig from "@/data/site-config.json";

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function parseClock(clock: string): number {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(clock.trim());
  if (!match) return NaN;
  const [, h, m, meridiem] = match;
  let hours = Number(h);
  const minutes = Number(m);
  if (meridiem.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

/** Parses site-config hour strings like "9:00 AM – 7:00 PM"; returns null when closed. */
function parseRange(
  range: string,
): { openMinutes: number; closeMinutes: number } | null {
  if (/closed/i.test(range)) return null;
  const [start, end] = range.split(/[–-]/).map((s) => s.trim());
  if (!start || !end) return null;
  const openMinutes = parseClock(start);
  const closeMinutes = parseClock(end);
  if (Number.isNaN(openMinutes) || Number.isNaN(closeMinutes)) return null;
  return { openMinutes, closeMinutes };
}

function toHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (totalMinutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Every master shares the salon's business hours (v1 simplification — see
 * docs/architecture.md). Returns "HH:MM" 24h slot start times for a given
 * ISO date, e.g. ["09:00", "09:30", ...], or [] when the salon is closed.
 */
export function getSlotsForDate(isoDate: string): string[] {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return [];

  const dayKey = DAY_KEYS[date.getDay()];
  const range = parseRange(siteConfig.hours[dayKey]);
  if (!range) return [];

  const step = siteConfig.bookingSlotIntervalMinutes;
  const slots: string[] = [];
  for (let t = range.openMinutes; t < range.closeMinutes; t += step) {
    slots.push(toHHMM(t));
  }
  return slots;
}
