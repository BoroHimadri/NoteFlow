"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/lib/axios";
import { useDebounce } from "@/src/hooks/useDebounce";
import { Button } from "@/src/components/ui/button";
import {
  ArrowLeft,
  Check,
  Clock,
  LockIcon,
  Share2Icon,
  Globe,
  Shield,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "@/src/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

import { EditorContent } from "@tiptap/react";
import EditorToolbar from "@/src/components/common/EditorToolbar";
import Loader from "@/src/components/common/Loader";
import { useDocumentEditor } from "@/src/hooks/useDocumentEditor";
import AIAssistant from "@/src/components/dashboard/AIAssistant";

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
    setIsPublic(false);
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

      try {
        const res = await api.get(`/documents/${id}`);
        return res.data.data;
      } catch (err: any) {
        if (err.response?.status === 401) {
          // If 401, they need to log in
          const currentPath = window.location.pathname;
          router.push(`/auth/sign-in?next=${currentPath}`);
          return null;
        }
        throw err;
      }
    },
    enabled: !!id && id !== "undefined",
    retry: false,
    staleTime: 0,
    gcTime: 0,
    throwOnError: false, // Prevents React Query from logging the error as a crash
  });

  //updating the note
  const mutation = useMutation({
    mutationFn: (updates: {
      title?: string;
      content?: string;
      is_public?: boolean;
    }) => api.patch(`/documents/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document", id] });
    },
  });

  // Sync state when data arrives
  useEffect(() => {
    if (doc && editor && !hasLoadedInitialData) {
      const initialTitle = doc.title || "";
      const initialContent = doc.content || "";
      const initialIsPublic = !!doc.is_public;

      setTitle(initialTitle);
      setContent(initialContent);
      setIsPublic(initialIsPublic);
      editor.commands.setContent(initialContent, { emitUpdate: false });

      lastSavedRef.current = { title: initialTitle, content: initialContent };
      setActiveId(id);

      const timer = setTimeout(() => {
        setHasLoadedInitialData(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [doc, editor, hasLoadedInitialData, id]);

  const togglePublicStatus = (status: boolean) => {
    setIsPublic(status);
    mutation.mutate({ is_public: status });
    toast.success(
      status
        ? "Anyone with the link can now view this note."
        : "Access restricted to invited members."
    );
  };

  // Auto-save logic
  useEffect(() => {
    if (
      !hasLoadedInitialData ||
      !activeId ||
      activeId !== id ||
      mutation.isPending
    )
      return;

    const isSettled = debouncedTitle === title && debouncedContent === content;
    if (!isSettled) return;

    const hasChanged =
      debouncedTitle !== lastSavedRef.current.title ||
      debouncedContent !== lastSavedRef.current.content;

    if (hasChanged) {
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
    const shareUrl = window.location.href;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success("Link copied!");
      })
      .catch((err) => {
        toast.error("Failed to copy link.");
      });
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
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

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-125 rounded-3xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Share2Icon className="w-5 h-5 text-purple-600" />
              Share this note
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
              Control who can view and edit this document.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">
              General Access
            </p>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => togglePublicStatus(false)}
                variant="ghost"
                className={`flex items-center justify-start gap-4 p-4 h-auto rounded-2xl border-2 transition-all text-left ${
                  !isPublic
                    ? "border-purple-600 bg-purple-50/50 dark:bg-purple-900/10"
                    : "border-transparent bg-zinc-50 dark:bg-zinc-800/50 hover:border-zinc-200"
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    !isPublic
                      ? "bg-purple-600 text-white"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                  }`}
                >
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    Restricted access
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Only people invited can access this document.
                  </p>
                </div>
              </Button>

              <Button
                onClick={() => togglePublicStatus(true)}
                variant="ghost"
                className={`flex items-center justify-start gap-4 p-4 h-auto rounded-2xl border-2 transition-all text-left ${
                  isPublic
                    ? "border-purple-600 bg-purple-50/50 dark:bg-purple-900/10"
                    : "border-transparent bg-zinc-50 dark:bg-zinc-800/50 hover:border-zinc-200"
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isPublic
                      ? "bg-purple-600 text-white"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                  }`}
                >
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    Anyone with the link
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Publicly viewable by everyone with the URL.
                  </p>
                </div>
              </Button>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Button
                onClick={handleCopyLink}
                className="w-full h-12 bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Share2Icon className="w-4 h-4 mr-2" />
                    Copy Link to Share
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-zinc-400 mt-3 font-medium">
                {isPublic
                  ? "Anyone with this link can view the document."
                  : "Only approved collaborators can use this link."}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
              className="flex items-center gap-2 rounded-xl px-4 h-8 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-lg shadow-purple-200/20"
            >
              <Share2Icon className="w-3.5 h-3.5" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* ── Document body ────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-8">
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
          leading-tight mb-4
        "
        />

        {/* Editor card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <EditorToolbar editor={editor} />

          {/* Editor content */}
          <div className="px-8 py-4 text-[15px] leading-7 min-h-75">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* AI Assistant Section */}
        <AIAssistant content={content} />

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
