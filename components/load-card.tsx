import Link from "next/link";

import { formatCurrency, formatDate, formatWeight } from "@/lib/utils";
import type { LoadRow } from "@/types/database";

type LoadCardProps = {
  load: LoadRow & {
    bidCount?: number;
    carrierBidId?: string | null;
    carrierBidMessage?: string | null;
    carrierBidPrice?: number | null;
    carrierBidState?: "available" | "active" | "won" | "closed" | "own_load";
    lowestBid?: number | null;
    latestBidAt?: string | null;
  };
};

export function LoadCard({ load }: LoadCardProps) {
  const statusTone =
    load.carrierBidState === "won"
      ? "bg-sea/10 text-sea"
      : load.carrierBidState === "closed" || load.carrierBidState === "own_load"
        ? "bg-surge/10 text-surge"
        : "bg-sea/10 text-sea";
  const statusLabel =
    load.carrierBidState === "won"
      ? "Awarded"
      : load.carrierBidState === "closed"
        ? "Closed"
        : load.carrierBidState === "own_load"
          ? "Own load"
          : load.status;
  const ctaLabel =
    load.carrierBidState === "active"
      ? "Review bid"
      : load.carrierBidState === "won"
        ? "View awarded load"
        : "View details";

  return (
    <article className="rounded-[24px] border border-white/50 bg-white/85 p-6 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">Open load</p>
            {typeof load.bidCount === "number" ? (
              <span className="rounded-full bg-sea/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sea">
                {load.bidCount} {load.bidCount === 1 ? "bid" : "bids"}
              </span>
            ) : null}
          </div>
          <h3 className="mt-2 text-xl font-semibold text-ink">{load.title}</h3>
          <p className="mt-2 text-sm text-slate">
            {load.pickup_location} to {load.delivery_location}
          </p>
        </div>

        <div className="rounded-2xl bg-mist px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate">Budget</p>
          <p className="mt-1 text-lg font-semibold text-ink">{formatCurrency(load.price_estimate)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 text-sm text-slate md:grid-cols-3">
        <div className="rounded-2xl bg-mist px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em]">Cargo</p>
          <p className="mt-1 font-medium text-ink">{load.cargo_type}</p>
        </div>
        <div className="rounded-2xl bg-mist px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em]">Weight</p>
          <p className="mt-1 font-medium text-ink">{formatWeight(load.weight)}</p>
        </div>
        <div className="rounded-2xl bg-mist px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em]">Pickup</p>
          <p className="mt-1 font-medium text-ink">{formatDate(load.pickup_date)}</p>
        </div>
      </div>

      {typeof load.bidCount === "number" ? (
        <div className="mt-4 grid gap-3 text-sm text-slate md:grid-cols-2">
          <div className="rounded-2xl bg-mist px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em]">Best bid</p>
            <p className="mt-1 font-medium text-ink">
              {load.lowestBid == null ? "No bids yet" : formatCurrency(load.lowestBid)}
            </p>
          </div>
          <div className="rounded-2xl bg-mist px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em]">Latest bid</p>
            <p className="mt-1 font-medium text-ink">
              {load.latestBidAt ? formatDate(load.latestBidAt) : "Waiting on carriers"}
            </p>
          </div>
        </div>
      ) : null}

      {load.carrierBidState ? (
        <div className="mt-4 rounded-2xl bg-mist px-4 py-4 text-sm text-slate">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em]">Your position</p>
              <p className="mt-1 font-medium text-ink">
                {load.carrierBidState === "active"
                  ? "Bid submitted on this load"
                  : load.carrierBidState === "won"
                    ? "You won this load"
                    : load.carrierBidState === "closed"
                      ? "Load already awarded"
                      : load.carrierBidState === "own_load"
                        ? "You posted this load"
                        : "No bid submitted yet"}
              </p>
            </div>
            {load.carrierBidPrice != null ? (
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.2em]">Your bid</p>
                <p className="mt-1 font-semibold text-ink">{formatCurrency(load.carrierBidPrice)}</p>
              </div>
            ) : null}
          </div>
          {load.carrierBidMessage ? <p className="mt-3 text-sm text-slate">{load.carrierBidMessage}</p> : null}
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between">
        <span className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${statusTone}`}>
          {statusLabel}
        </span>
        <Link className="text-sm font-semibold text-accent" href={`/loads/${load.id}`}>
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}
