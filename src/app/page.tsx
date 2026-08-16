import Image from "next/image";
import Link from "next/link";
import { ServiceCard } from "@/components/ServiceCard";
import siteConfig from "@/data/site-config.json";
import services from "@/data/services.json";
import type { Service } from "@/lib/types";

const featured = (services as Service[]).filter((s) =>
  ["mvp-cut", "skin-fade", "full-roster"].includes(s.id),
);

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden border-b border-surface-variant px-margin-mobile md:px-margin-desktop">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative z-10 mx-auto flex w-full max-w-container-max flex-col items-center gap-base text-center">
          <span className="mb-4 inline-block border border-outline-variant bg-surface-container px-4 py-2 text-label-sm font-label uppercase tracking-[0.2em] text-primary">
            Established {siteConfig.established}
          </span>
          <h1 className="mb-6 max-w-4xl font-display text-headline-lg-mobile uppercase leading-none tracking-tight text-on-surface md:text-display-lg">
            Game-Day <span className="block text-primary">Ready</span>
          </h1>
          <p className="mb-8 max-w-2xl text-body-lg text-on-surface-variant">
            Premium grooming for the modern man. Step into the cave, gear up,
            and walk out ready for whatever the day throws at you.
          </p>
          <Link
            href="/book"
            className="btn-press bg-primary px-8 py-4 font-display text-headline-md uppercase tracking-wider text-on-primary shadow-[4px_4px_0_0_var(--color-outline-variant)] transition-colors hover:brightness-110"
          >
            Book Your Cut
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-container-max px-margin-mobile py-16 md:px-margin-desktop md:py-24">
        <div className="mb-12 flex flex-col gap-base border-b border-surface-variant pb-4">
          <h2 className="font-display text-headline-lg uppercase tracking-tighter text-on-surface">
            Services
          </h2>
          <p className="text-label-sm font-label uppercase tracking-widest text-on-surface-variant">
            The Playbook
          </p>
        </div>
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="text-label-sm font-label uppercase tracking-widest text-primary hover:underline"
          >
            View full menu &amp; pricing &rarr;
          </Link>
        </div>
      </section>

      <section className="w-full border-t border-surface-variant bg-surface-container-lowest px-margin-mobile py-16 md:px-margin-desktop md:py-24">
        <div className="mx-auto flex max-w-container-max flex-col items-center gap-6 text-center">
          <h2 className="font-display text-headline-lg-mobile uppercase tracking-tighter text-on-surface md:text-headline-lg">
            Choose Your Player
          </h2>
          <p className="max-w-2xl text-body-lg text-on-surface-variant">
            Meet the master barbers behind the chair and pick who drafts your
            next look.
          </p>
          <Link
            href="/team"
            className="btn-press border border-surface-variant bg-surface-container-highest px-6 py-3 text-label-sm font-label uppercase tracking-wider text-on-surface transition-all hover:border-primary hover:bg-primary hover:text-on-primary"
          >
            Meet the Roster
          </Link>
        </div>
      </section>
    </>
  );
}
