# Add Logos3 restaurant carousel

## Goal
Add an auto-scrolling "Trusted by many restaurants" logo carousel below the hero on the home page, listing seven fine-dining restaurants as elegant text wordmarks.

## What exists (no work needed)
- `src/components/ui/carousel.tsx` — already present and compatible with the pasted Logos3 template.
- `src/components/ui/button.tsx` and `src/components/ui/card.tsx` — already present.
- `lucide-react`, `embla-carousel-react`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge` — already installed.

## Steps

### 1. Install dependency
```bash
bun add embla-carousel-auto-scroll
```
Only this package is missing; all other listed deps are already present.

### 2. Create `src/components/ui/logos3.tsx`
A faithful port of the shadcnblocks Logos3 template, with one adaptation for text wordmarks:
- Keep the `Logo` interface but treat `description` as the displayed restaurant name (no image URL used).
- Replace the `<Image>`/`<img>` markup with a styled text node rendered in the brand serif (Cormorant Garamond) so it matches the site's dark/gold aesthetic and never shows a broken image.
- Carousel uses `AutoScroll` plugin (start delay, plays on hover, pause-able).
- Heading defaults to `"Trusted by many restaurants"`.

Default logos (7 entries), each as a text wordmark:
- Per Se
- Masa
- The French Laundry
- Alinea
- Atelier Crenn
- Le Bernardin
- Narisawa

### 3. Add the section to the home page
In `app/page.tsx`, render `<Logos3 />` between `<ScrollVideoHero />` and `<AboutSection />`, wrapped in a section with the page's standard dark background and vertical padding so it sits visually below the hero.

### 4. Verify
- `bun run build:dev` passes (static export to `dist/`).
- Confirm the carousel auto-scrolls and the seven restaurant names appear in the brand serif.

## Notes
- No image URLs: restaurants don't have public logo SVGs, so text wordmarks avoid broken images and stay on-brand.
- The component stays reusable/props-driven; the home page just uses the defaults.
