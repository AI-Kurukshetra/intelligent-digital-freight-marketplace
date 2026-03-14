import { redirect } from "next/navigation";

import { loginAction } from "@/app/actions";
import { AuthCard } from "@/components/auth-card";
import { getViewer } from "@/lib/auth";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const viewer = await getViewer();
  const resolvedSearchParams = await searchParams;

  if (viewer) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_520px]">
        <div className="rounded-[32px] bg-ink p-10 text-white shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Carrier and shipper access</p>
          <h1 className="mt-4 text-4xl font-semibold">Run your freight operation from one control tower.</h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/80">
            Log in to see live marketplace demand, posted loads, submitted bids, and route-specific activity.
          </p>
        </div>

        <AuthCard
          action={loginAction}
          error={resolvedSearchParams?.error}
          message={resolvedSearchParams?.message}
          mode="login"
        />
      </div>
    </main>
  );
}
