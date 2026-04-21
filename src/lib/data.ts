import {
  Sparkles,
  Pin,
  Search,
  Share2,
  Zap,
  Shield,
  Smartphone,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

export const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Writing",
    desc: "Let AI continue your thoughts, summarise long notes, and suggest smart tags automatically.",
    accent: "bg-purple-50 text-purple-600",
  },
  {
    icon: Search,
    title: "Semantic Search",
    desc: "Ask questions about your notes. Find anything instantly with natural language search.",
    accent: "bg-violet-50 text-violet-600",
  },
  {
    icon: Pin,
    title: "Pin & Organise",
    desc: "Pin your most important notes to the top. Organise everything with tags and folders.",
    accent: "bg-purple-50 text-purple-600",
  },
  {
    icon: Share2,
    title: "Real-Time Collaboration",
    desc: "Share documents with your team and edit together in real time, like Google Docs.",
    accent: "bg-violet-50 text-violet-600",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    desc: "End-to-end encryption keeps your notes private. Only you can read your thoughts.",
    accent: "bg-purple-50 text-purple-600",
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    desc: "Available on web, iOS, and Android. Your notes sync instantly across all devices.",
    accent: "bg-violet-50 text-violet-600",
  },
];

export const PLANS = [
  {
    name: "Free",
    price: "0",
    desc: "Perfect for personal use",
    features: ["50 notes", "Basic search", "Mobile app", "2 GB storage"],
    cta: "Get started free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "8",
    desc: "For power users & writers",
    features: [
      "Unlimited notes",
      "AI writing assistant",
      "Semantic search",
      "20 GB storage",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Team",
    price: "16",
    desc: "Built for collaboration",
    features: [
      "Everything in Pro",
      "Real-time collaboration",
      "Team workspaces",
      "100 GB storage",
      "Admin controls",
    ],
    cta: "Talk to us",
    highlight: false,
  },
];

export const STATS = [
  { value: 50000, suffix: "+", label: "Active users" },
  { value: 99, suffix: "%", label: "Uptime SLA" },
  { value: 4, suffix: "M+", label: "Notes created" },
];
