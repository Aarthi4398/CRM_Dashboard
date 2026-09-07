import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/routes/page-metadata";

export const metadata = pageMetadata("Home");

export default function Home() {
  redirect("/dashboard");
}
