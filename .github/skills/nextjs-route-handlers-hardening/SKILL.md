---
name: nextjs-route-handlers-hardening
description: "Hardening Next.js Route Handlers (app/api/**/route.ts|js): validasi input, timeout upstream, fallback, dan safe error response production. Use when API tidak stabil atau rawan error saat build/runtime."
argument-hint: "Jelaskan endpoint API yang ingin di-hardening"
user-invocable: true
---

# Route Handlers Hardening

Skill ini fokus pada stabilitas endpoint API di App Router.

## Trigger
- API sering timeout atau flaky.
- Query/body tidak tervalidasi.
- Error response membocorkan detail internal.

## Langkah
1. Validasi query/body/path params.
2. Batasi ukuran input (limit, panjang query, enum provider).
3. Tambahkan timeout untuk request ke service eksternal.
4. Sediakan fallback bila upstream gagal.
5. Bedakan error detail untuk dev vs production.

## Checklist
- Input invalid mengembalikan status 400 yang jelas.
- Timeout/fallback ada untuk upstream penting.
- Payload error production aman.
