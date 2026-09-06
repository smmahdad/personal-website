export function LaunchBadge({
  href,
  kicker,
  label,
}: {
  href: string;
  kicker?: string;
  label: string;
}) {
  return (
    <a
      href={href}
      rel="noreferrer"
      className="inline-flex max-w-full flex-wrap items-baseline gap-x-2 gap-y-1 border border-brass/40 bg-brass/10 px-3 py-2 font-mono text-[11px] tracking-[0.12em] text-brass uppercase transition-colors hover:border-brass hover:text-brass-hot"
    >
      {kicker ? <span className="text-faint">{kicker}</span> : null}
      <span>{label}</span>
    </a>
  );
}
