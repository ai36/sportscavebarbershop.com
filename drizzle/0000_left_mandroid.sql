CREATE TABLE "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"master_id" text NOT NULL,
	"booking_date" date NOT NULL,
	"booking_time" time NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_email" text,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_master_date_time_idx" ON "bookings" USING btree ("master_id","booking_date","booking_time");