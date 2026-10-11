"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/src/services/supabase/client";
import { ACCESS_REQUESTS_QUERY_KEY } from "@/src/hooks/useAccessRequests";

export function useRealtimeAccessRequests() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("access-requests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "collaborators",
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ACCESS_REQUESTS_QUERY_KEY,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
