import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { SiteShell } from "@/components/SiteShell";
import { experiments, labIntro } from "@/content/lab";
import "./lab.css";

export const metadata: Metadata = {
  title: "Lab",
  description: "Swipe, throw, sign. Other rooms on sammah.dad.",
};

export default function LabPage() {
  return (
    <SiteShell currentPath="/lab/">
      <article className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <PageIntro
          kicker={labIntro.kicker}
          title={labIntro.title}
          lede={labIntro.lede}
        />
        <ul className="lab-doors mt-14">
          {experiments.map((experiment) => (
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
