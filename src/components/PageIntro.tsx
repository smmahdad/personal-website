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
      <h1 className="font-display mt-4 text-5xl leading-[0.95] text-ink sm:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-lg text-xl leading-8 text-ink/90">{lede}</p>
    </header>
  );
}
