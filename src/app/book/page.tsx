import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingWizard } from "@/components/BookingWizard";

export const metadata: Metadata = {
  title: "Book Now | Sports Cave Barbershop",
};

export default function BookPage() {
  return (
    <main className="mx-auto flex w-full max-w-container-max flex-1 flex-col items-center px-margin-mobile py-12 md:px-margin-desktop md:py-24">
      <Suspense fallback={null}>
        <BookingWizard />
      </Suspense>
    </main>
  );
}
