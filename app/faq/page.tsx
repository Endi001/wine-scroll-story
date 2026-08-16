import type { Metadata } from "next";
import { TopBar } from "@/components/site/TopBar";
import { FaqSection } from "@/components/site/FaqSection";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "FAQ & Search — Maison Noir",
  description:
    "Search Maison Noir instantly and read answers on ordering, bulk discounts, our Médoc estate and visiting us in Pauillac.",
  openGraph: {
    title: "FAQ & Search — Maison Noir",
    description:
      "Instant search across the estate, plus answers on ordering, bulk discounts and visiting Pauillac.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "FAQ & Search — Maison Noir",
    description:
      "Instant search across the estate, plus answers on ordering, bulk discounts and visiting Pauillac.",
  },
};

export default function FaqPage() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="pt-24">
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  );
}
