import { createClient } from "@/lib/supabase/server";
import type { BidRow, BidWithCarrier, LoadRow, UserRole, UserRow } from "@/types/database";

export type LoadFilters = {
  cargo?: string;
  delivery?: string;
  pickup?: string;
};

export async function getMarketplaceLoads(filters: LoadFilters = {}) {
  const supabase = await createClient();
  let query = supabase.from("loads").select("*").order("created_at", { ascending: false });

  if (filters.cargo) {
    query = query.ilike("cargo_type", `%${filters.cargo}%`);
  }

  if (filters.pickup) {
    query = query.ilike("pickup_location", `%${filters.pickup}%`);
  }

  if (filters.delivery) {
    query = query.ilike("delivery_location", `%${filters.delivery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch marketplace loads", error);
  }

  return data ?? [];
}

export async function getLoadById(loadId: string) {
  const supabase = await createClient();
  const { data: load } = await supabase.from("loads").select("*").eq("id", loadId).maybeSingle();

  if (!load) {
    return null;
  }

  const { data: bids } = await supabase
    .from("bids")
    .select("*")
    .eq("load_id", loadId)
    .order("bid_price", { ascending: true });

  return {
    load,
    bids: await attachCarrierEmails(bids ?? [])
  };
}

export async function getShipperDashboard(shipperId: string) {
  const supabase = await createClient();
  const { data: loads } = await supabase
    .from("loads")
    .select("*")
    .eq("shipper_id", shipperId)
    .order("created_at", { ascending: false });

  const loadIds = (loads ?? []).map((load) => load.id);
  const bids =
    loadIds.length === 0
      ? []
      : (
          await supabase
            .from("bids")
            .select("*")
            .in("load_id", loadIds)
            .order("created_at", { ascending: false })
        ).data ?? [];

  return {
    loads: loads ?? [],
    bids: await attachCarrierEmails(bids),
    totalEstimatedValue: (loads ?? []).reduce((sum, load) => sum + load.price_estimate, 0)
  };
}

export async function getCarrierDashboard(carrierId: string) {
  const supabase = await createClient();
  const { data: bids } = await supabase
    .from("bids")
    .select("*")
    .eq("carrier_id", carrierId)
    .order("created_at", { ascending: false });

  const loadIds = (bids ?? []).map((bid) => bid.load_id);
  const loads =
    loadIds.length === 0
      ? []
      : (
          await supabase
            .from("loads")
            .select("*")
            .in("id", loadIds)
            .order("pickup_date", { ascending: true })
        ).data ?? [];

  return {
    bids: bids ?? [],
    loads
  };
}

export function getRoleLabel(role: UserRole) {
  return role === "shipper" ? "Shipper" : "Carrier";
}

export function mapBidsToLoads(bids: BidRow[], loads: LoadRow[]) {
  const loadMap = new Map(loads.map((load) => [load.id, load]));
  return bids
    .map((bid) => ({
      bid,
      load: loadMap.get(bid.load_id)
    }))
    .filter((entry): entry is { bid: BidRow; load: LoadRow } => Boolean(entry.load));
}

async function getUsersByIds(userIds: string[]) {
  if (userIds.length === 0) {
    return [];
  }

  const supabase = await createClient();
  const { data } = await supabase.from("users").select("*").in("id", userIds);
  return data ?? [];
}

async function attachCarrierEmails(bids: BidRow[]): Promise<BidWithCarrier[]> {
  const carrierIds = [...new Set(bids.map((bid) => bid.carrier_id))];
  const carriers = await getUsersByIds(carrierIds);
  const carrierMap = new Map<string, UserRow>(carriers.map((carrier) => [carrier.id, carrier]));

  return bids.map((bid) => ({
    ...bid,
    carrierEmail: carrierMap.get(bid.carrier_id)?.email
  }));
}
