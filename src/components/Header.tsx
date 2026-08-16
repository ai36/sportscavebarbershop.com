"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import siteConfig from "@/data/site-config.json";

const desktopLinks = [
  { href: "/services", label: "Services" },
  { href: "/team", label: "Team" },
];

// Full-screen menu doubles as a roster call sheet — each row reuses the
// tagline that page already carries elsewhere on the site, so the mobile
// nav reads as this brand's, not a stock hamburger dropdown.
const rosterLinks = [
  { href: "/", label: "Home", tagline: "Game-Day Ready" },
  { href: "/services", label: "Services", tagline: "The Playbook" },
  { href: "/team", label: "Team", tagline: "The Roster" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close the takeover on navigation. Adjusting state during render (React's
  // documented pattern for "reset when a prop changes") instead of an
  // effect — no extra commit, and it sidesteps the set-state-in-effect rule.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-variant bg-background">
      <div className="mx-auto flex max-w-container-max items-center justify-between px-margin-mobile py-4 md:px-margin-desktop">
        <Link
          href="/"
          className="font-display text-headline-md uppercase tracking-tighter text-primary"
        >
          {siteConfig.shortName}
        </Link>

        <nav className="hidden items-center gap-gutter md:flex">
          {desktopLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 pb-1 text-body-md transition-colors ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/book"
            className="btn-press hidden bg-primary-container px-6 py-3 font-label text-label-sm uppercase tracking-wider text-on-primary-container shadow-[2px_2px_0_0_var(--color-outline)] transition-colors hover:brightness-110 md:inline-block"
          >
            Book Now
          </Link>
          <button
            type="button"
            className="font-label text-label-sm uppercase tracking-widest text-on-surface md:hidden"
            aria-expanded={open}
            aria-controls="roster-menu"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
        </div>
      </div>

      {/* Full-screen takeover, not a dropdown — self-contained so it never
          has to align pixel-for-pixel with the sticky header above it. */}
      <div
        id="roster-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-0 z-50 flex flex-col bg-background transition-transform duration-200 ease-out md:hidden ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
        inert={open ? undefined : true}
      >
        <div className="flex items-center justify-between border-b border-surface-variant px-margin-mobile py-4">
          <span className="font-display text-headline-md uppercase tracking-tighter text-primary">
            {siteConfig.shortName}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setOpen(false)}
            className="font-label text-label-sm uppercase tracking-widest text-on-surface"
          >
            Close
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-3 overflow-y-auto p-margin-mobile">
          <span className="mb-1 font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
            The Roster
          </span>
          {rosterLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`beveled-edge flex items-baseline justify-between border px-4 py-4 transition-colors ${
                  active
                    ? "border-primary bg-surface-container-high"
                    : "border-surface-variant bg-surface-container"
                }`}
              >
                <span className="font-display text-headline-md uppercase tracking-tight text-on-surface">
                  {link.label}
                </span>
                <span className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
                  {link.tagline}
                </span>
              </Link>
            );
          })}

          <Link
            href="/book"
            className="mt-auto btn-press flex items-center justify-between bg-primary-container px-4 py-4 text-on-primary-container shadow-[2px_2px_0_0_var(--color-outline)]"
          >
            <span className="font-display text-headline-md uppercase tracking-tight">
              Book Now
            </span>
            <span className="font-label text-label-sm uppercase tracking-widest">
              Draft Your Lineup
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
