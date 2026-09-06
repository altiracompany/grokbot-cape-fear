import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { runScrub, scrubDue, SCRUB_HOUR } from "@/lib/scrub";
import { useAgency } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ScrubBoard({ compact = false }: { compact?: boolean }) {
  const buyers = useAgency((s) => s.buyers);
  const leads = useAgency((s) => s.leads);
  const markets = useAgency((s) => s.markets);
  const lastScrubAt = useAgency((s) => s.lastScrubAt);
  const markScrubbed = useAgency((s) => s.markScrubbed);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const due = scrubDue(lastScrubAt);
  const items = runScrub(buyers, leads, markets);

  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">
            Daily scrub · {SCRUB_HOUR}am Chicago
          </p>
          <h2 className="mt-1 font-display text-2xl font-medium tracking-tight">
            {due ? "Scrub is due." : "Today's list."}
          </h2>
        </div>
        <Button type="button" variant={due ? "default" : "secondary"} onClick={() => markScrubbed()}>
          {due ? "Mark scrubbed" : "Scrubbed"}
        </Button>
      </div>
      {items.length === 0 ? (
        <Card className="rounded-xl p-5">
          <p className="text-sm text-muted">Nothing on the line. Text 10 trucks. That's the scrub.</p>
        </Card>
      ) : (
        <div className="grid gap-2">
          {items.slice(0, compact ? 4 : 7).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className={cn(
                "flex min-h-14 items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-[var(--shadow-border)]",
                item.tone === "urgent" ? "bg-elevated" : "bg-surface",
              )}
            >
              <span>
                <span className="block text-sm font-medium">{item.title}</span>
                <span className="block text-xs text-muted">{item.why}</span>
              </span>
              <span className="shrink-0 text-right text-xs text-subtle">{item.doThis}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
