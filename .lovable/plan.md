# Wine Website Plan

A dark, cinematic single-page wine brand site. The uploaded 4K video drives the hero as a scroll-scrubbed background (video currentTime bound to scroll position), producing a filmic reveal as the user scrolls into the content.

## Sections (single route `/`)

### 1. Fixed top bar (no nav)
- Left: placeholder logo mark + brand name ("Maison Noir" as placeholder, easy to swap)
- Right: "Contact" link that smooth-scrolls to the contact section
- Transparent over the video at top; gains a subtle dark blur backdrop after scrolling

### 2. Hero (scroll-controlled video)
- Full-viewport video pinned as background, muted, playsInline, preload=auto
- Scroll position within the hero section maps to `video.currentTime` (scrubbing)
- Overlaid centered content:
  - Large display headline: "Wine is for those who love to live."
  - Short subcopy (1–2 lines) about craft, terroir, and time
  - Subtle scroll-cue chevron
- Section is ~200vh tall so there's scroll distance to scrub through the video
- Dark gradient overlay for text legibility

### 3. About us
- Two-column on desktop, stacked on mobile
- Placeholder history copy (founded year, family estate, philosophy)
- Fade/slide-in on scroll

### 4. Contact form
- Fields: Name, Email, Question (textarea), Send button
- Client-side validation with zod (name/email required, message max length)
- On submit: show a success toast (no backend wired — pure UI, ready to hook up later)

### 5. Footer
- Brand blurb, address, phone, email, hours, small copyright line

## Visual direction
- Palette derived from typical wine video: deep near-black background, oxblood/burgundy accent, warm off-white text, muted gold highlight
- Typography: a serif display (e.g. Cormorant Garamond) for headlines paired with a clean sans (Inter) for body — loaded via `<link>` in `__root.tsx`
- Semantic tokens added to `src/styles.css` (`--background`, `--foreground`, `--primary` = burgundy, `--accent` = gold, plus `--gradient-hero`, `--shadow-elegant`)
- Motion: fade-in-up on section reveal, subtle letter-spacing settle on hero headline, hover underline on links, button hover glow

## Technical details
- Upload the provided MP4 via `lovable-assets` CLI → `src/assets/hero-wine.mp4.asset.json`; reference by CDN URL in the `<video>` tag
- New file `src/components/ScrollVideoHero.tsx` implements the scroll-scrubbing hero (uses `requestAnimationFrame` + a ref to the video; sets `currentTime` from scroll progress; falls back to autoplay loop if the video isn't yet buffered)
- New section components: `AboutSection.tsx`, `ContactSection.tsx`, `SiteFooter.tsx`, `TopBar.tsx` under `src/components/site/`
- Replace `src/routes/index.tsx` placeholder with composition of the above
- Update `src/routes/__root.tsx` head(): real title/description/OG for the wine brand, plus `<link>` tags for the Google Fonts
- Update `src/styles.css` with the burgundy/gold dark theme tokens and a couple of custom keyframes (`fade-up`, hero letter-spacing)
- Contact form uses zod + shadcn `Form`, `Input`, `Textarea`, `Button`, and `sonner` toast; no backend

## Assumptions (change any before I build)
- Brand name placeholder: "Maison Noir"
- Palette: near-black background, burgundy primary, warm gold accent, off-white text
- Fonts: Cormorant Garamond (display) + Inter (body)
- Contact form is UI-only for now (no email sending / DB)
- Site is a single scrolling page; no separate routes needed
