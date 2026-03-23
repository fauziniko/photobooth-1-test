---
name: nextjs-use-search-params-suspense
description: "Panduan perbaikan useSearchParams pada Next.js App Router dengan Suspense boundary. Use when build error menyebut missing-suspense-with-csr-bailout."
argument-hint: "Tempel log error useSearchParams"
user-invocable: true
---

# useSearchParams Suspense Guard

Skill ini fokus pada error build saat komponen client menggunakan `useSearchParams` tanpa boundary `Suspense`.

## Trigger
- "missing-suspense-with-csr-bailout"
- "useSearchParams should be wrapped in a suspense boundary"

## Langkah
1. Temukan komponen yang memanggil `useSearchParams`.
2. Pisahkan komponen menjadi:
   - komponen konten (menggunakan `useSearchParams`)
   - wrapper dengan `Suspense` + fallback.
3. Pastikan fallback ringan dan tidak mengubah behavior utama.
4. Build ulang untuk validasi.

## Checklist
- Semua consumer `useSearchParams` dibungkus `Suspense`.
- Tidak ada hydration mismatch baru.
- Build production sukses.
