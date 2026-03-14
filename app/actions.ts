"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { toNumber } from "@/lib/utils";
import type { UserRole } from "@/types/database";

function redirectWithError(path: string, message: string) {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function signupAction(formData: FormData) {
  const role = String(formData.get("role") ?? "") as UserRole;
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password || (role !== "shipper" && role !== "carrier")) {
    redirectWithError("/signup", "Please complete every field.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role }
    }
  });

  if (error) {
    redirectWithError("/signup", error.message);
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirectWithError(
    "/signup",
    "Signup succeeded, but Supabase email confirmation is still enabled. Disable email confirmation in Supabase Auth settings for instant access."
  );
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirectWithError("/login", "Email and password are required.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectWithError("/login", "Invalid email or password.");
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createLoadAction(formData: FormData) {
  const viewer = await requireRole("shipper");
  const title = String(formData.get("title") ?? "").trim();
  const pickupLocation = String(formData.get("pickup_location") ?? "").trim();
  const deliveryLocation = String(formData.get("delivery_location") ?? "").trim();
  const cargoType = String(formData.get("cargo_type") ?? "").trim();
  const pickupDate = String(formData.get("pickup_date") ?? "");
  const weight = toNumber(formData.get("weight"));
  const priceEstimate = toNumber(formData.get("price_estimate"));

  if (!title || !pickupLocation || !deliveryLocation || !cargoType || !pickupDate) {
    redirectWithError("/post-load", "All load fields are required.");
  }

  if (!Number.isFinite(weight) || !Number.isFinite(priceEstimate) || weight <= 0 || priceEstimate <= 0) {
    redirectWithError("/post-load", "Weight and budget must be valid positive numbers.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("loads").insert({
    cargo_type: cargoType,
    delivery_location: deliveryLocation,
    pickup_date: pickupDate,
    pickup_location: pickupLocation,
    price_estimate: priceEstimate,
    shipper_id: viewer.authUserId,
    title,
    weight
  });

  if (error) {
    redirectWithError("/post-load", error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/loads");
  redirect("/dashboard?message=Load posted successfully.");
}

export async function createBidAction(formData: FormData) {
  const viewer = await requireRole("carrier");
  const loadId = String(formData.get("load_id") ?? "");
  const bidPrice = toNumber(formData.get("bid_price"));
  const message = String(formData.get("message") ?? "").trim();

  if (!loadId || !Number.isFinite(bidPrice) || bidPrice <= 0) {
    redirectWithError(`/loads/${loadId}`, "Enter a valid bid.");
  }

  const supabase = await createClient();
  const { data: load } = await supabase.from("loads").select("*").eq("id", loadId).maybeSingle();

  if (!load) {
    redirectWithError("/loads", "This load no longer exists.");
  }

  if (load.shipper_id === viewer.authUserId) {
    redirectWithError(`/loads/${loadId}`, "You cannot bid on your own load.");
  }

  const { error } = await supabase.from("bids").upsert(
    {
      bid_price: bidPrice,
      carrier_id: viewer.authUserId,
      load_id: loadId,
      message: message || null
    },
    { onConflict: "load_id,carrier_id" }
  );

  if (error) {
    redirectWithError(`/loads/${loadId}`, error.message);
  }

  revalidatePath(`/loads/${loadId}`);
  revalidatePath("/dashboard");
  redirect(`/loads/${loadId}?message=Bid submitted successfully.`);
}
