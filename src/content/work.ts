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
  paragraphs: string[];
  themes: WorkTheme[];
  links?: { label: string; href: string }[];
};

export const workIntro = {
  title: "Work",
  kicker: "What I actually built",
  lede: "Three chapters I can talk about in public: Amazon Ads at high QPS, Rippling Spend under a four-second budget, and Cursor now. Substance over the adjective pile.",
} as const;

export const work: WorkStory[] = [
  {
    id: "cursor",
    company: "Cursor",
    role: "Engineering",
    era: "Current",
    url: "https://cursor.com",
    summary:
      "I'm at Cursor, working on the AI coding product. That's the public version, and it's the true one.",
    paragraphs: [
      "Cursor is where I am now. I am not going to invent a more specific title or a start date for a personal site. LinkedIn says Engineering. That's enough.",
      "What I will say: I like tools that make ambitious software feel more possible. After years of systems that decline a charge or mis-measure a model if you get them wrong, I care about products that sit in the critical path of how people build.",
    ],
    themes: [
      {
        title: "Public, not private",
        detail:
          "No product internals, no team map, no invented scope. If you want more, talk to me.",
      },
    ],
  },
  {
    id: "rippling",
    company: "Rippling",
    role: "Staff Engineer → EM → Senior EM → Director of Engineering",
    era: "Spend, then a wider org",
    url: "https://www.rippling.com",
    summary:
      "I went deep on Spend — corporate cards, bill pay, the authorization API — and later helped hire and lead around that org, including Travel.",
    pullQuote:
      "A charge has about four seconds. Miss the budget and someone doesn't pay for dinner, or AWS.",
    paragraphs: [
      "I joined Rippling as a Staff Engineer and stayed long enough to manage, then direct. Most of the work I can point at lives in Spend: expense requests, corporate cards, bill pay, the messy reality of money moving in a product that also had to stand alone.",
      "The technical story I wrote down is the authorization API. Every swipe calls it. It evaluates policies, risk and fraud models, card and company limits — and it has to finish in about four seconds or the network declines the charge for you. We took the 99th percentile from around 3.5 seconds down to about 600 milliseconds. That was not one clever trick. It was a pile of unglamorous ones.",
      "Composite indexes are left-to-right. We had a transactions index on company, role, card, transaction_date and a query that omitted company. The planner couldn't use the index. Including the leading field was the whole fix, and it is the kind of fix you only find if you actually look.",
      "The planner also picked the wrong index about one percent of the time. We reproduced the p99 spike with the same parameters ten thousand times, stored planner results next to latencies, and hinted Mongo at the index we meant. Hints are a loaded gun — data shape changes — but the intermittent spike was real.",
      "Connections were worse than they looked. The cluster opened database connections just-in-time with a short expiry. Opening one could cost 125ms, and it scaled with dependencies. Hourly CI/CD recycled pods, so the load balancer kept finding cold ones. We pooled connections, lengthened expiry, and ran a warmup script at boot that had to succeed before the app took traffic.",
      "Then the third party. After our own work, roughly 300ms was us and 400ms to 2.5s+ was a vendor. A 1.5s timeout capped the damage but blocked everything else. We kicked the I/O onto a thread, did independent work while it flew, and joined with a timeout. p99 went from about 800ms to 600ms. The ceiling stayed 1.5s because the vendor is the vendor.",
      "The other thing I am proud of is not a latency number. We got Spend sellable without onboarding onto Rippling Payroll or HCM. Corporate cards, bill pay, visibility — as a product, not a bundle tax. I hired for that org, including a new Travel product, and I still think about the people more than the flame graphs.",
    ],
    themes: [
      {
        title: "p99",
        detail: "~3.5s → ~600ms on the authorization path",
      },
      {
        title: "Budget",
        detail: "~4 seconds before the network declines the charge",
      },
      {
        title: "Product",
        detail: "Spend usable without full Rippling HCM / Payroll",
      },
    ],
    links: [
      {
        label: "Building Spend Management: Slashing latencies from 3.5s to 600ms",
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
      "Tech lead across multiple teams on online measurement of ML models for unrecognized traffic, and frequency capping that had to hold up at high QPS.",
    pullQuote:
      "Unrecognized traffic still has a frequency. Someone has to measure the model anyway.",
    paragraphs: [
      "I spent about five years at Amazon, last as a Senior Lead Software Engineer (L6) in Advertising. The work that is public: I tech-led across several teams on online measurement of machine-learned models for completely unrecognized traffic — so other teams could see what their models would actually do, not what a dashboard hoped they would do. That design went through an org-wide review.",
      "I also tech-led frequency capping on unrecognized traffic via ML, and a path that surfaced frequency-cap blocklists to the Amazon Ad Exchange. The public numbers on that architecture are about 100k reads per second and about 80k writes per second. The stack around it was the usual Ads one: Java, Python, EMR, Spark, Redis, Kinesis, Lambda.",
      "I was a founding member of the modeled frequency-capping team. We grew from two engineers into a mixed group of engineers and applied scientists. The culture work was not a side quest. Tech demos, book clubs, shared cooking recipes, joint working sessions. I still think that is how you get ownership that survives a re-org.",
    ],
    themes: [
      {
        title: "Measurement",
        detail: "Online impact of ML models on unrecognized traffic",
      },
      {
        title: "Frequency capping",
        detail: "Public claims ~100k reads/s and ~80k writes/s",
      },
      {
        title: "Team",
        detail: "Founding member; mentoring and a culture that was allowed to be human",
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
