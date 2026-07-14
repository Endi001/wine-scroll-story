import { Grape } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background py-16">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/60 text-accent">
              <Grape className="h-4 w-4" />
            </span>
            <span className="font-display text-xl text-foreground">Maison Noir</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A family estate producing single-vineyard wines in the Médoc since
            1897. Please drink responsibly.
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">Estate</p>
          <address className="not-italic text-sm leading-relaxed text-muted-foreground">
            12 Chemin des Vignes<br />
            33250 Pauillac<br />
            France
          </address>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">Contact</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>+33 5 56 00 12 34</li>
            <li>hello@maisonnoir.wine</li>
            <li>Mon–Sat, 10:00–18:00</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
          &copy; {new Date().getFullYear()} Maison Noir. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
