# 📚 JobTracker Project Documentation

Selamat datang di direktori dokumentasi teknis **JobTracker**. Dokumentasi ini disusun dari kacamata **Fullstack Software Engineer** (Next.js & Bun stack) untuk memetakan arsitektur yang sudah dibangun, mengevaluasi status implementasi terkini, serta merumuskan roadmap eksekusi fitur-fitur selanjutnya.

---

## 🗂️ Daftar Isi Dokumentasi

| Dokumen | Deskripsi | Status |
| :--- | :--- | :--- |
| **[01. Project Overview & Current Status](./01-project-overview-and-current-status.md)** | Audit mendalam kondisi codebase saat ini: tech stack, fitur yang sudah live, fitur setengah jadi, dan technical debt. | ✅ Lengkap |
| **[02. Architecture & Codebase Standards](./02-architecture-and-codebase-standards.md)** | Pola arsitektur 3-tier (*Repository - Service - Controller/Route*), struktur folder, konvensi penamaan, dan standar Bun + Next.js App Router. | ✅ Lengkap |
| **[03. Roadmap & Feature Backlog](./03-roadmap-and-feature-backlog.md)** | Rencana bertahap (*Phase 1 - Phase 5*) mencakup Kanban Board, Modul Wawancara, Modul Tasks, Notifikasi & Calendar, hingga AI Job Matcher. | ✅ Lengkap |
| **[04. Database Schema Design](./04-database-schema-design.md)** | Desain ERD dan blueprint tabel Drizzle ORM untuk tabel yang masih kosong (`interviews`, `tasks`, `contacts`) dan tabel relasional baru. | ✅ Lengkap |
| **[05. Technical Improvements & Modernization](./05-technical-improvements.md)** | Rencana optimasi: migrasi `useEffect` fetch ke TanStack Query / Server Actions, standardisasi komponen UI, dan performa query. | ✅ Lengkap |

---

## 🚀 Tech Stack Ringkas

- **Runtime & Package Manager**: [Bun](https://bun.sh/) (`v1.4.2`)
- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Database & ORM**: PostgreSQL via [Neon Serverless](https://neon.tech/), [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js v5 (Auth.js)](https://authjs.dev/) dengan Drizzle Adapter & Credentials / Google OAuth
- **Styling & UI**: Tailwind CSS v4, Lucide React, Shadcn/Base-UI
- **Validation & State**: Zod, React Hook Form, TanStack React Query, Zustand

---

## 🎯 Fokus Fase Selanjutnya (Immediate Next Steps)
1. **Penyelesaian Skema Database**: Implementasikan tabel `interviews`, `tasks`, dan `contacts` di Drizzle ORM.
2. **Implementasi Modul Interviews**: Kalender & tracker jadwal interview dengan reminder.
3. **Implementasi Modul Tasks**: To-do checklist lamaran kerja (take-home test, follow-up recruiter, perbaikan CV).
4. **Kanban Board View**: Visualisasi pipeline lamaran kerja dengan fitur drag-and-drop.
