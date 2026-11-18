# 02. Architecture & Codebase Standards

Dokumen ini mendefinisikan standar arsitektur dan pola penulisan kode (*coding convention*) untuk project **JobTracker** berbasis **Next.js App Router** dan **Bun**.

---

## 1. Pola Arsitektur (Layered 3-Tier Pattern)

Untuk menjaga kode tetap bersih, mudah di-test, dan *maintainable*, project ini mengadopsi pemisahan lapisan (separation of concerns):

```
+-------------------------------------------------------------+
|                 PRESENTATION LAYER                          |
|   app/(dashboard)/* (Pages, Layouts)                        |
|   components/* (UI Primitives, Forms, Views, Modals)        |
+-------------------------------------------------------------+
                              |
                     (HTTP / Server Action)
                              v
+-------------------------------------------------------------+
|                 CONTROLLER / API LAYER                      |
|   app/api/* (Next.js Route Handlers)                        |
|   - Session & User Authorization check                      |
|   - Request payload parsing & HTTP response formatting      |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                     CORE SERVICE LAYER                      |
|   core/services/*                                           |
|   - Business rules & orchestration                          |
|   - Status transition validations                           |
|   - Data sanitization & calculation                         |
+-------------------------------------------------------------+
               |                              |
               v                              v
+-----------------------------+  +----------------------------+
|     VALIDATION SCHEMAS      |  |      REPOSITORY LAYER      |
|   core/schemas/*            |  |   core/repositories/*      |
|   - Zod runtime schema      |  |   - Direct Drizzle queries |
|   - Type inference (TS)     |  |   - CRUD operations on DB  |
+-----------------------------+  +----------------------------+
                                              |
                                              v
                                 +----------------------------+
                                 |       DATABASE LAYER       |
                                 |   db/schema/* (Drizzle PG) |
                                 |   PostgreSQL (Neon)        |
                                 +----------------------------+
```

---

## 2. Struktur Direktori Proyek

```plaintext
job-tracker/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Route Group: Autentikasi (login, register)
│   ├── (dashboard)/          # Route Group: Halaman terproteksi
│   │   ├── applications/     # Halaman lamaran kerja (list/kanban)
│   │   ├── companies/        # Halaman master perusahaan
│   │   ├── dashboard/        # Halaman overview statistik
│   │   ├── interviews/       # Halaman jadwal interview
│   │   ├── tasks/            # Halaman to-do & reminders
│   │   └── layout.tsx        # Shell & auth session guard
│   ├── api/                  # RESTful Route Handlers
│   │   ├── applications/     # Endpoints /api/applications
│   │   ├── auth/             # Endpoints /api/auth (NextAuth & register)
│   │   ├── companies/        # Endpoints /api/companies
│   │   ├── interviews/       # (Akan datang) Endpoints /api/interviews
│   │   └── tasks/            # (Akan datang) Endpoints /api/tasks
│   ├── globals.css           # Tailwind CSS v4 styling
│   └── layout.tsx            # Root layout HTML & font provider
├── components/               # Komponen UI React
│   ├── applications/         # Komponen khusus modul lamaran
│   ├── auth/                 # Form login & registrasi
│   ├── companies/            # Komponen khusus modul perusahaan
│   ├── dashboard/            # Sidebar, header, dashboard shell
│   ├── interviews/           # (Akan datang) Calendar & interview cards
│   ├── tasks/                # (Akan datang) Checklist to-do
│   └── ui/                   # Reusable atomic UI (button, dialog, input, dropdown)
├── core/                     # Domain & Business Logic (Framework-Agnostic)
│   ├── repositories/         # Drizzle database queries
│   ├── schemas/              # Zod validation schemas
│   └── services/             # Business logic functions
├── db/                       # Database Configuration & ORM
│   ├── migrations/           # Drizzle generated migration files (.sql)
│   ├── schema/               # Drizzle table & relation definitions
│   └── index.ts              # Neon client & Drizzle DB instance
├── docs/                     # Dokumentasi teknis & spesifikasi proyek
├── lib/                      # Helper & utilities (formatting, cn, dsb.)
├── auth.ts                   # NextAuth v5 configuration & callbacks
└── drizzle.config.ts         # Konfigurasi Drizzle Kit
```

---

## 3. Standar Penulisan & Konvensi Kode

### A. Repositories (`core/repositories/*.ts`)
- Fungsi repository **hanya** bertugas berkomunikasi dengan tabel database lewat Drizzle ORM.
- **Wajib menyertakan filter `userId`** di setiap query (kecuali master data publik) untuk mencegah akses data lintas pengguna (*IDOR protection*).
- Hindari menaruh logika bisnis kompleks di repository.

Contoh standar:
```typescript
export async function findApplicationsByUserId(userId: string) {
  return db
    .select()
    .from(applications)
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.createdAt));
}
```

### B. Services (`core/services/*.ts`)
- Menerima input yang telah tervalidasi atau melakukan validasi internal sebelum menyimpan data.
- Menangani agregasi, perhitungan metrik, dan relasi data antar-tabel.

### C. Schemas (`core/schemas/*.ts`)
- Didefinisikan menggunakan **Zod**.
- Selalu *export* type TypeScript yang di-infer dari schema:
```typescript
export const createApplicationSchema = z.object({
  companyId: z.string().uuid("Invalid company ID"),
  position: z.string().min(1, "Position is required"),
  // ...
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
```

### D. Route Handlers (`app/api/*`)
- Wajib memverifikasi session user di baris pertama:
```typescript
const session = await auth();
if (!session?.user?.id) {
  return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
}
```
- Selalu format response dalam struktur JSON yang seragam:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```
Atau jika error:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": { ... }
}
```

---

## 4. Alur Migrasi Database dengan Bun

Gunakan Bun CLI untuk mengelola migrasi skema database:

```bash
# 1. Menghasilkan file migrasi baru setelah mengubah db/schema/*.ts
bun x drizzle-kit generate

# 2. Menerapkan migrasi langsung ke PostgreSQL (Neon)
bun x drizzle-kit migrate

# 3. Membuka Drizzle Studio di browser untuk melihat data database
bun x drizzle-kit studio
```
