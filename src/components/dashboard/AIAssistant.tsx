"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  Wand2,
  X,
  ChevronRight,
  History,
} from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";

interface AIAssistantProps {
  content: string;
}

export default function AIAssistant({ content }: AIAssistantProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [polishCount, setPolishCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const MAX_POLISHES = 3;

  const handleSummarize = async () => {
    if (polishCount >= MAX_POLISHES) {
      toast.error("You've reached the maximum of 3 polishes.");
      return;
    }

    if (!content || content.replace(/<[^>]*>/g, "").trim().length < 20) {
      toast.info("Write a bit more before polishing!");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to polish text");

      setSummary(data.summary);
      setPolishCount((prev) => prev + 1);
      toast.success(`Polished! (${polishCount + 1}/${MAX_POLISHES})`);
    } catch (error: any) {
      toast.error(error.message || "AI Error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!summary) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(summary);
      } else {
        // Fallback for non-secure contexts or older mobile browsers
        const textArea = document.createElement("textarea");
        textArea.value = summary;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-2xl shadow-2xl transition-all duration-300 group ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        } bg-linear-to-br from-purple-600 to-indigo-600 text-white hover:shadow-purple-500/25 hover:-translate-y-1 animate-in fade-in zoom-in duration-500`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full border-2 border-purple-600" />
          </div>
          <span className="font-semibold text-sm pr-1">AI Assistant</span>
        </div>
      </button>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-100 transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Glass Effect Backdrop */}
        <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-l border-zinc-200/50 dark:border-zinc-800/50 shadow-[-20px_0_50px_rgba(0,0,0,0.05)]" />

        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-xl shadow-lg shadow-purple-200 dark:shadow-none">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
                  AI Writing Assistant
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex gap-0.5">
                    {[...Array(MAX_POLISHES)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-1 rounded-full transition-colors duration-500 ${
                          i < polishCount
                            ? "bg-zinc-200 dark:bg-zinc-700"
                            : "bg-purple-500"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                    {MAX_POLISHES - polishCount} Credits Left
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors group"
            >
              <X className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-50" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!summary && !isGenerating ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-5 bg-linear-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-2xl border border-purple-100/50 dark:border-purple-800/20">
                  <p className="text-sm text-purple-900/70 dark:text-purple-300/70 leading-relaxed italic">
                    "Transform your rough thoughts into professional prose with
                    one click."
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">
                    How it works
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        icon: Wand2,
                        text: "Analyzes your current writing tone",
                      },
                      {
                        icon: Sparkles,
                        text: "Fixes awkward phrasing & vocabulary",
                      },
                      {
                        icon: History,
                        text: "Ensures professional business clarity",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                      >
                        <item.icon className="w-4 h-4 text-zinc-400 group-hover:text-purple-500 transition-colors" />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 animate-pulse" />
                  <Loader2 className="w-12 h-12 text-purple-600 animate-spin relative" />
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  Polishing Masterpiece
                </h4>
                <p className="text-sm text-zinc-500 max-w-50">
                  Refining your text to sound more sophisticated...
                </p>
              </div>
            )}

            {summary && !isGenerating && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Polished Version
                  </h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    READY
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm whitespace-pre-wrap">
                    {summary}
                  </div>

                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 h-11 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl transition-all active:scale-[0.98]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-semibold text-emerald-500">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          Copy to Clipboard
                        </span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    onClick={handleSummarize}
                    disabled={polishCount >= MAX_POLISHES}
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold shadow-lg shadow-purple-200 dark:shadow-none disabled:bg-zinc-100 disabled:text-zinc-400"
                  >
                    {polishCount >= MAX_POLISHES
                      ? "No Credits Remaining"
                      : "Repolish Version"}
                  </Button>
                  <Button
                    onClick={() => setSummary(null)}
                    variant="ghost"
                    className="w-full text-zinc-400 hover:text-zinc-600 h-10 rounded-xl text-xs"
                  >
                    Start Over
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          {!summary && !isGenerating && (
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/10">
              <Button
                onClick={handleSummarize}
                disabled={polishCount >= MAX_POLISHES}
                className="w-full h-14 bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white rounded-2xl font-bold transition-all hover:shadow-xl disabled:opacity-50 group"
              >
                <span className="mr-2">Polish Writing</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Background Blur for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-sm transition-opacity duration-500 sm:hidden"
        />
      )}
    </>
  );
}
