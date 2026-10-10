"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/lib/axios";
import { Check, X, User, FileText, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { useAccessRequests, ACCESS_REQUESTS_QUERY_KEY } from "@/src/hooks/useAccessRequests";

export default function Notifications({ documentId }: { documentId?: string }) {
  const queryClient = useQueryClient();

  const { data: requests, isLoading, error } = useAccessRequests(documentId);

  const mutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: string }) => {
      await api.patch("/collaborators/requests", { requestId, status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ACCESS_REQUESTS_QUERY_KEY });
      toast.success(variables.status === "accepted" ? "Access granted!" : "Request declined.");
    },
  });

  if (isLoading) return null;

  if (error) {
    console.error("Error in Notifications component:", error);
    return null;
  }

  if (!requests || requests.length === 0) {
    return null;
  }

  const isSidebar = !documentId;

  return (
    <div className={`space-y-4 ${isSidebar ? 'px-2' : ''}`}>
      <div className="flex items-center gap-2 px-1">
        <Bell className="w-4 h-4 text-purple-600" />
        <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          {isSidebar ? 'Requests' : 'Access Requests'}
        </h2>
        <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {requests.length}
        </span>
      </div>

      <div className="space-y-3">
        {requests.map((request: any) => (
          <div 
            key={request.id} 
            className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 transition-all hover:border-purple-200"
          >
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                  {request.email}
                </p>
                {!documentId && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <FileText className="w-2.5 h-2.5 text-zinc-400" />
                    <p className="text-[10px] text-zinc-500 truncate">
                      {request.documents?.title || 'Untitled'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Button
                onClick={() => mutation.mutate({ requestId: request.id, status: "accepted" })}
                disabled={mutation.isPending}
                className="flex-1 h-7 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-lg shadow-sm"
              >
                Approve
              </Button>
              <Button
                onClick={() => mutation.mutate({ requestId: request.id, status: "declined" })}
                disabled={mutation.isPending}
                variant="outline"
                className="flex-1 h-7 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
              >
                Decline
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
