(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/admin/frame-template/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FrameTemplatePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const CANVAS_PADDING = 20;
const CANVAS_GAP = 10;
const PHOTO_RATIO = 4 / 3;
const SLOT_COUNT_OPTIONS = [
    3,
    4,
    6,
    8
];
const FORMAT_PRESETS = {
    '1:3': {
        ratio: 1 / 3,
        areaScale: 1,
        label: '1:3 (Portrait Strip)'
    },
    '2:3': {
        ratio: 2 / 3,
        areaScale: 1,
        label: '2:3 (Portrait)'
    },
    A4: {
        ratio: 210 / 297,
        areaScale: 1.1,
        label: 'A4 (210x297)'
    },
    A3: {
        ratio: 297 / 420,
        areaScale: 1.5,
        label: 'A3 (297x420)'
    }
};
const BASE_SLOT_AREA = 100000;
const getCanvasSize = (slotCount, format)=>{
    const preset = FORMAT_PRESETS[format];
    const area = slotCount * BASE_SLOT_AREA * preset.areaScale;
    const width = Math.round(Math.sqrt(area * preset.ratio));
    const height = Math.round(width / preset.ratio);
    return {
        width,
        height
    };
};
const computeSlotLayout = (slotCount, canvasWidth, canvasHeight)=>{
    const availableWidth = Math.max(canvasWidth - CANVAS_PADDING * 2, 80);
    const availableHeight = Math.max(canvasHeight - CANVAS_PADDING * 2, 80);
    let best = null;
    for(let columns = 1; columns <= slotCount; columns += 1){
        const rows = Math.ceil(slotCount / columns);
        const widthByColumns = (availableWidth - CANVAS_GAP * (columns - 1)) / columns;
        const heightByRows = (availableHeight - CANVAS_GAP * (rows - 1)) / rows;
        if (widthByColumns <= 0 || heightByRows <= 0) continue;
        const photoWidth = Math.min(widthByColumns, heightByRows * PHOTO_RATIO);
        const photoHeight = photoWidth / PHOTO_RATIO;
        if (photoWidth <= 0 || photoHeight <= 0) continue;
        if (!best || photoWidth * photoHeight > best.photoWidth * best.photoHeight) {
            best = {
                columns,
                rows,
                photoWidth,
                photoHeight
            };
        }
    }
    if (!best) {
        return {
            columns: 1,
            rows: slotCount,
            photoWidth: 120,
            photoHeight: 90,
            slots: []
        };
    }
    const { columns, rows, photoWidth, photoHeight } = best;
    const slots = [];
    const totalGridHeight = rows * photoHeight + (rows - 1) * CANVAS_GAP;
    const startY = (canvasHeight - totalGridHeight) / 2;
    for(let row = 0; row < rows; row += 1){
        const firstIndex = row * columns;
        const remaining = slotCount - firstIndex;
        const itemsInRow = Math.min(columns, remaining);
        const rowWidth = itemsInRow * photoWidth + (itemsInRow - 1) * CANVAS_GAP;
        const startX = (canvasWidth - rowWidth) / 2;
        for(let col = 0; col < itemsInRow; col += 1){
            const x = startX + col * (photoWidth + CANVAS_GAP);
            const y = startY + row * (photoHeight + CANVAS_GAP);
            slots.push({
                x,
                y,
                width: photoWidth,
                height: photoHeight
            });
        }
    }
    return {
        columns,
        rows,
        photoWidth,
        photoHeight,
        slots
    };
};
const clamp = (value, min, max)=>Math.min(max, Math.max(min, value));
const normalizeExternalImageUrl = (raw)=>{
    const value = raw.trim();
    if (!value) return '';
    if (value.startsWith('data:') || value.startsWith('blob:') || value.startsWith('/api/')) {
        return value;
    }
    try {
        const parsed = new URL(value);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return "/api/image-proxy?url=".concat(encodeURIComponent(parsed.toString()));
        }
    } catch (e) {
        return '';
    }
    return '';
};
const extractImageUrlFromHtml = (html)=>{
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    var _match_;
    return (_match_ = match === null || match === void 0 ? void 0 : match[1]) !== null && _match_ !== void 0 ? _match_ : '';
};
const loadImage = (src)=>{
    return new Promise((resolve, reject)=>{
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = ()=>resolve(image);
        image.onerror = ()=>reject(new Error("Failed loading image: ".concat(src)));
        image.src = src;
    });
};
const drawCoverImage = (ctx, image, width, height)=>{
    const imageRatio = image.width / image.height;
    const canvasRatio = width / height;
    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;
    if (imageRatio > canvasRatio) {
        drawWidth = height * imageRatio;
        offsetX = (width - drawWidth) / 2;
    } else {
        drawHeight = width / imageRatio;
        offsetY = (height - drawHeight) / 2;
    }
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
};
const inferCanvasFormat = (width, height)=>{
    const ratio = width / Math.max(height, 1);
    let best = '1:3';
    let bestDiff = Number.POSITIVE_INFINITY;
    for (const key of Object.keys(FORMAT_PRESETS)){
        const diff = Math.abs(FORMAT_PRESETS[key].ratio - ratio);
        if (diff < bestDiff) {
            best = key;
            bestDiff = diff;
        }
    }
    return best;
};
function FrameTemplatePageContent() {
    var _searchParams_get;
    _s();
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const editTemplateQuery = ((_searchParams_get = searchParams.get('edit')) === null || _searchParams_get === void 0 ? void 0 : _searchParams_get.trim()) || '';
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loadingTemplate, setLoadingTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingTemplateName, setEditingTemplateName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [templateName, setTemplateName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [backgroundColor, setBackgroundColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('#ffffff');
    const [slotCount, setSlotCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(4);
    const [canvasFormat, setCanvasFormat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('1:3');
    const [canvasSizeOverride, setCanvasSizeOverride] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hasCustomSlots, setHasCustomSlots] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [backgroundImageFile, setBackgroundImageFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [backgroundImageUrl, setBackgroundImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [backgroundImageInputUrl, setBackgroundImageInputUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [existingTemplateStickerUrl, setExistingTemplateStickerUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [existingTemplateStickerOriginalUrl, setExistingTemplateStickerOriginalUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [existingStickerOffset, setExistingStickerOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const [existingStickerScale, setExistingStickerScale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [existingStickerRotate, setExistingStickerRotate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isExistingStickerSelected, setIsExistingStickerSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDraggingExistingSticker, setIsDraggingExistingSticker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [stickers, setStickers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingStickers, setLoadingStickers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [refreshingStickers, setRefreshingStickers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [canvasStickers, setCanvasStickers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedStickerId, setSelectedStickerId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [photoSlots, setPhotoSlots] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedSlotIndex, setSelectedSlotIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dragStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const existingStickerDragRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const existingStickerResizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const existingStickerRotateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const slotDragStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const resizeStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rotateStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FrameTemplatePageContent.useMemo[canvasSize]": ()=>{
            if (canvasSizeOverride) {
                return {
                    width: Math.max(1, Math.round(canvasSizeOverride.width)),
                    height: Math.max(1, Math.round(canvasSizeOverride.height))
                };
            }
            return getCanvasSize(slotCount, canvasFormat);
        }
    }["FrameTemplatePageContent.useMemo[canvasSize]"], [
        canvasSizeOverride,
        slotCount,
        canvasFormat
    ]);
    const layout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FrameTemplatePageContent.useMemo[layout]": ()=>computeSlotLayout(slotCount, canvasSize.width, canvasSize.height)
    }["FrameTemplatePageContent.useMemo[layout]"], [
        slotCount,
        canvasSize.width,
        canvasSize.height
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FrameTemplatePageContent.useEffect": ()=>{
            if (hasCustomSlots) return;
            setPhotoSlots(layout.slots.map({
                "FrameTemplatePageContent.useEffect": (slot)=>({
                        ...slot
                    })
            }["FrameTemplatePageContent.useEffect"]));
            setSelectedSlotIndex(null);
        }
    }["FrameTemplatePageContent.useEffect"], [
        layout.slots,
        hasCustomSlots
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FrameTemplatePageContent.useEffect": ()=>{
            if (!backgroundImageFile) {
                setBackgroundImageUrl(null);
                return;
            }
            const objectUrl = URL.createObjectURL(backgroundImageFile);
            setBackgroundImageUrl(objectUrl);
            return ({
                "FrameTemplatePageContent.useEffect": ()=>URL.revokeObjectURL(objectUrl)
            })["FrameTemplatePageContent.useEffect"];
        }
    }["FrameTemplatePageContent.useEffect"], [
        backgroundImageFile
    ]);
    const fetchStickers = async function() {
        let manual = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
        if (manual) {
            setRefreshingStickers(true);
        } else {
            setLoadingStickers(true);
        }
        try {
            const res = await fetch('/api/list-sticker', {
                cache: 'no-store'
            });
            const data = await res.json();
            const stickerItems = Array.isArray(data === null || data === void 0 ? void 0 : data.stickerItems) ? data.stickerItems : [];
            setStickers(stickerItems);
        } catch (e) {
            setMessage({
                type: 'error',
                text: 'Failed to load sticker list.'
            });
        } finally{
            setLoadingStickers(false);
            setRefreshingStickers(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FrameTemplatePageContent.useEffect": ()=>{
            fetchStickers();
        }
    }["FrameTemplatePageContent.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FrameTemplatePageContent.useEffect": ()=>{
            const loadTemplateForEdit = {
                "FrameTemplatePageContent.useEffect.loadTemplateForEdit": async ()=>{
                    if (!editTemplateQuery) {
                        setEditingTemplateName(null);
                        setExistingTemplateStickerUrl(null);
                        setExistingTemplateStickerOriginalUrl(null);
                        setExistingStickerOffset({
                            x: 0,
                            y: 0
                        });
                        setExistingStickerScale(1);
                        setExistingStickerRotate(0);
                        setIsExistingStickerSelected(false);
                        return;
                    }
                    setLoadingTemplate(true);
                    setMessage(null);
                    try {
                        const res = await fetch('/api/list-frame-template', {
                            cache: 'no-store'
                        });
                        const data = await res.json();
                        const templates = Array.isArray(data === null || data === void 0 ? void 0 : data.templates) ? data.templates : [];
                        const target = templates.find({
                            "FrameTemplatePageContent.useEffect.loadTemplateForEdit.target": (item)=>(item === null || item === void 0 ? void 0 : item.name) === editTemplateQuery
                        }["FrameTemplatePageContent.useEffect.loadTemplateForEdit.target"]);
                        if (!target) {
                            setMessage({
                                type: 'error',
                                text: "Template ".concat(editTemplateQuery, " was not found.")
                            });
                            setEditingTemplateName(null);
                            return;
                        }
                        setEditingTemplateName(target.name);
                        setTemplateName(target.name);
                        setExistingStickerOffset({
                            x: 0,
                            y: 0
                        });
                        setExistingStickerScale(1);
                        setExistingStickerRotate(0);
                        setIsExistingStickerSelected(false);
                        const targetStickerUrl = typeof (target === null || target === void 0 ? void 0 : target.stickerUrl) === 'string' ? target.stickerUrl : '';
                        const normalizedStickerUrl = normalizeExternalImageUrl(targetStickerUrl);
                        setExistingTemplateStickerOriginalUrl(targetStickerUrl || null);
                        setExistingTemplateStickerUrl(normalizedStickerUrl || targetStickerUrl || null);
                        if (target === null || target === void 0 ? void 0 : target.frameUrl) {
                            setBackgroundImageFile(null);
                            setBackgroundImageUrl(target.frameUrl);
                            setBackgroundImageInputUrl(target.frameUrl);
                        }
                        const settings = (target === null || target === void 0 ? void 0 : target.settings) && typeof target.settings === 'object' ? target.settings : null;
                        if (settings) {
                            const width = Number(settings.canvasWidth);
                            const height = Number(settings.canvasHeight);
                            const nextSlotCount = Number(settings.slotCount);
                            const rawSlots = Array.isArray(settings.photoSlots) ? settings.photoSlots : [];
                            if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
                                setCanvasSizeOverride({
                                    width,
                                    height
                                });
                                setCanvasFormat(inferCanvasFormat(width, height));
                            }
                            if (nextSlotCount === 3 || nextSlotCount === 4 || nextSlotCount === 6 || nextSlotCount === 8) {
                                setSlotCount(nextSlotCount);
                            }
                            if (rawSlots.length > 0) {
                                setPhotoSlots(rawSlots.map({
                                    "FrameTemplatePageContent.useEffect.loadTemplateForEdit": (slot)=>({
                                            x: Number(slot === null || slot === void 0 ? void 0 : slot.x) || 0,
                                            y: Number(slot === null || slot === void 0 ? void 0 : slot.y) || 0,
                                            width: Math.max(1, Number(slot === null || slot === void 0 ? void 0 : slot.width) || 1),
                                            height: Math.max(1, Number(slot === null || slot === void 0 ? void 0 : slot.height) || 1)
                                        })
                                }["FrameTemplatePageContent.useEffect.loadTemplateForEdit"]).slice(0, 12));
                                setHasCustomSlots(true);
                            }
                        }
                        setMessage({
                            type: 'success',
                            text: "Loaded template ".concat(target.name, " for editing.")
                        });
                    } catch (e) {
                        setMessage({
                            type: 'error',
                            text: 'Failed to load template for editing.'
                        });
                    } finally{
                        setLoadingTemplate(false);
                    }
                }
            }["FrameTemplatePageContent.useEffect.loadTemplateForEdit"];
            void loadTemplateForEdit();
        }
    }["FrameTemplatePageContent.useEffect"], [
        editTemplateQuery
    ]);
    const setBackgroundFromFile = (file)=>{
        if (!file.type.startsWith('image/')) {
            setMessage({
                type: 'error',
                text: 'Background file must be an image.'
            });
            return;
        }
        setBackgroundImageInputUrl('');
        setBackgroundImageFile(file);
        setMessage({
            type: 'success',
            text: 'Background updated from file.'
        });
    };
    const setBackgroundFromRawUrl = (rawUrl)=>{
        const normalized = normalizeExternalImageUrl(rawUrl);
        if (!normalized) {
            setMessage({
                type: 'error',
                text: 'Background image URL is invalid.'
            });
            return;
        }
        setBackgroundImageFile(null);
        setBackgroundImageUrl(normalized);
        setBackgroundImageInputUrl(rawUrl.trim());
        setMessage({
            type: 'success',
            text: 'Background updated from URL/paste.'
        });
    };
    const addStickerFromUrl = (rawUrl, x, y, label)=>{
        const normalized = normalizeExternalImageUrl(rawUrl);
        if (!normalized) {
            setMessage({
                type: 'error',
                text: 'Sticker URL is invalid.'
            });
            return false;
        }
        handleAddStickerToCanvas({
            name: label || 'Pasted Sticker',
            url: normalized
        }, x, y);
        return true;
    };
    const extractImagePayload = (dataTransfer)=>{
        const file = Array.from(dataTransfer.files).find((item)=>item.type.startsWith('image/'));
        if (file) {
            return {
                kind: 'file',
                file
            };
        }
        const html = dataTransfer.getData('text/html');
        const htmlImageUrl = html ? extractImageUrlFromHtml(html) : '';
        if (htmlImageUrl) {
            return {
                kind: 'url',
                url: htmlImageUrl
            };
        }
        const uriList = dataTransfer.getData('text/uri-list');
        if (uriList) {
            const first = uriList.split('\n').find((line)=>line && !line.startsWith('#')) || '';
            if (first) {
                return {
                    kind: 'url',
                    url: first
                };
            }
        }
        const plain = dataTransfer.getData('text/plain').trim();
        if (plain) {
            return {
                kind: 'url',
                url: plain
            };
        }
        return null;
    };
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[handlePointerMove]": (event)=>{
            const dragState = dragStateRef.current;
            const canvas = canvasRef.current;
            if (!dragState || !canvas) return;
            const bounds = canvas.getBoundingClientRect();
            const rawX = event.clientX - bounds.left - dragState.offsetX;
            const rawY = event.clientY - bounds.top - dragState.offsetY;
            setCanvasStickers({
                "FrameTemplatePageContent.useCallback[handlePointerMove]": (prev)=>prev.map({
                        "FrameTemplatePageContent.useCallback[handlePointerMove]": (sticker)=>{
                            if (sticker.id !== dragState.id) return sticker;
                            const x = clamp(rawX, 0, canvasSize.width - sticker.size);
                            const y = clamp(rawY, 0, canvasSize.height - sticker.size);
                            return {
                                ...sticker,
                                x,
                                y
                            };
                        }
                    }["FrameTemplatePageContent.useCallback[handlePointerMove]"])
            }["FrameTemplatePageContent.useCallback[handlePointerMove]"]);
        }
    }["FrameTemplatePageContent.useCallback[handlePointerMove]"], [
        canvasSize.height,
        canvasSize.width
    ]);
    const stopDrag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[stopDrag]": ()=>{
            dragStateRef.current = null;
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', stopDrag);
            window.removeEventListener('pointercancel', stopDrag);
        }
    }["FrameTemplatePageContent.useCallback[stopDrag]"], [
        handlePointerMove
    ]);
    const handleExistingStickerPointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[handleExistingStickerPointerMove]": (event)=>{
            const dragState = existingStickerDragRef.current;
            const canvas = canvasRef.current;
            if (!dragState || !canvas) return;
            const bounds = canvas.getBoundingClientRect();
            const nextX = event.clientX - bounds.left - dragState.offsetX;
            const nextY = event.clientY - bounds.top - dragState.offsetY;
            const minX = -canvasSize.width;
            const maxX = canvasSize.width;
            const minY = -canvasSize.height;
            const maxY = canvasSize.height;
            setExistingStickerOffset({
                x: clamp(nextX, minX, maxX),
                y: clamp(nextY, minY, maxY)
            });
        }
    }["FrameTemplatePageContent.useCallback[handleExistingStickerPointerMove]"], [
        canvasSize.height,
        canvasSize.width
    ]);
    const stopExistingStickerDrag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[stopExistingStickerDrag]": ()=>{
            existingStickerDragRef.current = null;
            setIsDraggingExistingSticker(false);
            window.removeEventListener('pointermove', handleExistingStickerPointerMove);
            window.removeEventListener('pointerup', stopExistingStickerDrag);
            window.removeEventListener('pointercancel', stopExistingStickerDrag);
        }
    }["FrameTemplatePageContent.useCallback[stopExistingStickerDrag]"], [
        handleExistingStickerPointerMove
    ]);
    const startExistingStickerDrag = (event)=>{
        const canvas = canvasRef.current;
        if (!canvas || !(existingTemplateStickerUrl || existingTemplateStickerOriginalUrl)) return;
        event.preventDefault();
        const bounds = canvas.getBoundingClientRect();
        existingStickerDragRef.current = {
            offsetX: event.clientX - bounds.left - existingStickerOffset.x,
            offsetY: event.clientY - bounds.top - existingStickerOffset.y
        };
        setIsDraggingExistingSticker(true);
        setIsExistingStickerSelected(true);
        window.addEventListener('pointermove', handleExistingStickerPointerMove);
        window.addEventListener('pointerup', stopExistingStickerDrag);
        window.addEventListener('pointercancel', stopExistingStickerDrag);
    };
    const handleExistingStickerResizePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[handleExistingStickerResizePointerMove]": (event)=>{
            const state = existingStickerResizeRef.current;
            if (!state) return;
            const dx = event.clientX - state.startX;
            const dy = event.clientY - state.startY;
            const delta = Math.max(dx, dy);
            const nextScale = clamp(state.startScale + delta / 200, 0.2, 3);
            setExistingStickerScale(nextScale);
        }
    }["FrameTemplatePageContent.useCallback[handleExistingStickerResizePointerMove]"], []);
    const stopExistingStickerResize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[stopExistingStickerResize]": ()=>{
            existingStickerResizeRef.current = null;
            window.removeEventListener('pointermove', handleExistingStickerResizePointerMove);
            window.removeEventListener('pointerup', stopExistingStickerResize);
            window.removeEventListener('pointercancel', stopExistingStickerResize);
        }
    }["FrameTemplatePageContent.useCallback[stopExistingStickerResize]"], [
        handleExistingStickerResizePointerMove
    ]);
    const startExistingStickerResize = (event)=>{
        event.preventDefault();
        event.stopPropagation();
        existingStickerResizeRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            startScale: existingStickerScale
        };
        setIsExistingStickerSelected(true);
        window.addEventListener('pointermove', handleExistingStickerResizePointerMove);
        window.addEventListener('pointerup', stopExistingStickerResize);
        window.addEventListener('pointercancel', stopExistingStickerResize);
    };
    const handleExistingStickerRotatePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[handleExistingStickerRotatePointerMove]": (event)=>{
            const state = existingStickerRotateRef.current;
            if (!state) return;
            const currentAngle = Math.atan2(event.clientY - state.centerY, event.clientX - state.centerX);
            const deltaDeg = (currentAngle - state.startAngle) * 180 / Math.PI;
            setExistingStickerRotate(state.startRotate + deltaDeg);
        }
    }["FrameTemplatePageContent.useCallback[handleExistingStickerRotatePointerMove]"], []);
    const stopExistingStickerRotate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[stopExistingStickerRotate]": ()=>{
            existingStickerRotateRef.current = null;
            window.removeEventListener('pointermove', handleExistingStickerRotatePointerMove);
            window.removeEventListener('pointerup', stopExistingStickerRotate);
            window.removeEventListener('pointercancel', stopExistingStickerRotate);
        }
    }["FrameTemplatePageContent.useCallback[stopExistingStickerRotate]"], [
        handleExistingStickerRotatePointerMove
    ]);
    const startExistingStickerRotate = (event)=>{
        var _canvasRef_current;
        event.preventDefault();
        event.stopPropagation();
        const bounds = (_canvasRef_current = canvasRef.current) === null || _canvasRef_current === void 0 ? void 0 : _canvasRef_current.getBoundingClientRect();
        if (!bounds) return;
        const centerX = bounds.left + canvasSize.width / 2 + existingStickerOffset.x;
        const centerY = bounds.top + canvasSize.height / 2 + existingStickerOffset.y;
        const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
        existingStickerRotateRef.current = {
            centerX,
            centerY,
            startAngle,
            startRotate: existingStickerRotate
        };
        setIsExistingStickerSelected(true);
        window.addEventListener('pointermove', handleExistingStickerRotatePointerMove);
        window.addEventListener('pointerup', stopExistingStickerRotate);
        window.addEventListener('pointercancel', stopExistingStickerRotate);
    };
    const handleSlotPointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[handleSlotPointerMove]": (event)=>{
            const dragState = slotDragStateRef.current;
            const canvas = canvasRef.current;
            if (!dragState || !canvas) return;
            const bounds = canvas.getBoundingClientRect();
            const rawX = event.clientX - bounds.left - dragState.offsetX;
            const rawY = event.clientY - bounds.top - dragState.offsetY;
            setPhotoSlots({
                "FrameTemplatePageContent.useCallback[handleSlotPointerMove]": (prev)=>prev.map({
                        "FrameTemplatePageContent.useCallback[handleSlotPointerMove]": (slot, index)=>{
                            if (index !== dragState.index) return slot;
                            return {
                                ...slot,
                                x: clamp(rawX, 0, canvasSize.width - slot.width),
                                y: clamp(rawY, 0, canvasSize.height - slot.height)
                            };
                        }
                    }["FrameTemplatePageContent.useCallback[handleSlotPointerMove]"])
            }["FrameTemplatePageContent.useCallback[handleSlotPointerMove]"]);
        }
    }["FrameTemplatePageContent.useCallback[handleSlotPointerMove]"], [
        canvasSize.height,
        canvasSize.width
    ]);
    const stopSlotDrag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[stopSlotDrag]": ()=>{
            slotDragStateRef.current = null;
            window.removeEventListener('pointermove', handleSlotPointerMove);
            window.removeEventListener('pointerup', stopSlotDrag);
            window.removeEventListener('pointercancel', stopSlotDrag);
        }
    }["FrameTemplatePageContent.useCallback[stopSlotDrag]"], [
        handleSlotPointerMove
    ]);
    const handleResizePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[handleResizePointerMove]": (event)=>{
            const state = resizeStateRef.current;
            if (!state) return;
            const dx = event.clientX - state.startX;
            const dy = event.clientY - state.startY;
            const delta = Math.max(dx, dy);
            const nextSize = clamp(state.startSize + delta, 24, 420);
            setCanvasStickers({
                "FrameTemplatePageContent.useCallback[handleResizePointerMove]": (prev)=>prev.map({
                        "FrameTemplatePageContent.useCallback[handleResizePointerMove]": (sticker)=>{
                            if (sticker.id !== state.id) return sticker;
                            return {
                                ...sticker,
                                size: nextSize,
                                x: clamp(sticker.x, 0, Math.max(canvasSize.width - nextSize, 0)),
                                y: clamp(sticker.y, 0, Math.max(canvasSize.height - nextSize, 0))
                            };
                        }
                    }["FrameTemplatePageContent.useCallback[handleResizePointerMove]"])
            }["FrameTemplatePageContent.useCallback[handleResizePointerMove]"]);
        }
    }["FrameTemplatePageContent.useCallback[handleResizePointerMove]"], [
        canvasSize.height,
        canvasSize.width
    ]);
    const stopResize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[stopResize]": ()=>{
            resizeStateRef.current = null;
            window.removeEventListener('pointermove', handleResizePointerMove);
            window.removeEventListener('pointerup', stopResize);
            window.removeEventListener('pointercancel', stopResize);
        }
    }["FrameTemplatePageContent.useCallback[stopResize]"], [
        handleResizePointerMove
    ]);
    const handleRotatePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[handleRotatePointerMove]": (event)=>{
            const state = rotateStateRef.current;
            if (!state) return;
            const currentAngle = Math.atan2(event.clientY - state.centerY, event.clientX - state.centerX);
            const deltaDeg = (currentAngle - state.startAngle) * 180 / Math.PI;
            const nextRotate = state.startRotate + deltaDeg;
            setCanvasStickers({
                "FrameTemplatePageContent.useCallback[handleRotatePointerMove]": (prev)=>prev.map({
                        "FrameTemplatePageContent.useCallback[handleRotatePointerMove]": (sticker)=>{
                            if (sticker.id !== state.id) return sticker;
                            return {
                                ...sticker,
                                rotate: nextRotate
                            };
                        }
                    }["FrameTemplatePageContent.useCallback[handleRotatePointerMove]"])
            }["FrameTemplatePageContent.useCallback[handleRotatePointerMove]"]);
        }
    }["FrameTemplatePageContent.useCallback[handleRotatePointerMove]"], []);
    const stopRotate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FrameTemplatePageContent.useCallback[stopRotate]": ()=>{
            rotateStateRef.current = null;
            window.removeEventListener('pointermove', handleRotatePointerMove);
            window.removeEventListener('pointerup', stopRotate);
            window.removeEventListener('pointercancel', stopRotate);
        }
    }["FrameTemplatePageContent.useCallback[stopRotate]"], [
        handleRotatePointerMove
    ]);
    const startDragSticker = (stickerId)=>(event)=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const sticker = canvasStickers.find((item)=>item.id === stickerId);
            if (!sticker) return;
            const bounds = canvas.getBoundingClientRect();
            dragStateRef.current = {
                id: stickerId,
                offsetX: event.clientX - bounds.left - sticker.x,
                offsetY: event.clientY - bounds.top - sticker.y
            };
            setIsExistingStickerSelected(false);
            setSelectedStickerId(stickerId);
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', stopDrag);
            window.addEventListener('pointercancel', stopDrag);
        };
    const startSlotDrag = (slotIndex)=>(event)=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const slot = photoSlots[slotIndex];
            if (!slot) return;
            const bounds = canvas.getBoundingClientRect();
            slotDragStateRef.current = {
                index: slotIndex,
                offsetX: event.clientX - bounds.left - slot.x,
                offsetY: event.clientY - bounds.top - slot.y
            };
            setHasCustomSlots(true);
            setIsExistingStickerSelected(false);
            setSelectedSlotIndex(slotIndex);
            window.addEventListener('pointermove', handleSlotPointerMove);
            window.addEventListener('pointerup', stopSlotDrag);
            window.addEventListener('pointercancel', stopSlotDrag);
        };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FrameTemplatePageContent.useEffect": ()=>{
            return ({
                "FrameTemplatePageContent.useEffect": ()=>{
                    stopDrag();
                    stopExistingStickerDrag();
                    stopExistingStickerResize();
                    stopExistingStickerRotate();
                    stopSlotDrag();
                    stopResize();
                    stopRotate();
                }
            })["FrameTemplatePageContent.useEffect"];
        }
    }["FrameTemplatePageContent.useEffect"], [
        stopDrag,
        stopExistingStickerDrag,
        stopExistingStickerResize,
        stopExistingStickerRotate,
        stopRotate,
        stopResize,
        stopSlotDrag
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FrameTemplatePageContent.useEffect": ()=>{
            setCanvasStickers({
                "FrameTemplatePageContent.useEffect": (prev)=>prev.map({
                        "FrameTemplatePageContent.useEffect": (sticker)=>({
                                ...sticker,
                                x: clamp(sticker.x, 0, Math.max(canvasSize.width - sticker.size, 0)),
                                y: clamp(sticker.y, 0, Math.max(canvasSize.height - sticker.size, 0))
                            })
                    }["FrameTemplatePageContent.useEffect"])
            }["FrameTemplatePageContent.useEffect"]);
        }
    }["FrameTemplatePageContent.useEffect"], [
        canvasSize.height,
        canvasSize.width
    ]);
    const handleAddStickerToCanvas = (item, targetX, targetY)=>{
        const baseSize = 80;
        const centeredX = targetX !== null && targetX !== void 0 ? targetX : canvasSize.width / 2 - baseSize / 2;
        const centeredY = targetY !== null && targetY !== void 0 ? targetY : canvasSize.height / 2 - baseSize / 2;
        const newSticker = {
            id: "".concat(Date.now(), "-").concat(Math.random().toString(36).slice(2, 8)),
            src: item.url,
            originalSrc: item.url,
            label: item.name,
            x: clamp(centeredX, 0, Math.max(canvasSize.width - baseSize, 0)),
            y: clamp(centeredY, 0, Math.max(canvasSize.height - baseSize, 0)),
            size: baseSize,
            rotate: 0,
            removeBg: false,
            z: Date.now()
        };
        setCanvasStickers((prev)=>[
                ...prev,
                newSticker
            ]);
        setIsExistingStickerSelected(false);
        setSelectedStickerId(newSticker.id);
    };
    const updateStickerById = (id, patch)=>{
        setCanvasStickers((prev)=>prev.map((sticker)=>{
                if (sticker.id !== id) return sticker;
                var _patch_size;
                const nextSize = (_patch_size = patch.size) !== null && _patch_size !== void 0 ? _patch_size : sticker.size;
                var _patch_x;
                const nextX = clamp((_patch_x = patch.x) !== null && _patch_x !== void 0 ? _patch_x : sticker.x, 0, Math.max(canvasSize.width - nextSize, 0));
                var _patch_y;
                const nextY = clamp((_patch_y = patch.y) !== null && _patch_y !== void 0 ? _patch_y : sticker.y, 0, Math.max(canvasSize.height - nextSize, 0));
                return {
                    ...sticker,
                    ...patch,
                    x: nextX,
                    y: nextY
                };
            }));
    };
    const startResizeSticker = (id)=>(event)=>{
            event.preventDefault();
            event.stopPropagation();
            const sticker = canvasStickers.find((item)=>item.id === id);
            if (!sticker) return;
            resizeStateRef.current = {
                id,
                startX: event.clientX,
                startY: event.clientY,
                startSize: sticker.size
            };
            window.addEventListener('pointermove', handleResizePointerMove);
            window.addEventListener('pointerup', stopResize);
            window.addEventListener('pointercancel', stopResize);
        };
    const startRotateSticker = (id)=>(event)=>{
            var _canvasRef_current;
            event.preventDefault();
            event.stopPropagation();
            const sticker = canvasStickers.find((item)=>item.id === id);
            const bounds = (_canvasRef_current = canvasRef.current) === null || _canvasRef_current === void 0 ? void 0 : _canvasRef_current.getBoundingClientRect();
            if (!sticker || !bounds) return;
            const centerX = bounds.left + sticker.x + sticker.size / 2;
            const centerY = bounds.top + sticker.y + sticker.size / 2;
            const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
            rotateStateRef.current = {
                id,
                centerX,
                centerY,
                startAngle,
                startRotate: sticker.rotate
            };
            window.addEventListener('pointermove', handleRotatePointerMove);
            window.addEventListener('pointerup', stopRotate);
            window.addEventListener('pointercancel', stopRotate);
        };
    const removeStickerById = (id)=>{
        setCanvasStickers((prev)=>prev.filter((sticker)=>sticker.id !== id));
        if (selectedStickerId === id) {
            setSelectedStickerId(null);
        }
    };
    const removeImageBackground = async (src)=>{
        const image = await loadImage(src);
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return src;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for(let i = 0; i < data.length; i += 4){
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const nearNeutral = max - min < 42;
            const bright = max > 210;
            if (bright && nearNeutral) {
                data[i + 3] = 0;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    };
    const toggleStickerRemoveBg = async (id)=>{
        const target = canvasStickers.find((item)=>item.id === id);
        if (!target) return;
        if (target.removeBg) {
            updateStickerById(id, {
                src: target.originalSrc,
                removeBg: false
            });
            return;
        }
        try {
            const processed = await removeImageBackground(target.originalSrc);
            updateStickerById(id, {
                src: processed,
                removeBg: true
            });
            setMessage({
                type: 'success',
                text: 'Remove BG has been applied to sticker.'
            });
        } catch (e) {
            setMessage({
                type: 'error',
                text: 'Failed to remove sticker background.'
            });
        }
    };
    const moveStickerLayer = (id, direction)=>{
        setCanvasStickers((prev)=>{
            const ordered = [
                ...prev
            ].sort((a, b)=>a.z - b.z);
            const index = ordered.findIndex((item)=>item.id === id);
            if (index < 0) return prev;
            const target = direction === 'up' ? index + 1 : index - 1;
            if (target < 0 || target >= ordered.length) return prev;
            const currentZ = ordered[index].z;
            ordered[index].z = ordered[target].z;
            ordered[target].z = currentZ;
            return ordered;
        });
    };
    const handleStickerLibraryDragStart = (event, sticker)=>{
        event.dataTransfer.setData('application/photobooth-sticker', JSON.stringify({
            name: sticker.name,
            url: sticker.url
        }));
        event.dataTransfer.effectAllowed = 'copy';
    };
    const handleCanvasDragOver = (event)=>{
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };
    const handleCanvasDrop = (event)=>{
        var _canvasRef_current;
        event.preventDefault();
        const raw = event.dataTransfer.getData('application/photobooth-sticker');
        const bounds = (_canvasRef_current = canvasRef.current) === null || _canvasRef_current === void 0 ? void 0 : _canvasRef_current.getBoundingClientRect();
        const dropX = bounds ? event.clientX - bounds.left - 40 : undefined;
        const dropY = bounds ? event.clientY - bounds.top - 40 : undefined;
        if (!raw) {
            const payload = extractImagePayload(event.dataTransfer);
            if (!payload) return;
            if (payload.kind === 'file') {
                const objectUrl = URL.createObjectURL(payload.file);
                handleAddStickerToCanvas({
                    name: payload.file.name || 'Dropped Sticker',
                    url: objectUrl
                }, dropX, dropY);
            } else {
                addStickerFromUrl(payload.url, dropX, dropY, 'Dropped Sticker');
            }
            return;
        }
        try {
            const parsed = JSON.parse(raw);
            if (!(parsed === null || parsed === void 0 ? void 0 : parsed.url)) return;
            handleAddStickerToCanvas({
                name: parsed.name || 'Sticker',
                url: parsed.url
            }, dropX, dropY);
        } catch (e) {
        // Ignore invalid drag payload
        }
    };
    const handleCanvasPaste = (event)=>{
        const payload = extractImagePayload(event.clipboardData);
        if (!payload) return;
        event.preventDefault();
        if (payload.kind === 'file') {
            const objectUrl = URL.createObjectURL(payload.file);
            handleAddStickerToCanvas({
                name: payload.file.name || 'Pasted Sticker',
                url: objectUrl
            });
            return;
        }
        addStickerFromUrl(payload.url, undefined, undefined, 'Pasted Sticker');
    };
    const handleBackgroundDrop = (event)=>{
        event.preventDefault();
        const payload = extractImagePayload(event.dataTransfer);
        if (!payload) return;
        if (payload.kind === 'file') {
            setBackgroundFromFile(payload.file);
            return;
        }
        setBackgroundFromRawUrl(payload.url);
    };
    const handleBackgroundPaste = (event)=>{
        const payload = extractImagePayload(event.clipboardData);
        if (!payload) return;
        event.preventDefault();
        if (payload.kind === 'file') {
            setBackgroundFromFile(payload.file);
            return;
        }
        setBackgroundFromRawUrl(payload.url);
    };
    const resetCanvas = ()=>{
        setBackgroundColor('#ffffff');
        setBackgroundImageFile(null);
        setBackgroundImageInputUrl('');
        setCanvasStickers([]);
        setSelectedStickerId(null);
        setCanvasSizeOverride(null);
        setHasCustomSlots(false);
        setMessage(null);
    };
    const exportTemplateImages = async (includeStickerLayer)=>{
        const scale = 2;
        const width = canvasSize.width * scale;
        const height = canvasSize.height * scale;
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = width;
        frameCanvas.height = height;
        const frameCtx = frameCanvas.getContext('2d');
        if (!frameCtx) throw new Error('Failed to create frame canvas.');
        frameCtx.scale(scale, scale);
        frameCtx.fillStyle = backgroundColor;
        frameCtx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        if (backgroundImageUrl) {
            const bgImage = await loadImage(backgroundImageUrl);
            drawCoverImage(frameCtx, bgImage, canvasSize.width, canvasSize.height);
        }
        // Slot guides are editor-only visual helpers and must not be baked into exported frame image.
        const frameBlob = await new Promise((resolve)=>frameCanvas.toBlob(resolve, 'image/png'));
        if (!frameBlob) {
            throw new Error('Failed to export frame image.');
        }
        let stickerBlob = null;
        if (includeStickerLayer) {
            const stickerCanvas = document.createElement('canvas');
            stickerCanvas.width = width;
            stickerCanvas.height = height;
            const stickerCtx = stickerCanvas.getContext('2d');
            if (!stickerCtx) throw new Error('Failed to create sticker canvas.');
            stickerCtx.scale(scale, scale);
            const existingStickerSource = existingTemplateStickerUrl || existingTemplateStickerOriginalUrl;
            if (existingStickerSource) {
                const existingStickerImage = await loadImage(existingStickerSource);
                stickerCtx.save();
                stickerCtx.translate(canvasSize.width / 2 + existingStickerOffset.x, canvasSize.height / 2 + existingStickerOffset.y);
                stickerCtx.rotate(existingStickerRotate * Math.PI / 180);
                stickerCtx.scale(existingStickerScale, existingStickerScale);
                stickerCtx.drawImage(existingStickerImage, -canvasSize.width / 2, -canvasSize.height / 2, canvasSize.width, canvasSize.height);
                stickerCtx.restore();
            }
            for (const sticker of [
                ...canvasStickers
            ].sort((a, b)=>a.z - b.z)){
                const stickerImage = await loadImage(sticker.src);
                const cx = sticker.x + sticker.size / 2;
                const cy = sticker.y + sticker.size / 2;
                stickerCtx.save();
                stickerCtx.translate(cx, cy);
                stickerCtx.rotate(sticker.rotate * Math.PI / 180);
                stickerCtx.drawImage(stickerImage, -sticker.size / 2, -sticker.size / 2, sticker.size, sticker.size);
                stickerCtx.restore();
            }
            stickerBlob = await new Promise((resolve)=>stickerCanvas.toBlob(resolve, 'image/png'));
            if (!stickerBlob) {
                throw new Error('Failed to export sticker image.');
            }
        }
        return {
            frameBlob,
            stickerBlob
        };
    };
    const handleSaveTemplate = async ()=>{
        setMessage(null);
        setUploading(true);
        try {
            const name = templateName.trim() || "template-".concat(Date.now());
            const isEditing = Boolean(editingTemplateName);
            const hasExistingSticker = Boolean(existingTemplateStickerUrl || existingTemplateStickerOriginalUrl);
            const shouldUploadSticker = !isEditing || canvasStickers.length > 0 || !hasExistingSticker;
            const { frameBlob, stickerBlob } = await exportTemplateImages(shouldUploadSticker);
            const templateSettings = {
                canvasWidth: canvasSize.width,
                canvasHeight: canvasSize.height,
                padding: CANVAS_PADDING,
                gap: CANVAS_GAP,
                bottomSpace: 0,
                frameBorderRadius: 0,
                photoBorderRadius: 0,
                photoWidth: Math.round(layout.photoWidth),
                photoHeight: Math.round(layout.photoHeight),
                slotCount,
                photoSlots: photoSlots.map((slot)=>({
                        x: Math.round(slot.x),
                        y: Math.round(slot.y),
                        width: Math.round(slot.width),
                        height: Math.round(slot.height)
                    }))
            };
            const formData = new FormData();
            formData.append('name', name);
            formData.append('frame', new File([
                frameBlob
            ], "".concat(name, "-frame.png"), {
                type: 'image/png'
            }));
            if (stickerBlob) {
                formData.append('sticker', new File([
                    stickerBlob
                ], "".concat(name, "-sticker.png"), {
                    type: 'image/png'
                }));
            }
            formData.append('settings', JSON.stringify(templateSettings));
            if (isEditing && editingTemplateName) {
                formData.append('currentName', editingTemplateName);
            }
            const res = await fetch(isEditing ? '/api/update-frame-template' : '/api/upload-frame-template', {
                method: isEditing ? 'PATCH' : 'POST',
                body: formData
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage({
                    type: 'error',
                    text: data.error || 'Failed to save template.'
                });
                return;
            }
            setMessage({
                type: 'success',
                text: "Template ".concat(name, " saved successfully.")
            });
            if (isEditing) {
                setEditingTemplateName(name);
            } else {
                setTemplateName('');
            }
            window.dispatchEvent(new Event('frameTemplatesUpdated'));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving template.';
            setMessage({
                type: 'error',
                text: errorMessage
            });
        } finally{
            setUploading(false);
        }
    };
    if (status === 'loading') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center px-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-600",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/src/app/admin/frame-template/page.tsx",
                lineNumber: 1178,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/frame-template/page.tsx",
            lineNumber: 1177,
            columnNumber: 7
        }, this);
    }
    if (!session || session.user.role !== 'ADMIN') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center px-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl sm:text-3xl font-bold text-red-600 mb-4",
                        children: "Access Denied"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/frame-template/page.tsx",
                        lineNumber: 1187,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm sm:text-base text-gray-600",
                        children: "You need admin privileges to access this page."
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/frame-template/page.tsx",
                        lineNumber: 1188,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/frame-template/page.tsx",
                lineNumber: 1186,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/frame-template/page.tsx",
            lineNumber: 1185,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-[#fff7fb] via-[#ffeaf4] to-[#fff5fa] py-8 sm:py-12 px-4 sm:px-6 lg:px-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl sm:text-4xl font-bold text-[#4f3040]",
                                    children: "Frame Template Canvas"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                    lineNumber: 1199,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm sm:text-base text-[#705362] mt-1",
                                    children: editingTemplateName ? "Editing template ".concat(editingTemplateName, ". Update canvas and save changes.") : 'Create templates on strip canvas: adjust background, add stickers, then save.'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                    lineNumber: 1200,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                            lineNumber: 1198,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/admin/frame-template/list",
                            className: "inline-flex items-center justify-center rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-4 py-2 font-semibold text-[#6d3f55] hover:bg-[#ffe7f2]",
                            children: "View Template List"
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                            lineNumber: 1206,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                    lineNumber: 1197,
                    columnNumber: 9
                }, this),
                message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg p-3 text-sm border ".concat(message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'),
                    children: message.text
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                    lineNumber: 1215,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#f3d7e5]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold text-[#4f3040] mb-4",
                                    children: "Photo Strip Canvas"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                    lineNumber: 1228,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-[#7d5f6d] mb-4",
                                    children: "Drag stickers directly on canvas to set position. These elements will be used as template overlay."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                    lineNumber: 1229,
                                    columnNumber: 13
                                }, this),
                                editingTemplateName && (existingTemplateStickerUrl || existingTemplateStickerOriginalUrl) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700",
                                    children: "Existing sticker layer loaded. Sticker lama bisa drag, rotate, dan resize."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                    lineNumber: 1234,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full overflow-auto rounded-xl border border-[#ecd4e1] bg-[#fff7fb] p-3 flex justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: canvasRef,
                                        className: "relative shrink-0 rounded-xl border border-[#f0d8e5] overflow-hidden",
                                        tabIndex: 0,
                                        onDragOver: handleCanvasDragOver,
                                        onDrop: handleCanvasDrop,
                                        onPaste: handleCanvasPaste,
                                        style: {
                                            width: canvasSize.width,
                                            height: canvasSize.height,
                                            backgroundColor,
                                            backgroundImage: backgroundImageUrl ? "url(".concat(backgroundImageUrl, ")") : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        },
                                        children: [
                                            photoSlots.map((slot, index)=>{
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute border rounded-md flex items-center justify-center cursor-move touch-none select-none ".concat(selectedSlotIndex === index ? 'border-[#d72688] ring-2 ring-[#f7aed0]' : 'border-white/70'),
                                                    onPointerDown: startSlotDrag(index),
                                                    style: {
                                                        left: slot.x,
                                                        top: slot.y,
                                                        width: slot.width,
                                                        height: slot.height,
                                                        backgroundColor,
                                                        zIndex: 2
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] font-semibold text-[#9a6c82]",
                                                        children: [
                                                            "Photo Slot ",
                                                            index + 1
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                        lineNumber: 1273,
                                                        columnNumber: 23
                                                    }, this)
                                                }, "placeholder-".concat(index), false, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1258,
                                                    columnNumber: 21
                                                }, this);
                                            }),
                                            existingTemplateStickerUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0",
                                                style: {
                                                    zIndex: 4,
                                                    transform: "translate(".concat(existingStickerOffset.x, "px, ").concat(existingStickerOffset.y, "px) rotate(").concat(existingStickerRotate, "deg) scale(").concat(existingStickerScale, ")"),
                                                    transformOrigin: 'center'
                                                },
                                                onPointerDown: startExistingStickerDrag,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: existingTemplateStickerUrl,
                                                        alt: "Existing template sticker",
                                                        className: "w-full h-full object-fill select-none ".concat(isDraggingExistingSticker ? 'cursor-grabbing' : 'cursor-grab'),
                                                        draggable: false,
                                                        onError: ()=>{
                                                            if (existingTemplateStickerOriginalUrl && existingTemplateStickerOriginalUrl !== existingTemplateStickerUrl) {
                                                                setExistingTemplateStickerUrl(existingTemplateStickerOriginalUrl);
                                                            }
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                        lineNumber: 1289,
                                                        columnNumber: 21
                                                    }, this),
                                                    isExistingStickerSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute -top-3 -right-3 flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                className: "h-6 w-6 rounded-full bg-white border border-[#f3b7d1] text-[#d72688] text-[10px] font-bold shadow",
                                                                onPointerDown: startExistingStickerRotate,
                                                                title: "Rotate existing sticker",
                                                                children: "⟳"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                lineNumber: 1308,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                className: "h-6 w-6 rounded-full bg-white border border-[#f3b7d1] text-[#d72688] text-[10px] font-bold shadow",
                                                                onPointerDown: startExistingStickerResize,
                                                                title: "Resize existing sticker",
                                                                children: "↘"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                lineNumber: 1317,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                        lineNumber: 1307,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                lineNumber: 1279,
                                                columnNumber: 19
                                            }, this),
                                            [
                                                ...canvasStickers
                                            ].sort((a, b)=>a.z - b.z).map((sticker)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        position: 'absolute',
                                                        left: sticker.x,
                                                        top: sticker.y,
                                                        zIndex: 5
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onPointerDown: startDragSticker(sticker.id),
                                                            onClick: ()=>setSelectedStickerId(sticker.id),
                                                            className: "touch-none rounded-md ".concat(selectedStickerId === sticker.id ? 'ring-2 ring-[#d72688]' : ''),
                                                            style: {
                                                                width: sticker.size,
                                                                height: sticker.size,
                                                                transform: "rotate(".concat(sticker.rotate, "deg)"),
                                                                cursor: 'grab',
                                                                background: 'transparent',
                                                                padding: 0
                                                            },
                                                            title: sticker.label,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: sticker.src,
                                                                alt: sticker.label,
                                                                className: "w-full h-full object-contain pointer-events-none"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                lineNumber: 1348,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1332,
                                                            columnNumber: 21
                                                        }, this),
                                                        selectedStickerId === sticker.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "absolute -top-3 -left-3 h-6 w-6 rounded-full bg-white border border-[#f3b7d1] text-[#d72688] text-[10px] font-bold shadow",
                                                                    onPointerDown: (event)=>{
                                                                        event.stopPropagation();
                                                                        moveStickerLayer(sticker.id, 'up');
                                                                    },
                                                                    title: "Move Layer Up",
                                                                    children: "↑"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1353,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-white border border-[#f3b7d1] text-[#d72688] text-[10px] font-bold shadow",
                                                                    onPointerDown: (event)=>{
                                                                        event.stopPropagation();
                                                                        moveStickerLayer(sticker.id, 'down');
                                                                    },
                                                                    title: "Move Layer Down",
                                                                    children: "↓"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1364,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "absolute -top-3 left-1/2 -translate-x-1/2 h-6 px-2 rounded-full bg-white border border-[#f3b7d1] text-[#d72688] text-[9px] font-bold shadow",
                                                                    onPointerDown: (event)=>{
                                                                        event.stopPropagation();
                                                                        void toggleStickerRemoveBg(sticker.id);
                                                                    },
                                                                    title: "Remove Background",
                                                                    children: sticker.removeBg ? 'BG ON' : 'BG OFF'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1375,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "absolute -top-3 -right-3 h-6 w-6 rounded-full bg-[#ffe9f2] border border-[#f3b7d1] text-[#c42874] text-[12px] font-bold shadow",
                                                                    onPointerDown: (event)=>{
                                                                        event.stopPropagation();
                                                                        removeStickerById(sticker.id);
                                                                    },
                                                                    title: "Delete",
                                                                    children: "×"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1386,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "absolute top-1/2 -right-3 -translate-y-1/2 h-6 w-6 rounded-full bg-white border border-[#f3b7d1] text-[#d72688] text-[10px] font-bold shadow",
                                                                    onPointerDown: startRotateSticker(sticker.id),
                                                                    title: "Rotate (drag pointer)",
                                                                    children: "⟳"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1398,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "absolute -bottom-3 -right-3 h-6 w-6 rounded-full bg-white border border-[#f3b7d1] text-[#d72688] text-[10px] font-bold shadow",
                                                                    onPointerDown: startResizeSticker(sticker.id),
                                                                    title: "Resize (drag pointer)",
                                                                    children: "↘"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1407,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true)
                                                    ]
                                                }, sticker.id, true, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1331,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                        lineNumber: 1240,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                    lineNumber: 1239,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 rounded-xl border border-[#ecd4e1] bg-[#fff7fb] p-3",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[#6d3f55]",
                                        children: "Click a sticker, then drag top-right handle to rotate and bottom-right handle to resize. Use BG button for background removal."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                        lineNumber: 1423,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                    lineNumber: 1422,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                            lineNumber: 1227,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    className: "bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#f3d7e5] h-fit",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-semibold text-[#4f3040] mb-4",
                                            children: "Template Settings"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                            lineNumber: 1429,
                                            columnNumber: 15
                                        }, this),
                                        loadingTemplate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-3 rounded-lg border border-[#ecd4e1] bg-[#fff7fb] px-3 py-2 text-xs text-[#6d3f55]",
                                            children: "Loading template data..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                            lineNumber: 1432,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "template-name",
                                                            className: "block text-sm font-medium text-[#5d4150] mb-1",
                                                            children: "Template Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1439,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "template-name",
                                                            type: "text",
                                                            value: templateName,
                                                            onChange: (event)=>setTemplateName(event.target.value),
                                                            placeholder: "example: photobooth-pink",
                                                            className: "w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1442,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1438,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "background-color",
                                                            className: "block text-sm font-medium text-[#5d4150] mb-1",
                                                            children: "Background Color"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1453,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    id: "background-color",
                                                                    type: "color",
                                                                    value: backgroundColor,
                                                                    onChange: (event)=>setBackgroundColor(event.target.value),
                                                                    className: "h-10 w-14 cursor-pointer rounded border border-[#d9c8d1] bg-white p-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1457,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: backgroundColor,
                                                                    onChange: (event)=>setBackgroundColor(event.target.value),
                                                                    className: "flex-1 rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1464,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1456,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1452,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "slot-count",
                                                            className: "block text-sm font-medium text-[#5d4150] mb-1",
                                                            children: "Number of Photo Slots"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1474,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            id: "slot-count",
                                                            value: slotCount,
                                                            onChange: (event)=>{
                                                                setCanvasSizeOverride(null);
                                                                setHasCustomSlots(false);
                                                                setSlotCount(Number(event.target.value));
                                                            },
                                                            className: "w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]",
                                                            children: SLOT_COUNT_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: option,
                                                                    children: [
                                                                        option,
                                                                        " Photos"
                                                                    ]
                                                                }, option, true, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1488,
                                                                    columnNumber: 23
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1477,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1473,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "canvas-format",
                                                            className: "block text-sm font-medium text-[#5d4150] mb-1",
                                                            children: "Format Canvas"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1496,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            id: "canvas-format",
                                                            value: canvasFormat,
                                                            onChange: (event)=>{
                                                                setCanvasSizeOverride(null);
                                                                setHasCustomSlots(false);
                                                                setCanvasFormat(event.target.value);
                                                            },
                                                            className: "w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]",
                                                            children: Object.keys(FORMAT_PRESETS).map((format)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: format,
                                                                    children: FORMAT_PRESETS[format].label
                                                                }, format, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1510,
                                                                    columnNumber: 23
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1499,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-1 text-xs text-[#8e6f7f]",
                                                            children: [
                                                                "Canvas: ",
                                                                canvasSize.width,
                                                                " x ",
                                                                canvasSize.height,
                                                                "px, Grid: ",
                                                                layout.columns,
                                                                " columns x ",
                                                                layout.rows,
                                                                " rows"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1515,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1495,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "background-image",
                                                            className: "block text-sm font-medium text-[#5d4150] mb-1",
                                                            children: "Background Image (optional)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1521,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "background-image",
                                                            type: "file",
                                                            accept: "image/*",
                                                            onChange: (event)=>{
                                                                var _event_target_files;
                                                                return setBackgroundImageFile(((_event_target_files = event.target.files) === null || _event_target_files === void 0 ? void 0 : _event_target_files[0]) || null);
                                                            },
                                                            className: "w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1524,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2 rounded-lg border border-dashed border-[#e7a0c2] bg-[#fff7fb] px-3 py-2 text-xs text-[#6d3f55] outline-none",
                                                            tabIndex: 0,
                                                            onDragOver: (event)=>{
                                                                event.preventDefault();
                                                                event.dataTransfer.dropEffect = 'copy';
                                                            },
                                                            onDrop: handleBackgroundDrop,
                                                            onPaste: handleBackgroundPaste,
                                                            children: "Drag/drop or paste image for Background (automatically placed in back layer)."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1531,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-2 flex gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: backgroundImageInputUrl,
                                                                    onChange: (event)=>setBackgroundImageInputUrl(event.target.value),
                                                                    placeholder: "Paste image URL from Google/website",
                                                                    className: "flex-1 rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1544,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>setBackgroundFromRawUrl(backgroundImageInputUrl),
                                                                    className: "rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-xs font-semibold text-[#6d3f55] hover:bg-[#ffe7f2]",
                                                                    children: "Use URL"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1551,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1543,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1520,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col sm:flex-row gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: resetCanvas,
                                                            className: "inline-flex items-center justify-center gap-2 rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-4 py-2 font-semibold text-[#6d3f55] hover:bg-[#ffe7f2]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1567,
                                                                    columnNumber: 21
                                                                }, this),
                                                                "Reset"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1562,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: handleSaveTemplate,
                                                            disabled: uploading,
                                                            className: "inline-flex items-center justify-center gap-2 rounded-lg border border-[#e7a0c2] bg-[#f8bfd7] px-4 py-2 font-semibold text-[#4a2337] hover:bg-[#f2aacb] disabled:opacity-60",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1576,
                                                                    columnNumber: 21
                                                                }, this),
                                                                uploading ? 'Saving...' : editingTemplateName ? 'Update Template' : 'Save Template'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1570,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1561,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                            lineNumber: 1437,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                    lineNumber: 1428,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    className: "bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#f3d7e5] h-fit",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-xl font-semibold text-[#4f3040]",
                                                    children: "Sticker Library"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1585,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>fetchStickers(true),
                                                    disabled: refreshingStickers,
                                                    className: "inline-flex items-center gap-1 rounded-md border border-[#e7a0c2] bg-[#fff3f9] px-2.5 py-1 text-xs font-semibold text-[#6d3f55] hover:bg-[#ffe7f2]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                            className: "w-3.5 h-3.5 ".concat(refreshingStickers ? 'animate-spin' : '')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1592,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Refresh"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1586,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                            lineNumber: 1584,
                                            columnNumber: 15
                                        }, this),
                                        loadingStickers ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500",
                                            children: "Loading stickers..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                            lineNumber: 1598,
                                            columnNumber: 17
                                        }, this) : stickers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500",
                                            children: "No stickers yet. Add stickers first from Sticker menu."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                            lineNumber: 1600,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-3 max-h-[560px] overflow-auto pr-1",
                                            children: stickers.map((sticker)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>handleAddStickerToCanvas(sticker),
                                                    draggable: true,
                                                    onDragStart: (event)=>handleStickerLibraryDragStart(event, sticker),
                                                    className: "rounded-lg border border-[#ecd4e1] bg-[#fff7fb] p-2 hover:border-[#f2aacb] hover:bg-white transition text-left",
                                                    title: "Add ".concat(sticker.name),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-md bg-white border border-[#f0e2e8] aspect-square flex items-center justify-center overflow-hidden",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: sticker.url,
                                                                alt: sticker.name,
                                                                className: "w-full h-full object-contain"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                lineNumber: 1615,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1613,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-1 text-[11px] text-[#6d3f55] truncate font-semibold",
                                                            children: sticker.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1617,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-1 inline-flex items-center gap-1 text-[11px] text-[#d72688] font-semibold",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                    className: "w-3 h-3"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                                    lineNumber: 1619,
                                                                    columnNumber: 25
                                                                }, this),
                                                                "Add"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                            lineNumber: 1618,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, sticker.objectName || sticker.url, true, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1604,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                            lineNumber: 1602,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 rounded-lg border border-[#ecd4e1] bg-[#fff7fb] p-3 text-xs text-[#6d3f55]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold mb-1",
                                                    children: "Notes"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1628,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "Template is saved as frame overlay + sticker overlay so it can be used directly in strip editor page."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1629,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1",
                                                    children: "Photo slots can be dragged to align photo areas with your template design."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                                    lineNumber: 1630,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                            lineNumber: 1627,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                                    lineNumber: 1583,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/frame-template/page.tsx",
                            lineNumber: 1427,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/frame-template/page.tsx",
                    lineNumber: 1226,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/admin/frame-template/page.tsx",
            lineNumber: 1196,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/admin/frame-template/page.tsx",
        lineNumber: 1195,
        columnNumber: 5
    }, this);
}
_s(FrameTemplatePageContent, "zUEfCsIvtxQAj+s16GYA7ywvdkA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = FrameTemplatePageContent;
function FrameTemplatePage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center px-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-600",
                children: "Loading template editor..."
            }, void 0, false, {
                fileName: "[project]/src/app/admin/frame-template/page.tsx",
                lineNumber: 1645,
                columnNumber: 11
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/frame-template/page.tsx",
            lineNumber: 1644,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FrameTemplatePageContent, {}, void 0, false, {
            fileName: "[project]/src/app/admin/frame-template/page.tsx",
            lineNumber: 1649,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/admin/frame-template/page.tsx",
        lineNumber: 1642,
        columnNumber: 5
    }, this);
}
_c1 = FrameTemplatePage;
var _c, _c1;
__turbopack_context__.k.register(_c, "FrameTemplatePageContent");
__turbopack_context__.k.register(_c1, "FrameTemplatePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_admin_frame-template_page_tsx_1d99aa44._.js.map