import Link from "next/link";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-mono text-[12px] tracking-[0.16em] text-muted lowercase">
            {site.domain}
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            {site.name} · {site.location} · {site.currentRole.company}
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <li>
            <a
              href={site.links.github.href}
              className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={site.links.linkedin.href}
              className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <Link
              href="/contact/"
              className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
