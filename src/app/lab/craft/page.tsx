import type { Metadata } from "next";
import { CraftStudio } from "@/components/lab/CraftStudio";

export const metadata: Metadata = {
  title: "Craft",
  description: "A four-second machine. Motes. A disc. Almost no words.",
};

export default function CraftPage() {
  return <CraftStudio />;
}
