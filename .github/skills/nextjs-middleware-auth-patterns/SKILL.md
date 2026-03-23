---
name: nextjs-middleware-auth-patterns
description: "Pattern auth/authorization dengan Next.js middleware untuk route protection yang konsisten. Use when mengatur proteksi /admin, /api private, redirect signin, dan akses public detail route."
argument-hint: "Jelaskan route mana yang private/public"
user-invocable: true
---

# Middleware Auth Patterns

Skill ini membantu menyelaraskan middleware dan route handler agar aturan akses konsisten.

## Trigger
- Ingin proteksi route berdasarkan role.
- Ingin kombinasi route private dan public sharing link.
- Redirect signin/callback URL belum konsisten.

## Langkah
1. Definisikan matrix akses: public, authenticated, role-based.
2. Terapkan matcher minimal agar middleware tidak overreach.
3. Untuk API, gunakan status code yang tepat (`401/403`) + pesan aman.
4. Sinkronkan rule middleware dengan validasi auth di handler sensitif.

## Checklist
- Route admin tidak bocor ke user tidak berhak.
- Shared link yang public tetap bisa diakses sesuai desain.
- Matcher tidak menambah latency pada route yang tidak perlu.
