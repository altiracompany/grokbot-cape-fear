import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CopyBlock } from "@/components/copy-block";
import { eligibleBuyers } from "@/lib/actions";
import { handoffPacket } from "@/lib/conversation";
import { nicheById } from "@/lib/niches";
import { freeLabel, handoffPrice } from "@/lib/pricing";
import { useAgency } from "@/lib/store";
import { money } from "@/lib/utils";
import type { Lead } from "@/lib/types";

export function HandoffDialog({ lead, trigger }: { lead: Lead; trigger?: React.ReactNode }) {
  const markets = useAgency((s) => s.markets);
  const buyers = useAgency((s) => s.buyers);
  const handoffLead = useAgency((s) => s.handoffLead);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [buyerId, setBuyerId] = useState("");
  const [packet, setPacket] = useState("");

  const market = markets.find((m) => m.id === lead.marketId);
  const eligible = eligibleBuyers(buyers, lead.marketId, lead.county);
  const selected = eligible.find((b) => b.id === buyerId) ?? eligible[0];
  const blocked = lead.screen !== "hot" && lead.screen !== "warm";
  const price = selected ? handoffPrice(selected) : 0;

  function send() {
    const id = selected?.id;
    if (!id || !market) {
      toast.error("No active owner on this market.");
      return;
    }
    const err = handoffLead(lead.id, id);
    if (err) {
      toast.error(err);
      return;
    }
    const niche = nicheById(market.nicheId);
    const after = { ...selected, freeRemaining: price === 0 ? selected.freeRemaining - 1 : selected.freeRemaining, freeUsed: price === 0 ? selected.freeUsed + 1 : selected.freeUsed };
    setPacket(handoffPacket({ ...lead, status: "sold", soldToBuyerId: id, soldPrice: price, free: price === 0 }, market, niche, after));
    toast.success(
      price === 0 ? `Handed to ${selected.company} · ${freeLabel(selected)}` : `Handed to ${selected.company} · ${money(price)}`,
    );
    setOpen(false);
    void navigate({ to: "/queue/$leadId", params: { leadId: lead.id } });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setPacket("");
      }}
    >
      <DialogTrigger asChild>{trigger ?? <Button size="sm">Handoff</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Screened handoff · {lead.name}</DialogTitle>
          <DialogDescription>
            {market ? `${nicheById(market.nicheId).name} · ${lead.neighborhood}` : "Lead"} · {lead.phone}
          </DialogDescription>
        </DialogHeader>
        {blocked ? (
          <p className="text-sm text-muted">Screen it hot or warm first. We do not dump raw callers on owners.</p>
        ) : eligible.length === 0 ? (
            <p className="text-sm text-muted">No active owner under cap. Add one — they get 2 free screened jobs.</p>
        ) : packet ? (
          <CopyBlock label="Packet to the owner" text={packet} grokKind="offer" grokBrief={packet} />
        ) : (
          <div className="grid gap-3">
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted">Owner</span>
              <select
                value={selected?.id ?? ""}
                onChange={(e) => setBuyerId(e.target.value)}
                className="h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
              >
                {eligible.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.company} · {b.freeRemaining > 0 ? `${b.freeRemaining} free` : money(b.pplRate)} · {b.soldThisMonth}/{b.monthlyCap}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-sm text-muted">
              {lead.service} · {lead.urgency ?? "today"} · {lead.screen}
            </p>
            <Button type="button" onClick={send} className="w-full">
              {price === 0 ? `Send free handoff (${selected ? freeLabel(selected) : ""})` : `Send · ${money(price)}`}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
