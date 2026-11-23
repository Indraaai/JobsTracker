# 03. Roadmap & Feature Backlog

Dokumen ini memetakan rencana kerja pengembangan (*development roadmap*) terperinci dari status saat ini menuju aplikasi JobTracker yang lengkap dan siap produksi.

---

## 🗺️ Roadmap Fase Pengembangan

```
+---------------------------------------------------------------------------------+
| Phase 1: Core Completion (Interviews & Tasks)                 [SELESAI ✅]      |
| - Implementasi skema & CRUD Interviews (jadwal, tipe, link meet, hasil)         |
| - Implementasi skema & CRUD Tasks (to-do list rekrutmen, reminder, status)      |
| - Integrasi data ke Dashboard Overview                                          |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
| Phase 2: Enhanced Application Experience & Kanban Board       [SELESAI ✅]      |
| - Tampilan Kanban Board (Drag-and-drop status lamaran)                          |
| - Detail Page Lamaran (`/applications/[id]`) 360° Cockpit View                  |
| - Create Company On-The-Fly & Quick Action Shortcuts                            |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
| Phase 3: Recruiter Contacts & Networking Module               [SELESAI ✅]      |
| - Implementasi modul Contacts (`db/schema/contacts.ts` & CRUD lengkap)          |
| - Hubungkan kontak recruiter dengan profil perusahaan dan lamaran               |
| - Global Command Palette (Ctrl+K / Cmd+K) pencarian instan & navigasi cepat     |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
| Phase 4: Document & Resume Management                         [PRIORITAS TINGGI]|
| - Upload CV / Resume (multiple versions, misal: Frontend CV, Fullstack CV)      |
| - Tautkan versi CV spesifik ke lamaran yang dikirim                             |
| - Cover letter generator & catatan portofolio                                   |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
| Phase 5: Analytics, Calendar Sync & AI Features               [MASA DEPAN]      |
| - Sinkronisasi jadwal interview ke Google Calendar (Google API)                 |
| - Laporan analitik mendalam (conversion rate per tahap, rata-rata durasi balas) |
| - AI Job Description Matcher (analisis kesesuaian skill dengan JD)              |
+---------------------------------------------------------------------------------+
```

---

## 📋 Detail Backlog per Fase

### 🎯 Phase 1: Core Completion (Interviews & Tasks) — *Immediate Next Step*

#### 1.1 Modul Interviews (Wawancara Kerja)
- **Tujuan**: Memungkinkan user mencatat dan mengelola jadwal wawancara dari berbagai tahapan (HR, User/Technical, Cultural Fit, Final).
- **Deliverables**:
  - `db/schema/interviews.ts`: Skema Drizzle untuk tabel `interviews` (terhubung ke `applications.id` dan `users.id`).
  - `core/schemas/interview.schema.ts`: Zod schema validasi input.
  - `core/repositories/interview.repository.ts`: CRUD query.
  - `core/services/interview.service.ts`: Business logic pemrosesan wawancara.
  - `app/api/interviews/route.ts` & `[id]/route.ts`: API endpoints.
  - `components/interviews/*`: List view jadwal interview mendatang (*upcoming*) dan yang sudah selesai (*completed*).
  - Integrasi widget "Upcoming Interviews" di Dashboard utama.

#### 1.2 Modul Tasks & To-Dos (Aktivitas Lamaran)
- **Tujuan**: Membantu pencari kerja mengingat tugas seperti take-home test, follow-up email setelah interview, atau mengirimkan dokumen tambahan.
- **Deliverables**:
  - `db/schema/tasks.ts`: Skema Drizzle untuk tabel `tasks` dengan field `title`, `dueDate`, `isCompleted`, `priority`, relasi opsional ke `applicationId`.
  - `core/schemas/task.schema.ts` & Repository/Service.
  - `app/api/tasks/route.ts` & `[id]/route.ts`.
  - `components/tasks/*`: Tampilan to-do list interaktif dengan checkbox instan (*optimistic update*).
  - Integrasi widget "Pending Tasks" di Dashboard utama.

---

### 🚀 Phase 2: Enhanced Application Experience & Kanban Board

#### 2.1 Kanban Board Pipeline
- Mengubah visualisasi tabel biasa menjadi papan Kanban interaktif dengan kolom status:
  `Wishlist/Saved` ➔ `Applied` ➔ `Screening` ➔ `Interview` ➔ `Offer` ➔ `Closed (Accepted/Rejected)`.
- Menggunakan library `@dnd-kit/core` atau implementasi HTML5 drag-and-drop yang ramah mobile.
- Perpindahan kartu otomatis memicu update status di backend.

#### 2.2 Halaman Detail Lamaran (`/applications/[id]`)
- Menampilkan seluruh riwayat satu lamaran:
  - Informasi posisi, deskripsi, tautan lowongan, dan nominal gaji.
  - Hubungan ke perusahaan terkait.
  - Riwayat tahapan wawancara yang terhubung.
  - Riwayat to-do / tasks yang terhubung.
  - Log aktivitas (misal: "Status berubah dari Applied ke Interview pada 12 Nov").

---

### 👥 Phase 3: Recruiter Contacts & Networking

- Mengisi `db/schema/contacts.ts` untuk menyimpan kontak penting:
  - Nama recruiter / hiring manager, role, email, nomor telepon, link LinkedIn.
  - Relasi ke perusahaan terkait (`companyId`).
- Halaman UI untuk melihat direktori kontak pencari kerja.

---

### 📄 Phase 4: Document & Resume Storage

- Manajemen aset berkas pelamar:
  - Dukungan upload file PDF ke cloud storage (Uploadthing / AWS S3 / Cloudflare R2).
  - Fitur mengaitkan dokumen spesifik (contoh: "Resume v3 - Next.js Focused") ke lamaran pekerjaan tertentu.

---

### 📊 Phase 5: Analytics, Calendar Sync & AI

- **Calendar Integration**: Fitur export ke iCal / sinkronisasi otomatis ke Google Calendar ketika jadwal interview ditambahkan.
- **Analytics Dashboard**:
  - Rata-rata waktu tunggu respon lamaran.
  - Tingkat keberhasilan (*conversion funnel*: Berapa % lamaran yang lolos ke interview).
  - Platform/sumber lowongan yang paling efektif (LinkedIn, Jobstreet, Glints, Referral).
- **AI Assist (Gemini API)**:
  - Fitur paste Job Description dan menerima ringkasan kata kunci penting (*key skills matching*).
