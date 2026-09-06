import type { Metadata } from "next";
import { CraftStudio } from "@/components/lab/CraftStudio";

export const metadata: Metadata = {
  title: "Craft",
  description: "Type, motion, almost no copy.",
};

export default function CraftPage() {
  return <CraftStudio />;
}
