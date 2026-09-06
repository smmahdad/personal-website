import type { Metadata } from "next";
import { LatencyRuler } from "@/components/LatencyRuler";
import { PageIntro } from "@/components/PageIntro";
import { SiteShell } from "@/components/SiteShell";
import { work, workIntro } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Amazon Ads measurement and frequency capping, Rippling Spend latency, engineering at Cursor.",
};

export default function WorkPage() {
  return (
    <SiteShell currentPath="/work/">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <PageIntro
          kicker={workIntro.kicker}
          title={workIntro.title}
          lede={workIntro.lede}
        />
        <div className="mt-14 space-y-8">
          {work.map((story) => (
            <article
              key={story.id}
              id={story.id}
              className="panel scroll-mt-24 px-6 py-8 sm:px-8 sm:py-10"
            >
              <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
                {story.era} · {story.role}
              </p>
              <h2 className="font-display mt-3 text-4xl text-ink sm:text-5xl">
                {story.url ? (
                  <a href={story.url} className="hover:text-brass">
                    {story.company}
                  </a>
                ) : (
                  story.company
                )}
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/90">
                {story.summary}
              </p>
              {story.id === "rippling" ? <LatencyRuler /> : null}
              {story.pullQuote ? (
                <blockquote className="font-display my-8 max-w-2xl border-l-2 border-brass pl-5 text-2xl leading-snug text-ink sm:text-3xl">
                  {story.pullQuote}
                </blockquote>
              ) : null}
              <ul className="mt-6 max-w-2xl space-y-3 text-[17px] leading-7 text-muted">
                {story.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {story.beats?.length ? (
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {story.beats.map((beat) => (
                    <li
                      key={beat}
                      className="border border-line bg-bg/40 px-4 py-4 text-sm leading-6 text-ink/90"
                    >
                      {beat}
                    </li>
                  ))}
                </ul>
              ) : null}
              <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                {story.themes.map((theme) => (
                  <li key={theme.title} className="border border-line px-4 py-4">
                    <p className="font-mono text-[11px] tracking-[0.14em] text-brass uppercase">
                      {theme.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {theme.detail}
                    </p>
                  </li>
                ))}
              </ul>
              {story.links?.length ? (
                <ul className="mt-7 space-y-2 text-sm">
                  {story.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-brass underline decoration-brass/40 underline-offset-4"
                        rel="noreferrer"
                      >
                        {link.label} →
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
