import type { Metadata } from "next";
import { ToysDesk } from "@/components/lab/ToysDesk";

export const metadata: Metadata = {
  title: "Toys",
  description: "Swipe a charge. Catch unrecognized traffic. Huck a disc. Sign a letter.",
};

export default function ToysPage() {
  return <ToysDesk />;
}
