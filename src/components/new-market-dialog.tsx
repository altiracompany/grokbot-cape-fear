import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
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
import { NICHES } from "@/lib/niches";
import { useAgency } from "@/lib/store";
import { CAPE_NICHES } from "@/lib/territory";
import { COUNTIES, type County } from "@/lib/types";
import { cn } from "@/lib/utils";

const NICHES_OPEN = NICHES.filter((n) => (CAPE_NICHES as readonly string[]).includes(n.id));

export function NewMarketDialog({ trigger }: { trigger?: ReactNode }) {
  const navigate = useNavigate();
  const addMarket = useAgency((s) => s.addMarket);
  const [open, setOpen] = useState(false);
  const [nicheId, setNicheId] = useState(NICHES_OPEN[0]?.id ?? "septic");
  const [counties, setCounties] = useState<County[]>(["new-hanover", "pender", "brunswick"]);
  const [neighborhoods, setNeighborhoods] = useState("");

  function toggleCounty(id: County) {
    setCounties((cur) => (cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id]));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (counties.length === 0) return;
    const id = addMarket({
      nicheId,
      counties,
      neighborhoods,
    });
    setOpen(false);
    setNeighborhoods("");
    void navigate({ to: "/markets/$marketId", params: { marketId: id } });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="min-h-11">
            Open niche
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Open a Cape Fear niche</DialogTitle>
          <DialogDescription>
            New Hanover, Pender, Brunswick only. We run the line. They get dedicated screened jobs — 2 free to start.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="niche">Niche</Label>
            <select
              id="niche"
              value={nicheId}
              onChange={(e) => setNicheId(e.target.value)}
              className="h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:outline-none"
            >
              {NICHES_OPEN.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label>Counties</Label>
            <div className="flex flex-wrap gap-2">
              {COUNTIES.map((c) => {
                const on = counties.includes(c.id);
                return (
                  <Button
                    key={c.id}
                    type="button"
                    size="sm"
                    variant={on ? "default" : "secondary"}
                    onClick={() => toggleCounty(c.id)}
                    className={cn("min-h-11")}
                  >
                    {c.label}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="hoods">Neighborhoods</Label>
            <Input
              id="hoods"
              value={neighborhoods}
              onChange={(e) => setNeighborhoods(e.target.value)}
              placeholder="Leland, Hampstead, Porters Neck"
            />
          </div>
          <Button type="submit" className="mt-1 w-full" disabled={counties.length === 0}>
            Own this line
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
