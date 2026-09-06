/**
 * Personal copy. First person. Short. Sounds like Sam talking.
 *
 * Soft / editable facts:
 * - Exact Cursor start date: unknown here; do not add one.
 * - Mentor names below are from a public LinkedIn post about becoming
 *   Director of Engineering at Rippling (Oct 2025).
 * - ASL proficiency is listed on the public LinkedIn profile.
 * - Governors Island details come from a public Spend org offsite post.
 */

export const about = {
  title: "About",
  kicker: "Hi",
  lede: "Community college. Berkeley. New York.",
  pullQuote: "Crazy to even be saying Director. Still true.",
  sections: [
    {
      heading: "School",
      lines: [
        "Orange Coast College — A.S. Math.",
        "UC Berkeley — B.A. CS.",
        "Community college first. Then I got to work.",
      ],
    },
    {
      heading: "The jobs",
      lines: [
        "Amazon Ads for about five years. Measurement. Frequency capping.",
        "Rippling: Staff → EM → Senior EM → Director. Mostly Spend.",
        "We made Spend something you could buy without dragging in HCM or Payroll.",
        "Cursor now. Maker on Grok Bot. Product Hunt #2.",
      ],
    },
    {
      heading: "People",
      lines: [
        "Malte Buecken. Daniel St. Jules. Albert Strasheim. Still shouting them out.",
        "Favorite Rippling day: Governors Island. Grilling. Games. Storm the night before.",
      ],
    },
  ],
  asides: [
    {
      label: "Based",
      items: ["New York"],
    },
    {
      label: "Also",
      items: ["English", "ASL"],
    },
  ],
} as const;
