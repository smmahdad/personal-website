import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { SiteShell } from "@/components/SiteShell";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Find Sam Mahdad on GitHub and LinkedIn. Email for sammah.dad is a placeholder until the inbox is live.",
};

const channels = [
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
];

export default function ContactPage() {
  return (
    <SiteShell currentPath="/contact/">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <PageIntro
          kicker="Hello"
          title="Contact"
          lede="I like useful conversations: systems, teams, recruiting, or a hello. LinkedIn is live. Email on this domain is not, yet."
        />
        <ul className="mt-14 divide-y divide-line border-y border-line">
          {channels.map((channel) => (
            <li key={channel.href}>
              <a
                href={channel.href}
                className="flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between"
                rel="noreferrer"
              >
                <span className="font-display text-2xl text-ink hover:text-brass">
                  {channel.label}
                </span>
                <span className="font-mono text-[13px] text-muted">
                  {channel.detail}
                </span>
              </a>
            </li>
          ))}
          <li className="flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between">
            {site.links.email ? (
              <a
                href={`mailto:${site.links.email}`}
                className="flex w-full flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="font-display text-2xl text-ink hover:text-brass">
                  Email
                </span>
                <span className="font-mono text-[13px] text-muted">
                  {site.links.email}
                </span>
              </a>
            ) : (
              <>
                <span className="font-display text-2xl text-ink">Email</span>
                <span className="max-w-md text-sm leading-6 text-muted">
                  {/* TODO: set site.links.email in src/content/site.ts once mail works */}
                  Placeholder — add a real address in{" "}
                  <code className="font-mono text-ink/80">src/content/site.ts</code>{" "}
                  when <span className="text-ink">{site.domain}</span> mail is ready.
                </span>
              </>
            )}
          </li>
        </ul>
      </div>
    </SiteShell>
  );
}
