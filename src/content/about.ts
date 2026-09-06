/**
 * Personal copy. Rewrite freely — this is meant to sound like Sam, not a résumé.
 *
 * Soft / editable facts:
 * - Exact Cursor start date: unknown here; do not add one.
 * - Mentor names below are from a public LinkedIn post about becoming
 *   Director of Engineering at Rippling (Oct 2025).
 * - ASL proficiency is listed on the public LinkedIn profile.
 * - Governors Island / WTC details come from a public Spend org offsite post.
 */

export const about = {
  title: "About",
  kicker: "Person first",
  lede: "Community college, Berkeley, New York, and a bias toward high agency. The work is in the systems. The point is the people.",
  sections: [
    {
      heading: "The long way around",
      paragraphs: [
        "I grew up into engineering the long way around: an A.S. in Mathematics at Orange Coast College, then a B.A. in Computer Science at UC Berkeley. That path still shapes how I work. I don't assume the room already knows. I like making hard systems understandable, and I like leaving teams better than I found them.",
        "I'm based in the New York area. A lot of my Rippling years lived in and around a WTC office — hybrid weeks, the occasional afternoon we actually got outside, and a running preference for people being in a room together when it matters.",
      ],
    },
    {
      heading: "How I like to work",
      paragraphs: [
        "The through-line is high agency. I want to own the outcome, not the ticket. At Amazon Ads that looked like tech-leading measurement and frequency-capping work across teams, plus the unglamorous culture stuff: tech demos, book clubs, shared cooking recipes, sitting down and working a problem through together.",
        "At Rippling it looked like going from Staff Engineer to Engineering Manager to Senior EM to Director of Engineering, mostly inside Spend. I care about shipping a product someone can actually buy — we got Spend to a place where you didn't need Rippling HCM or Payroll to use it — and I care about the teams that make that possible. One of my favorite days was trading the office for a Spend org offsite on Governors Island. Grilling, games, a storm the night before. That's the texture I want around the work.",
      ],
    },
    {
      heading: "Gratitude, then the next problem",
      paragraphs: [
        "When I became a Director of Engineering at Rippling I said out loud that it was crazy to even be saying it. I meant it. Career jumps don't happen in a vacuum. I shouted out Malte Buecken, Daniel St. Jules, and Albert Strasheim then, and I'll shout them out again here, along with the engineers who kept raising the bar. Rippling was a career accelerant because the company actually means it about ownership.",
        "These days I'm at Cursor. The day-to-day of that work belongs to the team. What I can say publicly is that I care about tools that raise the ceiling for people who want to ship.",
        "If you want the short version: I like problems where latency, correctness, and people all show up in the same sentence.",
      ],
    },
  ],
  asides: [
    {
      label: "Education",
      items: [
        "B.A. Computer Science, UC Berkeley",
        "A.S. Mathematics, Orange Coast College",
      ],
    },
    {
      label: "Based",
      items: ["New York area"],
    },
    {
      label: "Also",
      items: [
        "English",
        "American Sign Language — listed on LinkedIn as professional working proficiency",
      ],
    },
  ],
} as const;
