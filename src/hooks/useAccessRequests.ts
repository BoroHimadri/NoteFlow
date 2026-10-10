import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/axios";

export const ACCESS_REQUESTS_QUERY_KEY = ["access-requests"];

export function useAccessRequests(documentId?: string) {
  return useQuery({
    queryKey: ACCESS_REQUESTS_QUERY_KEY,
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
    refetchInterval: 30000, // 30 seconds
    staleTime: 10000, // 10 seconds
  });
}
