import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { SiteShell } from "@/components/SiteShell";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sam Mahdad: community college, Berkeley, New York. Amazon Ads, Rippling Spend, Cursor.",
};

export default function AboutPage() {
  return (
    <SiteShell currentPath="/about/">
      <article className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <PageIntro kicker={about.kicker} title={about.title} lede={about.lede} />

        <blockquote className="font-display mt-12 max-w-xl text-3xl leading-snug text-ink sm:text-4xl">
          {about.pullQuote}
        </blockquote>

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="grid gap-4">
            {about.sections.map((section) => (
              <section key={section.heading} className="panel px-6 py-7">
                <h2 className="font-display text-2xl text-ink">
                  {section.heading}
                </h2>
                <ul className="mt-5 space-y-3 text-[17px] leading-7 text-muted">
                  {section.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <aside className="grid gap-4 content-start">
            {about.asides.map((aside) => (
              <div key={aside.label} className="panel px-5 py-5">
                <h2 className="font-mono text-[11px] tracking-[0.18em] text-brass uppercase">
                  {aside.label}
                </h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                  {aside.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>
        </div>
      </article>
    </SiteShell>
  );
}
