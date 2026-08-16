import {
  pgTable,
  text,
  date,
  time,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * One row per confirmed booking. The unique index on (master, date, time) is
 * the only thing that prevents double-booking on v1 — see
 * docs/architecture.md for why duration-based overlap checking was deferred.
 */
export const bookings = pgTable(
  "bookings",
  {
    id: text("id").primaryKey(),
    serviceId: text("service_id").notNull(),
    masterId: text("master_id").notNull(),
    bookingDate: date("booking_date").notNull(),
    bookingTime: time("booking_time").notNull(),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerEmail: text("customer_email"),
    status: text("status").notNull().default("confirmed"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("bookings_master_date_time_idx").on(
      table.masterId,
      table.bookingDate,
      table.bookingTime,
    ),
  ],
);

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
