import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { SiteShell } from "@/components/SiteShell";
import { contact } from "@/content/contact";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Find Sam Mahdad on GitHub and LinkedIn.",
};

export default function ContactPage() {
  return (
    <SiteShell currentPath="/contact/">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <PageIntro
          kicker={contact.kicker}
          title={contact.title}
          lede={contact.lede}
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {contact.channels.map((channel) => (
            <li key={channel.href}>
              <a
                href={channel.href}
                className="panel lift flex h-full flex-col justify-between px-6 py-8"
                rel="noreferrer"
              >
                <span className="font-display text-3xl text-ink">
                  {channel.label}
                </span>
                <span className="mt-6 font-mono text-[13px] text-muted">
                  {channel.detail}
                </span>
              </a>
            </li>
          ))}
          {site.links.email ? (
            <li>
              <a
                href={`mailto:${site.links.email}`}
                className="panel lift flex h-full flex-col justify-between px-6 py-8"
              >
                <span className="font-display text-3xl text-ink">Email</span>
                <span className="mt-6 font-mono text-[13px] text-muted">
                  {site.links.email}
                </span>
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </SiteShell>
  );
}
