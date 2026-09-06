import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell currentPath="/404">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <p className="font-mono text-[11px] tracking-[0.2em] text-brass uppercase">
          404
        </p>
        <h1 className="font-display mt-3 text-5xl text-ink">
          This path doesn&apos;t exist.
        </h1>
        <p className="mt-5 max-w-md text-lg leading-8 text-muted">
          Either I haven&apos;t written it yet, or the URL is off by a slash.
        </p>
        <p className="mt-8">
          <Link href="/" className="text-brass">
            Back home →
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
