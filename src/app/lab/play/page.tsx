import type { Metadata } from "next";
import { Playground } from "@/components/lab/Playground";
import { playCopy } from "@/content/lab";

export const metadata: Metadata = {
  title: "Play",
  description: playCopy.lede,
};

export default function PlayPage() {
  return <Playground />;
}
