import { useEffect, useState } from "react";
import { Check, Copy, Loader2, PenLine } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { draftWithGrok } from "@/lib/grok";

export function CopyBlock({
  text,
  label,
  grokKind,
  grokBrief,
}: {
  text: string;
  label?: string;
  grokKind?: "outreach" | "offer" | "reject" | "report" | "blueprint";
  grokBrief?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState(text);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft(text);
  }, [text]);

  async function onCopy() {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  async function onGrok() {
    if (!grokKind || !grokBrief) return;
    setBusy(true);
    try {
      const res = await draftWithGrok({ data: { kind: grokKind, brief: grokBrief } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setDraft(res.text);
      toast.success("Draft replaced.");
    } catch {
      toast.error("Grok request failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl bg-elevated shadow-[var(--shadow-border)]">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <p className="text-xs font-medium tracking-wider text-muted uppercase">{label ?? "Copy"}</p>
        <div className="flex items-center gap-1">
          {grokKind ? (
            <Button type="button" size="sm" variant="ghost" onClick={onGrok} disabled={busy}>
              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <PenLine className="size-3.5" />}
              Draft
            </Button>
          ) : null}
          <Button type="button" size="sm" variant="ghost" onClick={onCopy}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <pre className="max-h-96 overflow-auto px-3 py-3 font-sans text-sm leading-relaxed whitespace-pre-wrap text-fg">
        {draft}
      </pre>
    </div>
  );
}
