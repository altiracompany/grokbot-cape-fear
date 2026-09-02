import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { CopyBlock } from "@/components/copy-block";
import { conservativePitch } from "@/lib/copy";
import { NICHES } from "@/lib/niches";
import { conservativeValue, WEEKLY_SEAT } from "@/lib/pricing";
import { CAPE_NICHES } from "@/lib/territory";
import { cn, money, pct } from "@/lib/utils";
import type { Niche } from "@/lib/types";

const OPEN = NICHES.filter((n) => (CAPE_NICHES as readonly string[]).includes(n.id));

export function ValueShowcase({ focusId }: { focusId?: string }) {
  const initial = OPEN.find((n) => n.id === focusId) ?? OPEN[0];
  const [selected, setSelected] = useState<Niche>(initial);
  const v = conservativeValue(selected);

  return (
    <section className="grid gap-6">
      <div>
        <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Conservative math</p>
        <h2 className="mt-1 font-display text-2xl font-medium tracking-tight">What the seat is worth</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Underwritten job. Underwritten close. Slow week volume. Not a hero forecast. {money(WEEKLY_SEAT)}/wk exclusive.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs tracking-wider text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Niche</th>
              <th className="px-4 py-3 font-medium">We underwrite</th>
              <th className="px-4 py-3 font-medium">Close</th>
              <th className="px-4 py-3 font-medium">1 job covers</th>
              <th className="px-4 py-3 font-medium">Slow week</th>
              <th className="px-4 py-3 font-medium">Vs Angi</th>
            </tr>
          </thead>
          <tbody>
            {OPEN.map((n) => {
              const row = conservativeValue(n);
              const active = selected.id === n.id;
              return (
                <tr
                  key={n.id}
                  className={cn("border-t border-border", active ? "bg-elevated" : "hover:bg-elevated/60")}
                >
                  <td className="px-4 py-3">
                    <button type="button" className="text-left font-medium" onClick={() => setSelected(n)}>
                      {n.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">{money(row.jobValue)}</td>
                  <td className="px-4 py-3 font-mono tabular-nums">{pct(row.closeRate)}</td>
                  <td className="px-4 py-3 font-mono tabular-nums">
                    {row.coversOnOneJob ? `${row.weeksOneJobCovers} wk` : `${row.closedToCover} jobs`}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 font-mono tabular-nums",
                      row.leftover >= 0 ? "text-go" : "text-maybe",
                    )}
                  >
                    {row.leftover >= 0 ? "+" : "−"}
                    {money(Math.abs(row.leftover))}
                  </td>
                  <td className="px-4 py-3 font-mono text-subtle tabular-nums">{money(row.angiCostPerJob)}/job</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ValueCard niche={selected} />
    </section>
  );
}

export function ValueCard({ niche }: { niche: Niche }) {
  const v = conservativeValue(niche);
  return (
    <div className="grid gap-3">
      <Card className="grid gap-4 rounded-2xl p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Slow week · {niche.name}</p>
            <CardTitle className="mt-1 text-xl">
              {v.coversOnOneJob
                ? `One ${money(v.jobValue)} job covers ${v.weeksOneJobCovers} weeks`
                : `${v.closedToCover} closed jobs cover the week`}
            </CardTitle>
          </div>
          <p className="font-mono text-2xl tabular-nums">{money(WEEKLY_SEAT)}/wk</p>
        </div>
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Job we model" value={money(v.jobValue)} />
          <Stat label="Close we model" value={pct(v.closeRate)} />
          <Stat label="Screened / slow wk" value={String(v.screenedPerWeek)} />
          <Stat
            label="Left after seat"
            value={`${v.leftover >= 0 ? "+" : "−"}${money(Math.abs(v.leftover))}`}
            tone={v.leftover >= 0 ? "go" : "maybe"}
          />
        </dl>
        <p className="text-sm leading-relaxed text-muted">
          Break-even is {v.closedToCover} closed job{v.closedToCover === 1 ? "" : "s"} or {v.screenedToCover} screened.
          Angi ~{money(v.angiCostPerJob)} per booked shared lead. We are {money(WEEKLY_SEAT)} for the whole exclusive
          week.
        </p>
      </Card>
      <CopyBlock label="Show them the math" text={conservativePitch(niche)} grokKind="offer" grokBrief={conservativePitch(niche)} />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "go" | "maybe" }) {
  return (
    <div>
      <dt className="text-xs tracking-wider text-subtle uppercase">{label}</dt>
      <dd className={cn("mt-1 font-mono text-lg tabular-nums", tone === "go" ? "text-go" : tone === "maybe" ? "text-maybe" : "")}>
        {value}
      </dd>
    </div>
  );
}

export function ValueStrip() {
  const highlights = OPEN.filter((n) => ["septic", "generator", "dock", "well"].includes(n.id));
  return (
    <section className="grid gap-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Value to the truck</h2>
          <p className="mt-1 text-sm text-muted">Conservative. One closed job vs $500/wk.</p>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        {highlights.map((n) => {
          const v = conservativeValue(n);
          return (
            <Card key={n.id} className="rounded-xl p-4">
              <p className="text-sm font-medium">{n.name}</p>
              <p className="mt-2 font-mono text-xl tabular-nums">
                {v.coversOnOneJob ? `${v.weeksOneJobCovers} wk` : `${v.closedToCover} jobs`}
              </p>
              <p className="mt-1 text-xs text-muted">
                {v.coversOnOneJob
                  ? `One ${money(v.jobValue)} job pays the seat`
                  : `${v.closedToCover} × ${money(v.jobValue)} covers ${money(WEEKLY_SEAT)}`}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
