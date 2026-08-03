import type { Metadata } from "next";
import { TopBar } from "@/components/site/TopBar";
import { BulkCalculator } from "@/components/site/BulkCalculator";
import { SiteFooter } from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "Bulk Orders — Maison Noir",
  description:
    "Order Maison Noir's estate cuvée by the case. Flat 5% off every bulk order — size your order and see the price update live.",
  openGraph: {
    title: "Bulk Orders — Maison Noir",
    description:
      "Order Maison Noir's estate cuvée by the case. Flat 5% off every bulk order.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Bulk Orders — Maison Noir",
    description:
      "Order Maison Noir's estate cuvée by the case. Flat 5% off every bulk order.",
  },
};

export default function BulkPage() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="pt-24">
        <BulkCalculator />
      </main>
      <SiteFooter />
    </div>
  );
}
