import { site } from "./site";

export const home = {
  eyebrow: `${site.currentRole.title} at ${site.currentRole.company} · ${site.location}`,
  headline: site.name,
  lead: site.tagline,
  body: [
    "I'm at Cursor now, working on an AI coding product. Before that I helped turn Rippling Spend into something you could buy on its own — corporate cards, bill pay, the authorization path that has about four seconds before a charge dies. Before that, about five years at Amazon Ads as a senior lead (L6), mostly measurement and frequency capping at high QPS.",
    "This site is the short version of who I am and what I've actually built. If you want the long version of a latency story, I wrote that one down.",
  ],
  now: [
    {
      label: "Now",
      title: "Cursor",
      detail: "Engineering on an AI coding product. Public title is just Engineering — that's accurate enough.",
    },
    {
      label: "Before",
      title: "Rippling",
      detail: "Staff Engineer → Engineering Manager → Senior EM → Director of Engineering. Deep in Spend; later hiring around Travel too.",
    },
    {
      label: "Before that",
      title: "Amazon Ads",
      detail: "Senior Lead Software Engineer (L6). Online measurement of ML models, frequency capping, mentoring, the unglamorous culture work.",
    },
  ],
  close: "If you want to talk — recruiting, a system, or just a hello — LinkedIn is the fastest path until email on this domain is live.",
} as const;
