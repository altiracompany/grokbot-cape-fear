import { useState } from "react";
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
import { eligibleBuyers } from "@/lib/actions";
import { nicheById } from "@/lib/niches";
import { useAgency } from "@/lib/store";
import { money } from "@/lib/utils";
import type { Lead } from "@/lib/types";

export function SellLeadDialog({ lead, trigger }: { lead: Lead; trigger?: React.ReactNode }) {
  const markets = useAgency((s) => s.markets);
  const buyers = useAgency((s) => s.buyers);
  const sellLead = useAgency((s) => s.sellLead);
  const [open, setOpen] = useState(false);
  const [buyerId, setBuyerId] = useState("");

  const market = markets.find((m) => m.id === lead.marketId);
  const eligible = eligibleBuyers(buyers, lead.marketId, lead.county);
  const selected = eligible.find((b) => b.id === buyerId) ?? eligible[0];

  function sell() {
    const id = selected?.id;
    if (!id) {
      toast.error("No active buyer on this market.");
      return;
    }
    const err = sellLead(lead.id, id);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success(`Sold to ${selected.company} · ${money(selected.pplRate)}`);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button size="sm">Sell</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sell {lead.name}</DialogTitle>
          <DialogDescription>
            {market ? `${nicheById(market.nicheId).name} · ${market.city}` : "Lead"} · {lead.phone}
          </DialogDescription>
        </DialogHeader>
        {eligible.length === 0 ? (
          <p className="text-sm text-muted">No active buyer under cap on this market. Add one first.</p>
        ) : (
          <div className="grid gap-3">
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted">Buyer</span>
              <select
                value={selected?.id ?? ""}
                onChange={(e) => setBuyerId(e.target.value)}
                className="h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
              >
                {eligible.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.company} · {money(b.pplRate)} · {b.soldThisMonth}/{b.monthlyCap}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-sm text-muted">
              {lead.service} · {lead.neighborhood || "metro"} · {lead.source}
            </p>
            <Button type="button" onClick={sell} className="w-full">
              Collect {selected ? money(selected.pplRate) : ""}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
