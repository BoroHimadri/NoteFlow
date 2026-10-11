import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/axios";

export const ACCESS_REQUESTS_QUERY_KEY = ["access-requests"];

export function useAccessRequests(documentId?: string, enabled = true) {
  return useQuery({
    queryKey: ACCESS_REQUESTS_QUERY_KEY,
    enabled,
    queryFn: async () => {
      const res = await api.get("/collaborators/requests");
      return res.data.requests || [];
    },
    select: (requests) => {
      if (documentId) {
        return requests.filter((r: any) => r.document_id === documentId);
      }
      return requests;
    },
    // Fallback so the owner still sees new requests even if realtime drops
    refetchInterval: enabled ? 15000 : false,
    refetchOnWindowFocus: enabled,
    staleTime: 5000,
  });
}
