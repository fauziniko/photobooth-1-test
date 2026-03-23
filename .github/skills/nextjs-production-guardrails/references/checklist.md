# Next.js Production Checklist

## Rendering and Routing
- Verifikasi page mana yang harus static vs dynamic.
- Hindari akses request-bound API di root layout jika tidak wajib.
- Gunakan redirect/navigation sesuai tipe komponen (server/client).

## Search Params and Suspense
- Jika komponen client memakai useSearchParams, bungkus subtree dengan Suspense.
- Sediakan fallback yang jelas untuk UX selama hydration.

## Auth and Session
- Jangan memaksa semua route dynamic hanya untuk preload session global.
- Letakkan auth check sedekat mungkin dengan route yang butuh proteksi.

## API Routes
- Validasi provider/input/query params.
- Batasi limit, panjang query, dan shape payload.
- Tambahkan timeout untuk request upstream.
- Gunakan fallback bila upstream gagal.
- Kembalikan pesan error aman di production.

## Verification
- Jalankan lint.
- Jalankan build production.
- Pastikan tidak ada prerender error dan type error.
