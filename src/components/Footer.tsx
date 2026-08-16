import siteConfig from "@/data/site-config.json";
import { Developer } from "@/components/developer/Developer";

export function Footer() {
  return (
    <>
      <footer className="mt-auto w-full border-t border-surface-variant bg-surface-container-lowest">
        <div className="mx-auto flex max-w-container-max flex-col gap-gutter px-margin-mobile py-12 md:flex-row md:items-start md:justify-between md:px-margin-desktop">
          <div className="flex flex-col gap-2">
            <span className="font-display text-headline-md uppercase tracking-tighter text-on-surface">
              {siteConfig.shortName}
            </span>
            <p className="text-label-sm font-label uppercase text-on-surface-variant">
              &copy; {siteConfig.established}&ndash;Present{" "}
              {siteConfig.brandName}. All rights reserved.
            </p>
            <p className="max-w-sm text-body-md text-on-surface-variant">
              {siteConfig.phone} &middot; {siteConfig.address}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <span className="border-b border-surface-variant pb-2 text-label-sm font-label uppercase tracking-widest text-on-surface-variant">
              Serving
            </span>
            <div className="flex flex-wrap gap-2">
              {siteConfig.areas.map((area) => (
                <span
                  key={area}
                  className="border border-surface-variant bg-surface-container px-3 py-1 text-label-sm font-label uppercase text-on-surface-variant"
                >
                  {area}
                </span>
              ))}
            </div>
            <span className="text-label-sm font-label uppercase text-on-surface-variant">
              {siteConfig.region}
            </span>
          </div>
        </div>
      </footer>
      <Developer />
    </>
  );
}
