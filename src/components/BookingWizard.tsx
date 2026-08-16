"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { format, parseISO, startOfDay } from "date-fns";
import servicesData from "@/data/services.json";
import mastersData from "@/data/masters.json";
import { getSlotsForDate } from "@/lib/business-hours";
import type { Service, Master } from "@/lib/types";

const services = servicesData as Service[];
const masters = mastersData as Master[];

const STEPS = ["Service", "Barber", "Time", "Details"] as const;

function isDayClosed(day: Date) {
  return getSlotsForDate(format(day, "yyyy-MM-dd")).length === 0;
}

/** Skips forward from `from` to the first day the salon is open (bounded — the schedule always has open days within a week). */
function nextOpenDay(from: Date): string {
  const day = new Date(from);
  for (let i = 0; i < 14; i++) {
    if (!isDayClosed(day)) return format(day, "yyyy-MM-dd");
    day.setDate(day.getDate() + 1);
  }
  return format(from, "yyyy-MM-dd");
}

export function BookingWizard() {
  const searchParams = useSearchParams();

  const [serviceId, setServiceId] = useState(searchParams.get("service") ?? "");
  const [masterId, setMasterId] = useState(searchParams.get("master") ?? "");
  const [date, setDate] = useState(() => nextOpenDay(new Date()));
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [step, setStep] = useState(() => {
    if (!searchParams.get("service")) return 0;
    if (!searchParams.get("master")) return 1;
    return 2;
  });

  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const selectedService = services.find((s) => s.id === serviceId);
  const selectedMaster = masters.find((m) => m.id === masterId);

  useEffect(() => {
    if (step !== 2 || !masterId || !date) return;
    let cancelled = false;

    async function loadSlots() {
      // Fetch-in-effect: setState calls below run after the async gap, on
      // purpose, so this is a subscribe-style effect rather than a
      // synchronous-render-in-effect anti-pattern.
      setSlotsLoading(true);
      setSlotsError(null);
      setTime("");
      try {
        const res = await fetch(
          `/api/availability?masterId=${masterId}&date=${date}`,
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load times");
        if (!cancelled) setSlots(data.slots ?? []);
      } catch (err) {
        if (!cancelled)
          setSlotsError(
            err instanceof Error ? err.message : "Failed to load times",
          );
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    }

    void loadSlots();
    return () => {
      cancelled = true;
    };
  }, [step, masterId, date]);

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(serviceId);
    if (step === 1) return Boolean(masterId);
    if (step === 2) return Boolean(time);
    return Boolean(name && phone);
  }, [step, serviceId, masterId, time, name, phone]);

  async function submitBooking() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          masterId,
          date,
          time,
          customerName: name,
          customerPhone: phone,
          customerEmail: email || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setStep(2);
        }
        throw new Error(data.error ?? "Something went wrong");
      }
      setConfirmed(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 text-center">
        <h1 className="font-display text-headline-lg-mobile uppercase tracking-tighter text-primary md:text-headline-lg">
          You&apos;re On the Board
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          {selectedService?.name} with {selectedMaster?.name} &mdash; {date} at{" "}
          {time}. We&apos;ll be in touch at {phone} to confirm.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12">
      <div className="flex w-full max-w-3xl flex-col items-center gap-6">
        <h1 className="text-center font-display text-headline-lg-mobile uppercase tracking-tighter text-on-surface md:text-headline-lg">
          Draft Your <span className="text-primary">Starting Lineup</span>
        </h1>
        <ol className="relative flex w-full items-center justify-between">
          <div className="absolute left-0 top-1/2 z-0 h-1 w-full -translate-y-1/2 rounded-full bg-surface-variant" />
          <div
            className="absolute left-0 top-1/2 z-0 h-1 -translate-y-1/2 rounded-full bg-primary-container transition-all duration-300"
            style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map((label, i) => (
            <li
              key={label}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-label text-label-sm ${
                  i <= step
                    ? "bg-primary-container text-white"
                    : "border border-surface-variant bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`font-label text-label-sm uppercase ${
                  i <= step ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {step === 0 && (
        <div className="grid w-full grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setServiceId(service.id)}
              className={`flex flex-col gap-4 border-t border-l p-6 text-left transition-colors ${
                serviceId === service.id
                  ? "border-primary ring-1 ring-primary bg-surface-container-high"
                  : "border-surface-variant/50 bg-surface-container hover:border-primary"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-headline-md uppercase tracking-tight text-on-surface">
                  {service.name}
                </h3>
                <span className="rounded bg-surface-container-lowest px-2 py-1 font-label text-label-sm text-on-surface">
                  ${service.price}
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant">
                {service.description}
              </p>
              <span className="font-label text-label-sm uppercase text-on-surface-variant">
                {service.durationMinutes} min
              </span>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="grid w-full grid-cols-1 gap-gutter md:grid-cols-3">
          {masters.map((master) => (
            <button
              key={master.id}
              type="button"
              onClick={() => setMasterId(master.id)}
              className={`flex flex-col gap-3 border p-6 text-left transition-colors ${
                masterId === master.id
                  ? "border-primary ring-1 ring-primary bg-surface-container-high"
                  : "border-surface-variant bg-surface-container hover:border-primary"
              }`}
            >
              <h3 className="font-display text-headline-md uppercase tracking-tight text-on-surface">
                {master.name}
              </h3>
              <span className="font-label text-label-sm uppercase text-on-surface-variant">
                {master.title} &middot; {master.experienceYears} Yrs Exp
              </span>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="flex w-full max-w-3xl flex-col gap-8 md:flex-row md:items-start md:justify-center">
          <div className="flex flex-col gap-2">
            <span className="font-label text-label-sm uppercase text-on-surface-variant">
              Date
            </span>
            <DayPicker
              mode="single"
              selected={parseISO(date)}
              onSelect={(d) => d && setDate(format(d, "yyyy-MM-dd"))}
              disabled={[{ before: startOfDay(new Date()) }, isDayClosed]}
              className="border border-surface-variant bg-surface-container-low p-4"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <span className="font-label text-label-sm uppercase text-on-surface-variant">
              Available times
            </span>
            {slotsLoading && (
              <p className="text-body-md text-on-surface-variant">
                Loading&hellip;
              </p>
            )}
            {slotsError && (
              <p className="text-body-md text-error">{slotsError}</p>
            )}
            {!slotsLoading && !slotsError && slots.length === 0 && (
              <p className="text-body-md text-on-surface-variant">
                No openings that day &mdash; try another date.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`btn-press border px-4 py-2 font-label text-label-sm ${
                    time === slot
                      ? "border-primary bg-primary text-on-primary"
                      : "border-surface-variant bg-surface-container-highest text-on-surface hover:border-primary"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex w-full max-w-xl flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-label text-label-sm uppercase text-on-surface-variant">
              Name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-surface-variant bg-surface-container-low px-4 py-3 text-on-surface focus:border-primary focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-label text-label-sm uppercase text-on-surface-variant">
              Phone
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-surface-variant bg-surface-container-low px-4 py-3 text-on-surface focus:border-primary focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-label text-label-sm uppercase text-on-surface-variant">
              Email (optional)
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-surface-variant bg-surface-container-low px-4 py-3 text-on-surface focus:border-primary focus:outline-none"
            />
          </label>
          <div className="border border-surface-variant bg-surface-container-low p-4 text-body-md text-on-surface-variant">
            {selectedService?.name} with {selectedMaster?.name} &mdash; {date}{" "}
            at {time}
          </div>
          {submitError && (
            <p className="text-body-md text-error">{submitError}</p>
          )}
        </div>
      )}

      <div className="flex w-full max-w-5xl justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="font-label text-label-sm uppercase text-on-surface-variant disabled:opacity-0"
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => setStep((s) => s + 1)}
            className="btn-press flex items-center gap-2 bg-primary-container px-8 py-4 font-display text-[20px] uppercase tracking-wider text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            disabled={!canContinue || submitting}
            onClick={submitBooking}
            className="btn-press flex items-center gap-2 bg-primary-container px-8 py-4 font-display text-[20px] uppercase tracking-wider text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Booking…" : "Confirm Booking"}
          </button>
        )}
      </div>
    </div>
  );
}
