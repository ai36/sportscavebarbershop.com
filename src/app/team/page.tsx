import type { Metadata } from "next";
import { MasterCard } from "@/components/MasterCard";
import masters from "@/data/masters.json";
import type { Master } from "@/lib/types";

export const metadata: Metadata = {
  title: "The Roster | Sports Cave Barbershop",
};

export default function TeamPage() {
  return (
    <main className="mx-auto w-full max-w-container-max px-margin-mobile py-16 md:px-margin-desktop md:py-24">
      <header className="mb-16 border-b border-surface-variant pb-8 md:mb-24">
        <h1 className="mb-4 font-display text-headline-lg-mobile uppercase tracking-tighter text-primary md:text-display-lg">
          The Roster
        </h1>
        <p className="max-w-2xl text-body-lg text-on-surface-variant">
          Meet the heavy hitters. Our barbers combine years of precision
          experience with an uncompromising dedication to their craft. Choose
          your player.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
        {(masters as Master[]).map((master) => (
          <MasterCard key={master.id} master={master} />
        ))}
      </div>
    </main>
  );
}
