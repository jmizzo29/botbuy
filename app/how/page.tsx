import { redirect } from "next/navigation";

export const metadata = {
  title: "How it works",
};

export default function HowPage() {
  redirect("/#how");
}
