"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type RealtimeListenerProps = {
  events: Array<{
    event: "INSERT" | "UPDATE" | "DELETE" | "*";
    schema?: string;
    table: string;
    filter?: string;
  }>;
};

export function RealtimeListener({ events }: RealtimeListenerProps) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`freightflow-${events.map((event) => event.table).join("-")}`);

    events.forEach((event) => {
      channel.on(
        "postgres_changes",
        {
          event: event.event,
          filter: event.filter,
          schema: event.schema ?? "public",
          table: event.table
        },
        () => router.refresh()
      );
    });

    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [events, router]);

  return null;
}
