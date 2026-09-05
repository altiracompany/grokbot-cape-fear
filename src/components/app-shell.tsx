import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Headset, LayoutGrid, MapPinned, Menu, Users } from "lucide-react";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NewMarketDialog } from "@/components/new-market-dialog";
import { BRAND, BRAND_MARK, BRAND_SHORT, BRAND_TAG } from "@/lib/brand";
import { useAgency } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Desk", icon: LayoutGrid },
  { to: "/queue", label: "Queue", icon: Headset },
  { to: "/markets", label: "Markets", icon: MapPinned },
  { to: "/buyers", label: "Hunt", icon: Users },
  { to: "/playbook", label: "Playbook", icon: BookOpen },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const markHydrated = useAgency((s) => s.markHydrated);
  const unsold = useAgency((s) => s.leads.filter((l) => l.status === "new").length);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve(useAgency.persist.rehydrate()).finally(() => {
      if (!cancelled) markHydrated();
    });
    return () => {
      cancelled = true;
    };
  }, [markHydrated]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-dvh overflow-x-hidden bg-bg text-fg">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-border bg-bg px-4 py-5 md:flex">
          <Brand />
          <NavList pathname={pathname} unsold={unsold} />
          <p className="mt-auto text-xs tracking-wide text-subtle uppercase">Screen the call. Send their job.</p>
        </aside>

        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Brand />
              <div className="mt-6" onClick={() => setMenuOpen(false)}>
                <NavList pathname={pathname} unsold={unsold} />
              </div>
            </SheetContent>
          </Sheet>
          <Brand compact />
          <NewMarketDialog />
        </header>

        <div className="md:pl-56">
          <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pt-4 pb-24 md:px-8 md:pt-8 md:pb-10">
            <div className="mb-6 hidden items-center justify-between md:flex">
              <p className="font-mono text-xs tracking-widest text-muted uppercase">
                Freedom Project · Cape Fear + Alamo · $500/wk
              </p>
              <NewMarketDialog />
            </div>
            {children}
          </div>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-border bg-bg/95 md:hidden">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative flex min-h-14 flex-col items-center justify-center gap-1 text-xs",
                  active ? "text-fg" : "text-muted",
                )}
              >
                <Icon className="size-4" />
                {item.label}
                {item.to === "/queue" && unsold > 0 ? (
                  <span className="absolute top-1.5 right-3 min-w-4 rounded-full bg-maybe px-1 text-center font-mono text-xs text-accent-fg">
                    {unsold}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <Toaster theme="dark" position="bottom-right" richColors={false} />
      </div>
    </TooltipProvider>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-md bg-elevated font-display text-sm font-semibold text-fg shadow-[var(--shadow-border)]">
        {BRAND_MARK}
      </span>
      <span className={cn("leading-tight", compact && "sr-only md:not-sr-only")}>
        <span className="block font-medium tracking-[0.12em] text-fg uppercase">{BRAND_SHORT}</span>
        {!compact ? <span className="block text-xs text-subtle">{BRAND_TAG}</span> : null}
      </span>
    </Link>
  );
}

function NavList({ pathname, unsold }: { pathname: string; unsold: number }) {
  return (
    <nav className="mt-8 flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex min-h-11 items-center gap-2.5 rounded-md px-3 text-sm transition-colors duration-150",
              active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg",
            )}
          >
            <Icon className="size-4" />
            <span className="flex-1">{item.label}</span>
            {item.to === "/queue" && unsold > 0 ? (
              <span className="font-mono text-xs text-maybe tabular-nums">{unsold}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
