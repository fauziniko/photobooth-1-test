---
name: nextjs-dynamic-server-usage
description: "Perbaikan error Next.js DYNAMIC_SERVER_USAGE pada App Router. Use when build gagal karena headers, cookies, auth(), atau request-bound API dipakai saat static prerender."
argument-hint: "Tempel log error DYNAMIC_SERVER_USAGE"
user-invocable: true
---

# Next.js Dynamic Server Usage Fix

Gunakan skill ini untuk memperbaiki route yang gagal static render karena akses data berbasis request.

## Trigger
- "Dynamic server usage"
- "couldn't be rendered statically because it used headers/cookies"
- "auth() di layout bikin build gagal"

## Langkah
1. Cari file page/layout dari stack trace build.
2. Identifikasi akses request-bound API: `auth()`, `headers()`, `cookies()`.
3. Putuskan strategi:
   - Pindahkan logic ke route yang memang dynamic.
   - Hindari preload session di root layout untuk semua route.
   - Gunakan client session fetch bila cocok.
4. Jalankan `npm run build` dan pastikan error hilang.

## Checklist
- Root layout tidak memaksa semua route menjadi dynamic.
- Route admin/auth tetap aman setelah refactor.
- Build production sukses.
