/**
 * Site-wide facts and links. Edit here when roles, URLs, or meta copy change.
 *
 * CONTENT NOTES (do not invent beyond public sources):
 * - Cursor title is listed publicly as "Engineering". Do not upgrade this
 *   to a more specific title unless Sam updates it.
 * - Cursor start date is not stated with enough certainty to print. Keep
 *   the current-role copy date-free.
 * - Email is intentionally unset until a real inbox exists for sammah.dad.
 * - Grok Bot Product Hunt launch (Aug 12, 2026): Sam is listed as a Maker.
 *   Public ranks: #2 of the day, #2 of the week. Do not invent contribution
 *   scope, upvote counts, or product internals.
 */

export const grokBotLaunch = {
  product: "Grok Bot",
  tagline: "AI teammates that you can give real work to",
  href: "https://www.producthunt.com/products/grok/launches/grok-bot",
  date: "August 12, 2026",
  dayRank: 2,
  weekRank: 2,
  role: "Maker",
} as const;

export const site = {
  name: "Sam Mahdad",
  shortName: "Sam",
  domain: "sammah.dad",
  url: "https://sammah.dad",
  locale: "en_US",
  location: "New York",
  currentRole: {
    title: "Engineering",
    company: "Cursor",
    companyUrl: "https://cursor.com",
    summary: "AI coding product",
  },
  tagline: "Declined cards. Bad measurements. Tools people actually use.",
  description:
    "Sam Mahdad. Engineering at Cursor. Previously Rippling Spend and Amazon Ads.",
  links: {
    github: {
      label: "GitHub",
      href: "https://github.com/smmahdad",
      handle: "smmahdad",
    },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/smmahdad",
      handle: "smmahdad",
    },
    email: null as string | null,
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/about/", label: "About" },
    { href: "/work/", label: "Work" },
    { href: "/writing/", label: "Writing" },
    { href: "/lab/", label: "Lab" },
    { href: "/contact/", label: "Contact" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
