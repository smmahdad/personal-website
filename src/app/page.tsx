import Link from "next/link";
import { LaunchBadge } from "@/components/LaunchBadge";
import { LatencyRuler } from "@/components/LatencyRuler";
import { SiteShell } from "@/components/SiteShell";
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
          <h1 className="font-display mt-6 max-w-3xl text-6xl leading-[0.9] text-ink sm:text-8xl">
            {home.headline}
          </h1>
          <p className="mt-8 max-w-md text-2xl leading-snug text-ink/90">
            {home.lead}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/work/" className="btn btn-primary">
              The work
            </Link>
            <Link href="/about/" className="btn btn-ghost">
              About
            </Link>
          </div>
        </section>

        <section className="grid gap-4 border-b border-line py-14 sm:grid-cols-3">
          {home.now.map((item) => (
            <article key={item.title} className="panel lift px-5 py-6">
              <p className="font-mono text-[11px] tracking-[0.16em] text-faint uppercase">
                {item.label}
              </p>
              <h2 className="font-display mt-3 text-3xl text-ink">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">{item.detail}</p>
              {"badge" in item && item.badge ? (
                <div className="mt-5">
                  <LaunchBadge
                    href={item.badge.href}
                    kicker={item.badge.kicker}
                    label={item.badge.label}
                  />
                </div>
              ) : null}
            </article>
          ))}
        </section>

        <section className="border-b border-line py-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              Selected work
            </h2>
            <Link
              href="/work/"
              className="font-mono text-[11px] tracking-[0.14em] text-brass uppercase"
            >
              All of it
            </Link>
          </div>

          <Link
            href={home.featuredStat.href}
            className="panel lift mt-8 block px-6 py-7 sm:px-8"
          >
            <p className="font-mono text-[11px] tracking-[0.16em] text-brass uppercase">
              {home.featuredStat.kicker}
            </p>
            <p className="font-display mt-3 text-4xl leading-none text-ink sm:text-6xl">
              {home.featuredStat.value}
            </p>
            <p className="mt-4 max-w-md text-muted">
              {home.featuredStat.detail}
            </p>
          </Link>

          <LatencyRuler />

          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {work.map((story) => (
              <li key={story.id}>
                <Link
                  href={`/work/#${story.id}`}
                  className="panel lift flex h-full flex-col px-5 py-6"
                >
                  <p className="font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
                    {story.era}
                  </p>
                  <h3 className="font-display mt-3 text-2xl text-ink">
                    {story.company}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {story.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-8 border-b border-line py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-brass uppercase">
              Writing
            </p>
            <h2 className="font-display mt-3 text-3xl text-ink sm:text-4xl">
              One post I still send
            </h2>
          </div>
          <article className="panel lift px-6 py-7">
            <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
              {writing[0].publication} · {writing[0].year}
            </p>
            <h3 className="font-display mt-3 text-2xl leading-snug text-ink">
              <a href={writing[0].href} className="hover:text-brass" rel="noreferrer">
                {writing[0].title}
              </a>
            </h3>
            <p className="mt-4 text-[16px] leading-7 text-muted">
              {writing[0].summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm">
              <a
                href={writing[0].href}
                className="text-brass underline decoration-brass/40 underline-offset-4"
                rel="noreferrer"
              >
                Read it
              </a>
              <Link
                href="/writing/"
                className="text-muted underline decoration-line underline-offset-4"
              >
                Writing
              </Link>
            </div>
          </article>
        </section>

        <section className="panel mb-16 mt-14 px-6 py-10 sm:px-10">
          <p className="font-display text-3xl leading-snug text-ink sm:text-4xl">
            {home.close}
          </p>
          <p className="mt-6">
            <Link href="/contact/" className="btn btn-primary">
              Say hi
            </Link>
          </p>
        </section>
      </div>
    </SiteShell>
  );
}
