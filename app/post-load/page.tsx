import { createLoadAction } from "@/app/actions";
import { DashboardLayout } from "@/components/dashboard-layout";
import { SubmitButton } from "@/components/submit-button";
import { requireRole } from "@/lib/auth";

type PostLoadPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function PostLoadPage({ searchParams }: PostLoadPageProps) {
  await requireRole("shipper");
  const resolvedSearchParams = await searchParams;

  return (
    <DashboardLayout
      description="Create a clean freight listing so qualified carriers can respond quickly."
      role="shipper"
      title="Post a freight load"
    >
      <section className="rounded-[28px] border border-white/50 bg-white/85 p-8 shadow-soft">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Create a new listing</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Describe the load and your target budget</h1>
          <p className="mt-3 text-sm leading-7 text-slate">
            This form keeps the MVP simple: route, cargo, weight, pickup date, and budget estimate.
          </p>
        </div>

        <form action={createLoadAction} className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium text-ink" htmlFor="title">
              Load title
            </label>
            <input
              id="title"
              name="title"
              required
              placeholder="Dallas to Atlanta refrigerated produce"
              className="w-full rounded-2xl border border-slate/15 bg-mist px-4 py-3 text-sm text-ink outline-none ring-accent/30 focus:ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink" htmlFor="pickup_location">
              Pickup location
            </label>
            <input
              id="pickup_location"
              name="pickup_location"
              required
              placeholder="Dallas, TX"
              className="w-full rounded-2xl border border-slate/15 bg-mist px-4 py-3 text-sm text-ink outline-none ring-accent/30 focus:ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink" htmlFor="delivery_location">
              Delivery location
            </label>
            <input
              id="delivery_location"
              name="delivery_location"
              required
              placeholder="Atlanta, GA"
              className="w-full rounded-2xl border border-slate/15 bg-mist px-4 py-3 text-sm text-ink outline-none ring-accent/30 focus:ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink" htmlFor="cargo_type">
              Cargo type
            </label>
            <input
              id="cargo_type"
              name="cargo_type"
              required
              placeholder="Refrigerated"
              className="w-full rounded-2xl border border-slate/15 bg-mist px-4 py-3 text-sm text-ink outline-none ring-accent/30 focus:ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink" htmlFor="pickup_date">
              Pickup date
            </label>
            <input
              id="pickup_date"
              name="pickup_date"
              type="date"
              required
              className="w-full rounded-2xl border border-slate/15 bg-mist px-4 py-3 text-sm text-ink outline-none ring-accent/30 focus:ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink" htmlFor="weight">
              Weight (lbs)
            </label>
            <input
              id="weight"
              name="weight"
              type="number"
              min="1"
              step="100"
              required
              placeholder="42000"
              className="w-full rounded-2xl border border-slate/15 bg-mist px-4 py-3 text-sm text-ink outline-none ring-accent/30 focus:ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink" htmlFor="price_estimate">
              Budget estimate (USD)
            </label>
            <input
              id="price_estimate"
              name="price_estimate"
              type="number"
              min="1"
              step="100"
              required
              placeholder="4800"
              className="w-full rounded-2xl border border-slate/15 bg-mist px-4 py-3 text-sm text-ink outline-none ring-accent/30 focus:ring"
            />
          </div>

          {resolvedSearchParams?.error ? (
            <p className="lg:col-span-2 rounded-2xl bg-surge/10 px-4 py-3 text-sm text-surge">
              {resolvedSearchParams.error}
            </p>
          ) : null}

          <div className="lg:col-span-2">
            <SubmitButton className="bg-ink text-white hover:bg-slate" pendingLabel="Posting load...">
              Publish load
            </SubmitButton>
          </div>
        </form>
      </section>
    </DashboardLayout>
  );
}
