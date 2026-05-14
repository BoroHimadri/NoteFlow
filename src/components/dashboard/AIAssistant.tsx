"use client";

import { useState } from "react";
import { Sparkles, Loader2, Copy, Check, Wand2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";

interface AIAssistantProps {
  content: string;
}

export default function AIAssistant({ content }: AIAssistantProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!content || content.replace(/<[^>]*>/g, "").trim().length < 20) {
      toast.info("Write a bit more before polishing your text!");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to polish text");
      }

      setSummary(data.summary);
      toast.success("Text polished successfully!");
    } catch (error: any) {
      console.error("AI Assistant Error:", error);
      toast.error(error.message || "Something went wrong with the AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Polished version copied!");
  };

  return (
    <div className="mt-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden transition-all duration-300">
      <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">AI Writing Assistant</h3>
        </div>
        {!summary && !isGenerating && (
          <Button
            onClick={handleSummarize}
            variant="ghost"
            size="sm"
            className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <Wand2 className="w-3.5 h-3.5 mr-1.5" />
            Polish Writing
          </Button>
        )}
      </div>

      <div className="px-6 py-4">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-3" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400 animate-pulse">
              Polishing your writing to sound more professional...
            </p>
          </div>
        ) : summary ? (
          <div className="space-y-4">
            <div className="relative group">
              <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 whitespace-pre-wrap">
                {summary}
              </div>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-50 dark:hover:bg-zinc-700"
                title="Copy polished text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              </button>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                onClick={() => setSummary(null)}
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-500 hover:text-zinc-700"
              >
                Clear
              </Button>
              <Button
                onClick={handleSummarize}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 rounded-xl"
              >
                Repolish
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4">
              Our AI can rewrite your notes to sound more professional, sophisticated, and clear.
            </p>
            <Button
              onClick={handleSummarize}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6"
            >
              Polish My Writing
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
