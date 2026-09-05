import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AREA_LINES, e164, lineForCounty, loadLines, saveLines, smsHref, type SavedLines } from "@/lib/lines";
import { seatSms, turnkeySms } from "@/lib/seats";
import { useAgency } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Buyer } from "@/lib/types";

export const Route = createFileRoute("/outreach")({ component: OutreachPage });

function OutreachPage() {
  const buyers = useAgency((s) => s.buyers);
  const [lines, setLines] = useState<SavedLines>(() => (typeof window === "undefined" ? { "210": "", "830": "" } : loadLines()));
  const [lineId, setLineId] = useState<"210" | "830">("830");
  const [offer, setOffer] = useState<"dedicated" | "turnkey">("dedicated");
  const [picked, setPicked] = useState<string | null>(null);
  const [manual, setManual] = useState("");

  const alamo = useMemo(
    () => buyers.filter((b) => ["bexar", "comal", "guadalupe"].includes(b.county) && b.hunt !== "paying"),
    [buyers],
  );
  const buyer = alamo.find((b) => b.id === picked) ?? null;
  const body = buyer ? (offer === "turnkey" ? turnkeySms(buyer) : seatSms(buyer)) : "";
  const to = buyer?.phone && !buyer.phone.includes("555") ? buyer.phone : manual;
  const href = smsHref(to, body);

  function persist(next: SavedLines) {
    setLines(next);
    saveLines(next);
  }

  function send() {
    if (!e164(to)) {
      toast.error("Real owner mobile. Not a 555.");
      return;
    }
    if (!body) {
      toast.error("Pick a company.");
      return;
    }
    void navigator.clipboard.writeText(body);
    if (href) window.location.href = href;
    toast.success(`Copied. Paste into Cove and send from the ${lineId} line.`);
  }

  function copyOnly() {
    if (!body) return;
    void navigator.clipboard.writeText(body);
    toast.success("Copied. Paste into OpenPhone from the " + lineId + " line.");
  }

  return (
    <main className="flex flex-col gap-8">
      <header>
        <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Lazy outreach</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">210 or 830. Then send.</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Buy two local lines in Cove. Paste them once. Tap a truck. Copy + send from Cove. That's the stack.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        {AREA_LINES.map((line) => (
          <Card key={line.id} className="rounded-xl p-5">
            <p className="font-mono text-xs tracking-wider text-subtle uppercase">{line.id} · {line.label}</p>
            <p className="mt-1 text-sm text-muted">{line.counties}</p>
            <Label htmlFor={`l-${line.id}`} className="mt-4">
              Cove number
            </Label>
            <Input
              id={`l-${line.id}`}
              className="mt-1.5"
              inputMode="tel"
              placeholder={`${line.id} number`}
              value={lines[line.id]}
              onChange={(e) => persist({ ...lines, [line.id]: e.target.value })}
            />
          </Card>
        ))}
      </section>

      <Card className="rounded-xl p-5">
        <CardTitle>Cove — skip OpenPhone</CardTitle>
        <ol className="mt-3 grid gap-2 text-sm text-muted">
          <li>1. Cove you already have. Don't buy OpenPhone.</li>
          <li>
            2. Add a <span className="text-fg">210</span> and an <span className="text-fg">830</span> on that account.
            Not a 512. Not an 800.
          </li>
          <li>3. Paste both above. 210 = Bexar. 830 = Comal / Guadalupe.</li>
          <li>4. AI can answer after hours. You still screen the hot job before it hits the truck.</li>
          <li>5. When they Google you: grokbot-cape-fear.vercel.app — the public site, not this desk.</li>
        </ol>
      </Card>

      <div className="flex flex-wrap gap-2">
        {AREA_LINES.map((line) => (
          <button
            key={line.id}
            type="button"
            onClick={() => setLineId(line.id)}
            className={cn("h-11 rounded-md px-4 text-sm", lineId === line.id ? "bg-elevated text-fg" : "text-muted")}
          >
            Send as {line.id}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOffer("dedicated")}
          className={cn("h-11 rounded-md px-4 text-sm", offer === "dedicated" ? "bg-elevated text-fg" : "text-muted")}
        >
          Dedicated $500
        </button>
        <button
          type="button"
          onClick={() => setOffer("turnkey")}
          className={cn("h-11 rounded-md px-4 text-sm", offer === "turnkey" ? "bg-elevated text-fg" : "text-muted")}
        >
          Turnkey busy
        </button>
      </div>

      <div className="grid gap-2">
        {alamo.slice(0, 12).map((b) => (
          <OwnerRow key={b.id} buyer={b} active={picked === b.id} onPick={() => {
            setPicked(b.id);
            setLineId(lineForCounty(b.county));
          }} />
        ))}
      </div>

      {buyer ? (
        <Card className="grid gap-4 rounded-xl p-5">
          <p className="text-sm text-muted">
            {buyer.company} · send as {lineId} · {offer}
          </p>
          <div className="grid gap-1.5">
            <Label htmlFor="to">Their mobile (replace 555s)</Label>
            <Input id="to" inputMode="tel" placeholder="Owner cell" value={manual || (buyer.phone.includes("555") ? "" : buyer.phone)} onChange={(e) => setManual(e.target.value)} />
          </div>
          <pre className="overflow-x-auto rounded-lg bg-elevated p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">{body}</pre>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={copyOnly} className="h-12">
              Copy for Cove
            </Button>
            <Button type="button" variant="secondary" onClick={send} className="h-12">
              Also open Messages
            </Button>
          </div>
        </Card>
      ) : (
        <p className="text-sm text-muted">Tap a company. We fill the text. You hit send.</p>
      )}
    </main>
  );
}

function OwnerRow({ buyer, active, onPick }: { buyer: Buyer; active: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "flex min-h-14 items-center justify-between rounded-xl px-4 text-left text-sm shadow-[var(--shadow-border)]",
        active ? "bg-elevated" : "bg-surface",
      )}
    >
      <span>
        {buyer.company}
        <span className="ml-2 text-muted">{buyer.county.replace(/-/g, " ")}</span>
      </span>
      <span className="font-mono text-xs text-subtle">{lineForCounty(buyer.county)}</span>
    </button>
  );
}
