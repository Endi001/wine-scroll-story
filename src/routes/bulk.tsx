import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { BulkCalculator } from "@/components/site/BulkCalculator";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/bulk")({
  head: () => ({
    meta: [
      { title: "Bulk Orders — Maison Noir" },
      {
        name: "description",
        content:
          "Order Maison Noir's estate cuvée by the case. Flat 5% off every bulk order — size your order and see the price update live.",
      },
      { property: "og:title", content: "Bulk Orders — Maison Noir" },
      {
        property: "og:description",
        content:
          "Order Maison Noir's estate cuvée by the case. Flat 5% off every bulk order.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Bulk Orders — Maison Noir" },
      {
        name: "twitter:description",
        content:
          "Order Maison Noir's estate cuvée by the case. Flat 5% off every bulk order.",
      },
    ],
  }),
  component: BulkPage,
});

function BulkPage() {
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
