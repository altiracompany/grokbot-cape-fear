import { createServerFn } from "@tanstack/react-start";

const SYSTEM = `You write for Freedom Project Leads. We get jobs for one local company in a county (Bexar, Comal, Guadalupe; also New Hanover, Pender, Brunswick).
Never agency jargon: no "lead gen," "dedicated," "desk," "packet," "screened handoff," "turnkey," "ICP," "SKU," "CMO," "funnel," "nurture," "optimization," "inbound," "mill," "PPL," "seat."
Say: jobs, truck, county, robot, text you the name and street, one company, you go.
Never say we own the page, they rent, or we re-auction. Jobs feel like theirs.
A robot answers. It says it's a robot. Then we text the job to that one company.
$500 a week after two free jobs. Mail to 5,000 homes is $300. If they're slammed: we run it, $2,500 + $750/wk.
Don't fight Angi on plumber. Fence, gutters, septic, quince — specific work.
Voice: short sentences. Numbers. Jobs not traffic. 5th grade.
Public posts: value only. Offer in the DM. CTA is YES.
Never promise #1. Never fake reviews. Never dump raw callers.
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
