import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { SiteShell } from "@/components/SiteShell";
import { writing, writingIntro } from "@/content/writing";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Sam Mahdad on cutting Rippling Spend authorization latency from 3.5s to 600ms.",
};

export default function WritingPage() {
  const piece = writing[0];

  return (
    <SiteShell currentPath="/writing/">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <PageIntro
          kicker={writingIntro.kicker}
          title={writingIntro.title}
          lede={writingIntro.lede}
        />

        <article className="panel mt-14 px-6 py-8 sm:px-8 sm:py-10">
          <p className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase">
            {piece.publication} · {piece.year}
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-3xl leading-snug text-ink sm:text-4xl">
            <a href={piece.href} className="hover:text-brass" rel="noreferrer">
              {piece.title}
            </a>
          </h2>
          <p className="mt-3 text-sm text-muted">{piece.role}</p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/90">
            {piece.summary}
          </p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {piece.takeaways.map((item, index) => (
              <li
                key={item}
                className="border border-line bg-bg/40 px-4 py-4 text-sm leading-6 text-muted"
              >
                <span className="font-mono text-[11px] text-brass">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-ink/90">{item}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8">
            <a href={piece.href} className="btn btn-primary" rel="noreferrer">
              Read the original
            </a>
          </p>
        </article>

        <p className="mt-12 max-w-md font-display text-2xl text-ink">
          {writingIntro.close}
        </p>
      </div>
    </SiteShell>
  );
}
