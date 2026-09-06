import { latency } from "@/content/work";

function percent(ms: number) {
  return Math.min(100, (ms / latency.budgetMs) * 100);
}

export function LatencyRuler() {
  const after = percent(latency.afterMs);
  const before = percent(latency.beforeMs);

  return (
    <figure className="my-8">
      <div className="flex items-baseline justify-between gap-4">
        <figcaption className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
          Card authorization · p99 vs a {latency.budgetMs / 1000}s budget
        </figcaption>
        <p className="font-mono text-[11px] text-faint">0 — {latency.budgetMs}ms</p>
      </div>
      <div className="relative mt-4 h-16">
        <div className="absolute inset-x-0 top-7 h-px bg-line" />
        <div
          className="absolute top-6 h-0.5 bg-copper/80"
          style={{ width: `${before}%` }}
          aria-hidden
        />
        <div
          className="absolute top-6 h-0.5 bg-brass"
          style={{ width: `${after}%` }}
          aria-hidden
        />
        <Marker left={after} label={`${latency.afterMs}ms`} tone="brass" />
        <Marker left={before} label={`${latency.beforeMs}ms`} tone="copper" />
        <Marker left={100} label="decline" tone="faint" />
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
        <li>
          <span className="text-brass">●</span> {latency.afterLabel}
        </li>
        <li>
          <span className="text-copper">●</span> {latency.beforeLabel}
        </li>
        <li>
          <span className="text-faint">●</span> {latency.budgetLabel}
        </li>
      </ul>
    </figure>
  );
}

function Marker({
  left,
  label,
  tone,
}: {
  left: number;
  label: string;
  tone: "brass" | "copper" | "faint";
}) {
  const color =
    tone === "brass"
      ? "text-brass"
      : tone === "copper"
        ? "text-copper"
        : "text-faint";

  return (
    <div
      className={`absolute top-4 -translate-x-1/2 ${color}`}
      style={{ left: `${left}%` }}
    >
      <span className="block h-6 w-px bg-current" />
      <span className="mt-1 block font-mono text-[10px] tracking-[0.08em] whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
