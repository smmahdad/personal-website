export const writingIntro = {
  title: "Writing",
  kicker: "Things I signed my name to",
  lede: "I don't publish a lot. When I do, I want it to be useful to someone who has the same class of problem on Monday.",
} as const;

export const writing = [
  {
    title: "Building Spend Management: Slashing latencies from 3.5s to 600ms",
    publication: "Rippling Engineering",
    year: "2024",
    href: "https://www.rippling.com/blog/building-spend-management-slashing-latencies",
    role: "Author — then Engineering Manager, Spend Management",
    summary:
      "How we brought the authorization API's 99th percentile from around 3.5 seconds to 600 milliseconds: composite index gotchas, query planner hints, connection pooling and warmup for hourly CI/CD cold starts, and multithreading third-party I/O with timeouts. Application layer only. The four-second card-network budget is the plot.",
    takeaways: [
      "Indexes are left-to-right. Missing the leading field means you don't have an index.",
      "The planner can be wrong 1% of the time. That 1% is your p99.",
      "Hourly deploys plus just-in-time connections is a cold-start machine.",
      "A timeout that blocks the rest of the request is only half a timeout.",
    ],
  },
] as const;
