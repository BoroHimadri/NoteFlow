"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { FileText, Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "../components/ui/button";

// Floating lost notes for the background
const LOST_NOTES = [
  {
    title: "Meeting notes…",
    tag: "WORK",
    rotate: "-6deg",
    x: "8%",
    y: "15%",
    delay: "0s",
    size: "w-36",
  },
  {
    title: "Ideas for later…",
    tag: "IDEAS",
    rotate: "5deg",
    x: "78%",
    y: "10%",
    delay: "0.4s",
    size: "w-32",
  },
  {
    title: "Book summary…",
    tag: "PERSONAL",
    rotate: "-3deg",
    x: "85%",
    y: "55%",
    delay: "0.8s",
    size: "w-36",
  },
  {
    title: "Research draft…",
    tag: "RESEARCH",
    rotate: "7deg",
    x: "5%",
    y: "65%",
    delay: "0.2s",
    size: "w-32",
  },
  {
    title: "Weekly reflection…",
    tag: "JOURNAL",
    rotate: "-8deg",
    x: "70%",
    y: "78%",
    delay: "1s",
    size: "w-36",
  },
  {
    title: "Q4 roadmap…",
    tag: "WORK",
    rotate: "4deg",
    x: "20%",
    y: "80%",
    delay: "0.6s",
    size: "w-32",
  },
];

const TAG_COLORS: Record<string, string> = {
  WORK: "bg-purple-100 text-purple-700",
  IDEAS: "bg-amber-100 text-amber-700",
  PERSONAL: "bg-violet-100 text-violet-700",
  RESEARCH: "bg-blue-100 text-blue-700",
  JOURNAL: "bg-pink-100 text-pink-700",
};

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center px-5">
      {/* Soft purple glow behind center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-purple-100/70 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-violet-200/40 rounded-full blur-2xl -z-10" />

      {/* Floating lost note cards */}
      {mounted &&
        LOST_NOTES.map((note, i) => (
          <div
            key={i}
            className={`
            absolute hidden sm:block ${note.size}
            bg-white border border-zinc-200 rounded-xl p-3
            shadow-sm opacity-60
          `}
            style={{
              left: note.x,
              top: note.y,
              rotate: note.rotate,
              animation: `float-note 6s ${note.delay} ease-in-out infinite`,
            }}
          >
            <span
              className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full ${
                TAG_COLORS[note.tag]
              }`}
            >
              {note.tag}
            </span>
            <div className="mt-2 space-y-1.5">
              <div className="h-1.5 bg-zinc-100 rounded w-full" />
              <div className="h-1.5 bg-zinc-100 rounded w-3/4" />
            </div>
            <p className="text-[11px] text-zinc-400 mt-2 font-serif">
              {note.title}
            </p>
          </div>
        ))}

      {/* Center content */}
      <div
        className="relative text-center max-w-lg"
        style={{ animation: "fade-up 0.7s ease both" }}
      >
        {/* Torn paper / lost note illustration */}
        <div className="relative mx-auto w-48 h-48 mb-8">
          {/* Shadow note behind */}
          <div
            className="absolute inset-0 bg-purple-100 border border-purple-200 rounded-2xl"
            style={{ rotate: "6deg", transform: "rotate(6deg)" }}
          />
          {/* Main note */}
          <div className="absolute inset-0 bg-white border border-zinc-200 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-3 p-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-500" />
            </div>
            <div className="w-full space-y-2">
              <div className="h-2 bg-zinc-100 rounded w-full" />
              <div className="h-2 bg-zinc-100 rounded w-4/5 mx-auto" />
              <div className="h-2 bg-purple-100 rounded w-2/3 mx-auto" />
            </div>
            {/* Ripped edge effect */}
            <div className="absolute -bottom-3 left-0 right-0 h-3 overflow-hidden">
              <svg
                viewBox="0 0 300 12"
                className="w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 L20,8 L40,2 L60,10 L80,3 L100,9 L120,1 L140,8 L160,2 L180,10 L200,3 L220,9 L240,1 L260,8 L280,3 L300,0 L300,12 L0,12 Z"
                  fill="white"
                  stroke="#e4e4e7"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 404 number */}
        <div className="relative mb-2">
          <span
            className="font-serif text-[120px] sm:text-[160px] leading-none text-zinc-100 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden
          >
            404
          </span>
          <p className="relative font-serif text-3xl sm:text-4xl text-zinc-900 leading-tight pt-4">
            This note got <span className="italic text-purple-600">lost</span>
          </p>
        </div>

        <p className="text-zinc-500 text-base leading-relaxed mt-4 mb-8 max-w-sm mx-auto">
          The page you're looking for has wandered off — probably filed under
          the wrong tag. Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 h-10 gap-2">
              <Home className="w-4 h-4" />
              Back to dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="rounded-xl px-6 h-10 gap-2 border-zinc-200 text-zinc-600 hover:border-purple-300 hover:text-purple-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Go home
            </Button>
          </Link>
        </div>

        {/* Subtle suggestion */}
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-zinc-400">
          <Search className="w-3.5 h-3.5" />
          <span>Try searching for your note from the dashboard</span>
        </div>

        {/* Brand mark */}
        <div className="mt-12">
          <span className="font-serif text-sm text-zinc-300">
            Note<span className="italic text-purple-300">Flow</span>
          </span>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes float-note {
          0%,
          100% {
            transform: translateY(0px) rotate(var(--tw-rotate, 0deg));
          }
          50% {
            transform: translateY(-12px) rotate(var(--tw-rotate, 0deg));
          }
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
