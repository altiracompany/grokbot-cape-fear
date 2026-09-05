import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BRAND, BRAND_MARK, BRAND_SHORT } from "@/lib/brand";

export function PublicFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-elevated font-display text-sm font-semibold shadow-[var(--shadow-border)]">
              {BRAND_MARK}
            </span>
            <span className="font-medium tracking-[0.1em] uppercase">{BRAND_SHORT}</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-muted">
            <a href="/#how" className="hidden hover:text-fg sm:inline">
              How
            </a>
            <a href="/#offers" className="hidden hover:text-fg sm:inline">
              Offers
            </a>
            <Link to="/apply" className="hover:text-fg">
              Apply
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 md:px-8">{children}</div>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-10 text-sm text-subtle md:px-8">
          <p>{BRAND}</p>
          <p>Dedicated lead generation. Bexar · Comal · Guadalupe · Cape Fear.</p>
          <p>We text from 210 and 830. One company per county.</p>
        </div>
      </footer>
    </div>
  );
}
