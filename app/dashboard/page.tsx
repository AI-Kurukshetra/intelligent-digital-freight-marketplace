import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { DashboardLayout } from "@/components/dashboard-layout";
import { LoadCard } from "@/components/load-card";
import { RealtimeListener } from "@/components/realtime-listener";
import { StatCard } from "@/components/stat-card";
import { requireViewer } from "@/lib/auth";
import { getCarrierDashboard, getShipperDashboard } from "@/lib/data";
import type { BidRow } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  noStore();
  const viewer = await requireViewer();
  const resolvedSearchParams = await searchParams;
  const role = viewer.role ?? "carrier";

  if (role === "shipper") {
    const snapshot = await getShipperDashboard(viewer.authUserId);

    return (
      <DashboardLayout
        description="Track posted freight, monitor bid activity, and keep capacity sourcing moving."
        role={role}
        title="Shipper dashboard"
      >
        <RealtimeListener
          events={[
            { event: "*", table: "loads", filter: `shipper_id=eq.${viewer.authUserId}` },
            { event: "*", table: "bids" }
          ]}
        />

        {resolvedSearchParams?.message ? (
          <p className="rounded-2xl bg-sea/10 px-4 py-3 text-sm text-sea">{resolvedSearchParams.message}</p>
        ) : null}
        {resolvedSearchParams?.error ? (
          <p className="rounded-2xl bg-surge/10 px-4 py-3 text-sm text-surge">{resolvedSearchParams.error}</p>
        ) : null}
        {!viewer.profile ? (
          <p className="rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-900">
            Profile sync is pending. If posting or bidding fails, re-run the SQL in `supabase/schema.sql` to backfill
            the `users` table.
          </p>
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Posted loads" value={String(snapshot.loads.length)} />
          <StatCard label="Incoming bids" value={String(snapshot.bids.length)} tone="accent" />
          <StatCard label="Estimated freight value" value={formatCurrency(snapshot.totalEstimatedValue)} tone="surge" />
        </section>

        <section className="rounded-[28px] border border-white/50 bg-white/80 p-6 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-accent">Recent activity</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Loads you have posted</h2>
            </div>
            <Link href="/post-load" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
              Post a new load
            </Link>
          </div>

          <div className="mt-6 grid gap-5">
            {snapshot.loads.length === 0 ? (
              <div className="rounded-[24px] bg-mist p-6 text-sm text-slate">
                No loads yet. Post your first load to start collecting bids.
              </div>
            ) : (
              snapshot.loads.slice(0, 4).map((load) => <LoadCard key={load.id} load={load} />)
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/50 bg-white/80 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Bid feed</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Latest carrier responses</h2>
          <div className="mt-6 space-y-4">
            {snapshot.bids.length === 0 ? (
              <div className="rounded-[24px] bg-mist p-6 text-sm text-slate">
                No bids yet. As carriers respond, they will appear here automatically.
              </div>
            ) : (
              snapshot.bids.slice(0, 6).map((bid) => (
                <div key={bid.id} className="rounded-[24px] bg-mist p-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-ink">{bid.carrierEmail ?? "Carrier"}</p>
                        {snapshot.loads.find((load) => load.awarded_bid_id === bid.id) ? (
                          <span className="rounded-full bg-sea/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sea">
                            Awarded
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-slate">{bid.message || "No note provided."}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-ink">{formatCurrency(bid.bid_price)}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate">{formatDate(bid.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </DashboardLayout>
    );
  }

  const snapshot = await getCarrierDashboard(viewer.authUserId);
  const carrierBids = snapshot.bids as BidRow[];
  const loadMap = new Map(snapshot.loads.map((load) => [load.id, load]));

  return (
    <DashboardLayout
      description="Scan the live board, watch your bid pipeline, and chase lanes that fit your fleet."
      role={role}
      title="Carrier dashboard"
    >
      <RealtimeListener
        events={[
          { event: "*", table: "loads" },
          { event: "*", table: "bids", filter: `carrier_id=eq.${viewer.authUserId}` }
        ]}
      />

      {resolvedSearchParams?.message ? (
        <p className="rounded-2xl bg-sea/10 px-4 py-3 text-sm text-sea">{resolvedSearchParams.message}</p>
      ) : null}
      {resolvedSearchParams?.error ? (
        <p className="rounded-2xl bg-surge/10 px-4 py-3 text-sm text-surge">{resolvedSearchParams.error}</p>
      ) : null}
      {!viewer.profile ? (
        <p className="rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-900">
          Profile sync is pending. If posting or bidding fails, re-run the SQL in `supabase/schema.sql` to backfill the
          `users` table.
        </p>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Submitted bids" value={String(carrierBids.length)} />
        <StatCard label="Tracked loads" value={String(snapshot.loads.length)} tone="accent" />
        <StatCard
          label="Pipeline value"
          value={formatCurrency(carrierBids.reduce((sum: number, bid: BidRow) => sum + bid.bid_price, 0))}
          tone="surge"
        />
      </section>

      <section className="rounded-[28px] border border-white/50 bg-white/80 p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-accent">Market access</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Available loads</h2>
          </div>
          <Link href="/loads" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
            Open load board
          </Link>
        </div>

        <div className="mt-6 rounded-[24px] bg-mist p-6 text-sm text-slate">
          View live freight opportunities, compare routes, and bid with a single workflow built for capacity teams.
        </div>
      </section>

      <section className="rounded-[28px] border border-white/50 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.25em] text-accent">Your bids</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Active bid pipeline</h2>
        <div className="mt-6 space-y-4">
          {carrierBids.length === 0 ? (
            <div className="rounded-[24px] bg-mist p-6 text-sm text-slate">
              No bids submitted yet. Browse the load board to start competing on freight.
            </div>
          ) : (
            carrierBids.map((bid) => {
              const load = loadMap.get(bid.load_id);
              const bidState =
                load?.status === "awarded"
                  ? load.awarded_bid_id === bid.id
                    ? "won"
                    : "lost"
                  : "active";

              return (
                <div key={bid.id} className="rounded-[24px] border border-white/50 bg-white/85 p-5 shadow-soft">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-ink">{load?.title ?? "Submitted bid"}</p>
                      <p className="mt-1 text-sm text-slate">
                        {load
                          ? `${load.pickup_location} to ${load.delivery_location}`
                          : `Load ID: ${bid.load_id}`}
                      </p>
                      {bid.message ? <p className="mt-2 text-sm text-slate">{bid.message}</p> : null}
                    </div>
                    <div className="rounded-2xl bg-mist px-4 py-3 text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate">Your bid</p>
                      <p className="text-lg font-semibold text-ink">{formatCurrency(bid.bid_price)}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate">{formatDate(bid.created_at)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                        bidState === "won"
                          ? "bg-sea/10 text-sea"
                          : bidState === "lost"
                            ? "bg-surge/10 text-surge"
                            : "bg-sea/10 text-sea"
                      }`}
                    >
                      {bidState === "won" ? "Awarded" : bidState === "lost" ? "Closed" : "Active"}
                    </span>
                    {load ? (
                      <Link className="text-sm font-semibold text-accent" href={`/loads/${load.id}`}>
                        View load
                      </Link>
                    ) : (
                      <span className="text-xs uppercase tracking-[0.2em] text-slate">Load details unavailable</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
