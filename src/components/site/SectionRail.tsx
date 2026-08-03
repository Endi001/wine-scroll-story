"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "Our Story" },
  { id: "contact", label: "Contact" },
];

export function SectionRail() {
  const [active, setActive] = useState("hero");
  const activeRef = useRef("hero");
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      rafId.current = null;
      const anchor = window.innerHeight * 0.4;
      let current = SECTIONS[0].id;

      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= anchor) current = s.id;
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) current = SECTIONS[SECTIONS.length - 1].id;

      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
      }
    };

    const onScroll = () => {
      if (rafId.current == null) rafId.current = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-4 top-1/2 z-40 -translate-y-1/2 animate-fade-up lg:right-8"
    >
      <ul className="flex flex-col gap-4 lg:gap-6">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => jump(s.id)}
                aria-label={s.label}
                aria-current={isActive ? "true" : undefined}
                className="group relative flex items-center justify-end gap-3 p-2 lg:p-0"
              >
                {/* Hover tag (small screens only) */}
                <span
                  className={`pointer-events-none absolute right-full mr-1 whitespace-nowrap rounded-full bg-background/80 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-accent opacity-0 backdrop-blur-md motion-safe:translate-x-1 motion-safe:transition-all motion-safe:duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:group-hover:translate-x-0 motion-safe:group-focus-visible:translate-x-0 lg:hidden`}
                >
                  {s.label}
                </span>

                {/* Dot (small screens) */}
                <span
                  className={`h-2 w-2 rounded-full motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out lg:hidden ${
                    isActive
                      ? "scale-125 bg-accent ring-2 ring-accent/30"
                      : "bg-border/60 group-hover:bg-accent/60"
                  }`}
                />

                {/* Label + tick (large screens) */}
                <span
                  className={`hidden text-[10px] uppercase tracking-[0.3em] motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out lg:inline ${
                    isActive
                      ? "text-accent opacity-100"
                      : "text-muted-foreground opacity-50 group-hover:opacity-100"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`hidden h-px motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out lg:block ${
                    isActive
                      ? "w-10 bg-accent"
                      : "w-4 bg-border/60 group-hover:w-7 group-hover:bg-accent/60"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
