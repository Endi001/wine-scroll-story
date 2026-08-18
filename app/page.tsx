import { TopBar } from "@/components/site/TopBar";
import { ScrollVideoHero } from "@/components/site/ScrollVideoHero";
import { AboutSection } from "@/components/site/AboutSection";
import { ContactSection } from "@/components/site/ContactSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SectionRail } from "@/components/site/SectionRail";
import { Logos3 } from "@/components/ui/logos3";

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SectionRail />
      <main>
        <ScrollVideoHero />
        <Logos3 className="border-t border-border/40 py-16" />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
