import type { Metadata } from "next";
import { ShellSession } from "@/components/lab/ShellSession";

export const metadata: Metadata = {
  title: "Shell",
  description: "authorize, frisbee, forecast, sign, agent.",
};

export default function ShellPage() {
  return <ShellSession />;
}
