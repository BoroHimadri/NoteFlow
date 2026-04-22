"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/src/lib/axios";
import Editor from "@/src/components/dashboard/Editor";
import { useDebounce } from "@/src/hooks/useDebounce";

export default function DocumentPage() {
  const params = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  // 1. The "Debounced" versions of our state
  const debouncedContent = useDebounce(content, 1000); // Wait 1s
  const debouncedTitle = useDebounce(title, 1000);

  const id = params?.id as string;

  const { data: doc, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      if (!id || id === "undefined") return null;

      const res = await api.get(`/documents/${id}`);
      return res.data.data;
    },
    enabled: !!id && id !== "undefined",
    // retry: false,
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
      setHasLoadedInitialData(true); // Mark that we've synced with the DB
    }
  }, [doc, hasLoadedInitialData]);

  //  auto-save logic
  useEffect(() => {
    // CRITICAL: Do not mutate if we haven't loaded the initial data yet!
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

  if (isLoading) return <p>Loading ...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-4xl font-bold bg-transparent border-none outline-none mb-8 w-full"
        placeholder="Untitled"
      />
      <Editor content={content} onChange={setContent} />

      <div className="mt-4 text-xs text-gray-400">
        {mutation.isPending ? "Saving..." : "All changes saved"}
      </div>
    </div>
  );
}
