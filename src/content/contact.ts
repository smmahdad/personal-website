import { site } from "./site";

export const contact = {
  title: "Contact",
  kicker: "Hello",
  lede: "Systems, teams, recruiting, or just hi.",
  channels: [
    {
      label: site.links.github.label,
      href: site.links.github.href,
      detail: `@${site.links.github.handle}`,
    },
    {
      label: site.links.linkedin.label,
      href: site.links.linkedin.href,
      detail: "Fastest way to reach me",
    },
  ],
} as const;
