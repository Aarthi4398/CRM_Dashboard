import Link from "next/link";
import { pageMetadata } from "@/lib/routes/page-metadata";

export const metadata = pageMetadata("Privacy Policy");

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="muted mt-4 leading-7">
        This portfolio demo includes placeholder privacy copy only. Replace with your own policy before production use.
      </p>
      <p className="mt-8">
        <Link href="/signup" className="text-[#465fff] hover:underline">Back to sign up</Link>
      </p>
    </main>
  );
}
