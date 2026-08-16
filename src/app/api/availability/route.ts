import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { bookings } from "@/lib/db/schema";
import { getSlotsForDate } from "@/lib/business-hours";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const masterId = searchParams.get("masterId");
  const date = searchParams.get("date");

  if (!masterId || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "masterId and date=YYYY-MM-DD are required" },
      { status: 400 },
    );
  }

  const allSlots = getSlotsForDate(date);
  if (allSlots.length === 0) {
    return NextResponse.json({ slots: [] });
  }

  try {
    const db = getDb();
    const taken = await db
      .select({ time: bookings.bookingTime })
      .from(bookings)
      .where(
        and(
          eq(bookings.masterId, masterId),
          eq(bookings.bookingDate, date),
          eq(bookings.status, "confirmed"),
        ),
      );

    const takenTimes = new Set(taken.map((row) => row.time.slice(0, 5)));
    const slots = allSlots.filter((slot) => !takenTimes.has(slot));
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("[api/availability] failed", error);
    return NextResponse.json(
      { error: "Booking database is not configured yet." },
      { status: 503 },
    );
  }
}
