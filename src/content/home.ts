import { site } from "./site";

export const home = {
  eyebrow: `${site.currentRole.title} at ${site.currentRole.company} · ${site.location}`,
  headline: site.name,
  lead: site.tagline,
  now: [
    {
      label: "Now",
      title: "Cursor",
      detail: "Engineering. AI coding product.",
    },
    {
      label: "Before",
      title: "Rippling",
      detail: "Staff → Director. Spend. Later, hiring around Travel too.",
    },
    {
      label: "Before that",
      title: "Amazon Ads",
      detail: "L6. Measurement, frequency capping, high QPS.",
    },
  ],
  featuredStat: {
    kicker: "Rippling Spend · auth p99",
    value: "3.5s → 600ms",
    detail: "Four seconds before the network kills the charge.",
    href: "/work/#rippling",
  },
  close: "Recruiting, a system, or just hi. LinkedIn is fastest.",
} as const;
