## Swap hero video to the Pexels wine-glass clip

The scroll-scrubbing hero already works — only the source video needs to change.

### Steps
1. Download the MP4 from the Pexels page (https://www.pexels.com/video/a-wine-glass-with-light-reflection-7686953/) — grab the highest available quality (up to 4K if offered).
2. Upload it via `lovable-assets create` and write the pointer to `src/assets/hero-wine.mp4.asset.json` (overwriting the current pointer so `ScrollVideoHero.tsx` picks it up with no code change).
3. Delete the previous CDN asset (old `asset_id`) so it doesn't linger.
4. Verify in the preview that the new clip scrubs smoothly on scroll; if the new clip is much shorter/longer, no code change is needed — the hero maps scroll progress to `0..duration` automatically.

### Notes
- No component, route, or styling changes. The palette, typography, headline, and overlay all stay as-is.
- If Pexels blocks direct download from the sandbox, I'll fall back to asking you to attach the MP4 file directly.
