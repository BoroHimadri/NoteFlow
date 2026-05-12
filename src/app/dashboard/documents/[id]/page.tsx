"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/lib/axios";
import { useDebounce } from "@/src/hooks/useDebounce";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft, Check, Clock, LockIcon, Share2Icon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "@/src/components/ui/spinner";

import { EditorContent } from "@tiptap/react";
import EditorToolbar from "@/src/components/common/EditorToolbar";
import Loader from "@/src/components/common/Loader";
import { useDocumentEditor } from "@/src/hooks/useDocumentEditor";

export default function DocumentPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  const debouncedContent = useDebounce(content, 1000); // Wait 1s
  const debouncedTitle = useDebounce(title, 1000);
  const [activeId, setActiveId] = useState<string | null>(null);
  const id = params?.id as string;
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const lastSavedRef = useRef({ title: "", content: "" });

  //edtor hook
  const editor = useDocumentEditor((html, text) => {
    setContent(html);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  });

  // Reset state when ID changes
  useEffect(() => {
    setHasLoadedInitialData(false);
    setTitle("");
    setContent("");
    setActiveId(null);
    lastSavedRef.current = { title: "", content: "" };
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent("", { emitUpdate: false });
    }
  }, [id, editor]);

  // Auto-resize title textarea
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);

  //fetch created note
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
    staleTime: 0, // Always consider data stale so it refetches on mount
    gcTime: 0,    // Don't cache this for long
  });

  //updating the note
  const mutation = useMutation({
    mutationFn: (updates: { title: string; content: string }) =>
      api.patch(`/documents/${id}`, updates),
    onSuccess: () => {
      // Invalidate the query to ensure we have the latest version in the cache
      queryClient.invalidateQueries({ queryKey: ["document", id] });
    },
  });

  // Sync state when data arrives
  useEffect(() => {
    if (doc && editor && !hasLoadedInitialData) {
      console.log("Syncing initial data:", { title: doc.title, id });
      
      const initialTitle = doc.title || "";
      const initialContent = doc.content || "";

      setTitle(initialTitle);
      setContent(initialContent);
      editor.commands.setContent(initialContent, { emitUpdate: false });

      // Initialize tracking refs with the actual data from DB
      lastSavedRef.current = { title: initialTitle, content: initialContent };
      setActiveId(id);

      // Small delay to let the state settle before allowing auto-save
      const timer = setTimeout(() => {
        setHasLoadedInitialData(true);
      }, 500); 
      
      return () => clearTimeout(timer);
    }
  }, [doc, editor, hasLoadedInitialData, id]);

  // Auto-save logic
  useEffect(() => {
    if (!hasLoadedInitialData || !activeId || activeId !== id || mutation.isPending)
      return;

    // 1. Only save if the debounced values have "settled" (match the current state)
    const isSettled = debouncedTitle === title && debouncedContent === content;
    if (!isSettled) return;

    // 2. Only save if something has actually changed from what's on the server
    const hasChanged =
      debouncedTitle !== lastSavedRef.current.title ||
      debouncedContent !== lastSavedRef.current.content;

    if (hasChanged) {
      // Capture current values to update ref on success
      const titleToSave = debouncedTitle;
      const contentToSave = debouncedContent;

      mutation.mutate(
        {
          title: titleToSave,
          content: contentToSave,
        },
        {
          onSuccess: () => {
            lastSavedRef.current = {
              title: titleToSave,
              content: contentToSave,
            };
          },
        }
      );
    }
    // Removed mutation from dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedContent,
    debouncedTitle,
    title,
    content,
    hasLoadedInitialData,
    id,
    activeId,
  ]);

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

  const handleShare = () => {
    handleCopyLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const message =
        error.response?.data?.error || "Failed to request access.";
      toast.error(message);
    },
  });

  const handleRequestAccess = (id: string) => {
    requestMutation.mutate(id);
  };

  if (isLoading) return <Loader />;

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
    <div className="min-h-screen bg-[#FAFAF8]">
      <ToastContainer />

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-[#FAFAF8]/90 backdrop-blur-sm border-b border-zinc-200/60">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Left — back + save status */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="text-zinc-400 hover:text-zinc-700 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {mutation.isPending ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs text-zinc-400">Saving…</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-zinc-400">Saved</span>
                </>
              )}
            </div>
          </div>

          {/* Right — word count + share */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock className="w-3 h-3" />
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>

            <Button
              onClick={handleShare}
              size="sm"
              className={`
              flex items-center gap-2 rounded-xl px-4 h-8 text-xs font-medium
              transition-all duration-200
              ${
                copied
                  ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }
            `}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2Icon className="w-3.5 h-3.5" />
                  Share
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Document body ────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          rows={1}
          className="
          w-full resize-none overflow-hidden
          bg-transparent border-none outline-none
          font-serif text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50
          placeholder:text-zinc-300 dark:placeholder:text-zinc-700
          leading-tight mb-8
        "
        />

        {/* Editor card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <EditorToolbar editor={editor} />

          {/* Editor content */}
          <div className="px-8 py-6 text-[15px] leading-7">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Bottom meta */}
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 px-1">
          <span>{wordCount} words</span>
          <span className="sm:hidden">
            {mutation.isPending ? "Saving…" : "All changes saved"}
          </span>
        </div>
      </div>
    </div>
  );
}
