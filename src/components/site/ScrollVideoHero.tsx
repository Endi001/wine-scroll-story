import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import heroMp4 from "@/assets/hero-wine.mp4.asset.json";
import heroWebm from "@/assets/hero-wine.webm.asset.json";

export function ScrollVideoHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const targetTime = useRef(0);
  const currentSmooth = useRef(0);
  const rafId = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const inView = useRef(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onMeta = () => setDuration(video.duration || 0);
    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();
    // Prime the decoder pipeline (Safari/iOS)
    const prime = () => {
      video.play().then(() => video.pause()).catch(() => {});
    };
    if (video.readyState >= 2) prime();
    else video.addEventListener("loadeddata", prime, { once: true });
    return () => video.removeEventListener("loadedmetadata", onMeta);
  }, []);

  useEffect(() => {
    if (!duration) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const computeTarget = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;
      targetTime.current = progress * (duration - 0.05);
    };

    // Time-based exponential smoothing, locked to display refresh
    const tau = 0.09; // seconds — smaller = snappier, larger = smoother
    const tick = (ts: number) => {
      if (lastTs.current == null) lastTs.current = ts;
      const dt = Math.min((ts - lastTs.current) / 1000, 0.05);
      lastTs.current = ts;

      const alpha = 1 - Math.exp(-dt / tau);
      currentSmooth.current += (targetTime.current - currentSmooth.current) * alpha;

      if (Math.abs(currentSmooth.current - video.currentTime) > 1 / 120) {
        try {
          video.currentTime = currentSmooth.current;
        } catch {
          /* ignore */
        }
      }

      if (inView.current) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        rafId.current = null;
        lastTs.current = null;
      }
    };

    const startLoop = () => {
      if (rafId.current == null) {
        lastTs.current = null;
        rafId.current = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      computeTarget();
      startLoop();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting) startLoop();
      },
      { threshold: 0 },
    );
    io.observe(section);

    computeTarget();
    currentSmooth.current = targetTime.current;
    startLoop();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };
  }, [duration]);

  return (
    <section id="hero" ref={sectionRef} className="relative" style={{ height: "360vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          disableRemotePlayback
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={heroWebm.url} type="video/webm" />
          <source src={heroMp4.url} type="video/mp4" />
        </video>
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
