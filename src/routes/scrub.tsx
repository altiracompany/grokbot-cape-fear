import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScrubBoard } from "@/components/scrub-board";
import { scrubDue } from "@/lib/scrub";
import { useAgency } from "@/lib/store";

export const Route = createFileRoute("/scrub")({ component: ScrubPage });

function ScrubPage() {
  const lastScrubAt = useAgency((s) => s.lastScrubAt);
  const markScrubbed = useAgency((s) => s.markScrubbed);

  useEffect(() => {
    const tick = () => {
      if (scrubDue(useAgency.getState().lastScrubAt)) {
        /* list is live; they mark done */
      }
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [lastScrubAt, markScrubbed]);

  return (
    <main className="flex flex-col gap-8">
      <header>
        <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">5am</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">Scrub</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          One list. Screen, handoff, collect, mail, text. Then close the board.
        </p>
      </header>
      <ScrubBoard />
    </main>
  );
}
