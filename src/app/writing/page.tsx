import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { SiteShell } from "@/components/SiteShell";
import { writing, writingIntro } from "@/content/writing";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Public writing by Sam Mahdad, including the Rippling Engineering post on cutting Spend authorization latency from 3.5s to 600ms.",
};

export default function WritingPage() {
  return (
    <SiteShell currentPath="/writing/">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <PageIntro
          kicker={writingIntro.kicker}
          title={writingIntro.title}
          lede={writingIntro.lede}
        />
        <ol className="mt-14 divide-y divide-line border-y border-line">
          {writing.map((piece) => (
            <li key={piece.href} className="py-10">
              <p className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase">
                {piece.publication} · {piece.year}
              </p>
              <h2 className="font-display mt-3 max-w-3xl text-3xl leading-snug text-ink">
                <a href={piece.href} className="hover:text-brass" rel="noreferrer">
                  {piece.title}
                </a>
              </h2>
              <p className="mt-2 text-sm text-muted">{piece.role}</p>
              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-muted">
                {piece.summary}
              </p>
              <ul className="mt-6 max-w-2xl list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
                {piece.takeaways.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-6">
                <a
                  href={piece.href}
                  className="text-brass underline decoration-brass/40 underline-offset-4"
                  rel="noreferrer"
                >
                  Read the original →
                </a>
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-10 max-w-xl text-sm leading-7 text-faint">
          Room for more. If I write again, it will land in{" "}
          <code className="font-mono text-muted">src/content/writing.ts</code>.
        </p>
      </div>
    </SiteShell>
  );
}
