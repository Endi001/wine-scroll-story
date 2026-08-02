## Problem
The rail's active state comes from an `IntersectionObserver` with a thin `-45%/-45%` band and picks the entry with the highest `intersectionRatio`. Two things break because of that:

1. The hero is 360vh tall, so its intersection *ratio* is always tiny compared to the shorter About/Contact sections, and the observer callback only reports sections whose visibility *changed* — so the highlight is decided from partial information and lands on the wrong section (Our Story while viewing Contact).
2. Sections enter and leave that narrow band in quick succession while scrolling, so the highlight flips back and forth.

## Fix: scroll-position based active detection
Replace the IntersectionObserver in `src/components/site/SectionRail.tsx` with a single scroll/resize listener throttled through `requestAnimationFrame`:

- On each tick, read every section's `getBoundingClientRect()`.
- Active section = the last section whose `top` is above an anchor line at ~40% of viewport height. This is monotonic with scroll position, so it can never oscillate.
- Special case the bottom of the page: if the user is within a few pixels of the document bottom, force the last section active (Contact), so a short final section still highlights.
- Only call `setActive` when the id actually changes, avoiding re-render churn.
- Keep `prefers-reduced-motion` handling for the click-to-jump behavior.

## Small screens: dots with hover labels
Currently the rail is `hidden lg:block`. Make it visible at all sizes with two presentations:

- **Below `lg`**: each item renders as a small dot (`h-2 w-2 rounded-full`), `right-4`, spaced `gap-4`. Inactive dot is `bg-border/60`; active dot is `bg-accent` and slightly scaled up with a soft gold ring. The label is hidden by default and appears on hover/focus as a small floating tag to the left of the dot (`opacity-0 translate-x-1` to `opacity-100 translate-x-0`, 200ms), using the existing uppercase-tracked, `text-accent`-on-dark style with a `bg-background/80 backdrop-blur` pill so it stays readable over the video.
- **`lg` and up**: unchanged tick-line + always-visible label layout.

Touch targets stay at least 32px via padding around the dot. Labels remain accessible via `aria-label` on each button so the dots are still meaningful to screen readers.

## Files
- Edited: `src/components/site/SectionRail.tsx` (only file changed)

## Out of scope
No changes to the hero scroll-scrub logic, top bar, sections, or the `/bulk` page.
