"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type LoadFiltersFormProps = {
  cargo?: string;
  delivery?: string;
  pickup?: string;
};

export function LoadFiltersForm({ cargo = "", delivery = "", pickup = "" }: LoadFiltersFormProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [pickupValue, setPickupValue] = useState(pickup);
  const [deliveryValue, setDeliveryValue] = useState(delivery);
  const [cargoValue, setCargoValue] = useState(cargo);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (pickupValue.trim()) {
      params.set("pickup", pickupValue.trim());
    }

    if (deliveryValue.trim()) {
      params.set("delivery", deliveryValue.trim());
    }

    if (cargoValue.trim()) {
      params.set("cargo", cargoValue.trim());
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <form className="mt-8 grid gap-4 rounded-[24px] bg-mist p-5 md:grid-cols-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="pickup"
        value={pickupValue}
        onChange={(event) => setPickupValue(event.target.value)}
        placeholder="Pickup location"
        className="rounded-2xl border border-slate/15 bg-white px-4 py-3 text-sm text-ink outline-none ring-accent/30 focus:ring"
      />
      <input
        type="text"
        name="delivery"
        value={deliveryValue}
        onChange={(event) => setDeliveryValue(event.target.value)}
        placeholder="Delivery location"
        className="rounded-2xl border border-slate/15 bg-white px-4 py-3 text-sm text-ink outline-none ring-accent/30 focus:ring"
      />
      <input
        type="text"
        name="cargo"
        value={cargoValue}
        onChange={(event) => setCargoValue(event.target.value)}
        placeholder="Cargo type"
        className="rounded-2xl border border-slate/15 bg-white px-4 py-3 text-sm text-ink outline-none ring-accent/30 focus:ring"
      />
      <button type="submit" className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white">
        Apply filters
      </button>
    </form>
  );
}
