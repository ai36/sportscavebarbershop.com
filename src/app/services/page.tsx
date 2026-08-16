import type { Metadata } from "next";
import Image from "next/image";
import { ServiceCard } from "@/components/ServiceCard";
import services from "@/data/services.json";
import type { Service, ServiceCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Services & Pricing | Sports Cave Barbershop",
};

const categories: { key: ServiceCategory; label: string }[] = [
  { key: "haircuts", label: "Haircuts" },
  { key: "beard-shaves", label: "Beard & Shaves" },
  { key: "packages", label: "Packages" },
];

export default function ServicesPage() {
  const all = services as Service[];

  return (
    <main className="mx-auto w-full max-w-container-max px-margin-mobile py-16 md:px-margin-desktop md:py-24">
      <header className="mb-16 md:mb-24">
        <h1 className="mb-4 font-display text-headline-lg-mobile uppercase tracking-wide text-on-surface md:text-display-lg">
          Services &amp; Pricing
        </h1>
        <p className="max-w-2xl text-body-lg text-on-surface-variant">
          Premium grooming delivered with precision. Review the playbook below
          and select the upgrade your look requires.
        </p>
      </header>

      <div className="flex flex-col gap-16">
        {categories.map(({ key, label }, index) => {
          const items = all.filter((s) => s.category === key);
          if (items.length === 0) return null;
          return (
            <div key={key} className="flex flex-col gap-16">
              <section id={key}>
                <h2 className="mb-8 border-b border-surface-variant pb-2 font-display text-headline-md uppercase tracking-widest text-primary">
                  {label}
                </h2>
                <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
                  {items.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </section>

              {index === 0 && (
                <div className="relative h-64 w-full overflow-hidden border border-surface-variant md:h-96">
                  <Image
                    src="/images/services-break.jpg"
                    alt="Barber trimming a client's beard with precision shears"
                    fill
                    sizes="100vw"
                    className="object-cover opacity-90 grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
