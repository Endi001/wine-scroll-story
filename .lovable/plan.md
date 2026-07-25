## Goal
Add a second route `/bulk` with a real-time bulk-order calculator, linked from the top bar to the left of "Contact". Match the existing dark burgundy/gold aesthetic.

## Nav change (`src/components/site/TopBar.tsx`)
- Replace the single `#contact` anchor with two links, in order: `Bulk` (TanStack `<Link to="/bulk">`) then `Contact` (`<Link to="/">` with hash `#contact`, or anchor when on `/`).
- Same uppercase-tracked style; gold hover underline preserved.
- Logo continues to link home.

## New route (`src/routes/bulk.tsx`)
- `createFileRoute("/bulk")` with its own `head()` — title "Bulk Orders — Maison Noir", matching description, og/twitter title+description. No og:image (no hero visual).
- Layout: `<TopBar />`, main section, `<SiteFooter />` — same page shell pattern as index.

## Calculator component (`src/components/site/BulkCalculator.tsx`)
Card centered in a max-w container, styled like existing sections (border, muted background, gold accents, Cormorant display headings).

State:
- `quantity` (number, default 25), controlled by a slider input.

Constants:
- Wine name: "Cuvée Noir 2019" (single product).
- Unit price: €48.
- Bulk discount: 5% flat on all orders 10–100.

UI structure inside the card:
1. Small uppercase-tracked eyebrow "Bulk Orders".
2. Display heading with wine name.
3. Quantity slider (shadcn `Slider`) min 10, max 100, step 1. Current quantity shown large next to "bottles".
4. Live totals block:
   - Subtotal = quantity × unitPrice
   - Discount (5%) = subtotal × 0.05 — labelled "You save"
   - Total = subtotal − discount, large gold number
5. Cost breakdown list (rows with label + value, thin divider rows):
   - Wine · Cuvée Noir 2019
   - Unit price · €48.00
   - Quantity · N bottles
   - Subtotal · €X
   - Bulk discount (5%) · −€X
   - Total · €X (emphasized)
6. CTA button styled like the Contact form's submit ("Call us to order") — links to `tel:+33556001234` (the number already in the footer).

All values formatted via `Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })`.

## Design consistency
- Reuse existing tokens: `bg-background`, `text-foreground`, `text-accent`, `border-border/40`, `font-display`, uppercase `tracking-[0.3em/0.4em]` eyebrows.
- Slider: use existing shadcn `@/components/ui/slider`; if not present, add it (shadcn primitive, no new deps).
- Fade-up entrance using `animate-fade-up` utility already defined in `styles.css`.

## Files
- New: `src/routes/bulk.tsx`, `src/components/site/BulkCalculator.tsx`
- Edited: `src/components/site/TopBar.tsx` (add Bulk link, switch to TanStack `Link`)
- Possibly new: `src/components/ui/slider.tsx` if not already in the project

## Out of scope
No changes to hero, About, Contact form, footer content, theme, or fonts. No backend — CTA is a `tel:` link.
