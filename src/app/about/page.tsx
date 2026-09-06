import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { SiteShell } from "@/components/SiteShell";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who Sam Mahdad is as a person: community college to Berkeley, New York, high-agency teams, and the work that is allowed to be human.",
};

export default function AboutPage() {
  return (
    <SiteShell currentPath="/about/">
      <article className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <PageIntro kicker={about.kicker} title={about.title} lede={about.lede} />
        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="space-y-12">
            {about.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl text-ink">
                  {section.heading}
                </h2>
                <div className="mt-4 max-w-xl space-y-4 text-[17px] leading-8 text-muted">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="space-y-8 border-t border-line pt-8 lg:border-t-0 lg:pt-0">
            {about.asides.map((aside) => (
              <div key={aside.label}>
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
