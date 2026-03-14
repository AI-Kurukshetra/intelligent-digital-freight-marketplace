import Link from "next/link";

import { getViewer } from "@/lib/auth";

const featureCards = [
  {
    title: "Fast load posting",
    description: "Shippers can create clean, structured freight listings in minutes."
  },
  {
    title: "Live bid marketplace",
    description: "Carriers review opportunities and compete with real-time bid updates."
  },
  {
    title: "Role-based dashboards",
    description: "Each user sees only the workflows that matter to their operation."
  }
];

export default async function HomePage() {
  const viewer = await getViewer();

  return (
    <main>
      <section className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-16 lg:flex-row lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-accent">FreightFlow</p>
          <h1 className="mt-6 text-5xl font-semibold leading-tight text-ink md:text-6xl">
            Match freight supply and carrier capacity with one clean marketplace.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate">
            FreightFlow gives shippers a fast way to post loads and gives carriers a focused board to bid,
            win, and manage opportunities without spreadsheet chaos.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={viewer ? "/dashboard" : "/signup"}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-soft"
            >
              {viewer ? "Open dashboard" : "Launch FreightFlow"}
            </Link>
            <Link
              href="/loads"
              className="rounded-full border border-slate/15 bg-white/90 px-6 py-3 text-sm font-semibold text-ink"
            >
              Browse load board
            </Link>
          </div>

          <div className="mt-12 grid gap-4 text-sm text-slate md:grid-cols-3">
            <div className="rounded-[24px] border border-white/50 bg-white/80 p-5 shadow-soft">
              <p className="font-medium text-ink">Post freight</p>
              <p className="mt-2">Structured load creation for shippers and ops teams.</p>
            </div>
            <div className="rounded-[24px] border border-white/50 bg-white/80 p-5 shadow-soft">
              <p className="font-medium text-ink">Collect bids</p>
              <p className="mt-2">Carrier offers stream into load detail views in real time.</p>
            </div>
            <div className="rounded-[24px] border border-white/50 bg-white/80 p-5 shadow-soft">
              <p className="font-medium text-ink">Move faster</p>
              <p className="mt-2">Modern dashboard UX that is ready for Vercel and Supabase.</p>
            </div>
          </div>
        </div>

        <div className="w-full rounded-[36px] border border-white/50 bg-white/85 p-8 shadow-soft">
          <div className="grid gap-5">
            {featureCards.map((card, index) => (
              <div
                key={card.title}
                className={`rounded-[24px] p-6 ${
                  index === 1 ? "bg-accent text-white" : "bg-mist text-ink"
                }`}
              >
                <p className="text-sm font-medium uppercase tracking-[0.25em] opacity-80">Core workflow</p>
                <h2 className="mt-3 text-2xl font-semibold">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 opacity-90">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[36px] bg-ink px-8 py-10 text-white shadow-soft">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/70">Shippers</p>
              <h3 className="mt-3 text-2xl font-semibold">Publish loads and compare carrier bids</h3>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/70">Carriers</p>
              <h3 className="mt-3 text-2xl font-semibold">Discover lanes that fit your fleet</h3>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/70">Hackathon-ready</p>
              <h3 className="mt-3 text-2xl font-semibold">Focused MVP with clean deployment on Vercel</h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
