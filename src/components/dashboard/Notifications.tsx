"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/lib/axios";
import { Check, X, User, FileText, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";

export default function Notifications() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ["access-requests"],
    queryFn: async () => {
      console.log("Fetching access requests...");
      const res = await api.get("/collaborators/requests");
      console.log("Response from server:", res.data);
      return res.data.requests;
    },
    refetchInterval: 10000,
  });

  const mutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: string }) => {
      await api.patch("/collaborators/requests", { requestId, status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["access-requests"] });
      toast.success(variables.status === "accepted" ? "Access granted!" : "Request declined.");
    },
  });

  if (isLoading) return null;

  if (error) {
    console.error("Error in Notifications component:", error);
    return null;
  }

  if (!requests || requests.length === 0) {
    console.log("No pending requests to show.");
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Bell className="w-4 h-4 text-purple-600" />
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Access Requests</h2>
        <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {requests.length}
        </span>
      </div>

      <div className="space-y-2">
        {requests.map((request: any) => (
          <div 
            key={request.id} 
            className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 transition-all hover:shadow-md hover:border-purple-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                  {request.email}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <FileText className="w-3 h-3 text-zinc-400" />
                  <p className="text-xs text-zinc-500 truncate">
                    Requests access to <span className="font-medium text-zinc-700 dark:text-zinc-300">"{request.documents?.title || 'Untitled'}"</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button
                onClick={() => mutation.mutate({ requestId: request.id, status: "accepted" })}
                disabled={mutation.isPending}
                className="flex-1 h-9 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-200 dark:shadow-none"
              >
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Approve
              </Button>
              <Button
                onClick={() => mutation.mutate({ requestId: request.id, status: "declined" })}
                disabled={mutation.isPending}
                variant="outline"
                className="flex-1 h-9 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
              >
                <X className="w-3.5 h-3.5 mr-1.5" />
                Decline
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
