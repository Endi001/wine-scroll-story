import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import heroVideo from "@/assets/hero-wine.mp4.asset.json";

export function ScrollVideoHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const targetTime = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onMeta = () => setDuration(video.duration || 0);
    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();
    return () => video.removeEventListener("loadedmetadata", onMeta);
  }, []);

  useEffect(() => {
    if (!duration) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const tick = () => {
      const current = video.currentTime;
      const diff = targetTime.current - current;
      if (Math.abs(diff) > 0.02) {
        video.currentTime = current + diff * 0.15;
        rafId.current = requestAnimationFrame(tick);
      } else {
        rafId.current = null;
      }
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;
      targetTime.current = progress * (duration - 0.05);
      if (rafId.current == null) rafId.current = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [duration]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "220vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src={heroVideo.url}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="mb-6 animate-fade-up text-xs uppercase tracking-[0.4em] text-accent">
            Est. 1897 &middot; Bordeaux
          </p>
          <h1 className="animate-hero-in font-display text-5xl leading-[1.05] text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
            Wine is for those <br />
            <span className="italic text-accent">who love to live.</span>
          </h1>
          <p className="mt-8 max-w-xl animate-fade-up text-base text-muted-foreground sm:text-lg [animation-delay:400ms]">
            Slow-crafted vintages from a single family estate. Poured for long
            evenings, honest conversations, and everything worth remembering.
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-accent/80">
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
