import Link from "next/link";

import { getRoleLabel } from "@/lib/data";
import type { UserRole } from "@/types/database";

type DashboardLayoutProps = {
  children: React.ReactNode;
  description: string;
  role: UserRole;
  title: string;
};

export function DashboardLayout({ children, description, role, title }: DashboardLayoutProps) {
  const navItems =
    role === "shipper"
      ? [
          { href: "/dashboard", label: "Overview" },
          { href: "/post-load", label: "Post a load" },
          { href: "/loads", label: "Marketplace" }
        ]
      : [
          { href: "/dashboard", label: "Overview" },
          { href: "/loads", label: "Load board" }
        ];

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-white/40 bg-white/80 p-6 shadow-soft backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent">{getRoleLabel(role)} Console</p>
        <h2 className="mt-3 text-2xl font-semibold text-ink">{title}</h2>
        <p className="mt-3 text-sm text-slate">{description}</p>

        <div className="mt-8 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-2xl bg-mist px-4 py-3 text-sm font-medium text-ink transition hover:bg-ink hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      <main className="space-y-8">{children}</main>
    </div>
  );
}
