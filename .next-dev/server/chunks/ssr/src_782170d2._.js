module.exports = [
"[project]/src/lib/indexedDB.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * IndexedDB utility for storing photos locally in browser
 * Photos persist across page refreshes
 */ __turbopack_context__.s([
    "clearPhotosFromIndexedDB",
    ()=>clearPhotosFromIndexedDB,
    "isIndexedDBSupported",
    ()=>isIndexedDBSupported,
    "loadPhotosFromIndexedDB",
    ()=>loadPhotosFromIndexedDB,
    "savePhotosToIndexedDB",
    ()=>savePhotosToIndexedDB
]);
const DB_NAME = 'PhotoboothDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';
// Initialize IndexedDB
const initDB = ()=>{
    return new Promise((resolve, reject)=>{
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = ()=>{
            console.error('❌ IndexedDB error:', request.error);
            reject(request.error);
        };
        request.onsuccess = ()=>{
            resolve(request.result);
        };
        request.onupgradeneeded = (event)=>{
            const db = event.target.result;
            // Create object store if it doesn't exist
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                objectStore.createIndex('timestamp', 'timestamp', {
                    unique: false
                });
                console.log('✅ IndexedDB object store created');
            }
        };
    });
};
const savePhotosToIndexedDB = async (photos)=>{
    try {
        const db = await initDB();
        const transaction = db.transaction([
            STORE_NAME
        ], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        // Clear existing photos first
        store.clear();
        // Add new photos
        photos.forEach((photoData, index)=>{
            store.add({
                photoData,
                timestamp: Date.now(),
                index
            });
        });
        return new Promise((resolve, reject)=>{
            transaction.oncomplete = ()=>{
                console.log('✅ Photos saved to IndexedDB:', photos.length);
                resolve();
            };
            transaction.onerror = ()=>{
                console.error('❌ Failed to save photos to IndexedDB');
                reject(transaction.error);
            };
        });
    } catch (error) {
        console.error('❌ IndexedDB save error:', error);
        throw error;
    }
};
const loadPhotosFromIndexedDB = async ()=>{
    try {
        const db = await initDB();
        const transaction = db.transaction([
            STORE_NAME
        ], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        return new Promise((resolve, reject)=>{
            request.onsuccess = ()=>{
                const records = request.result || [];
                // Sort by index to maintain order
                records.sort((a, b)=>a.index - b.index);
                const photos = records.map((record)=>record.photoData);
                console.log('✅ Photos loaded from IndexedDB:', photos.length);
                resolve(photos);
            };
            request.onerror = ()=>{
                console.error('❌ Failed to load photos from IndexedDB');
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('❌ IndexedDB load error:', error);
        return []; // Return empty array on error
    }
};
const clearPhotosFromIndexedDB = async ()=>{
    try {
        const db = await initDB();
        const transaction = db.transaction([
            STORE_NAME
        ], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.clear();
        return new Promise((resolve, reject)=>{
            transaction.oncomplete = ()=>{
                console.log('✅ Photos cleared from IndexedDB');
                resolve();
            };
            transaction.onerror = ()=>{
                console.error('❌ Failed to clear photos from IndexedDB');
                reject(transaction.error);
            };
        });
    } catch (error) {
        console.error('❌ IndexedDB clear error:', error);
        throw error;
    }
};
const isIndexedDBSupported = ()=>{
    return typeof indexedDB !== 'undefined';
};
}),
"[project]/src/lib/tempPhotoStorage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearTempLiveVideoUrlFromSessionStorage",
    ()=>clearTempLiveVideoUrlFromSessionStorage,
    "clearTempPhotosFromSessionStorage",
    ()=>clearTempPhotosFromSessionStorage,
    "loadTempLiveVideoUrlFromSessionStorage",
    ()=>loadTempLiveVideoUrlFromSessionStorage,
    "loadTempPhotosFromSessionStorage",
    ()=>loadTempPhotosFromSessionStorage,
    "saveTempLiveVideoUrlToSessionStorage",
    ()=>saveTempLiveVideoUrlToSessionStorage,
    "saveTempPhotosToSessionStorage",
    ()=>saveTempPhotosToSessionStorage
]);
const TEMP_PHOTOS_KEY = 'photobooth-photos-temp';
const TEMP_LIVE_VIDEO_URL_KEY = 'photobooth-live-video-url-temp';
// Keep fallback payload small to avoid browser sessionStorage quota issues.
const MAX_SESSION_PHOTO_PAYLOAD_BYTES = 1_800_000;
const loadTempPhotosFromSessionStorage = ()=>{
    try {
        const raw = sessionStorage.getItem(TEMP_PHOTOS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch  {
        return [];
    }
};
const saveTempPhotosToSessionStorage = (photos)=>{
    try {
        const serialized = JSON.stringify(photos);
        if (serialized.length > MAX_SESSION_PHOTO_PAYLOAD_BYTES) {
            sessionStorage.removeItem(TEMP_PHOTOS_KEY);
            return false;
        }
        sessionStorage.setItem(TEMP_PHOTOS_KEY, serialized);
        return true;
    } catch  {
        // QuotaExceededError or unavailable session storage should not break flow.
        try {
            sessionStorage.removeItem(TEMP_PHOTOS_KEY);
        } catch  {
        // Ignore remove errors.
        }
        return false;
    }
};
const clearTempPhotosFromSessionStorage = ()=>{
    try {
        sessionStorage.removeItem(TEMP_PHOTOS_KEY);
    } catch  {
    // Ignore remove errors.
    }
};
const loadTempLiveVideoUrlFromSessionStorage = ()=>{
    try {
        const raw = sessionStorage.getItem(TEMP_LIVE_VIDEO_URL_KEY);
        if (!raw || typeof raw !== 'string') return null;
        return raw;
    } catch  {
        return null;
    }
};
const saveTempLiveVideoUrlToSessionStorage = (url)=>{
    try {
        if (!url || typeof url !== 'string') {
            sessionStorage.removeItem(TEMP_LIVE_VIDEO_URL_KEY);
            return false;
        }
        sessionStorage.setItem(TEMP_LIVE_VIDEO_URL_KEY, url);
        return true;
    } catch  {
        try {
            sessionStorage.removeItem(TEMP_LIVE_VIDEO_URL_KEY);
        } catch  {
        // Ignore remove errors.
        }
        return false;
    }
};
const clearTempLiveVideoUrlFromSessionStorage = ()=>{
    try {
        sessionStorage.removeItem(TEMP_LIVE_VIDEO_URL_KEY);
    } catch  {
    // Ignore remove errors.
    }
};
}),
"[project]/src/app/photo/gallery/[id]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GalleryDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qrcode$2e$react$2f$lib$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/qrcode.react/lib/esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-ssr] (ecmascript) <export default as ImageIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-ssr] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$qr$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__QrCode$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/qr-code.js [app-ssr] (ecmascript) <export default as QrCode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-ssr] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/indexedDB.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tempPhotoStorage.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
const normalizeVideoSource = (value)=>{
    if (!value || typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('data:video/')) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith('/')) return trimmed;
    return null;
};
const isGifSource = (value)=>{
    if (!value || typeof value !== 'string') return false;
    if (value.startsWith('data:image/gif')) return true;
    return /\.gif(\?|#|$)/i.test(value);
};
function GalleryDetailPage() {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const id = typeof params?.id === 'string' ? params.id : '';
    const { status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    const [item, setItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [origin, setOrigin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [mediaIndex, setMediaIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showQrPopup, setShowQrPopup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDownloadingAll, setIsDownloadingAll] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [generatedGifDataUrl, setGeneratedGifDataUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [, setIsGeneratingGif] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isPreparingEditor, setIsPreparingEditor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const mediaTouchStartXRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const normalizeEditorImageSource = (value)=>{
        if (typeof value !== 'string') return null;
        const trimmed = value.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith('data:image/')) return trimmed;
        if (trimmed.startsWith('/api/image-proxy?url=')) return trimmed;
        if (trimmed.startsWith('/')) return trimmed;
        if (trimmed.startsWith('blob:')) return trimmed;
        if (/^https?:\/\//i.test(trimmed)) {
            return `/api/image-proxy?url=${encodeURIComponent(trimmed)}`;
        }
        return null;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchItem = async ()=>{
            if (!id) {
                setError('Invalid gallery ID.');
                setIsLoading(false);
                return;
            }
            try {
                const res = await fetch(`/api/gallery/${id}`, {
                    cache: 'no-store'
                });
                if (res.status === 404) {
                    setError('Gallery item not found.');
                    setIsLoading(false);
                    return;
                }
                if (!res.ok) {
                    setError('Failed to load gallery details.');
                    setIsLoading(false);
                    return;
                }
                const data = await res.json();
                setItem(data?.item ?? null);
            } catch  {
                setError('An error occurred while loading gallery details.');
            } finally{
                setIsLoading(false);
            }
        };
        fetchItem();
    }, [
        id
    ]);
    const detailLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!origin || !id) return '/photo/gallery';
        return `${origin}/photo/gallery/${id}`;
    }, [
        origin,
        id
    ]);
    const imagePreview = item?.stripDataUrl ?? item?.previewDataUrl ?? item?.imageUrl ?? '';
    const capturePhotos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!item) return [];
        if (item.photoFrames.length > 0) return item.photoFrames;
        if (item.livePhotos.length > 0) return item.livePhotos;
        return imagePreview ? [
            imagePreview
        ] : [];
    }, [
        item,
        imagePreview
    ]);
    const rawLiveCandidate = item?.liveVideoDataUrl;
    const rawGifCandidate = item?.gifDataUrl ?? generatedGifDataUrl;
    const liveVideoSrc = normalizeVideoSource(rawLiveCandidate);
    const gifSrc = isGifSource(rawGifCandidate) ? rawGifCandidate : !liveVideoSrc && isGifSource(rawLiveCandidate) ? rawLiveCandidate : null;
    const mediaSlides = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const slides = [];
        const stripSrc = item?.stripDataUrl ?? imagePreview ?? item?.imageUrl ?? '';
        if (stripSrc) {
            slides.push({
                key: 'strip',
                type: 'image',
                label: 'Strip',
                src: stripSrc,
                downloadName: `strip-${id}.png`,
                downloadLabel: 'Download Strip'
            });
        }
        if (liveVideoSrc) {
            const liveExt = /\.mp4(\?|#|$)/i.test(liveVideoSrc) ? 'mp4' : /\.(mov|m4v)(\?|#|$)/i.test(liveVideoSrc) ? 'mov' : 'webm';
            slides.push({
                key: 'live-video',
                type: 'video',
                label: 'Live Video',
                src: liveVideoSrc,
                downloadName: `live-${id}.${liveExt}`,
                downloadLabel: 'Download Live'
            });
        }
        if (gifSrc) {
            slides.push({
                key: 'gif',
                type: 'image',
                label: 'GIF',
                src: gifSrc,
                downloadName: `gif-${id}.gif`,
                downloadLabel: 'Download GIF'
            });
        }
        capturePhotos.forEach((src, idx)=>{
            slides.push({
                key: `capture-${idx}`,
                type: 'image',
                label: `Captured Photo ${idx + 1}`,
                src,
                downloadName: `capture-${id}-${idx + 1}.png`,
                downloadLabel: 'Download Photo'
            });
        });
        return slides;
    }, [
        capturePhotos,
        gifSrc,
        id,
        imagePreview,
        item?.imageUrl,
        item?.stripDataUrl,
        liveVideoSrc
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMediaIndex(0);
    }, [
        mediaSlides.length
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setGeneratedGifDataUrl(null);
        setMediaIndex(0);
    }, [
        item?.id
    ]);
    const createGifFromFrames = async (frames)=>{
        if (frames.length === 0) return null;
        try {
            const GIF = (await __turbopack_context__.A("[project]/node_modules/gif.js/index.js [app-ssr] (ecmascript, async loader)")).default;
            const firstImg = new window.Image();
            firstImg.src = frames[0];
            await new Promise((resolve)=>{
                firstImg.onload = resolve;
            });
            const width = firstImg.naturalWidth || 640;
            const height = firstImg.naturalHeight || 480;
            const gif = new GIF({
                workers: 2,
                quality: 10,
                width,
                height,
                workerScript: '/gif.worker.js'
            });
            const sequence = frames.length > 1 ? [
                ...frames,
                ...frames.slice().reverse()
            ] : [
                ...frames
            ];
            for (const src of sequence){
                const image = new window.Image();
                image.src = src;
                await new Promise((resolve)=>{
                    image.onload = resolve;
                });
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) continue;
                ctx.drawImage(image, 0, 0, width, height);
                gif.addFrame(canvas, {
                    delay: 700
                });
            }
            const blob = await new Promise((resolve)=>{
                gif.on('finished', function(generatedBlob) {
                    resolve(generatedBlob);
                });
                gif.render();
            });
            const dataUrl = await new Promise((resolve, reject)=>{
                const reader = new FileReader();
                reader.onload = ()=>resolve(reader.result);
                reader.onerror = ()=>reject(reader.error);
                reader.readAsDataURL(blob);
            });
            return dataUrl;
        } catch  {
            return null;
        }
    };
    const handleDownload = async (url, filename)=>{
        if (!url) return;
        try {
            if (url.startsWith('data:')) {
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                link.remove();
                return;
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error('Fetch failed');
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(objectUrl);
        } catch  {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let isMounted = true;
        const ensureGif = async ()=>{
            if (!item || item.gifDataUrl || capturePhotos.length === 0 || generatedGifDataUrl) return;
            setIsGeneratingGif(true);
            const generated = await createGifFromFrames(capturePhotos);
            if (isMounted) {
                setGeneratedGifDataUrl(generated);
                setIsGeneratingGif(false);
            }
        };
        ensureGif();
        return ()=>{
            isMounted = false;
        };
    }, [
        capturePhotos,
        generatedGifDataUrl,
        item
    ]);
    const copyLink = async ()=>{
        try {
            await navigator.clipboard.writeText(detailLink);
            alert('Detail link copied successfully');
        } catch  {
            alert('Failed to copy detail link');
        }
    };
    const handleShare = async ()=>{
        try {
            if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
                await navigator.share({
                    title: 'Gallery Detail',
                    text: `View photobooth result ID ${item?.id ?? ''}`,
                    url: detailLink
                });
                return;
            }
            await copyLink();
        } catch  {
        // Ignore aborted share
        }
    };
    const handleEditInEditor = async ()=>{
        if (!item) return;
        setIsPreparingEditor(true);
        try {
            const sourcePhotos = [
                ...Array.isArray(item.photoFrames) ? item.photoFrames : []
            ];
            if (sourcePhotos.length === 0 && Array.isArray(item.livePhotos)) {
                sourcePhotos.push(...item.livePhotos);
            }
            if (sourcePhotos.length === 0) {
                if (item.stripDataUrl) sourcePhotos.push(item.stripDataUrl);
                else if (item.previewDataUrl) sourcePhotos.push(item.previewDataUrl);
                else if (item.imageUrl) sourcePhotos.push(item.imageUrl);
            }
            const normalizedPhotos = sourcePhotos.map(normalizeEditorImageSource).filter((v)=>Boolean(v));
            if (normalizedPhotos.length === 0) {
                alert('Photos for this item are not available in the editor.');
                return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveTempPhotosToSessionStorage"])(normalizedPhotos);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIndexedDBSupported"])()) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["savePhotosToIndexedDB"])(normalizedPhotos);
            }
            if (item.liveVideoDataUrl && typeof item.liveVideoDataUrl === 'string') {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveTempLiveVideoUrlToSessionStorage"])(item.liveVideoDataUrl);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearTempLiveVideoUrlFromSessionStorage"])();
            }
            const nextLayout = Number.isFinite(Number(item.layout)) ? Number(item.layout) : Math.max(1, normalizedPhotos.length);
            router.push(`/photo/edit?layout=${nextLayout}&source=gallery&id=${item.id}`);
        } catch  {
            alert('An error occurred while preparing the editor.');
        } finally{
            setIsPreparingEditor(false);
        }
    };
    const handlePrintCurrent = ()=>{
        const currentSlide = mediaSlides[mediaIndex];
        const fallbackImageSlide = mediaSlides.find((slide)=>slide.type === 'image');
        const imageSlide = currentSlide?.type === 'image' ? currentSlide : fallbackImageSlide;
        if (!imageSlide) {
            alert('No image media available for printing.');
            return;
        }
        const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=1100,height=900');
        if (!printWindow) {
            alert('Popup blocked. Please allow popups for print feature.');
            return;
        }
        printWindow.document.write(`
      <html>
        <head>
          <title>Print Gallery Media</title>
          <style>
            @page { margin: 12mm; }
            body {
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: #fff;
            }
            img {
              width: 100%;
              max-width: 950px;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${imageSlide.src}" alt="${imageSlide.label}" />
          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
        printWindow.document.close();
    };
    const handleDownloadAll = async ()=>{
        if (mediaSlides.length === 0 || isDownloadingAll) return;
        setIsDownloadingAll(true);
        try {
            for (const slide of mediaSlides){
                await handleDownload(slide.src, slide.downloadName);
                await new Promise((resolve)=>setTimeout(resolve, 180));
            }
        } finally{
            setIsDownloadingAll(false);
        }
    };
    const onMediaSwipeStart = (event)=>{
        mediaTouchStartXRef.current = event.touches[0]?.clientX ?? null;
    };
    const onMediaSwipeEnd = (event)=>{
        if (mediaTouchStartXRef.current === null) return;
        const endX = event.changedTouches[0]?.clientX ?? mediaTouchStartXRef.current;
        const delta = endX - mediaTouchStartXRef.current;
        mediaTouchStartXRef.current = null;
        if (Math.abs(delta) < 35) return;
        if (delta < 0) {
            setMediaIndex((prev)=>Math.min(prev + 1, Math.max(mediaSlides.length - 1, 0)));
        } else {
            setMediaIndex((prev)=>Math.max(prev - 1, 0));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "pb-page-bg min-h-screen py-8 px-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-5xl mx-auto",
            children: [
                status === 'authenticated' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/photo/gallery",
                        className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                lineNumber: 511,
                                columnNumber: 15
                            }, this),
                            "Back to Gallery"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                        lineNumber: 507,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                    lineNumber: 506,
                    columnNumber: 11
                }, this) : null,
                isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl border border-pink-100 shadow-md p-10 text-center text-gray-500 font-medium",
                    children: "Loading gallery details..."
                }, void 0, false, {
                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                    lineNumber: 518,
                    columnNumber: 11
                }, this) : error || !item ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl border border-pink-100 shadow-md p-10 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__["ImageIcon"], {
                            className: "w-10 h-10 text-pink-300 mx-auto mb-3"
                        }, void 0, false, {
                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                            lineNumber: 523,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-700 font-medium",
                            children: error ?? 'Gallery item not found.'
                        }, void 0, false, {
                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                            lineNumber: 524,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500 mt-1",
                            children: "Please make sure the opened link is correct."
                        }, void 0, false, {
                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                            lineNumber: 525,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                    lineNumber: 522,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-5",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-2xl border border-pink-100 shadow-md overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-pink-50 p-4 flex items-center justify-center",
                                    children: mediaSlides.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-500",
                                        children: "Media is not available for this item yet."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                        lineNumber: 533,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3 w-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                onTouchStart: onMediaSwipeStart,
                                                onTouchEnd: onMediaSwipeEnd,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "overflow-hidden rounded-xl border border-pink-100 bg-white",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex transition-transform duration-300 ease-out",
                                                            style: {
                                                                transform: `translateX(-${mediaIndex * 100}%)`
                                                            },
                                                            children: mediaSlides.map((slide)=>{
                                                                const isStripSlide = slide.key === 'strip';
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-full shrink-0 p-3",
                                                                    children: slide.type === 'video' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-full h-[62vh] max-h-[70vh] rounded-xl border border-pink-100 bg-black flex items-center justify-center overflow-hidden",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                                            src: slide.src,
                                                                            controls: true,
                                                                            autoPlay: true,
                                                                            loop: true,
                                                                            muted: true,
                                                                            playsInline: true,
                                                                            className: "max-w-full max-h-full object-contain object-center rounded-xl bg-black"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                            lineNumber: 553,
                                                                            columnNumber: 39
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                        lineNumber: 552,
                                                                        columnNumber: 37
                                                                    }, this) : isStripSlide ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-full h-[62vh] max-h-[70vh] rounded-xl border border-pink-100 bg-white flex items-center justify-center overflow-hidden",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                            src: slide.src,
                                                                            alt: slide.label,
                                                                            className: "max-w-full max-h-full object-contain object-center"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                            lineNumber: 566,
                                                                            columnNumber: 39
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                        lineNumber: 564,
                                                                        columnNumber: 37
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-full h-[62vh] max-h-[70vh] rounded-xl border border-pink-100 bg-white flex items-center justify-center overflow-hidden",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                            src: slide.src,
                                                                            alt: slide.label,
                                                                            className: "max-w-full max-h-full object-contain object-center"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                            lineNumber: 575,
                                                                            columnNumber: 39
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                        lineNumber: 573,
                                                                        columnNumber: 37
                                                                    }, this)
                                                                }, slide.key, false, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 550,
                                                                    columnNumber: 33
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                            lineNumber: 542,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                        lineNumber: 541,
                                                        columnNumber: 25
                                                    }, this),
                                                    mediaSlides.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setMediaIndex((prev)=>Math.max(prev - 1, 0)),
                                                                className: "absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#d72688]/80 text-white flex items-center justify-center hover:bg-[#d72688] transition",
                                                                "aria-label": "Previous media",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                                    className: "w-5 h-5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 596,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                lineNumber: 590,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setMediaIndex((prev)=>Math.min(prev + 1, mediaSlides.length - 1)),
                                                                className: "absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#d72688]/80 text-white flex items-center justify-center hover:bg-[#d72688] transition",
                                                                "aria-label": "Next media",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                    className: "w-5 h-5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 604,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                lineNumber: 598,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                lineNumber: 536,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-[#d72688] font-medium",
                                                        children: [
                                                            mediaSlides[mediaIndex]?.label ?? 'Media',
                                                            " (",
                                                            mediaIndex + 1,
                                                            "/",
                                                            mediaSlides.length,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                        lineNumber: 611,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleDownload(mediaSlides[mediaIndex]?.src, mediaSlides[mediaIndex]?.downloadName ?? `media-${item.id}`),
                                                        className: "gallery-detail-action-btn inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                lineNumber: 618,
                                                                columnNumber: 27
                                                            }, this),
                                                            mediaSlides[mediaIndex]?.downloadLabel ?? 'Download'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                        lineNumber: 614,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                lineNumber: 610,
                                                columnNumber: 23
                                            }, this),
                                            mediaSlides.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-center gap-1.5 flex-wrap",
                                                children: mediaSlides.map((slide, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setMediaIndex(idx),
                                                        "aria-label": `View ${slide.label}`,
                                                        className: `h-2.5 rounded-full transition-all ${idx === mediaIndex ? 'w-6 bg-[#d72688]' : 'w-2.5 bg-pink-200 hover:bg-pink-300'}`
                                                    }, `media-dot-${slide.key}`, false, {
                                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                        lineNumber: 626,
                                                        columnNumber: 29
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                lineNumber: 624,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                        lineNumber: 535,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                    lineNumber: 531,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-xl border border-[#f3b7d1] bg-[#fff8fc] p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                    className: "text-2xl font-bold text-[#d72688]",
                                                    children: "Gallery Detail"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                    lineNumber: 642,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 mt-1 break-all",
                                                    children: [
                                                        "ID: ",
                                                        item.id
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                    lineNumber: 643,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-4 space-y-2 text-sm text-gray-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-between gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-semibold text-[#d72688]",
                                                                    children: "Date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 647,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-right",
                                                                    children: new Date(item.createdAt).toLocaleString('id-ID')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 648,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                            lineNumber: 646,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-between gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-semibold text-[#d72688]",
                                                                    children: "Layout"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 651,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-right",
                                                                    children: item.layout
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 652,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                            lineNumber: 650,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-between gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-semibold text-[#d72688]",
                                                                    children: "Filter"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 655,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-right",
                                                                    children: item.filter
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 656,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                            lineNumber: 654,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-between gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "font-semibold text-[#d72688]",
                                                                    children: "Photo Count"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 659,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-right",
                                                                    children: capturePhotos.length
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 660,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                            lineNumber: 658,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                    lineNumber: 645,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                            lineNumber: 641,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "gallery-detail-actions mt-4 space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: copyLink,
                                                            className: "gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#f8bfd7] text-[#d72688] bg-[#fff7fb] hover:bg-[#ffe4ef] transition",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 671,
                                                                    columnNumber: 25
                                                                }, this),
                                                                "Copy Link"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                            lineNumber: 667,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: item.imageUrl,
                                                            target: "_blank",
                                                            rel: "noreferrer",
                                                            className: "gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#fa75aa] hover:bg-[#d72688] text-white transition",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 681,
                                                                    columnNumber: 25
                                                                }, this),
                                                                "Open Strip URL"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                            lineNumber: 675,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                    lineNumber: 666,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl border border-[#f3b7d1] bg-white p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] uppercase tracking-wide font-semibold text-[#a13d70]",
                                                            children: "Download Media"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                            lineNumber: 687,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2 grid grid-cols-2 gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleDownload(item.stripDataUrl ?? imagePreview ?? item.imageUrl, `strip-${item.id}.png`),
                                                                    className: "gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                            lineNumber: 693,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        "Download Strip"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 689,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleDownload(gifSrc, `gif-${item.id}.gif`),
                                                                    className: "gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition disabled:opacity-50 disabled:cursor-not-allowed",
                                                                    disabled: !gifSrc,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                            lineNumber: 702,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        "Download GIF"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 697,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleDownload(liveVideoSrc, `live-${item.id}.webm`),
                                                                    className: "gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition disabled:opacity-50 disabled:cursor-not-allowed",
                                                                    disabled: !liveVideoSrc,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                            lineNumber: 711,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        "Download Live"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 706,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: handleDownloadAll,
                                                                    disabled: isDownloadingAll || mediaSlides.length === 0,
                                                                    className: "gallery-detail-action-btn col-span-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#fa75aa] bg-[#fff7fb] text-[#d72688] hover:bg-[#ffeaf3] transition disabled:opacity-50 disabled:cursor-not-allowed",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                            lineNumber: 720,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        isDownloadingAll ? 'Downloading...' : 'Download All'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 715,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                            lineNumber: 688,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                    lineNumber: 686,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl border border-[#f3b7d1] bg-white p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] uppercase tracking-wide font-semibold text-[#a13d70]",
                                                            children: "Quick Actions"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                            lineNumber: 727,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: handleEditInEditor,
                                                                    disabled: isPreparingEditor,
                                                                    className: "gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-2 py-2 rounded-lg border border-[#f8bfd7] bg-white text-[#d72688] hover:bg-[#fff7fb] transition disabled:opacity-50 disabled:cursor-not-allowed",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__["ImageIcon"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                            lineNumber: 734,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        isPreparingEditor ? 'Preparing...' : 'Edit in Editor'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 729,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setShowQrPopup(true),
                                                                    className: "gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-2 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$qr$2d$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__QrCode$3e$__["QrCode"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                            lineNumber: 742,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        "QR Code"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 738,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: handlePrintCurrent,
                                                                    className: "gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-2 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                            lineNumber: 750,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        "Print"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 746,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: handleShare,
                                                                    className: "gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-2 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                            lineNumber: 758,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        "Share"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                                    lineNumber: 754,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                            lineNumber: 728,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                    lineNumber: 726,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                            lineNumber: 665,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                    lineNumber: 640,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                            lineNumber: 530,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                        lineNumber: 529,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                    lineNumber: 528,
                    columnNumber: 11
                }, this),
                showQrPopup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 bg-[#fa75aa]/25 backdrop-blur-[2px] flex items-center justify-center p-4",
                    onClick: ()=>setShowQrPopup(false),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-md rounded-2xl border border-[#f3b7d1] bg-white p-6 shadow-[0_20px_45px_rgba(250,117,170,0.22)]",
                        onClick: (event)=>event.stopPropagation(),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-bold text-[#d72688]",
                                        children: "QR Link Detail"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                        lineNumber: 780,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setShowQrPopup(false),
                                        className: "px-2 py-1 text-sm text-[#d72688] hover:bg-pink-50 rounded-md",
                                        children: "Tutup"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                        lineNumber: 781,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                lineNumber: 779,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-[#f3b7d1] bg-[#fff7fb] p-4 flex flex-col items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qrcode$2e$react$2f$lib$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QRCodeCanvas"], {
                                        value: detailLink,
                                        size: 220,
                                        includeMargin: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                        lineNumber: 790,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-600 break-all text-center",
                                        children: detailLink
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                        lineNumber: 791,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: copyLink,
                                        className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                                lineNumber: 796,
                                                columnNumber: 19
                                            }, this),
                                            "Copy Link"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                        lineNumber: 792,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                                lineNumber: 789,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                        lineNumber: 775,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
                    lineNumber: 771,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
            lineNumber: 504,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/photo/gallery/[id]/page.tsx",
        lineNumber: 503,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_782170d2._.js.map