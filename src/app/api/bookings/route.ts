import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db/client";
import { bookings } from "@/lib/db/schema";
import { getSlotsForDate } from "@/lib/business-hours";
import { notifyNewBooking } from "@/lib/notify";
import servicesData from "@/data/services.json";
import mastersData from "@/data/masters.json";
import type { Service, Master } from "@/lib/types";

const services = servicesData as Service[];
const masters = mastersData as Master[];

interface BookingRequestBody {
  serviceId: string;
  masterId: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
}

function isPostgresUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

export async function POST(request: NextRequest) {
  let body: BookingRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    serviceId,
    masterId,
    date,
    time,
    customerName,
    customerPhone,
    customerEmail,
  } = body;

  if (
    !serviceId ||
    !masterId ||
    !date ||
    !time ||
    !customerName ||
    !customerPhone
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const service = services.find((s) => s.id === serviceId);
  const master = masters.find((m) => m.id === masterId);
  if (!service || !master) {
    return NextResponse.json(
      { error: "Unknown service or barber" },
      { status: 400 },
    );
  }

  const validSlots = getSlotsForDate(date);
  if (!validSlots.includes(time)) {
    return NextResponse.json(
      { error: "That time is outside business hours for the selected date." },
      { status: 400 },
    );
  }

  const id = randomUUID();

  try {
    const db = getDb();
    await db.insert(bookings).values({
      id,
      serviceId,
      masterId,
      bookingDate: date,
      bookingTime: time,
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
    });
  } catch (error) {
    if (isPostgresUniqueViolation(error)) {
      return NextResponse.json(
        { error: "That slot was just taken. Please pick another time." },
        { status: 409 },
      );
    }
    console.error("[api/bookings] insert failed", error);
    return NextResponse.json(
      { error: "Booking database is not configured yet." },
      { status: 503 },
    );
  }

  await notifyNewBooking({
    id,
    serviceName: service.name,
    masterName: master.name,
    date,
    time,
    customerName,
    customerPhone,
  });

  return NextResponse.json({ id, status: "confirmed" }, { status: 201 });
}
