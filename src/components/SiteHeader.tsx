import Link from "next/link";
import { site } from "@/content/site";
import { MobileNav } from "./MobileNav";

export function SiteHeader({ currentPath }: { currentPath: string }) {
  return (
    <header className="relative border-b border-line/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="font-mono text-[13px] tracking-[0.18em] text-ink lowercase"
        >
          {site.domain}
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {site.nav
            .filter((item) => item.href !== "/")
            .map((item) => {
              const active =
                currentPath === item.href ||
                currentPath === item.href.replace(/\/$/, "");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[13px] tracking-[0.14em] uppercase transition-colors duration-150 ${
                    active
                      ? "text-brass"
                      : "text-muted hover:text-ink"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
        </nav>
        <MobileNav currentPath={currentPath} />
      </div>
    </header>
  );
}
