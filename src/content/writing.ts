export const writingIntro = {
  title: "Writing",
  kicker: "Signed",
  lede: "I don't write a lot. This one I still send people.",
  close: "More when I have something worth signing.",
} as const;

export const writing = [
  {
    title: "Building Spend Management: Slashing latencies from 3.5s to 600ms",
    publication: "Rippling Engineering",
    year: "2024",
    href: "https://www.rippling.com/blog/building-spend-management-slashing-latencies",
    role: "Author — then Engineering Manager, Spend Management",
    summary:
      "Auth API p99: ~3.5s → 600ms. Composite indexes, planner hints, connection warmup, third-party I/O that doesn't block the rest of the request. Application layer only. The four-second card-network budget is the plot.",
    takeaways: [
      "Indexes are left-to-right. Miss the leading field and you don't have an index.",
      "The planner can be wrong 1% of the time. That 1% is your p99.",
      "Hourly deploys plus just-in-time connections is a cold-start machine.",
      "A timeout that blocks the rest of the request is only half a timeout.",
    ],
  },
] as const;
