import { createServerFn } from "@tanstack/react-start";

const SYSTEM = `You are Grokbot, operator for a Cape Fear (New Hanover, Pender, Brunswick) lead desk.
We CREATE and OWN ranking sites. Our call center answers every inbound, captures the conversation, screens it, and hands a HOT job to a local owner.
First 2 screened handoffs per owner are FREE, then pay-per-lead. Exclusive auctions are PARKED.
We do not compete with Angi, Thumbtack, or Google LSA on generic plumber / HVAC / electrician. We flank hyper-specific niches they list but do not rank (septic, dryer vent, well, standby generator). Copycat rank-and-rent shops and AI site farms are coming — first-mover on domain + GBP is the moat. Pitch jobs, not rankings. Name the mill in sentence one when writing owner outreach.
Voice: short sentences. Numbers over adjectives. Tie price to jobs, not traffic.
Never promise guaranteed #1. Never sell fake reviews. Never dump unscreened callers.
Output only the copy requested. No preamble.`;

type DraftInput = {
  kind: "outreach" | "offer" | "reject" | "report" | "blueprint";
  brief: string;
};

export const draftWithGrok = createServerFn({ method: "POST" })
  .validator((input: DraftInput) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Grok is not available in this environment." };

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.4,
        max_tokens: 700,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Write ${data.kind} copy.\n\n${data.brief}` },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `Grok request failed (${res.status}).` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "Empty draft." };
    return { ok: true as const, text };
  });
