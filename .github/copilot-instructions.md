# Copilot Instructions for This Project

Project ini adalah Next.js App Router (TypeScript + beberapa route JS) dengan fokus stabilitas production build.

## Tujuan Utama
- Utamakan solusi yang membuat `npm run build` stabil.
- Prioritaskan perbaikan root cause, bukan workaround gejala.
- Pertahankan perubahan tetap minimal dan aman.

## Auto Trigger Guidance
Saat user memberikan log error build/runtime Next.js, lakukan:
1. Klasifikasikan pola error.
2. Pilih skill paling relevan.
3. Terapkan patch terfokus.
4. Verifikasi lint + build.

Gunakan skill berikut secara proaktif:
- `/nextjs-build-error-triage` untuk investigasi awal.
- `/nextjs-dynamic-server-usage` untuk error prerender berbasis headers/cookies/auth.
- `/nextjs-use-search-params-suspense` untuk issue `useSearchParams`.
- `/nextjs-server-client-components` untuk boundary server/client.
- `/nextjs-route-handlers-hardening` untuk hardening API route.
- `/nextjs-middleware-auth-patterns` untuk auth middleware dan role access.
- `/nextjs-production-guardrails` sebagai checklist akhir.

## Agent Preference
Untuk kasus build error kompleks, prioritaskan agent:
- `Next.js Skill Orchestrator`

Agent ini harus:
- Memilih skill berdasarkan pattern error log.
- Menjalankan verifikasi lint/build sebelum menyimpulkan selesai.

## Editing Rules
- Jangan mengubah arsitektur besar jika tidak diminta.
- Hindari menambah dependency baru kecuali perlu.
- Jika ada beberapa opsi, pilih yang paling kecil impact-nya ke route existing.
- Pastikan perubahan tidak melemahkan proteksi auth/role.

## Done Criteria
Task dianggap selesai hanya jika:
- Error utama hilang.
- Lint dan build production berhasil.
- Ringkasan akhir menyebut file yang berubah dan hasil verifikasi.
