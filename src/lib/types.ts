export type ServiceCategory = "haircuts" | "beard-shaves" | "packages";

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
  popular?: boolean;
}

export interface Master {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  experienceYears: number;
  quote: string;
  /** Path under /public once real photography exists; null renders the placeholder portrait. */
  photo: string | null;
}

export interface SiteConfig {
  brandName: string;
  shortName: string;
  tagline: string;
  established: string;
  areas: string[];
  region: string;
  phone: string;
  phoneNote: string;
  address: string;
  hours: Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", string>;
  socials: Record<string, string>;
  bookingSlotIntervalMinutes: number;
}
