"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/src/services/supabase/client";

type DocumentRow = { id: string };

export function useRealtimeDocuments(documentId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(documentId ? `documents-${documentId}` : "documents-list")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "documents",
          ...(documentId ? { filter: `id=eq.${documentId}` } : {}),
        },
        (payload) => {
          const changedId =
            (payload.new as DocumentRow)?.id ??
            (payload.old as DocumentRow)?.id;

          queryClient.invalidateQueries({ queryKey: ["documents"] });

          if (changedId) {
            queryClient.invalidateQueries({ queryKey: ["document", changedId] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, documentId]);
}
