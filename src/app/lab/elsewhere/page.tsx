import type { Metadata } from "next";
import { Elsewhere } from "@/components/lab/Elsewhere";
import { elsewhereCopy } from "@/content/elsewhere";

export const metadata: Metadata = {
  title: elsewhereCopy.title,
  description: "A night house. Bring a light.",
};

export default function ElsewherePage() {
  return <Elsewhere />;
}
