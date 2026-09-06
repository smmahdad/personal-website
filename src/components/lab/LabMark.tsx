import Link from "next/link";

export function LabMark({ tone }: { tone: "toys" | "craft" | "shell" }) {
  return (
    <p className={`lab-mark lab-mark-${tone}`}>
      <Link href="/">sammah.dad</Link>
      <span aria-hidden="true"> / </span>
      <Link href="/lab/">lab</Link>
    </p>
  );
}
