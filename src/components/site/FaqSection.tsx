"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/search-index";
import { SiteSearch } from "@/components/site/SiteSearch";

export function FaqSection() {
  const [open, setOpen] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <section className="relative border-t border-border/40 py-32">
      <div className="mx-auto max-w-3xl px-6">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-accent">Help</p>
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
          Questions, <span className="italic text-accent">answered.</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Ask in your own words — the search understands meaning, not just keywords, and
          ranks every page and answer as you type.
        </p>

        <div className="mt-12">
          <SiteSearch />
        </div>

        <ul className="mt-14 space-y-4">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === item.id;
            return (
              <li
                key={item.id}
                id={item.id}
                className="animate-fade-up scroll-mt-28 rounded-sm border border-border/60 bg-card/40 transition-colors hover:border-accent/40"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left sm:px-8"
                >
                  <span className="font-display text-xl text-foreground sm:text-2xl">
                    {item.question}
                  </span>
                  <Plus
                    className={`h-4 w-4 shrink-0 text-accent transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-7 text-sm leading-relaxed text-muted-foreground sm:px-8">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-14 text-center">
          <button
            type="button"
            className="group inline-flex items-center gap-3 border border-accent/70 bg-transparent px-8 py-4 text-xs uppercase tracking-[0.35em] text-accent transition-all hover:bg-accent hover:text-accent-foreground"
          >
            Have more questions?
            <span className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
