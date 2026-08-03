"use client";

import { useEffect, useRef, useState } from "react";

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

export function AboutSection() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="about" className="relative border-t border-border/40 py-32">
      <div
        ref={ref}
        className={`mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2 md:gap-24 ${
          visible ? "animate-fade-up" : "opacity-0"
        }`}
      >
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-accent">
            Our story
          </p>
          <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
            Five generations of <span className="italic text-accent">patient hands.</span>
          </h2>
        </div>
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:pt-6">
          <p>
            Founded in 1897 on a quiet slope in the Médoc, Maison Noir began
            with a single row of Cabernet Sauvignon and a promise: that wine
            should be made slowly, honestly, and only when the vintage deserved
            it.
          </p>
          <p>
            Today the estate remains family-run. Every bottle is still hand-
            picked, foot-trodden into oak, and cellared for a minimum of
            eighteen months before it is allowed to leave our door.
          </p>
          <p>
            We do not chase trends. We chase evenings that stretch a little
            longer than they should.
          </p>
        </div>
      </div>
    </section>
  );
}
