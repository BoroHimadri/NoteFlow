"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/src/lib/axios";
import Editor from "@/src/components/dashboard/Editor";
import { useDebounce } from "@/src/hooks/useDebounce";
import { Button } from "@/src/components/ui/button";
import { LockIcon, Share2Icon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "@/src/components/ui/spinner";

export default function DocumentPage() {
  const params = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  const debouncedContent = useDebounce(content, 1000); // Wait 1s
  const debouncedTitle = useDebounce(title, 1000);

  const id = params?.id as string;

  const {
    data: doc,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      if (!id || id === "undefined") return null;

      const res = await api.get(`/documents/${id}`);
      return res.data.data;
    },
    enabled: !!id && id !== "undefined",
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (updates: { title: string; content: string }) =>
      api.patch(`/documents/${id}`, updates),
  });

  // Sync state when data arrives
  useEffect(() => {
    if (doc && !hasLoadedInitialData) {
      setTitle(doc.title);
      setContent(doc.content);
      setHasLoadedInitialData(true);
    }
  }, [doc, hasLoadedInitialData]);

  //  auto-save logic
  useEffect(() => {
    if (!hasLoadedInitialData || !id) return;

    const timeout = setTimeout(() => {
      mutation.mutate({ title, content });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, content, hasLoadedInitialData, id]);

  //   This effect ONLY runs when the "Debounced" values change
  useEffect(() => {
    if (debouncedContent || debouncedTitle) {
      mutation.mutate({ title: debouncedTitle, content: debouncedContent });
    }
  }, [debouncedContent, debouncedTitle]);

  const handleCopyLink = () => {
    // 1. Get the current URL
    const shareUrl = window.location.href;
    // 2. Write to clipboard
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success("Link copied! Share it with your collaborator.");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy link.");
      });
  };

  //request access api
  const requestMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await api.post(`/documents/${documentId}/request`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Access requested! The owner will review your request.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error || "Failed to request access.";
      toast.error(message);
    },
  });

  const handleRequestAccess = (id: string) => {
    requestMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-10 h-10 text-purple-600 animate-spin" />
          <p className="text-sm font-medium text-zinc-500 animate-pulse">
            Loading your note...
          </p>
        </div>
      </div>
    );
  }

  //The Request Access
  if (error || !doc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="bg-zinc-100 p-4 rounded-full mb-4">
          <LockIcon className="w-8 h-8 text-zinc-500" />
        </div>
        <h1 className="text-2xl font-bold">Access Required</h1>
        <p className="text-zinc-500 mt-2 mb-8 max-w-sm">
          This note is private. You need permission from the owner to view or
          edit it.
        </p>

        <button
          onClick={() => handleRequestAccess(id)}
          disabled={requestMutation.isPending}
          className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
        >
          {requestMutation.isPending ? (
            <>
              <Spinner className="animate-spin" />
              Sending Request...
            </>
          ) : (
            "Request Access"
          )}
        </button>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <ToastContainer />
      <div className=" flex justify-between items-center mb-8 ">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-4xl font-bold bg-transparent border-none outline-none w-full"
          placeholder="Untitled"
        />{" "}
        <Button
          onClick={handleCopyLink}
          className="
          flex items-center gap-2
          bg-purple-500 hover:bg-purple-700
          text-white text-sm font-medium
          p-5 rounded-xl
          transition-colors duration-150
          cursor-pointer
        "
        >
          <Share2Icon className="w-4 h-4" />
          Share this doc
        </Button>
      </div>

      <Editor content={content} onChange={setContent} />

      <div className="mt-4 text-xs text-gray-400">
        {mutation.isPending ? "Saving..." : "All changes saved"}
      </div>
    </div>
  );
}
