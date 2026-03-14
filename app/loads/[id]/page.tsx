import Link from "next/link";
import { notFound } from "next/navigation";

import { awardBidAction } from "@/app/actions";
import { BidForm } from "@/components/bid-form";
import { RealtimeListener } from "@/components/realtime-listener";
import { getViewer } from "@/lib/auth";
import { getLoadById } from "@/lib/data";
import { formatCurrency, formatDate, formatWeight } from "@/lib/utils";

export const dynamic = "force-dynamic";

type LoadDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoadDetailPage({ params, searchParams }: LoadDetailPageProps) {
  const viewer = await getViewer();
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const payload = await getLoadById(resolvedParams.id);

  if (!payload) {
    notFound();
  }

  const { load, bids } = payload;
  const isShipperOwner = viewer?.role === "shipper" && viewer.authUserId === load.shipper_id;
  const canBid = viewer?.role === "carrier" && viewer.authUserId !== load.shipper_id && load.status === "open";
  const ownBid = viewer?.role === "carrier" ? bids.find((bid) => bid.carrier_id === viewer.authUserId) : null;
  const lowestBid = bids.length > 0 ? bids.reduce((best, bid) => (bid.bid_price < best.bid_price ? bid : best), bids[0]) : null;
  const latestBid = bids.length > 0 ? bids.reduce((latest, bid) => (bid.created_at > latest.created_at ? bid : latest), bids[0]) : null;
  const awardedBid = load.awarded_bid_id ? bids.find((bid) => bid.id === load.awarded_bid_id) : null;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <RealtimeListener
        events={[
          { event: "*", table: "bids", filter: `load_id=eq.${resolvedParams.id}` },
          { event: "*", table: "loads", filter: `id=eq.${resolvedParams.id}` }
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-[32px] border border-white/50 bg-white/85 p-8 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-accent">Load detail</p>
              <h1 className="mt-3 text-4xl font-semibold text-ink">{load.title}</h1>
              <p className="mt-4 text-base text-slate">
                {load.pickup_location} to {load.delivery_location}
              </p>
            </div>
            <div className="rounded-[24px] bg-ink px-5 py-4 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Budget target</p>
              <p className="mt-1 text-2xl font-semibold">{formatCurrency(load.price_estimate)}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] bg-mist p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate">Cargo type</p>
              <p className="mt-2 text-lg font-semibold text-ink">{load.cargo_type}</p>
            </div>
            <div className="rounded-[24px] bg-mist p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate">Weight</p>
              <p className="mt-2 text-lg font-semibold text-ink">{formatWeight(load.weight)}</p>
            </div>
            <div className="rounded-[24px] bg-mist p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate">Pickup date</p>
              <p className="mt-2 text-lg font-semibold text-ink">{formatDate(load.pickup_date)}</p>
            </div>
            <div className="rounded-[24px] bg-mist p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate">Status</p>
              <p className="mt-2 text-lg font-semibold capitalize text-ink">{load.status}</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-accent">Bid activity</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">Current bids</h2>
              </div>
              <Link href="/loads" className="text-sm font-semibold text-accent">
                Back to board
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {bids.length === 0 ? (
                <div className="rounded-[24px] bg-mist p-6 text-sm text-slate">
                  No bids yet. The first qualified carrier response will appear here.
                </div>
              ) : (
                bids.map((bid) => (
                  <div key={bid.id} className="rounded-[24px] bg-mist p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-ink">{bid.carrierEmail ?? "Carrier"}</p>
                          {load.awarded_bid_id === bid.id ? (
                            <span className="rounded-full bg-sea/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sea">
                              Awarded
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-slate">{bid.message || "No note provided."}</p>
                      </div>
                      <div className="flex flex-col gap-3 md:items-end">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-ink">{formatCurrency(bid.bid_price)}</p>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate">{formatDate(bid.created_at)}</p>
                        </div>
                        {isShipperOwner && load.status === "open" ? (
                          <form action={awardBidAction}>
                            <input type="hidden" name="load_id" value={load.id} />
                            <input type="hidden" name="bid_id" value={bid.id} />
                            <button
                              className="rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate"
                              type="submit"
                            >
                              Award bid
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          {resolvedSearchParams?.message ? (
            <p className="rounded-2xl bg-sea/10 px-4 py-3 text-sm text-sea">{resolvedSearchParams.message}</p>
          ) : null}
          {resolvedSearchParams?.error ? (
            <p className="rounded-2xl bg-surge/10 px-4 py-3 text-sm text-surge">{resolvedSearchParams.error}</p>
          ) : null}

          {canBid ? (
            <div className="space-y-4">
              {ownBid ? (
                <div className="rounded-[24px] border border-white/50 bg-white/85 p-6 shadow-soft">
                  <p className="text-sm uppercase tracking-[0.25em] text-accent">Your active bid</p>
                  <p className="mt-3 text-3xl font-semibold text-ink">{formatCurrency(ownBid.bid_price)}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate">{formatDate(ownBid.created_at)}</p>
                  <p className="mt-4 text-sm leading-7 text-slate">{ownBid.message || "No note provided."}</p>
                </div>
              ) : null}
              <BidForm
                initialBidPrice={ownBid?.bid_price}
                initialMessage={ownBid?.message}
                loadId={load.id}
                submitLabel={ownBid ? "Update bid" : "Submit bid"}
              />
            </div>
          ) : viewer?.role === "carrier" && ownBid ? (
            <div className="rounded-[24px] border border-white/50 bg-white/85 p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.25em] text-accent">Your bid</p>
              <p className="mt-3 text-3xl font-semibold text-ink">{formatCurrency(ownBid.bid_price)}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate">{formatDate(ownBid.created_at)}</p>
              <p className="mt-4 text-sm leading-7 text-slate">{ownBid.message || "No note provided."}</p>
              <div className="mt-4">
                <span
                  className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                    load.awarded_bid_id === ownBid.id ? "bg-sea/10 text-sea" : "bg-surge/10 text-surge"
                  }`}
                >
                  {load.awarded_bid_id === ownBid.id ? "Awarded" : "Closed"}
                </span>
              </div>
            </div>
          ) : viewer?.role === "shipper" ? (
            <div className="rounded-[24px] border border-white/50 bg-white/85 p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.25em] text-accent">Bid summary</p>
              {bids.length === 0 ? (
                <p className="mt-3 text-sm leading-7 text-slate">
                  No carrier bids yet. Responses for this load will appear here as they come in.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {awardedBid ? (
                    <div className="rounded-2xl bg-sea/10 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-sea">Winning bid</p>
                      <p className="mt-2 text-lg font-semibold text-ink">{formatCurrency(awardedBid.bid_price)}</p>
                      <p className="mt-1 text-sm text-slate">{awardedBid.carrierEmail ?? "Carrier selected"}</p>
                    </div>
                  ) : null}
                  <div className="rounded-2xl bg-mist px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate">Responses received</p>
                    <p className="mt-2 text-3xl font-semibold text-ink">{bids.length}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-mist px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate">Best bid</p>
                      <p className="mt-2 text-lg font-semibold text-ink">
                        {lowestBid ? formatCurrency(lowestBid.bid_price) : "-"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-mist px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate">Latest response</p>
                      <p className="mt-2 text-lg font-semibold text-ink">
                        {latestBid ? formatDate(latestBid.created_at) : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-[24px] border border-white/50 bg-white/85 p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.25em] text-accent">Bidding access</p>
              <p className="mt-3 text-sm leading-7 text-slate">
                {viewer
                  ? load.status === "awarded"
                    ? "This load has already been awarded."
                    : "This is your own load."
                  : "Log in as a carrier to submit a bid on this load."}
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
