# 05. Technical Improvements & Modernization

Dokumen ini berisi panduan teknis bagi tim pengembang untuk mengoptimalkan performa, keandalan kode (*maintainability*), dan kenyamanan pengguna (*developer & user experience*).

---

## 1. Modernisasi Data Fetching (Migrasi ke TanStack Query)

### Masalah Saat Ini
Saat ini, komponen seperti `ApplicationList` dan `CompanyList` menggunakan *pattern* klasik:
```typescript
// Pattern saat ini (Kurang efisien)
useEffect(() => {
  async function loadData() {
    setLoading(true);
    const res = await fetch("/api/applications");
    const json = await res.json();
    setApplications(json.data);
    setLoading(false);
  }
  loadData();
}, []);
```
**Kekurangan**:
- Tidak ada *cache layer* (setiap berpindah tab/halaman melakukan fetch ulang).
- Tidak ada *automatic background refetching* saat window kembali fokus.
- Mutasi data (Create, Update, Delete) membutuhkan manual reload state atau trigger fungsi fetch penuh.

### Solusi Rekomendasi
Paket `@tanstack/react-query` sudah ada di `package.json`. Kita perlu:
1. Menambahkan `QueryClientProvider` di `app/layout.tsx` atau `components/shared/query-provider.tsx`.
2. Membuat kustom hooks untuk entitas data:
```typescript
// hooks/use-applications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res = await fetch("/api/applications");
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data;
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
```

---

## 2. Resolusi Linter & Code Smells

Berikut perbaikan spesifik yang perlu segera diaplikasikan:

### A. Ganti `window.location.href` dengan Next.js Router
- **File**: `components/auth/login-form.tsx` & `components/auth/register-form.tsx`
- **Masalah**: Mengabaikan Single Page Application (SPA) client-side transition dan memicu full-page reload.
- **Solusi**: Gunakan `useRouter()` dari `next/navigation`:
```typescript
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  // ...
  const onSubmit = async () => {
    // ...
    router.push("/dashboard");
    router.refresh();
  };
}
```

### B. Optimasi Tag Gambar (`<img>` ➔ `<Image />` atau Avatar Fallback)
- **File**: `components/companies/company-list.tsx`
- **Masalah**: Penggunaan `<img src={company.logoUrl} />` mentah memicu warning LCP (Largest Contentful Paint).
- **Solusi**: Gunakan komponen `<Image />` dari `next/image` dengan proper domain whitelist di `next.config.ts`, atau sediakan fallback avatar inisial nama perusahaan jika logo tidak tersedia.

### C. Konsolidasi File Konfigurasi Auth
- Hapus file kosong `lib/auth.ts` atau jadikan re-export dari root `auth.ts` untuk menghindari ambiguitas import path di kalangan tim:
```typescript
// lib/auth.ts
export { auth, handlers, signIn, signOut } from "@/auth";
```

---

## 3. Standardisasi Komponen UI Atomik (Design System)

Saat ini baru terdapat `components/ui/button.tsx`. Komponen form seperti modal, input text, select dropdown, dan badge status dibuat manual dengan Tailwind di masing-masing file form.

Disarankan mengadopsi standar komponen headless seperti `@base-ui/react` (sudah terpasang di dependencies) atau Shadcn primitives untuk:
- `components/ui/dialog.tsx`: Menggantikan modal kustom manual di form create/edit.
- `components/ui/badge.tsx`: Standardisasi status badge (SAVED, APPLIED, INTERVIEW, OFFER, dsb.).
- `components/ui/select.tsx`: Dropdown pemilihan status dan perusahaan yang lebih ramah keyboard dan aksesibilitas (a11y).
- `components/ui/calendar.tsx` & `date-picker.tsx`: Pemilihan tanggal deadline dan jadwal interview yang presisi.

---

## 4. Keamanan & Database Best Practices

1. **IDOR (Insecure Direct Object Reference) Prevention**:
   - Selalu validasi bahwa `userId` dari session cocok dengan `userId` pemilik data di database pada setiap query `UPDATE` dan `DELETE`. Hal ini sudah dilakukan dengan baik di `application.repository.ts` dan `company.repository.ts`, pertahankan standar ini untuk `interviews` dan `tasks`.
2. **Neon Serverless Connection Resilience**:
   - Query saat ini menggunakan `drizzle-orm/neon-http` yang ideal untuk serverless/edge runtime karena tidak memelihara koneksi TCP persisten (*stateless HTTP requests*).
   - Pastikan variabel lingkungan `DATABASE_URL` menggunakan pooling URL jika nanti menambahkan WebSocket/real-time transactions.
