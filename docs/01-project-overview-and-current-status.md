# 01. Project Overview & Current Status Review

**Reviewer**: Senior Fullstack Software Engineer  
**Tanggal**: 17 November 2026  
**Stack**: Next.js 16 + React 19 + Bun 1.4.2 + Drizzle ORM + PostgreSQL (Neon)

---

## 1. Executive Summary

Project **JobTracker** dibangun untuk mempermudah pencari kerja mengelola, melacak, dan memantau status lamaran pekerjaan (*job applications*), profil perusahaan (*companies*), jadwal wawancara (*interviews*), dan to-do list terkait proses rekrutmen.

Fondasi dasar aplikasi sudah sangat rapi dan mengikuti arsitektur modular (*Clean Architecture / 3-Tier Pattern*), dengan pemisahan yang jelas antara:
1. **Schema Layer** (`core/schemas/`): Validasi data runtime menggunakan Zod.
2. **Repository Layer** (`core/repositories/`): Abstraksi database query menggunakan Drizzle ORM.
3. **Service Layer** (`core/services/`): Logika bisnis dan orkestrasi data.
4. **API / Controller Layer** (`app/api/`): HTTP Route Handlers Next.js.
5. **Presentation Layer** (`app/(dashboard)/` & `components/`): Next.js App Router UI.

Secara fungsionalitas, modul **Autentikasi**, **Perusahaan (Companies)**, dan **Lamaran (Applications)** sudah memiliki CRUD lengkap. Namun, modul **Interviews**, **Tasks**, dan **Contacts** masih berstatus kosong/placeholder.

---

## 2. Audit Tech Stack & Dependensi

| Layer | Teknologi | Versi | Status Evaluasi |
| :--- | :--- | :--- | :--- |
| **Runtime & PM** | Bun | `1.4.2` | Berjalan optimal untuk eksekusi skrip, linting, dan manajemen paket. |
| **Framework** | Next.js | `16.3.6` (React 19) | Menggunakan App Router dengan route grouping `(auth)` dan `(dashboard)`. |
| **Database** | Neon Serverless PostgreSQL | `@neondatabase/serverless` | Serverless connection over HTTP/Websockets via `drizzle-orm/neon-http`. |
| **ORM** | Drizzle ORM & Kit | `0.45.3` / `0.31.11` | Sudah memiliki 5 snapshot migrasi di `db/migrations/`. |
| **Authentication** | NextAuth (Auth.js) | `^5.0.0-beta.32` | Terintegrasi dengan `@auth/drizzle-adapter`. Support Credentials + Google OAuth. |
| **UI & Styling** | Tailwind CSS v4 + Lucide | `@tailwindcss/postcss ^4` | Styling modern, responsif, dan konsisten. |
| **State & Cache** | TanStack Query & Zustand | Terpasang di `package.json` | **Belum diimplementasikan** (komponen masih memakai manual `fetch` + `useEffect`). |
| **Form & Validasi** | React Hook Form + Zod | `react-hook-form ^7`, `zod ^4` | Digunakan untuk validasi schema dan form input. |

---

## 3. Kondisi Fitur Saat Ini (Current Implementation Audit)

### ✅ Fitur yang Sudah Selesai & Berfungsi Penuh

#### A. Autentikasi & Session (`/login`, `/register`, `auth.ts`)
- **Credentials Auth**: Registrasi user baru dengan enkripsi kata sandi via `bcryptjs`, login dengan email & password.
- **OAuth Provider**: Konfigurasi Google Provider sudah siap (tinggal melengkapi client ID/secret di `.env.local`).
- **Drizzle Adapter**: Sinkronisasi user dan session otomatis ke database PostgreSQL (`users`, `accounts`, `sessions`, `verificationTokens`).
- **Route Guard**: Layout `app/(dashboard)/layout.tsx` memverifikasi sesi server-side dan me-redirect user yang belum login ke `/login`.

#### B. Manajemen Perusahaan / Companies (`/companies`, `/api/companies`)
- **Database Schema**: Tabel `companies` dengan field `name`, `logoUrl`, `websiteUrl`, `linkedinUrl`, `location`, `industry`, `notes`, serta relasi ke `users.id`.
- **Unique Constraint**: Constraint unik pada pasangan `(userId, name)` mencegah duplikasi nama perusahaan per user.
- **Backend Architecture**:
  - `core/schemas/company.schema.ts`: Validasi Zod `createCompanySchema` & `updateCompanySchema`.
  - `core/repositories/company.repository.ts`: Query Drizzle (`findCompaniesByUserId`, `findCompanyById`, `createCompany`, `updateCompany`, `deleteCompany`).
  - `core/services/company.service.ts`: Business logic pemanggilan repository.
  - `app/api/companies/route.ts` & `[id]/route.ts`: Endpoint RESTful lengkap (GET all, POST create, GET by id, PUT update, DELETE).
- **UI & UX**:
  - `components/companies/company-list.tsx`: Tampilan card grid dengan search query filter, logo placeholder, link website, dan modal edit/delete.
  - `components/companies/company-form.tsx`: Modal pop-up responsif untuk create/edit data perusahaan.

#### C. Manajemen Lamaran / Job Applications (`/applications`, `/api/applications`)
- **Database Schema**: Tabel `applications` lengkap dengan enum status:
  `SAVED`, `APPLIED`, `SCREENING`, `ASSESSMENT`, `INTERVIEW`, `OFFER`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`.
- **Field Detail**: Relasi ke `companyId`, posisi pekerjaan, link lowongan (`jobUrl`), rentang gaji (`salaryMin`, `salaryMax`, `currency`), tanggal apply, deadline, dan catatan.
- **Backend Architecture**:
  - `core/schemas/application.schema.ts`: Zod schema dengan parsing tanggal aman (`preprocess`).
  - `core/repositories/application.repository.ts`: Query Drizzle lengkap dengan sorting `createdAt`.
  - `core/services/application.service.ts`: Service logic terpisah.
  - `app/api/applications/route.ts` & `[id]/route.ts`: Endpoint RESTful lengkap (GET, POST, PUT, DELETE).
- **UI & UX**:
  - `components/applications/application-list.tsx`: Filter tab berdasarkan status (`ALL`, `APPLIED`, `INTERVIEW`, dsb.), formatting gaji Rupiah/valuta asing, status badge warna-warni, trigger action edit & delete.
  - `components/applications/application-form.tsx`: Dropdown relasional memilih perusahaan dari database user, input kompensasi, date picker deadline/applied.

#### D. Dashboard Overview (`/dashboard`)
- Menampilkan ringkasan metrik kuantitatif: *Total Applications*, *In Progress*, *Interviews Scheduled*, dan *Offers Received*.
- Data diambil secara server-side melalui `Promise.all([getApplications(userId), getCompanies(userId)])`.
- Menyediakan shortcut aksi cepat ("New Application", "Add Company").

---

## 4. Fitur yang Masih Kosong / Skeleton (Pending Implementation)

| Modul | File Terkait | Kondisi Saat Ini |
| :--- | :--- | :--- |
| **Interviews** | `db/schema/interviews.ts`<br>`app/(dashboard)/interviews/page.tsx` | Schema file kosong (0 bytes). Halaman UI hanya menampilkan banner *"Feature Coming Soon"*. Belum ada repository, service, maupun API route. |
| **Tasks & To-Dos** | `db/schema/tasks.ts`<br>`app/(dashboard)/tasks/page.tsx` | Schema file kosong (0 bytes). Halaman UI hanya menampilkan banner *"Feature Coming Soon"*. Belum ada repository, service, maupun API route. |
| **Contacts / Recruiters** | `db/schema/contacts.ts` | Schema file kosong (0 bytes). Belum ada halaman UI maupun endpoint API. |
| **Shared UI Components** | `components/shared/`<br>`components/ui/` | Folder `shared` masih kosong. Folder `components/ui/` baru memiliki `button.tsx`, sisa form input/modal di-*hardcode* di masing-masing komponen. |

---

## 5. Technical Debt & Area Peningkatan Kualitas Kode

1. **Strategi Fetching Data di Sisi Client**:
   - Komponen `ApplicationList` dan `CompanyList` saat ini memakai `useEffect` + `useState` + manual `fetch()`.
   - Hal ini menyebabkan re-fetch berulang tanpa caching, tidak ada background revalidation, dan tidak memanfaatkan paket `@tanstack/react-query` yang sudah terpasang.
2. **File Orphan & Duplikasi Konfigurasi**:
   - `lib/auth.ts` kosong (0 bytes), sementara inisialisasi NextAuth berada di root `auth.ts`. Hal ini dapat membingungkan developer baru. Sebaiknya distandardisasi.
3. **Peringatan Linter (ESLint)**:
   - Penggunaan `window.location.href` di `login-form.tsx` dan `register-form.tsx` memicu warning Next.js (seharusnya memakai `useRouter().push()` atau `redirect()`).
   - Penggunaan tag murni `<img>` di `company-list.tsx` memicu warning Next.js (disarankan memakai `<Image />` dari `next/image` dengan proper loader/unoptimized flag).
4. **Tampilan Aplikasi Baru Terbatas pada Tampilan Tabel/List**:
   - Pengguna job tracker modern sangat menyukai tampilan **Kanban Board** (Drag & Drop antar status seperti Trello/Notion).
5. **Belum Ada Storage Attachment**:
   - Belum ada kemampuan mengunggah CV / Resume per lamaran pekerjaan atau portofolio file.
