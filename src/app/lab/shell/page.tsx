import type { Metadata } from "next";
import { ShellSession } from "@/components/lab/ShellSession";

export const metadata: Metadata = {
  title: "Shell",
  description: "A home directory with Sam in it.",
};

export default function ShellPage() {
  return <ShellSession />;
}
