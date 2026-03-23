---
name: nextjs-production-guardrails
description: "Panduan hardening Next.js App Router untuk mencegah build/prerender error production. Use when debugging DYNAMIC_SERVER_USAGE, useSearchParams Suspense bailout, static vs dynamic rendering issues, auth/session in layout, route handlers, dan middleware patterns."
argument-hint: "Jelaskan error/build issue Next.js yang ingin diperbaiki"
user-invocable: true
---

# Next.js Production Guardrails

Skill ini membantu menganalisis dan memperbaiki masalah umum Next.js App Router yang sering lolos di development tetapi gagal saat production build.

## Kapan Dipakai
- Build gagal saat prerender/static generation
- Muncul error DYNAMIC_SERVER_USAGE
- Muncul error useSearchParams harus dibungkus Suspense
- Auth/session logic menyebabkan page tidak bisa static
- Ingin audit page/layout/api agar lebih production-safe

## Prosedur
1. Identifikasi sumber error dari log build dan stack trace.
2. Periksa page/layout yang mengakses request-bound API (headers/cookies/auth) saat prerender.
3. Pastikan komponen client yang memakai useSearchParams dibungkus Suspense boundary.
4. Bedakan benar antara route static dan dynamic:
   - Panggilan auth/headers/cookies di layout global biasanya membuat route jadi dynamic.
   - Pindahkan pengambilan session ke level yang tepat (client provider atau route yang memang dynamic).
5. Validasi API route:
   - Sanitasi input query/body
   - Timeout/fallback untuk upstream API
   - Hindari error payload yang bocor di production
6. Jalankan lint + build ulang sampai clean.

## Checklist Cepat
- Root layout tidak melakukan request-bound work yang memaksa semua route dynamic.
- useSearchParams berada dalam Suspense boundary.
- Middleware proteksi route konsisten dengan auth di route handler.
- API route punya validasi, timeout, dan error handling aman.
- npm run build sukses tanpa warning/error kritikal.

## Referensi
- Checklist implementasi: references/checklist.md
