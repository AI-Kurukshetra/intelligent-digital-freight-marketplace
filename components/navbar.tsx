import Link from "next/link";

import { logoutAction } from "@/app/actions";
import type { Viewer } from "@/lib/auth";

type NavbarProps = {
  viewer: Viewer | null;
};

export function Navbar({ viewer }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white">
            FF
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">FreightFlow</p>
            <p className="text-xs text-slate">Digital freight marketplace</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate md:flex">
          <Link href="/loads" className="transition hover:text-ink">
            Load board
          </Link>
          {viewer ? (
            <>
              <Link href="/dashboard" className="transition hover:text-ink">
                Dashboard
              </Link>
              {viewer.role === "shipper" ? (
                <Link href="/post-load" className="transition hover:text-ink">
                  Post load
                </Link>
              ) : null}
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {viewer ? (
            <>
              <div className="hidden rounded-full bg-mist px-4 py-2 text-sm text-slate md:block">
                {viewer.email}
              </div>
              <form action={logoutAction}>
                <button className="rounded-full border border-slate/15 px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="rounded-full px-4 py-2 text-sm font-semibold text-ink" href="/login">
                Log in
              </Link>
              <Link className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white" href="/signup">
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
