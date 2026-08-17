"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Fuse, { type FuseResultMatch } from "fuse.js";
import Link from "next/link";
import { Loader2, Search, Sparkles } from "lucide-react";
import { SEARCH_RECORDS, type SearchRecord } from "@/lib/search-index";
import { semanticSearch, type SemanticResult } from "@/lib/semantic-search";

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

/** Literal keyword ranges — used to highlight semantic results where the words do appear. */
function literalRanges(text: string, query: string): Ranges | undefined {
  const words = query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 2);
  if (words.length === 0) return undefined;
  const lower = text.toLowerCase();
  const found: Array<readonly [number, number]> = [];
  for (const word of words) {
    let from = 0;
    let at = lower.indexOf(word, from);
    while (at !== -1) {
      found.push([at, at + word.length - 1] as const);
      from = at + word.length;
      at = lower.indexOf(word, from);
    }
  }
  return found.length ? found.sort((a, b) => a[0] - b[0]) : undefined;
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

type Row = {
  key: string;
  section: string;
  title: string;
  href: string;
  body: { text: string; ranges?: Ranges };
  titleRanges?: Ranges;
  score?: number;
};

export function SiteSearch() {
  const [query, setQuery] = useState("");
  const [semantic, setSemantic] = useState<SemanticResult[] | null>(null);
  const [thinking, setThinking] = useState(false);
  const requestId = useRef(0);

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
  const active = trimmed.length >= 2;

  const keywordRows: Row[] = useMemo(() => {
    if (!active) return [];
    return fuse.search(trimmed).slice(0, 6).map(({ item, matches }) => ({
      key: item.id,
      section: item.section,
      title: item.title,
      href: item.href,
      titleRanges: rangesFor(matches, "title"),
      body: snippet(item.content, rangesFor(matches, "content")),
    }));
  }, [active, fuse, trimmed]);

  // Debounced semantic search: embed the query in the browser, rank by cosine
  // distance in the database.
  useEffect(() => {
    if (!active) {
      setSemantic(null);
      setThinking(false);
      return;
    }
    const id = ++requestId.current;
    setThinking(true);
    const timer = setTimeout(() => {
      semanticSearch(trimmed, 6)
        .then((results) => {
          if (requestId.current !== id) return;
          setSemantic(results.filter((r) => r.similarity > 0.12));
        })
        .catch(() => {
          if (requestId.current === id) setSemantic(null);
        })
        .finally(() => {
          if (requestId.current === id) setThinking(false);
        });
    }, 250);
    return () => clearTimeout(timer);
  }, [active, trimmed]);

  const semanticRows: Row[] | null = useMemo(() => {
    if (!semantic) return null;
    return semantic.map((r) => {
      const ranges = literalRanges(r.content, trimmed);
      return {
        key: r.doc_key,
        section: r.section,
        title: r.title,
        href: r.href,
        titleRanges: literalRanges(r.title, trimmed),
        body: snippet(r.content, ranges),
        score: r.similarity,
      };
    });
  }, [semantic, trimmed]);

  // Semantic ranking wins once it lands; keyword results keep the page useful
  // while the model loads or if the backend is unreachable.
  const rows = semanticRows ?? keywordRows;
  const isSemantic = semanticRows !== null;

  return (
    <div>
      <div className="group relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything — “can tourists visit?”"
          aria-label="Search the site"
          className="w-full rounded-sm border border-border/60 bg-card/40 py-5 pl-14 pr-14 text-base text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-300 focus:border-accent/70 focus:bg-card/60"
        />
        {thinking && (
          <Loader2 className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-accent/80" />
        )}
      </div>

      {active && (
        <div className="mt-6 animate-fade-up">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {rows.length === 0
                ? "No results"
                : `${rows.length} result${rows.length > 1 ? "s" : ""}`}
            </p>
            {isSemantic && rows.length > 0 && (
              <p className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-accent/80">
                <Sparkles className="h-3 w-3" />
                Meaning-based
              </p>
            )}
          </div>

          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing matched &ldquo;{trimmed}&rdquo;. Try &ldquo;discount&rdquo;,
              &ldquo;tourists&rdquo; or &ldquo;how is it made&rdquo;.
            </p>
          ) : (
            <ul className="divide-y divide-border/40 border-y border-border/40">
              {rows.map((row) => (
                <li key={row.key}>
                  <Link
                    href={row.href}
                    className="group block py-5 transition-colors hover:bg-card/40"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-accent/80">
                        {row.section}
                      </p>
                      {row.score !== undefined && (
                        <p className="shrink-0 text-[0.65rem] tracking-[0.2em] text-muted-foreground/70">
                          {Math.round(row.score * 100)}% match
                        </p>
                      )}
                    </div>
                    <p className="mt-2 font-display text-2xl text-foreground transition-colors group-hover:text-accent">
                      <Highlight text={row.title} ranges={row.titleRanges} />
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      <Highlight text={row.body.text} ranges={row.body.ranges} />
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
