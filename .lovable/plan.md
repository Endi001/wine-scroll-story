## Goal
Add a sticky section navigator to the home page: a fixed vertical rail that lists the page's sections, lets you click to jump, and highlights the section currently in view.

## Sections tracked (home page)
- Hero ("Wine is for those who love to live") — `#top` / hero section
- Our Story — `#about`
- Get in Touch — `#contact`

The hero section needs an `id` (e.g. `id="hero"`) so it can be targeted; About and Contact already have ids.

## Component: `src/components/site/SectionRail.tsx`
- Fixed position, vertically centered on the right edge (`fixed right-8 top-1/2 -translate-y-1/2 z-40`), so it stays in place through the whole scroll.
- One row per section: a short horizontal tick line plus the section label.
- Clicking a row scrolls smoothly to that section (`scrollIntoView({ behavior: "smooth" })`), and updates the hash.
- Active state tracked with an `IntersectionObserver` over the three section elements, picking the one most in view (rootMargin tuned so the active item flips near the vertical middle of the viewport).
- Hidden below `lg` (mobile keeps the clean full-bleed hero); the top bar still covers navigation there.

## Design
Reuses existing tokens only — no new colors:
- Inactive: `text-muted-foreground`, tick line `bg-border/60`, label at `text-[10px] uppercase tracking-[0.3em]` to match the site's eyebrow style.
- Active: `text-accent` (gold), tick line widens and turns `bg-accent`.
- No panel/background box — just the rail floating over the dark background, matching the site's minimal feel.

## Animation
- Tick line grows from ~16px to ~40px on active, with `transition-all duration-300 ease-out`; color fades in the same transition.
- Labels: inactive labels sit at low opacity and fade to full opacity on active or hover.
- Rail itself enters with the existing `animate-fade-up` utility on mount.
- Smooth scroll on click; respects `prefers-reduced-motion` by falling back to instant jump and dropping the length/opacity transitions.

## Files
- New: `src/components/site/SectionRail.tsx`
- Edited: `src/routes/index.tsx` (render `<SectionRail />`), `src/components/site/ScrollVideoHero.tsx` (add `id="hero"` to the section)

## Out of scope
No changes to the top bar, hero scroll-scrub logic, forms, footer, or the `/bulk` page (the rail is home-page only, since that's the page with scrollable sections).
