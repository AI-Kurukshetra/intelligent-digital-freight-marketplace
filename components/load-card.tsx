import Link from "next/link";

import { formatCurrency, formatDate, formatWeight } from "@/lib/utils";
import type { LoadRow } from "@/types/database";

type LoadCardProps = {
  load: LoadRow;
};

export function LoadCard({ load }: LoadCardProps) {
  return (
    <article className="rounded-[24px] border border-white/50 bg-white/85 p-6 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">Open load</p>
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

      <div className="mt-6 flex items-center justify-between">
        <span className="rounded-full bg-sea/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sea">
          {load.status}
        </span>
        <Link className="text-sm font-semibold text-accent" href={`/loads/${load.id}`}>
          View details
        </Link>
      </div>
    </article>
  );
}
