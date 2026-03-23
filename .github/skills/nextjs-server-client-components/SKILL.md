---
name: nextjs-server-client-components
description: "Panduan boundary Server vs Client Components di Next.js App Router. Use when terjadi salah pemakaian hooks/browser API di server component atau overuse client component."
argument-hint: "Jelaskan gejala boundary issue"
user-invocable: true
---

# Server vs Client Component Boundary

Skill ini membantu menentukan lokasi logic yang tepat agar performa dan build tetap stabil.

## Trigger
- Hook React dipakai di server component.
- Browser API dipakai tanpa `use client`.
- Terlalu banyak komponen client tanpa kebutuhan interaktif.

## Langkah
1. Klasifikasi komponen: interaktif (client) vs non-interaktif (server).
2. Simpan fetching/data-heavy di server component saat memungkinkan.
3. Batasi `use client` hanya untuk subtree yang perlu interaksi.
4. Pastikan props antar boundary serializable.

## Checklist
- Tidak ada hook client di server component.
- Tidak ada browser API di server context.
- Bundle client tidak membengkak tanpa alasan.
