import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { TopBar } from "@/components/site/TopBar";
import { ScrollVideoHero } from "@/components/site/ScrollVideoHero";
import { AboutSection } from "@/components/site/AboutSection";
import { ContactSection } from "@/components/site/ContactSection";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main>
        <ScrollVideoHero />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <Toaster theme="dark" position="bottom-center" />
    </div>
  );
}
