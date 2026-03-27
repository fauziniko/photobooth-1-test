(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__8978dbac._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$jwt$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/jwt.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$jwt$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/core/jwt.js [middleware-edge] (ecmascript)");
;
;
const AUTH_SECRET = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? process.env.AUTHJS_SECRET;
const readAuthToken = async (request)=>{
    const tokenOptions = {
        req: request
    };
    if (AUTH_SECRET) {
        tokenOptions.secret = AUTH_SECRET;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$jwt$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getToken"])(tokenOptions);
};
const withNoStore = (response)=>{
    response.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('x-middleware-cache', 'no-cache');
    response.headers.set('Vary', 'Cookie, Next-Router-Prefetch, Purpose, Sec-Purpose, RSC');
    return response;
};
const isPrefetchLikeRequest = (request)=>{
    const purpose = request.headers.get('purpose');
    const secPurpose = request.headers.get('sec-purpose');
    const nextPrefetch = request.headers.get('next-router-prefetch');
    const isRsc = request.nextUrl.searchParams.has('_rsc') || request.headers.has('rsc');
    return purpose === 'prefetch' || secPurpose === 'prefetch' || nextPrefetch === '1' || isRsc;
};
const PUBLIC_PAGE_PATHS = new Set([
    '/photo',
    '/photo/gallery',
    '/photo/uploaded',
    '/admin/frame-template',
    '/admin/frame-template/list',
    '/admin/sticker/new',
    '/admin/sticker/list'
]);
const isPublicPagePath = (pathname)=>PUBLIC_PAGE_PATHS.has(pathname);
const isProtectedPhotoPage = (pathname)=>{
    if (isPublicPagePath(pathname)) {
        return false;
    }
    return pathname.startsWith('/photo') || pathname.startsWith('/photo-result');
};
async function middleware(request) {
    const token = await readAuthToken(request);
    const tokenRole = token && typeof token === 'object' && 'role' in token ? token.role : undefined;
    const { pathname } = request.nextUrl;
    const isPrefetch = isPrefetchLikeRequest(request);
    // Protect all PhotoBooth pages.
    if (isProtectedPhotoPage(pathname)) {
        if (isPrefetch) {
            return withNoStore(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"](null, {
                status: 204
            }));
        }
        if (!token) {
            const url = new URL('/auth/signin', request.url);
            url.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`);
            return withNoStore(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url));
        }
    }
    // Protect /admin route - requires ADMIN role (registered users)
    if (pathname.startsWith('/admin') && !isPublicPagePath(pathname)) {
        if (isPrefetch) {
            return withNoStore(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"](null, {
                status: 204
            }));
        }
        if (!token) {
            const url = new URL('/auth/signin', request.url);
            url.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`);
            return withNoStore(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url));
        }
        // Only registered users (USER or ADMIN role) can access admin
        // This means only logged-in users can upload
        if (tokenRole !== 'ADMIN' && tokenRole !== 'USER') {
            return withNoStore(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/', request.url)));
        }
    }
    // Protect upload APIs - requires authentication (any registered user)
    if (pathname.startsWith('/api/upload-frame-template') || pathname.startsWith('/api/upload-sticker') || pathname.startsWith('/api/upload-frame-sticker')) {
        if (!token) {
            return withNoStore(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized. Please login to upload.'
            }, {
                status: 403
            }));
        }
    // Any registered user can upload, not just ADMIN
    }
    // Gallery APIs: allow public GET for /api/gallery/:id shared links.
    if (pathname.startsWith('/api/gallery')) {
        const isDetailApiPath = /^\/api\/gallery\/[^/]+$/.test(pathname);
        const isPublicDetailRead = isDetailApiPath && request.method === 'GET';
        if (!token && !isPublicDetailRead) {
            return withNoStore(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized. Please login first.'
            }, {
                status: 403
            }));
        }
    }
    return withNoStore(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next());
}
const config = {
    matcher: [
        '/photo/:path*',
        '/photo-result/:path*',
        '/admin/:path*',
        '/api/gallery/:path*',
        '/api/upload-frame-template/:path*',
        '/api/upload-sticker/:path*',
        '/api/upload-frame-sticker/:path*'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__8978dbac._.js.map