# FAQ Page + Client-Side Search Engine

## What gets built

A new `/faq` page, linked in the top bar (left of Bulk / Contact), with an instant search
bar at the top and 7 question cards below it — styled exactly like the rest of the site
(burgundy/gold palette, Cormorant Garamond headings, fade-up reveal animations, same footer).

## Page layout

```text
  Top bar  (Logo · FAQ · Bulk · Contact)
  ------------------------------------------------
  Eyebrow: "Help"
  H1: Questions, answered.
  [  Search the estate…                        ]   <- instant, no submit
  ------------------------------------------------
  results appear here while typing (replaces cards)
  ------------------------------------------------
  Card 1 .. Card 7   (one per row, expandable Q/A)
  ------------------------------------------------
  [ Have more questions? ]   (styled CTA, no action)
  ------------------------------------------------
  Footer (same component as home)
```

## Search behaviour

- Typing filters in real time — no button, no page reload, results update per keystroke.
- The index covers the whole site, not just the FAQ: home hero copy, Our Story text,
  contact section, the Bulk order page, plus all 7 FAQ answers. Each entry has a title,
  description, body text and a destination link (e.g. `/bulk`, `/#about`, or an FAQ card).
- Matched keywords are highlighted in gold inside result titles and snippets.
- Empty query shows the 7 FAQ cards; a query with no hits shows a short "no results" state.
- Results are clickable and jump to the relevant page/section.

## The 7 FAQ questions

Drawn from the site's actual content: shipping/ordering, the 5% bulk discount, minimum
case size, how to place a bulk order by phone, the estate's history and winemaking,
visiting the estate in Pauillac, and contact/response times.

## Technical notes

- Library: **Fuse.js** — small (~5 KB gzipped), fuzzy matching, and it returns match
  index ranges, which is what makes reliable keyword highlighting possible. FlexSearch is
  faster at large scale but this index is a few dozen entries, so match metadata wins.
- New files: `src/lib/search-index.ts` (typed content records + FAQ data),
  `src/components/site/SearchBar.tsx` (input + live results + highlighter),
  `src/components/site/FaqSection.tsx` (cards + CTA), `app/faq/page.tsx` (route + metadata).
- `TopBar.tsx` gains the FAQ link.
- Highlighting renders from Fuse `includeMatches` index ranges into `<mark>` spans styled
  with the existing `text-accent` token — no hardcoded colours.
- All search state is client-side `useState`; the page is statically exported like the
  others, so the production `dist` build is unaffected.
