import { domainFor } from "./utils";
import type { Market, Niche } from "./types";

export function suggestDomain(city: string, niche: Niche) {
  return domainFor(city, niche.slug);
}

export function moneyKeywords(city: string, niche: Niche) {
  const n = niche.name.replace(" / ", " ");
  const service = niche.services[0] ?? n;
  return [
    `${service.toLowerCase()} ${city}`,
    `${city} ${service.toLowerCase()}`,
    `emergency ${service.toLowerCase()} ${city}`,
    `${service.toLowerCase()} near me`,
    `${service.toLowerCase()} cost ${city}`,
    `24 hour ${service.toLowerCase()} ${city}`,
    `best ${service.toLowerCase()} ${city}`,
    `${city} ${niche.slug} company`,
    `${service.toLowerCase()} ${city} ${/* neighborhoods filled later */ "prices"}`,
    `${niche.gbpPrimary.toLowerCase()} ${city}`,
  ];
}

export function aeoQuestions(city: string, niche: Niche) {
  const s = (niche.services[0] ?? niche.name).toLowerCase();
  return [
    `How much does ${s} cost in ${city}?`,
    `Who do I call for ${s} in ${city}?`,
    `Is there 24 hour ${s} in ${city}?`,
    `How fast can I get ${s} in ${city}?`,
    `Do I need ${s} every year in ${city}?`,
    `What neighborhoods do you serve near ${city}?`,
    `Are you licensed for ${s} in ${city}?`,
    `What's included in a typical ${s} job?`,
    `Who is the best ${s} company in ${city}?`,
    `Can I get same-day ${s} in ${city}?`,
  ];
}

export function pageList(city: string, niche: Niche, neighborhoods: string[]) {
  const area = neighborhoods.slice(0, 3).join(", ");
  const s = (niche.services[0] ?? niche.name).toLowerCase();
  const range = niche.jobRange;
  return [
    {
      name: "Home",
      path: "/",
      lead: `${city} ${s} with a real person on the line. We cover ${area || city} and run ${niche.hours}.`,
    },
    {
      name: "Service",
      path: "/service",
      lead: `This page is only about ${s} — not a junk drawer of every trade. ${niche.services.slice(0, 3).join(", ")}.`,
    },
    {
      name: "Emergency",
      path: "/emergency",
      lead:
        niche.urgency === "emergency"
          ? `If it can't wait, call. ${city} ${s} with after-hours dispatch and a tracking number on every job.`
          : `Same-day windows for ${city} ${s} when the job is a fire, flood, or no-heat problem.`,
    },
    {
      name: "Pricing / How much",
      path: "/pricing",
      lead: `Typical ${s} in ${city} runs ${range} before extras. You get a number before anyone rolls.`,
    },
    {
      name: "Areas served",
      path: "/areas",
      lead: `Primary: ${city}. Neighborhoods: ${neighborhoods.join(", ") || "metro"}. We do not fake statewide coverage.`,
    },
    {
      name: "FAQ",
      path: "/faq",
      lead: `Spoken questions. Cost, timing, neighborhoods, and who to call — written so AI Overviews can cite it.`,
    },
    {
      name: "Contact",
      path: "/contact",
      lead: `Click-to-call first. Short form second. No chat widget, no email ping-pong.`,
    },
  ];
}

export function schemaPlan() {
  return [
    {
      type: "LocalBusiness",
      use: "NAP, geo, hours, telephone, areaServed, priceRange",
    },
    { type: "Service", use: "Each money service with areaServed + offers range" },
    { type: "FAQPage", use: "The 10 AEO questions, answer-first" },
    { type: "Review", use: "Only real reviews we can show — never invented" },
  ];
}

export function conversionPath(city: string, tracking = "(xxx) xxx-xxxx") {
  return [
    `Primary: tap-to-call ${tracking} on every page — rings OUR desk, not the owner.`,
    `Secondary: 3-field form — name, phone, neighborhood in ${city}. We call back and screen.`,
    `No quote mill. Screened handoff to the owner. First 2 free. We keep the site.`,
  ];
}

export function buildBlueprint(market: Market, niche: Niche) {
  const city = market.city;
  return {
    domain: market.domain || suggestDomain(city, niche),
    pages: pageList(city, niche, market.neighborhoods),
    keywords: moneyKeywords(city, niche).map((k, i) =>
      i === 8 && market.neighborhoods[0]
        ? `${(niche.services[0] ?? niche.name).toLowerCase()} ${market.neighborhoods[0]}`
        : k,
    ),
    questions: aeoQuestions(city, niche),
    schema: schemaPlan(),
    gbpPrimary: niche.gbpPrimary,
    gbpSecondary: niche.gbpSecondary,
    conversion: conversionPath(city, market.trackingNumber),
    hours: niche.hours,
    services: niche.services,
  };
}
