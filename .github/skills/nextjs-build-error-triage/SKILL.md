---
name: nextjs-build-error-triage
description: "Workflow triage cepat untuk error build Next.js: type errors, prerender errors, routing mismatch, dan runtime-to-build regression. Use when npm run build gagal dan butuh root-cause fix cepat."
argument-hint: "Tempel output build yang gagal"
user-invocable: true
---

# Next.js Build Error Triage

Skill ini memberikan alur investigasi agar perbaikan fokus ke akar masalah.

## Trigger
- `npm run build` gagal.
- Error lint/type/prerender terjadi bersamaan.

## Langkah
1. Kelompokkan error: TypeScript, prerender, routing, API runtime.
2. Perbaiki dari error pertama yang paling hulu.
3. Hindari patch gejala tanpa validasi end-to-end.
4. Ulangi `lint` lalu `build` sampai clean.
5. Catat perubahan guardrail agar tidak terulang.

## Checklist
- Tidak ada error lint/type.
- Tidak ada prerender error.
- Build final sukses.
