import { useEffect, useState } from "react";
import { Grape } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

export function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLink =
    "relative text-sm uppercase tracking-[0.25em] text-foreground/90 transition-colors hover:text-accent after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/70 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/60 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
            <Grape className="h-4 w-4" />
          </span>
          <span className="font-display text-xl tracking-wide text-foreground">
            Maison Noir
          </span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link to="/bulk" className={navLink}>
            Bulk
          </Link>
          {pathname === "/" ? (
            <a href="#contact" className={navLink}>
              Contact
            </a>
          ) : (
            <Link to="/" hash="contact" className={navLink}>
              Contact
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
