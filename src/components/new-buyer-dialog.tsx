import { useState, type FormEvent, type ReactNode } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { nicheById } from "@/lib/niches";
import { useAgency } from "@/lib/store";
import { COUNTIES, type County } from "@/lib/types";
import { money } from "@/lib/utils";

export function NewBuyerDialog({ marketId, trigger }: { marketId?: string; trigger?: ReactNode }) {
  const markets = useAgency((s) => s.markets);
  const addBuyer = useAgency((s) => s.addBuyer);
  const live = markets.filter((m) => m.stage === "live" || m.stage === "ranking" || m.stage === "build");
  const [open, setOpen] = useState(false);
  const [mid, setMid] = useState(marketId ?? live[0]?.id ?? markets[0]?.id ?? "");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cap, setCap] = useState("12");
  const [county, setCounty] = useState<County>("brunswick");

  const market = markets.find((m) => m.id === (marketId || mid));

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!market || !name.trim() || !company.trim() || !phone.trim()) return;
    addBuyer({
      name,
      company,
      phone,
      email,
      marketId: market.id,
      county,
      pplRate: market.pplPrice,
      monthlyCap: Number(cap) || 12,
    });
    toast.success(`${company} pitched for ${COUNTIES.find((c) => c.id === county)?.label} · $500/wk`);
    setOpen(false);
    setName("");
    setCompany("");
    setPhone("");
    setEmail("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button size="sm">Onboard owner</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Claim a county seat</DialogTitle>
          <DialogDescription>
            One owner per niche per county. 2 free jobs, then the monthly seat. They never own the page.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          {!marketId ? (
            <div className="grid gap-1.5">
              <Label htmlFor="bm">Niche</Label>
              <select
                id="bm"
                value={mid}
                onChange={(e) => setMid(e.target.value)}
                className="h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
              >
                {markets.map((m) => (
                  <option key={m.id} value={m.id}>
                    {nicheById(m.nicheId).name} · {m.city}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="bn">Owner</Label>
              <Input id="bn" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="bc">Company</Label>
              <Input id="bc" value={company} onChange={(e) => setCompany(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="bp">Phone</Label>
              <Input id="bp" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="be">Email</Label>
              <Input id="be" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="cty">County seat</Label>
              <select
                id="cty"
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
            <div className="grid gap-1.5">
              <Label htmlFor="cap">Overage cap</Label>
              <Input id="cap" inputMode="numeric" value={cap} onChange={(e) => setCap(e.target.value)} />
            </div>
          </div>
          <p className="text-sm text-muted">
            2 free, then $500 a week exclusive. Extra jobs {market ? money(market.pplPrice) : "—"}.
          </p>
          <Button type="submit" className="w-full">
            Add to hunt
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
