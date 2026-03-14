import { redirect } from "next/navigation";

import { signupAction } from "@/app/actions";
import { AuthCard } from "@/components/auth-card";
import { getViewer } from "@/lib/auth";

type SignupPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const viewer = await getViewer();
  const resolvedSearchParams = await searchParams;

  if (viewer) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_520px]">
        <div className="rounded-[32px] bg-gradient-to-br from-accent via-ink to-sea p-10 text-white shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Marketplace onboarding</p>
          <h1 className="mt-4 text-4xl font-semibold">Create your FreightFlow account and pick your side.</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/80">
            Shippers publish freight. Carriers browse lanes and submit bids. The role you choose drives your
            dashboard and permissions.
          </p>
        </div>

        <AuthCard action={signupAction} error={resolvedSearchParams?.error} mode="signup" />
      </div>
    </main>
  );
}
