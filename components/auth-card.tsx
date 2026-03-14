import Link from "next/link";

import { SubmitButton } from "@/components/submit-button";
import type { UserRole } from "@/types/database";

type AuthCardProps = {
  action: (formData: FormData) => Promise<void>;
  error?: string;
  message?: string;
  mode: "login" | "signup";
};

const roleOptions: UserRole[] = ["shipper", "carrier"];

export function AuthCard({ action, error, message, mode }: AuthCardProps) {
  const isSignup = mode === "signup";

  return (
    <div className="w-full rounded-[28px] border border-white/50 bg-white/90 p-8 shadow-soft backdrop-blur">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">
          FreightFlow Access
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">
          {isSignup ? "Create your marketplace account" : "Welcome back to FreightFlow"}
        </h1>
        <p className="mt-3 text-sm text-slate">
          {isSignup
            ? "Choose your role, create your account, and start moving freight."
            : "Log in to manage loads, bids, and your active freight pipeline."}
        </p>
      </div>

      <form action={action} className="space-y-5">
        {isSignup ? (
          <div className="space-y-3">
            <label className="text-sm font-medium text-ink">Role</label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((role) => (
                <label
                  key={role}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate/15 bg-mist px-4 py-3 text-sm font-medium capitalize text-ink"
                >
                  <input type="radio" name="role" value={role} defaultChecked={role === "shipper"} />
                  {role}
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-medium text-ink" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-2xl border border-slate/15 bg-white px-4 py-3 text-sm text-ink outline-none ring-accent/30 transition focus:ring"
            placeholder="ops@shipperco.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-ink" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-2xl border border-slate/15 bg-white px-4 py-3 text-sm text-ink outline-none ring-accent/30 transition focus:ring"
            placeholder="Minimum 6 characters"
          />
        </div>

        {message ? <p className="rounded-2xl bg-sea/10 px-4 py-3 text-sm text-sea">{message}</p> : null}
        {error ? <p className="rounded-2xl bg-surge/10 px-4 py-3 text-sm text-surge">{error}</p> : null}

        <SubmitButton
          className="w-full bg-ink text-white hover:bg-slate"
          pendingLabel={isSignup ? "Creating account..." : "Signing in..."}
        >
          {isSignup ? "Create account" : "Log in"}
        </SubmitButton>
      </form>

      <p className="mt-6 text-sm text-slate">
        {isSignup ? "Already have an account?" : "Need an account?"}{" "}
        <Link className="font-semibold text-accent" href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
