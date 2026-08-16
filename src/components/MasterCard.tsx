import Image from "next/image";
import Link from "next/link";
import type { Master } from "@/lib/types";
import { PortraitPlaceholder } from "./PortraitPlaceholder";

export function MasterCard({ master }: { master: Master }) {
  const firstName = master.name.split(/[\s"]+/).find(Boolean) ?? master.name;

  return (
    <article className="beveled-edge group flex flex-col overflow-hidden border border-surface-variant bg-surface-container">
      <div className="relative h-80 w-full bg-surface-container-high">
        {master.photo ? (
          <Image
            src={master.photo}
            alt={master.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
          />
        ) : (
          <PortraitPlaceholder name={master.name} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
        <div className="absolute inset-x-4 bottom-4">
          <span className="mb-2 inline-block border border-surface-variant bg-surface-container-highest px-2 py-1 text-label-sm font-label uppercase text-primary">
            {master.title}
          </span>
          <h2 className="font-display text-headline-md uppercase tracking-tight text-on-surface">
            {master.name}
          </h2>
        </div>
      </div>

      <div className="flex flex-grow flex-col justify-between p-6">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {master.specialties.map((s) => (
              <span
                key={s}
                className="border border-surface-variant bg-surface-container-low px-2 py-1 text-label-sm font-label uppercase text-on-surface-variant"
              >
                {s}
              </span>
            ))}
            <span className="border border-surface-variant bg-surface-container-low px-2 py-1 text-label-sm font-label uppercase text-on-surface-variant">
              {master.experienceYears} Yrs Exp
            </span>
          </div>
          <blockquote className="mb-6 border-l-2 border-primary pl-4 italic text-on-surface-variant">
            &ldquo;{master.quote}&rdquo;
          </blockquote>
        </div>
        <Link
          href={`/book?master=${master.id}`}
          className="btn-press mt-auto flex items-center justify-center gap-2 border border-surface-variant bg-surface-container-highest py-4 text-label-sm font-label uppercase tracking-widest text-primary transition-all hover:border-primary hover:bg-surface-bright"
        >
          Book {firstName}
        </Link>
      </div>
    </article>
  );
}
