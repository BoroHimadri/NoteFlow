"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

import { Sparkles, Zap, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { FEATURES, STATS } from "../lib/data";

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ── Intersection observer hook ────────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { ref: statsRef, inView: statsInView } = useInView();

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <span className="font-serif text-xl text-zinc-900">
            Note<span className="italic text-purple-600">Flow</span>
          </span>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-500">
            <a
              href="#features"
              className="hover:text-purple-600 transition-colors"
            >
              Features
            </a>
            {/* <a
              href="#pricing"
              className="hover:text-purple-600 transition-colors"
            >
              Pricing
            </a> */}
            <a
              href="#about"
              className="hover:text-purple-600 transition-colors"
            >
              About
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/sign-in">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-600 hover:text-purple-600"
              >
                Log in
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-5"
              >
                Get started
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-zinc-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-purple-100 px-5 py-4 flex flex-col gap-4 text-sm">
            <a
              href="#features"
              className="text-zinc-600 hover:text-purple-600"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </a>
            {/* <a
              href="#pricing"
              className="text-zinc-600 hover:text-purple-600"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </a> */}
            <a
              href="#about"
              className="text-zinc-600 hover:text-purple-600"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>
            <div className="flex gap-3 pt-2 border-t border-zinc-100">
              <Link href="/auth/sign-in" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-zinc-200"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/auth/sign-up" className="flex-1">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-5 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-purple-100/60 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-violet-200/40 rounded-full blur-2xl -z-10" />
        <div className="absolute top-40 left-0 w-56 h-56 bg-purple-200/30 rounded-full blur-2xl -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50 animate-fade-in px-4 py-1.5 text-xs tracking-wide">
            <Sparkles className="w-3 h-3 mr-1.5" />
            AI-Powered Note Taking
          </Badge>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-zinc-900 leading-[1.05] tracking-tight mb-6 animate-slide-up">
            Think clearly,{" "}
            <span className="italic text-purple-600">write freely</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up-delay">
            NoteFlow is the intelligent note-taking app that helps you capture
            ideas, organise documents, and unlock insights — all in one
            beautiful workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up-delay-2">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-8 h-12 text-base shadow-lg shadow-purple-200"
              >
                Start for free
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl px-8 h-12 text-base border-zinc-200 text-zinc-600 hover:border-purple-300 hover:text-purple-600"
              >
                See how it works
              </Button>
            </Link>
          </div>

          <p className="text-xs text-zinc-400 mt-4">
            No credit card required · Free forever plan
          </p>
        </div>

        {/* Hero mockup */}
        <div className="max-w-4xl mx-auto mt-16 animate-float">
          <div className="relative bg-white rounded-3xl border border-purple-100 shadow-2xl shadow-purple-100/50 overflow-hidden">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-50 border-b border-zinc-100">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-300" />
                <span className="w-3 h-3 rounded-full bg-amber-300" />
                <span className="w-3 h-3 rounded-full bg-green-300" />
              </div>
              <div className="flex-1 bg-white rounded-md h-6 mx-4 border border-zinc-200 flex items-center px-3">
                <span className="text-[11px] text-zinc-400">
                  noteflow.app/dashboard
                </span>
              </div>
            </div>
            {/* Fake dashboard preview */}
            <div className="p-6 bg-zinc-50/50">
              <div className="flex gap-4">
                {/* Sidebar preview */}
                <div className="hidden sm:flex flex-col gap-2 w-36 shrink-0">
                  {["Dashboard", "All Notes", "Pinned", "Tags"].map(
                    (item, i) => (
                      <div
                        key={item}
                        className={`h-8 rounded-lg flex items-center px-3 text-xs font-medium ${
                          i === 0
                            ? "bg-purple-100 text-purple-700"
                            : "text-zinc-400"
                        }`}
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
                {/* Cards preview */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    {
                      tag: "WORK",
                      title: "Q3 Roadmap",
                      color: "bg-purple-50 text-purple-700",
                      pinned: true,
                    },
                    {
                      tag: "IDEAS",
                      title: "AI Features",
                      color: "bg-amber-50 text-amber-700",
                      pinned: false,
                    },
                    {
                      tag: "RESEARCH",
                      title: "Competitive Analysis",
                      color: "bg-blue-50 text-blue-700",
                      pinned: true,
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className={`bg-white rounded-xl border border-zinc-200 p-3 relative ${
                        card.pinned ? "border-t-2 border-t-purple-400" : ""
                      }`}
                    >
                      <span
                        className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full ${card.color}`}
                      >
                        {card.tag}
                      </span>
                      <p className="text-xs font-serif font-normal text-zinc-800 mt-2 leading-snug">
                        {card.title}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="h-1.5 bg-zinc-100 rounded w-full" />
                        <div className="h-1.5 bg-zinc-100 rounded w-4/5" />
                        <div className="h-1.5 bg-zinc-100 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        ref={statsRef}
        className="py-16 px-5 border-y border-purple-50 bg-purple-50/30"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {STATS.map((stat) => {
            const count = useCountUp(stat.value, 1800, statsInView);
            return (
              <div key={stat.label}>
                <p className="font-serif text-4xl sm:text-5xl text-zinc-900">
                  {count.toLocaleString()}
                  {stat.suffix}
                </p>
                <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50">
              <Zap className="w-3 h-3 mr-1.5" />
              Everything you need
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl text-zinc-900 leading-tight">
              Built for how you{" "}
              <span className="italic text-purple-600">actually think</span>
            </h2>
            <p className="text-zinc-500 mt-4 max-w-xl mx-auto">
              Every feature is designed to get out of your way and let you focus
              on what matters — your ideas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const { ref, inView } = useInView(0.1);
              return (
                <div
                  key={f.title}
                  ref={ref}
                  style={{ transitionDelay: `${i * 80}ms` }}
                  className={`
                    group bg-white border border-zinc-100 rounded-2xl p-6
                    hover:border-purple-200 hover:shadow-lg hover:shadow-purple-50
                    transition-all duration-300 cursor-default
                    ${
                      inView
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-6"
                    }
                  `}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.accent} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Highlight band ── */}
      <section className="py-20 px-5 bg-linear-to-br from-purple-600 to-violet-700 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="font-serif text-4xl sm:text-5xl text-white leading-tight mb-6">
            Your second brain,{" "}
            <span className="italic opacity-80">always with you</span>
          </h2>
          <p className="text-purple-100 text-lg mb-8 max-w-xl mx-auto">
            Stop losing ideas to scattered apps and forgotten notebooks.
            NoteFlow keeps everything connected.
          </p>
          <Link href="/auth/sign-up">
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-purple-50 rounded-2xl px-10 h-12 text-base font-semibold shadow-lg"
            >
              Start writing today
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Pricing ── */}
      {/* <section id="pricing" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50">
              Pricing
            </Badge>
            <h2 className="font-serif text-4xl sm:text-5xl text-zinc-900">
              Simple, <span className="italic text-purple-600">honest</span>{" "}
              pricing
            </h2>
            <p className="text-zinc-500 mt-4">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`
                  relative rounded-2xl p-7 border transition-all duration-300
                  ${
                    plan.highlight
                      ? "bg-purple-600 border-purple-600 shadow-2xl shadow-purple-200 scale-105"
                      : "bg-white border-zinc-200 hover:border-purple-200 hover:shadow-md"
                  }
                `}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
                    MOST POPULAR
                  </span>
                )}
                <p
                  className={`text-sm font-semibold mb-1 ${
                    plan.highlight ? "text-purple-200" : "text-zinc-500"
                  }`}
                >
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className={`font-serif text-4xl ${
                      plan.highlight ? "text-white" : "text-zinc-900"
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.highlight ? "text-purple-300" : "text-zinc-400"
                    }`}
                  >
                    /mo
                  </span>
                </div>
                <p
                  className={`text-sm mb-6 ${
                    plan.highlight ? "text-purple-200" : "text-zinc-400"
                  }`}
                >
                  {plan.desc}
                </p>

                <ul className="space-y-3 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check
                        className={`w-4 h-4 shrink-0 ${
                          plan.highlight ? "text-purple-200" : "text-purple-600"
                        }`}
                      />
                      <span
                        className={
                          plan.highlight ? "text-purple-100" : "text-zinc-600"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth/sign-up">
                  <Button
                    className={`w-full rounded-xl h-10 font-medium ${
                      plan.highlight
                        ? "bg-white text-purple-700 hover:bg-purple-50"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Footer ── */}
      <footer id="about" className="bg-zinc-950 text-white py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-10 mb-12">
            <div>
              <span className="font-serif text-2xl">
                Note<span className="italic text-purple-400">Flow</span>
              </span>
              <p className="text-zinc-400 text-sm mt-2 max-w-xs leading-relaxed">
                The intelligent workspace for your ideas, documents, and
                knowledge.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 text-sm">
              <div>
                <p className="text-zinc-300 font-medium mb-3">Product</p>
                {["Features", "Changelog", "Roadmap"].map((l) => (
                  <p
                    key={l}
                    className="text-zinc-500 hover:text-purple-400 cursor-pointer mb-2 transition-colors"
                  >
                    {l}
                  </p>
                ))}
              </div>
              <div>
                <p className="text-zinc-300 font-medium mb-3">Company</p>
                {["About", "Privacy", "Terms"].map((l) => (
                  <p
                    key={l}
                    className="text-zinc-500 hover:text-purple-400 cursor-pointer mb-2 transition-colors"
                  >
                    {l}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-zinc-600 text-xs">
              © 2025 NoteFlow. All rights reserved.
            </p>
            <p className="text-zinc-600 text-xs">
              Made with ♥ for writers everywhere
            </p>
          </div>
        </div>
      </footer>

      {/* ── Animation styles ── */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease both;
        }
        .animate-slide-up {
          animation: slide-up 0.7s ease both;
        }
        .animate-slide-up-delay {
          animation: slide-up 0.7s 0.15s ease both;
        }
        .animate-slide-up-delay-2 {
          animation: slide-up 0.7s 0.3s ease both;
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .transition-all {
          transition-property: all;
        }
      `}</style>
    </div>
  );
}
