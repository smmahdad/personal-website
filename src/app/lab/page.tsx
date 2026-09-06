import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { SiteShell } from "@/components/SiteShell";
import { experiments, labIntro } from "@/content/lab";
import "./lab.css";

export const metadata: Metadata = {
  title: "Lab",
  description: "A night house, and a few older drafts.",
};

const hero = experiments.find((experiment) => experiment.tier === "hero");
const drafts = experiments.filter((experiment) => experiment.tier === "draft");

export default function LabPage() {
  return (
    <SiteShell currentPath="/lab/">
      <article className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <PageIntro
          kicker={labIntro.kicker}
          title={labIntro.title}
          lede={labIntro.lede}
        />

        {hero ? (
          <Link href={hero.href} className="lab-hero">
            <span className="lab-hero-lamp" aria-hidden="true" />
            <span className="lab-hero-copy">
              <span className="lab-hero-vibe">{hero.vibe}</span>
              <span className="lab-hero-title">{hero.title}</span>
              <span className="lab-hero-blurb">{hero.blurb}</span>
            </span>
          </Link>
        ) : null}

        <p className="lab-drafts-kicker">v1 drafts</p>
        <ul className="lab-doors">
          {drafts.map((experiment) => (
            <li key={experiment.slug}>
              <Link
                href={experiment.href}
                className={`lab-door lab-door-${experiment.slug}`}
              >
                <span className="lab-door-vibe">{experiment.vibe}</span>
                <span>
                  <span className="lab-door-title">{experiment.title}</span>
                  <span className="lab-door-blurb">{experiment.blurb}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </SiteShell>
  );
}
