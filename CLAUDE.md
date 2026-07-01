# Runminders — CLAUDE.md

## Gambaran Project

Runminders adalah marketplace event lari berbasis web. Member bisa menemukan dan mendaftar event lari; admin mengelola event, member, dan partner.

**Domain:** marketplace event lari
**Deployment:** Vercel
**Status:** Development — Midtrans sandbox, email Resend via `EMAIL_TEST_ADDRESS`

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Custom JWT + NextAuth (Google OAuth) |
| Payment | Midtrans Snap |
| Email | Resend |
| Icon | @iconify/react |

---

## Perintah Umum

```bash
npm run dev     # Jalankan dev server
npm run build   # Build production
npm run lint    # Lint kode
```

---

## Struktur Direktori

```
docs/
└── Runminders API.postman_collection.json  # Dokumentasi API (Postman v2.1)

src/
├── proxy.js              # Edge guard: validasi JWT untuk /api/me/* dan /api/admin/*
├── app/
│   ├── api/              # API routes (server-side) — intent-based prefix
│   │   ├── admin/        # Khusus admin (role=admin + Bearer token)
│   │   │   ├── contacts/ # Kelola pesan kontak (GET list, GET/PATCH/DELETE by ID)
│   │   │   ├── events/   # Kelola event (POST, PUT/DELETE by ID, PATCH toggle-status)
│   │   │   ├── members/  # Kelola member (GET list, GET/PUT by ID)
│   │   │   ├── partners/ # Kelola partner (POST, PUT/DELETE by ID)
│   │   │   ├── registrations/ # Lihat semua registrasi (GET)
│   │   │   └── reviews/  # Kelola review termasuk nonaktif (GET/POST, GET/PUT/DELETE by ID)
│   │   ├── auth/         # register, login, verify, forgot/reset password, google
│   │   ├── contact/      # Submit pesan kontak publik (POST only)
│   │   ├── events/       # List + detail event publik (GET only)
│   │   ├── me/           # Member terautentikasi (Bearer token)
│   │   │   ├── events/   # Daftar registrasi milik user (GET list, GET/PATCH by ID)
│   │   │   ├── password/ # Ganti password (PUT)
│   │   │   ├── profile/  # Profil user (GET + PUT)
│   │   │   └── registrations/ # Buat pendaftaran event (POST)
│   │   ├── partners/     # List + detail partner publik (GET only)
│   │   ├── payments/     # Webhook Midtrans
│   │   └── reviews/      # List + detail review aktif (GET only)
│   ├── (halaman publik)
│   │   ├── page.js       # Home
│   │   ├── events/       # Daftar event + detail + register
│   │   ├── about/
│   │   ├── contact/
│   │   ├── faq/
│   │   ├── login/ register/ forgot-password/ reset-password/ verify-email/
│   │   ├── payment/      # success / pending / failed
│   │   └── privacy-policy/ terms-conditions/
│   └── dashboard/        # Halaman terproteksi
│       ├── page.js       # Dashboard member
│       ├── profile/
│       ├── my-events/    # Event yang dibuat member
│       └── admin/        # Khusus role admin
│           ├── events/   # Kelola event (list, create, edit)
│           ├── members/  # Kelola member
│           ├── partners/ # Kelola partner
│           └── contacts/ # Kelola pesan kontak (list + detail)
├── components/
│   ├── layout/           # Layout, Header, Footer, DashboardLayout, AuthLayout
│   ├── ui/               # Button, Input, EventCard, SocialButton, LegalLayout, LegalSidebarNav
│   ├── home/             # HeroSection, AboutSection, EventsSection, dll.
│   ├── events/           # EventGrid, EventList, EventDetail, EventFilters, dll.
│   ├── auth/             # LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm
│   ├── email/            # Template email (React Email)
│   └── [about/ contact/ faq/ legal/]
├── data/
│   ├── faq.js            # faqCategories + faqData (5 kategori, 15 item)
│   ├── privacy.js        # privacySections (sidebar nav kebijakan privasi)
│   ├── terms.js          # termsSections (sidebar nav syarat & ketentuan)
│   └── about.js          # heroContent + values (halaman about)
├── hooks/
│   └── useAuth.js        # Hook auth client-side
└── lib/
    ├── supabase.js        # Supabase server client (service role)
    ├── auth-utils.js      # hashPassword, verifyToken, isValidEmail, dll. (Node.js only)
    ├── auth-edge.js       # verifyTokenEdge via jose — Edge Runtime only (proxy.js)
    ├── auth-storage.js    # AES-encrypted localStorage/sessionStorage
    ├── email.js           # Fungsi kirim email via Resend
    ├── midtrans.js        # createSnapTransaction, verifySignature
    └── formatters-utils.js# Formatter tanggal, harga, dll.
```

---

## Skema Database (Supabase)

Tabel utama:
- **members** — akun user (email, password_hash, role, is_email_verified, token verifikasi)
- **events** — data event (title, slug, description, image_url, date, location, pricing, slots)
- **event_categories** — kategori/tier event dengan harga dan slot
- **category_features** — fitur per kategori
- **registrations** — pendaftaran user ke event (dengan status payment)
- **payment_transactions** — record transaksi dari Midtrans
- **partners** — data partner/sponsor
- **reviews** — testimoni/review pengguna (reviewer_name, reviewer_title, content, rating, is_active)
- **contact_messages** — pesan dari form kontak publik (name, email, subject, message, status: `new` | `read` | `replied`)

---

## Sistem Auth

**Dua metode login:**
1. **Email/password** — custom dengan Supabase, password di-hash bcrypt (12 rounds), JWT untuk sesi
2. **Google OAuth** — via NextAuth.js

**Penyimpanan token client-side:**
- Key storage: `r_auth` (di localStorage atau sessionStorage)
- Data di-encrypt AES dengan CryptoJS sebelum disimpan
- `rememberMe=true` → localStorage; `false` → sessionStorage
- Hook: `useAuth()` dari `src/hooks/useAuth.js`

**Role user:** `member` (default) | `admin`
- Proteksi halaman dashboard dilakukan client-side via `useAuth()`
- Proteksi API route dilakukan server-side via `proxy.js` (edge) + helper di dalam route handler

**Helper auth di `src/lib/auth-utils.js`:**
- `verifyAuth(request)` — decode JWT dari header `Authorization: Bearer <token>`, kembalikan payload atau `null`
- `verifyAdmin(request)` — sama seperti `verifyAuth` tapi hanya lolos jika `role === 'admin'`

**Proxy (`src/proxy.js`):**
- Berjalan di Edge Runtime sebelum semua request ke `/api/me/*` dan `/api/admin/*`
- Cek `Authorization` header; kembalikan 401 jika token tidak ada/tidak valid
- Untuk `/api/admin/*` tambahan cek `role === 'admin'`, kembalikan 403 jika bukan admin
- Verifikasi JWT menggunakan `verifyTokenEdge` dari `src/lib/auth-edge.js` (pakai `jose`, Edge-compatible)
- Jangan import `auth-utils.js` dari sini — `bcryptjs`, `crypto`, `jsonwebtoken` tidak kompatibel dengan Edge Runtime

---

## Konvensi Kode

- Semua operasi database **server-side** via `supabaseServer` (service role key)
- Client Supabase reguler sengaja di-disable (dikomentari di `src/lib/supabase.js`)
- Path alias: `@/*` → `src/*`
- `reactStrictMode: false` di `next.config.mjs`
- Komponen UI menggunakan ikon dari `@iconify/react`
- Tidak ada type annotation (plain JavaScript, bukan TypeScript)
- Data konten dipisah ke `src/data/` (faq, privacy, terms, about) — komponen hanya berisi logika rendering dan JSX layout

---

## Alur Payment (Midtrans)

1. User submit form registrasi → `POST /api/me/registrations` (Bearer token wajib)
2. Backend buat transaksi Midtrans Snap (expiry 2 jam)
3. User bayar via Snap popup
4. Midtrans kirim webhook ke `POST /api/payments/webhook`
5. Backend verifikasi signature SHA512, update status registrasi + slot event
6. Email konfirmasi dikirim via Resend
7. Webhook juga di-forward ke app partner (RITW, SYD) berdasarkan prefix order ID

---

## Integrasi Email (Resend)

Fungsi tersedia di `src/lib/email.js`:
- `sendVerificationEmail()` — token valid 24 jam
- `sendWelcomeEmail()`
- `sendPasswordResetEmail()`
- `sendEventRegistrationEmail()`
- `sendPaymentSuccessEmail()`
- `sendContactAutoReplyEmail()` — auto-reply ke pengirim form kontak

**Mode pengiriman email** dikontrol via env var `EMAIL_TEST_ADDRESS` di `.env.local`:
- Jika `EMAIL_TEST_ADDRESS` diset → semua email diarahkan ke alamat tersebut (testing)
- Jika tidak diset → email dikirim ke penerima asli (production)

Untuk production di Vercel: jangan set `EMAIL_TEST_ADDRESS`.

---

## Modul yang Ada

| Modul | Status |
|---|---|
| Member (beli/daftar event) | ✅ Ada |
| Event (list, detail, register) | ✅ Ada |
| Checkout & payment | ✅ Ada |
| Admin — kelola event | ✅ Ada |
| Admin — kelola member | ✅ Ada |
| Admin — kelola partner | ✅ Ada |
| Admin — kelola pesan kontak | ✅ Ada |
| Merchant role | ❌ Belum ada |

---

## Struktur API

API menggunakan **intent-based prefix** untuk memisahkan akses berdasarkan role:

| Prefix | Akses | Auth |
|---|---|---|
| `GET /api/events`, `GET /api/partners`, `GET /api/reviews`, `POST /api/contact` | Publik | Tidak perlu |
| `/api/auth/*` | Publik (autentikasi) | Tidak perlu |
| `/api/me/*` | Member terautentikasi | `Authorization: Bearer <token>` |
| `/api/admin/*` | Admin saja | `Authorization: Bearer <token>` + role=admin |
| `/api/payments/webhook` | Midtrans server | Signature SHA512 |

**Aturan penting:**
- Endpoint publik (`/api/events`, `/api/partners`, `/api/reviews`) hanya menyajikan data aktif — tidak ada mutasi
- `/api/reviews` publik hanya menampilkan `is_active = true`; `/api/admin/reviews` menampilkan semua
- `member_id` tidak boleh dikirim dari body/client — selalu diambil dari JWT token di server
- Semua route admin dan me sudah diproteksi ganda: proxy (edge) + `verifyAuth`/`verifyAdmin` di dalam handler

---

## Hal Penting yang Perlu Diketahui

- **Email test mode:** Dikontrol via `EMAIL_TEST_ADDRESS` di `.env.local`. Set nilainya untuk testing, kosongkan di production
- **Midtrans sandbox:** `MIDTRANS_IS_PRODUCTION=false`, belum production
- **Proxy (edge guard):** `src/proxy.js` memproteksi `/api/me/*` (JWT) dan `/api/admin/*` (JWT + role=admin) di level Edge Runtime. Gunakan `verifyTokenEdge` dari `src/lib/auth-edge.js` — jangan import `auth-utils.js` karena pakai Node.js modules yang tidak kompatibel dengan Edge Runtime. Proteksi halaman dashboard tetap client-side via `useAuth()`
- **Google OAuth:** Dikonfigurasi via NextAuth di `/api/auth/[...nextauth]`
- **`/emails-preview`:** Halaman untuk preview semua template email (dev only)
- **App partner terhubung:** RITW (Run In The Wood) dan SYD (Share Your Distance) — webhook di-forward berdasarkan prefix order ID
- **LegalLayout adalah Server Component** — `'use client'` hanya ada di `LegalSidebarNav`. Jangan tambahkan `'use client'` ke `LegalLayout` karena akan menarik `Layout` → `Footer` ke client bundle dan membuat `process.env.*` (APP_MAIL, APP_PHONE, dll.) jadi `undefined`
