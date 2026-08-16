function initials(name: string) {
  return name
    .replace(/"[^"]*"/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/**
 * Stands in for real barber/hero photography (none exists yet — see
 * docs/business-requirements.md). Deliberately styled, not a broken <img>.
 */
export function PortraitPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest">
      <span className="font-display text-display-lg text-surface-variant">
        {initials(name)}
      </span>
    </div>
  );
}
