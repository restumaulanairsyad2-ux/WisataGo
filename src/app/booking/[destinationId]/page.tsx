import { notFound } from "next/navigation";
import { BookingPageContent } from "@/components/booking-page";
import { destinations } from "@/lib/destinations";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default async function BookingPage({ params }: { params: Promise<{ destinationId: string }> }) {
  const { destinationId } = await params;
  const initial = destinations.find((item) => item.slug === destinationId) ?? null;
  if (!initial && !isSupabaseConfigured) notFound();
  return <BookingPageContent slug={destinationId} initial={initial} />;
}
