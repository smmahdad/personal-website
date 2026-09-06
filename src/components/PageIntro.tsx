export function PageIntro({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="max-w-2xl">
      <p className="font-mono text-[11px] tracking-[0.2em] text-brass uppercase">
        {kicker}
      </p>
      <h1 className="font-display mt-3 text-4xl leading-[1.1] text-ink sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 text-lg leading-8 text-muted">{lede}</p>
    </header>
  );
}
