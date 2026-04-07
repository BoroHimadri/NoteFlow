# 🧠 NoteFlow – AI-Powered Real-Time Notes App

**NoteFlow** is a modern full-stack web application that allows users to create, edit, and manage notes in real-time with a clean and intuitive interface. It integrates authentication, secure data handling, and scalable backend services.

---

## 🚀 Features

- 🔐 **Authentication**

  - Email & password login using Supabase Auth
  - Secure session management

- 📝 **Notes Management**

  - Create, read, update notes
  - User-specific data with Row Level Security (RLS)

- ⚡ **Real-Time Sync**

  - Instant updates using Supabase Realtime

- 🎨 **Modern UI**

  - Built with Tailwind CSS and shadcn/ui
  - Responsive and clean dashboard layout

- 🤖 **AI Integration**

  - Smart suggestions / summarization (future enhancement)(in the making...)

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript
- **UI:** Tailwind CSS, shadcn/ui
- **Backend (BaaS):** Supabase
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

- AI-powered note suggestions
- Rich text editor (Tiptap)
- Collaboration features
- Google OAuth login

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
