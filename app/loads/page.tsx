import { LoadCard } from "@/components/load-card";
import { LoadFiltersForm } from "@/components/load-filters-form";
import { RealtimeListener } from "@/components/realtime-listener";
import { getViewer } from "@/lib/auth";
import { getMarketplaceLoads } from "@/lib/data";

type LoadsPageProps = {
  searchParams?: Promise<{
    cargo?: string;
    delivery?: string;
    pickup?: string;
  }>;
};

export default async function LoadsPage({ searchParams }: LoadsPageProps) {
  const viewer = await getViewer();
  const resolvedSearchParams = await searchParams;
  const loads = await getMarketplaceLoads({
    cargo: resolvedSearchParams?.cargo,
    delivery: resolvedSearchParams?.delivery,
    pickup: resolvedSearchParams?.pickup
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <RealtimeListener events={[{ event: "*", table: "loads" }, { event: "*", table: "bids" }]} />

      <section className="rounded-[32px] border border-white/50 bg-white/85 p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">Live marketplace</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-ink">Load board</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate">
              Explore active freight, filter by route or cargo, and open each load to review pricing context and
              submit bids.
            </p>
          </div>
          {viewer?.role === "shipper" ? (
            <div className="rounded-2xl bg-mist px-5 py-4 text-sm text-slate">
              Shippers can browse the board too, but only carriers can place bids.
            </div>
          ) : null}
        </div>

        <LoadFiltersForm
          cargo={resolvedSearchParams?.cargo}
          delivery={resolvedSearchParams?.delivery}
          pickup={resolvedSearchParams?.pickup}
        />
      </section>

      <section className="mt-8 grid gap-5">
        {loads.length === 0 ? (
          <div className="rounded-[28px] border border-white/50 bg-white/85 p-8 text-sm text-slate shadow-soft">
            No loads match the current filters.
          </div>
        ) : (
          loads.map((load) => <LoadCard key={load.id} load={load} />)
        )}
      </section>
    </main>
  );
}
