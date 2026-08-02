import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "Our Story" },
  { id: "contact", label: "Contact" },
];

export function SectionRail() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.01, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
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
      className="fixed right-8 top-1/2 z-40 hidden -translate-y-1/2 animate-fade-up lg:block"
    >
      <ul className="flex flex-col gap-6">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => jump(s.id)}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center justify-end gap-3 motion-safe:transition-colors"
              >
                <span
                  className={`text-[10px] uppercase tracking-[0.3em] motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out ${
                    isActive
                      ? "text-accent opacity-100"
                      : "text-muted-foreground opacity-50 group-hover:opacity-100"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`h-px motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out ${
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
