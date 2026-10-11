# 🧠 NoteFlow – AI-Powered Real-Time Notes App

**NoteFlow** is a modern full-stack web application that allows users to create, edit, and manage notes in real-time with a clean and intuitive interface. It integrates authentication, secure data handling, and scalable backend services.

---

## 🚀 Features

- 🔐 **Authentication**

  - Email & password login using Supabase Auth
  - Google OAuth authentication
  - Secure session management

- 📝 **Notes Management**

  - Create, read, update notes
  - User-specific data with Row Level Security (RLS)

- ⚡ **Real-Time Sync**

  - Instant updates using Supabase Realtime

- 🎨 **Modern UI**

  - Built with Tailwind CSS and shadcn/ui
  - Responsive and clean dashboard layout

- 🤖 **AI Integration (Gemini)**

  - **Polish** — rewrites your writing to be professional and clear
  - **Summarize** — one-click TL;DR with key points
  - **Continue Writing** — AI drafts the next part of your note
  - **Ask AI** — chat with your note & get answers from its content
  - Credit-based usage tracking per session

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript
- **UI:** Tailwind CSS, shadcn/ui
- **Backend (BaaS):** Supabase
- **AI:** Google Gemini (via GoogleGenerativeAI)
- **Editor:** Tiptap (rich text)
- **Forms:** React Hook Form
- **Database:** PostgreSQL (via Supabase)

---

## 🔒 Security

- Row Level Security (RLS) ensures users can only access their own data
- Secure authentication handled by Supabase

---

## 📁 Project Structure (Simplified)

```
app/
  page.tsx
  auth/
    sign-in/
    sign-up/
  dashboard/
  document/[id]/
components/
services/
```

---

## 🎯 Purpose

This project demonstrates:

- Full-stack development using modern tools
- Authentication & authorization flows
- Real-time data handling
- Clean UI/UX design

---

## 🚧 Future Improvements

- AI-powered semantic search across notes
- Auto-tagging & smart title suggestions
- Tone transform (formal ⇄ casual, expand ⇄ condense)

---

## 💡 Author

**Himadri Boro**

---

> Built as a portfolio project to showcase real-world frontend + backend integration skills.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
