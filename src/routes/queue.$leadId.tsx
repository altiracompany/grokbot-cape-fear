import { useState, type FormEvent } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyBlock } from "@/components/copy-block";
import { HandoffDialog } from "@/components/handoff-dialog";
import { LeadBadge, ScreenBadge } from "@/components/status";
import { countyLabel, handoffPacket } from "@/lib/conversation";
import { nicheById } from "@/lib/niches";
import { useAgency } from "@/lib/store";
import { ageLabel, cn } from "@/lib/utils";
import { COUNTIES } from "@/lib/types";
import type { CallTurn, County, ScreenGrade, Urgency } from "@/lib/types";

export const Route = createFileRoute("/queue/$leadId")({
  component: CallDesk,
});

const URGENCY: { id: Urgency; label: string }[] = [
  { id: "now", label: "Now" },
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "quote", label: "Quote" },
];

function CallDesk() {
  const { leadId } = Route.useParams();
  const lead = useAgency((s) => s.leads.find((l) => l.id === leadId));
  const market = useAgency((s) => s.markets.find((m) => m.id === lead?.marketId));
  const owner = useAgency((s) => s.buyers.find((b) => b.id === lead?.soldToBuyerId));
  const screenLead = useAgency((s) => s.screenLead);
  const addTapeTurn = useAgency((s) => s.addTapeTurn);

  const [county, setCounty] = useState<County>(lead?.county ?? "new-hanover");
  const [address, setAddress] = useState(lead?.address ?? "");
  const [urgency, setUrgency] = useState<Urgency>(lead?.urgency ?? "today");
  const [notes, setNotes] = useState(lead?.screenNotes ?? "");
  const [speaker, setSpeaker] = useState<CallTurn["speaker"]>("agent");
  const [turn, setTurn] = useState("");

  if (!lead || !market) {
    return (
      <main className="grid gap-3">
        <h1 className="text-2xl font-medium">Not in queue</h1>
        <Link to="/queue" className="text-sm text-muted hover:text-fg">
          Back to queue
        </Link>
      </main>
    );
  }

  const file = lead;
  const site = market;
  const niche = nicheById(site.nicheId);
  const open = file.status === "new";

  function save(grade: ScreenGrade) {
    screenLead(file.id, {
      screen: grade,
      urgency,
      county,
      address,
      screenNotes: notes,
    });
    toast.success(
      grade === "hot"
        ? "Hot. We own it. Hand it."
        : grade === "warm"
          ? "Warm. Hand if a truck will take it."
          : grade === "dead"
            ? "Dead. Not a job."
            : "On the line.",
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    save(file.screen === "unscreened" ? "screening" : file.screen);
  }

  function logTurn(e: FormEvent) {
    e.preventDefault();
    if (!turn.trim()) return;
    addTapeTurn(file.id, speaker, turn);
    setTurn("");
    toast.success("Tape updated.");
  }

  return (
    <main className="flex flex-col gap-6">
      <Link to="/queue" className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Queue
      </Link>

      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">{market.trackingNumber}</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">{lead.name}</h1>
          <p className="mt-2 text-sm text-muted">
            {lead.phone} · {niche.name} · {countyLabel(lead.county)} ·{" "}
            <span suppressHydrationWarning>{ageLabel(lead.at)}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ScreenBadge screen={lead.screen} />
          <LeadBadge status={lead.status} />
          {open && (lead.screen === "hot" || lead.screen === "warm") ? <HandoffDialog lead={lead} /> : null}
        </div>
      </header>

      {!open && owner ? (
        <CopyBlock
          label="Packet sent"
          text={handoffPacket(lead, market, niche, owner)}
          grokKind="offer"
          grokBrief={`Screened handoff packet, ${lead.name}, ${niche.name}, Cape Fear.`}
        />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl p-5">
          <CardTitle>Conversation</CardTitle>
          <p className="mt-1 text-sm text-muted">
            {lead.source === "call" ? "Live on the tracking line." : "Form, then our callback."} We keep the tape. Owners
            never hear a raw caller.
          </p>
          <ol className="mt-4 grid max-h-96 gap-3 overflow-auto">
            {lead.conversation.length === 0 ? (
              <li className="text-sm text-muted">No turns yet. Answer inbound to capture the call.</li>
            ) : (
              lead.conversation.map((t, i) => (
                <li key={`${t.at}-${i}`} className="grid gap-1">
                  <p className="font-mono text-xs text-subtle">
                    {t.at} · {t.speaker === "agent" ? "Desk" : "Caller"}
                  </p>
                  <p
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm leading-relaxed",
                      t.speaker === "agent" ? "bg-elevated text-fg" : "bg-bg text-fg shadow-[var(--shadow-border)]",
                    )}
                  >
                    {t.text}
                  </p>
                </li>
              ))
            )}
          </ol>
          {open ? (
            <form onSubmit={logTurn} className="mt-4 grid gap-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={speaker === "agent" ? "default" : "secondary"}
                  onClick={() => setSpeaker("agent")}
                >
                  Desk
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={speaker === "caller" ? "default" : "secondary"}
                  onClick={() => setSpeaker("caller")}
                >
                  Caller
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  value={turn}
                  onChange={(e) => setTurn(e.target.value)}
                  placeholder="Log the next turn. We own this tape."
                />
                <Button type="submit" size="sm" className="shrink-0">
                  Capture
                </Button>
              </div>
            </form>
          ) : null}
        </Card>

        <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <div>
            <CardTitle>Screen</CardTitle>
            <p className="mt-1 text-sm text-muted">
              In tri-county? Real job? Timeframe? If yes, it's hot — we own it until a screened handoff.
            </p>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="addr">Address</Label>
            <Input
              id="addr"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, neighborhood"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="county">County</Label>
            <select
              id="county"
              value={county}
              onChange={(e) => setCounty(e.target.value as County)}
              className="h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
            >
              {COUNTIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Urgency</Label>
            <div className="flex flex-wrap gap-2">
              {URGENCY.map((u) => (
                <Button
                  key={u.id}
                  type="button"
                  size="sm"
                  variant={urgency === u.id ? "default" : "secondary"}
                  onClick={() => setUrgency(u.id)}
                >
                  {u.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sn">Screen notes</Label>
            <Textarea
              id="sn"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="In territory. Access. What they said. Why it's hot."
            />
          </div>
          {open ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Button type="button" variant="secondary" onClick={() => save("screening")}>
                Hold
              </Button>
              <Button type="button" onClick={() => save("hot")}>
                Hot
              </Button>
              <Button type="button" variant="secondary" onClick={() => save("warm")}>
                Warm
              </Button>
              <Button type="button" variant="danger" onClick={() => save("dead")}>
                Dead
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted">Already closed. Transcript stays on the file.</p>
          )}
        </form>
      </div>
    </main>
  );
}
