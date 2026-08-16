"use client";

import { useMemo, useState } from "react";
import Fuse, { type FuseResultMatch } from "fuse.js";
import Link from "next/link";
import { Search } from "lucide-react";
import { SEARCH_RECORDS, type SearchRecord } from "@/lib/search-index";

type Ranges = ReadonlyArray<readonly [number, number]>;

function Highlight({ text, ranges }: { text: string; ranges?: Ranges }) {
  if (!ranges || ranges.length === 0) return <>{text}</>;
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  ranges.forEach(([start, end], i) => {
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(
      <mark
        key={`${start}-${i}`}
        className="rounded-[2px] bg-accent/20 px-0.5 text-accent"
      >
        {text.slice(start, end + 1)}
      </mark>,
    );
    cursor = end + 1;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

function rangesFor(
  matches: readonly FuseResultMatch[] | undefined,
  key: keyof SearchRecord,
): Ranges | undefined {
  return matches?.find((m) => m.key === key)?.indices;
}

/** Trim long content to a window around the first match. */
function snippet(text: string, ranges?: Ranges) {
  const first = ranges?.[0]?.[0] ?? 0;
  const start = Math.max(0, first - 60);
  const end = Math.min(text.length, start + 220);
  const sliced = text.slice(start, end);
  const shifted: Ranges | undefined = ranges
    ?.filter(([s, e]) => s >= start && e < end)
    .map(([s, e]) => [s - start, e - start] as const);
  return {
    text: `${start > 0 ? "…" : ""}${sliced}${end < text.length ? "…" : ""}`,
    ranges: shifted?.map(
      ([s, e]) => [s + (start > 0 ? 1 : 0), e + (start > 0 ? 1 : 0)] as const,
    ),
  };
}

export function SiteSearch() {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(SEARCH_RECORDS, {
        includeMatches: true,
        threshold: 0.34,
        ignoreLocation: true,
        minMatchCharLength: 2,
        keys: [
          { name: "title", weight: 3 },
          { name: "description", weight: 2 },
          { name: "content", weight: 1 },
        ],
      }),
    [],
  );

  const trimmed = query.trim();
  const results = useMemo(
    () => (trimmed.length < 2 ? [] : fuse.search(trimmed).slice(0, 8)),
    [fuse, trimmed],
  );

  return (
    <div>
      <div className="group relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the estate…"
          aria-label="Search the site"
          className="w-full rounded-sm border border-border/60 bg-card/40 py-5 pl-14 pr-5 text-base text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-300 focus:border-accent/70 focus:bg-card/60"
        />
      </div>

      {trimmed.length >= 2 && (
        <div className="mt-6 animate-fade-up">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {results.length === 0
              ? "No results"
              : `${results.length} result${results.length > 1 ? "s" : ""}`}
          </p>

          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing matched &ldquo;{trimmed}&rdquo;. Try &ldquo;discount&rdquo;,
              &ldquo;bottle&rdquo; or &ldquo;visit&rdquo;.
            </p>
          ) : (
            <ul className="divide-y divide-border/40 border-y border-border/40">
              {results.map(({ item, matches }) => {
                const body = snippet(item.content, rangesFor(matches, "content"));
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="group block py-5 transition-colors hover:bg-card/40"
                    >
                      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-accent/80">
                        {item.section}
                      </p>
                      <p className="mt-2 font-display text-2xl text-foreground transition-colors group-hover:text-accent">
                        <Highlight
                          text={item.title}
                          ranges={rangesFor(matches, "title")}
                        />
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        <Highlight text={body.text} ranges={body.ranges} />
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
