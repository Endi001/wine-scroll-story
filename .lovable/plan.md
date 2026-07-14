## Goal
Make the scroll-driven hero video feel like buttery 60fps playback instead of the current stuttery scrub.

## Why it stutters today
- We set `video.currentTime` directly on scroll — browsers only decode keyframes quickly, so jumping to arbitrary timestamps produces visible stepping.
- The RAF easing (`diff * 0.15`) with a 0.02s deadband still snaps to whatever frame the decoder can seek to, and long-GOP MP4s (like the Pexels source) decode slowly on seek.
- Scroll height (220vh) is short, so each scroll pixel maps to a large time jump.

## Approach
Move from "seek on scroll" to "smoothly interpolated playbackRate + longer scroll runway", plus a decoder-friendly source.

### 1. Re-encode the hero clip for smooth scrubbing (in `src/assets/`)
Serve an MP4 with an all-intra / very short GOP so every frame is a keyframe — this is the single biggest win for scrub smoothness. Also emit a WebM/VP9 fallback. Both encoded at 60fps from the existing Pexels source, `-g 1` (all keyframes), `+faststart`, ~8 Mbps. Replace the current `hero-wine.mp4.asset.json` with the new all-intra MP4 and add `hero-wine.webm.asset.json`.

### 2. Rework `ScrollVideoHero.tsx` scrubbing loop
- Increase section height from `220vh` to `360vh` so each frame gets more scroll distance (finer granularity).
- Keep a `targetTime` updated on scroll, but drive `currentTime` from a persistent `requestAnimationFrame` loop that always runs while the hero is in view (not only when diff > threshold) — this keeps updates locked to the display's 60/120Hz refresh.
- Use time-based smoothing (exponential ease with a per-frame `1 - Math.exp(-dt / tau)` factor, tau ≈ 90ms) instead of fixed `0.15` — frame-rate independent and visibly smoother.
- Add `<source>` tags for WebM first, MP4 second, so Chromium/Firefox pick the cheaper-to-seek encode.
- Add `disableRemotePlayback`, keep `preload="auto"`, and call `video.play().then(() => video.pause())` once after metadata to prime the decoder pipeline on Safari/iOS.
- Pause the RAF loop via `IntersectionObserver` when the hero scrolls out of view.

### 3. No visual/content changes
Headline, overlays, layout, colors, and copy stay exactly as they are. This is purely a smoothness fix.

## Files touched
- `src/assets/hero-wine.mp4.asset.json` (replace with all-intra re-encode)
- `src/assets/hero-wine.webm.asset.json` (new)
- `src/components/site/ScrollVideoHero.tsx` (rewritten scrub loop + `<source>` tags + taller section)

## Out of scope
No changes to About, Contact, Footer, TopBar, theme, or fonts.