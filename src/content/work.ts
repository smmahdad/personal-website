import { grokBotLaunch } from "./site";

/**
 * Work stories from public sources only.
 *
 * Do not add employers, awards, headcount, or dates that are not below
 * or in src/content/site.ts. Rippling title sequence is public; exact
 * start/end months are left off on purpose.
 */

export type WorkTheme = {
  title: string;
  detail: string;
};

export type WorkStory = {
  id: string;
  company: string;
  role: string;
  era: string;
  url?: string;
  summary: string;
  pullQuote?: string;
  lines: string[];
  beats?: string[];
  themes: WorkTheme[];
  links?: { label: string; href: string }[];
  badge?: { kicker: string; label: string; href: string };
};

export const workIntro = {
  title: "Work",
  kicker: "What I built",
  lede: "Amazon at high QPS. Rippling under a four-second budget. Cursor now — Grok Bot hit #2.",
} as const;

export const work: WorkStory[] = [
  {
    id: "cursor",
    company: "Cursor",
    role: "Engineering",
    era: "Now",
    url: "https://cursor.com",
    summary: "I'm at Cursor. Maker on Grok Bot. #2 of the day.",
    lines: [
      "Maker on the Grok Bot launch. #2 of the day, #2 of the week.",
    ],
    themes: [
      {
        title: "Now",
        detail: "Engineering. AI coding product.",
      },
      {
        title: "Grok Bot",
        detail: `Maker. Product Hunt #${grokBotLaunch.dayRank} of the day.`,
      },
      {
        title: "Week",
        detail: `#${grokBotLaunch.weekRank} of the week too.`,
      },
    ],
    badge: {
      kicker: "Product Hunt",
      label: `${grokBotLaunch.product} · #${grokBotLaunch.dayRank} of the day`,
      href: grokBotLaunch.href,
    },
    links: [
      {
        label: "Grok Bot on Product Hunt",
        href: grokBotLaunch.href,
      },
    ],
  },
  {
    id: "rippling",
    company: "Rippling",
    role: "Staff → EM → Senior EM → Director",
    era: "Spend, then a wider org",
    url: "https://www.rippling.com",
    summary:
      "Corporate cards. Bill pay. The auth path with about four seconds before a charge dies.",
    pullQuote:
      "Miss the budget and someone doesn't pay for dinner. Or AWS.",
    lines: [
      "Joined as Staff. Left as Director. Most of what I can point at is Spend.",
      "Auth p99: ~3.5s → ~600ms. Not one trick. A pile of unglamorous ones.",
      "Hired for that org, including a new Travel product.",
    ],
    beats: [
      "Indexes are left-to-right. Miss the leading field and you don't have an index.",
      "Planner was wrong 1% of the time. That 1% is your p99.",
      "Hourly deploys + just-in-time connections = cold-start machine.",
      "A timeout that blocks the rest of the request is only half a timeout.",
    ],
    themes: [
      {
        title: "p99",
        detail: "~3.5s → ~600ms on auth",
      },
      {
        title: "Budget",
        detail: "~4 seconds or the network declines it",
      },
      {
        title: "Product",
        detail: "Spend without forcing HCM / Payroll",
      },
    ],
    links: [
      {
        label: "The latency write-up",
        href: "https://www.rippling.com/blog/building-spend-management-slashing-latencies",
      },
    ],
  },
  {
    id: "amazon",
    company: "Amazon Ads",
    role: "Senior Lead Software Engineer (L6)",
    era: "About five years",
    url: "https://advertising.amazon.com",
    summary:
      "Tech lead on measurement and frequency capping. Unrecognized traffic. High QPS.",
    pullQuote:
      "Unrecognized traffic still has a frequency. Someone has to measure the model anyway.",
    lines: [
      "Measured ML models on traffic nobody recognized. Org-wide review.",
      "Frequency capping via ML. Then blocklists out to the Ad Exchange. ~100k reads/s, ~80k writes/s.",
      "Founding member of that team. Two engineers, then more. Demos, book clubs, shared recipes. Yeah, recipes.",
    ],
    themes: [
      {
        title: "Measurement",
        detail: "Online impact of ML models on unrecognized traffic",
      },
      {
        title: "QPS",
        detail: "~100k reads/s · ~80k writes/s",
      },
      {
        title: "Team",
        detail: "Founding member. Mentoring. Yeah, recipes.",
      },
    ],
  },
];

export const latency = {
  budgetMs: 4000,
  beforeMs: 3500,
  afterMs: 600,
  beforeLabel: "p99 before",
  afterLabel: "p99 after",
  budgetLabel: "network decline",
} as const;
