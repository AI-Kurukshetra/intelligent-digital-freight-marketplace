import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { UserRole, UserRow } from "@/types/database";

export type Viewer = {
  authUserId: string;
  email: string;
  profile: UserRow | null;
  role: UserRole | null;
};

function getRoleFromMetadata(role: unknown): UserRole | null {
  return role === "shipper" || role === "carrier" ? role : null;
}

async function syncProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
  const rpcResult = await supabase.rpc("ensure_user_profile");

  if (!rpcResult.error) {
    return;
  }

  if (rpcResult.error.code !== "PGRST202") {
    console.error("Failed to sync user profile via RPC", rpcResult.error);
  }
}

export const getViewer = cache(async (): Promise<Viewer | null> => {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return null;
  }

  const metadataRole = getRoleFromMetadata(user.user_metadata?.role) ?? getRoleFromMetadata(user.app_metadata?.role);
  let { data: profile } = await supabase.from("users").select("*").eq("id", user.id).maybeSingle();

  if (!profile) {
    await syncProfile(supabase);
    profile = (await supabase.from("users").select("*").eq("id", user.id).maybeSingle()).data;
  }

  if (!profile) {
    const role = metadataRole ?? "carrier";
    const insertResult = await supabase.from("users").upsert(
      {
        email: user.email,
        id: user.id,
        role
      },
      { onConflict: "id" }
    );

    if (insertResult.error && insertResult.error.code !== "23505") {
      console.error("Failed to create missing user profile", insertResult.error);
    }

    profile = (await supabase.from("users").select("*").eq("id", user.id).maybeSingle()).data;
  }

  return {
    authUserId: user.id,
    email: user.email,
    profile,
    role: profile?.role ?? metadataRole
  };
});

export async function requireViewer() {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/login");
  }

  return viewer;
}

export async function requireRole(role: UserRole) {
  const viewer = await requireViewer();

  if (viewer.role !== role) {
    redirect("/dashboard?error=forbidden");
  }

  return viewer;
}
