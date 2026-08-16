import Link from "next/link";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="beveled-edge group flex flex-col justify-between border border-surface-variant bg-surface-container p-6 transition-colors hover:border-primary">
      <div>
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-outline-variant pb-4">
          <h3 className="font-display text-headline-md uppercase tracking-tight text-on-surface transition-colors group-hover:text-primary">
            {service.name}
            {service.popular && (
              <span className="ml-2 align-middle text-[10px] font-label uppercase tracking-widest text-primary">
                Popular
              </span>
            )}
          </h3>
          <span className="whitespace-nowrap bg-surface-container-high px-2 py-1 font-label text-label-sm text-primary">
            ${service.price}
          </span>
        </div>
        <p className="mb-6 text-body-md text-on-surface-variant">
          {service.description}
        </p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-label-sm font-label uppercase text-on-surface-variant">
          {service.durationMinutes} min
        </span>
        <Link
          href={`/book?service=${service.id}`}
          className="btn-press border border-surface-variant bg-surface-container-highest px-4 py-2 text-label-sm font-label uppercase tracking-wider text-on-surface transition-all hover:border-primary hover:bg-primary hover:text-on-primary"
        >
          Select
        </Link>
      </div>
    </div>
  );
}
