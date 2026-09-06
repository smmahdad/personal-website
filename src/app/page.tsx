import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { LatencyRuler } from "@/components/LatencyRuler";
import { home } from "@/content/home";
import { work } from "@/content/work";
import { writing } from "@/content/writing";

export default function HomePage() {
  return (
    <SiteShell currentPath="/">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <section className="border-b border-line py-16 sm:py-24">
          <p className="font-mono text-[11px] tracking-[0.2em] text-brass uppercase">
            {home.eyebrow}
          </p>
          <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[0.95] text-ink sm:text-7xl">
            {home.headline}
          </h1>
          <p className="mt-8 max-w-xl text-xl leading-8 text-ink/90">
            {home.lead}
          </p>
          <div className="mt-8 max-w-xl space-y-4 text-[17px] leading-8 text-muted">
            {home.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/work/"
              className="bg-brass px-4 py-2 text-sm font-medium text-bg-soft hover:bg-brass-hot"
            >
              Work and systems
            </Link>
            <Link
              href="/about/"
              className="border border-line px-4 py-2 text-sm text-ink hover:border-brass"
            >
              About the person
            </Link>
          </div>
        </section>

        <section className="grid gap-8 border-b border-line py-14 md:grid-cols-3">
          {home.now.map((item) => (
            <article key={item.title}>
              <p className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase">
                {item.label}
              </p>
              <h2 className="font-display mt-2 text-2xl text-ink">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="border-b border-line py-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-ink">Selected work</h2>
            <Link
              href="/work/"
              className="font-mono text-[11px] tracking-[0.14em] text-brass uppercase"
            >
              Full stories
            </Link>
          </div>
          <LatencyRuler />
          <ul className="divide-y divide-line border-t border-line">
            {work.map((story) => (
              <li key={story.id}>
                <Link
                  href={`/work/#${story.id}`}
                  className="group flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
                      {story.role}
                    </p>
                    <h3 className="font-display mt-1 text-2xl text-ink group-hover:text-brass">
                      {story.company}
                    </h3>
                  </div>
                  <p className="max-w-md text-sm leading-7 text-muted">
                    {story.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-10 py-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-brass uppercase">
              Writing
            </p>
            <h2 className="font-display mt-3 text-3xl text-ink">
              One post I still send people
            </h2>
          </div>
          <article>
            <a
              href={writing[0].href}
              className="block hover:text-brass"
              rel="noreferrer"
            >
              <h3 className="font-display text-2xl leading-snug text-ink">
                {writing[0].title}
              </h3>
            </a>
            <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
              {writing[0].publication} · {writing[0].year}
            </p>
            <p className="mt-4 text-[16px] leading-8 text-muted">
              {writing[0].summary}
            </p>
            <div className="mt-6 flex gap-5 text-sm">
              <a
                href={writing[0].href}
                className="text-brass underline decoration-brass/40 underline-offset-4"
                rel="noreferrer"
              >
                Read on Rippling
              </a>
              <Link
                href="/writing/"
                className="text-muted underline decoration-line underline-offset-4"
              >
                Writing index
              </Link>
            </div>
          </article>
        </section>

        <section className="mb-16 border border-line bg-bg-soft px-6 py-10 sm:px-10">
          <p className="font-display text-2xl text-ink sm:text-3xl">
            {home.close}
          </p>
          <p className="mt-5">
            <Link href="/contact/" className="text-brass">
              Contact and links →
            </Link>
          </p>
        </section>
      </div>
    </SiteShell>
  );
}
