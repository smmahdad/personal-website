import type { Metadata } from "next";
import { ToysDesk } from "@/components/lab/ToysDesk";

export const metadata: Metadata = {
  title: "Toys",
  description: "Clicky little web things. Approve a charge. Twist a dial. Hit the pads.",
};

export default function ToysPage() {
  return <ToysDesk />;
}
