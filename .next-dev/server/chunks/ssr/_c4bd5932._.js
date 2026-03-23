module.exports = [
"[project]/components/ConfirmDialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConfirmDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', cancelLabel = 'Cancel', loading = false, onCancel, onConfirm }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        const onEscape = (event)=>{
            if (event.key === 'Escape' && !loading) {
                onCancel();
            }
        };
        window.addEventListener('keydown', onEscape);
        return ()=>window.removeEventListener('keydown', onEscape);
    }, [
        open,
        loading,
        onCancel
    ]);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[130] pb-modal-backdrop flex items-center justify-center p-4",
        onClick: ()=>{
            if (!loading) onCancel();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "pb-modal-shell w-full max-w-lg p-5 sm:p-6 text-left",
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "confirm-dialog-title",
            onClick: (event)=>event.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-50 border border-red-100 text-red-500",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/components/ConfirmDialog.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ConfirmDialog.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    id: "confirm-dialog-title",
                                    className: "text-base sm:text-lg font-bold text-[#4a2337]",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/components/ConfirmDialog.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-sm text-[#6d3f55]",
                                    children: message
                                }, void 0, false, {
                                    fileName: "[project]/components/ConfirmDialog.tsx",
                                    lineNumber: 64,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ConfirmDialog.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ConfirmDialog.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onCancel,
                            disabled: loading,
                            className: "px-4 py-2 rounded-lg border border-[#e7a0c2] bg-[#fff3f9] text-[#6d3f55] hover:bg-[#ffe7f2] transition disabled:opacity-60",
                            children: cancelLabel
                        }, void 0, false, {
                            fileName: "[project]/components/ConfirmDialog.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onConfirm,
                            disabled: loading,
                            className: "px-4 py-2 rounded-lg border border-red-200 bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-60",
                            children: loading ? 'Processing...' : confirmLabel
                        }, void 0, false, {
                            fileName: "[project]/components/ConfirmDialog.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ConfirmDialog.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ConfirmDialog.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ConfirmDialog.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/admin/sticker/new/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewStickerPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ConfirmDialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clipboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard.js [app-ssr] (ecmascript) <export default as Clipboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eraser.js [app-ssr] (ecmascript) <export default as Eraser>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-ssr] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-ssr] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PencilLine$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil-line.js [app-ssr] (ecmascript) <export default as PencilLine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/smile.js [app-ssr] (ecmascript) <export default as Smile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/undo-2.js [app-ssr] (ecmascript) <export default as Undo2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-ssr] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WandSparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wand-sparkles.js [app-ssr] (ecmascript) <export default as WandSparkles>");
'use client';
;
;
;
;
;
;
const CANVAS_SIZE = 512;
const SHAPE_DRAG_TYPE = 'application/photobooth-shape';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const PRESET_CATEGORIES = [
    'custom',
    'wedding',
    'birthday',
    'fun',
    'kids',
    'event'
];
const SHAPE_LIBRARY = [
    {
        kind: 'square',
        label: 'Square',
        keywords: [
            'box',
            'rectangle'
        ]
    },
    {
        kind: 'triangle',
        label: 'Triangle',
        keywords: [
            'polygon'
        ]
    },
    {
        kind: 'circle',
        label: 'Circle',
        keywords: [
            'round'
        ]
    },
    {
        kind: 'diamond',
        label: 'Diamond',
        keywords: [
            'rhombus'
        ]
    },
    {
        kind: 'star',
        label: 'Star',
        keywords: [
            'sparkle'
        ]
    },
    {
        kind: 'pentagon',
        label: 'Pentagon',
        keywords: [
            'five'
        ]
    },
    {
        kind: 'hexagon',
        label: 'Hexagon',
        keywords: [
            'six'
        ]
    },
    {
        kind: 'heart',
        label: 'Heart',
        keywords: [
            'love'
        ]
    },
    {
        kind: 'plus',
        label: 'Plus',
        keywords: [
            'cross'
        ]
    },
    {
        kind: 'cloud',
        label: 'Cloud',
        keywords: [
            'bubble'
        ]
    }
];
const extractCategoryFromObjectName = (objectName)=>{
    const parts = String(objectName || '').split('/');
    return parts[1] || '';
};
const pointFromEvent = (canvas, clientX, clientY)=>{
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
};
const clamp = (value, min, max)=>Math.max(min, Math.min(max, value));
const toSafeValue = (value)=>value.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '');
const formatFileSize = (size)=>{
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};
const normalizeExternalImageUrl = (raw)=>{
    const value = raw.trim();
    if (!value) return '';
    if (value.startsWith('/api/image-proxy?url=')) return value;
    try {
        const parsed = new URL(value);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return `/api/image-proxy?url=${encodeURIComponent(parsed.toString())}`;
        }
    } catch  {
        return '';
    }
    return '';
};
const loadImage = (src)=>{
    return new Promise((resolve, reject)=>{
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = ()=>resolve(image);
        image.onerror = ()=>reject(new Error(`Failed loading image: ${src}`));
        image.src = src;
    });
};
const drawShapeOnContext = (ctx, shape)=>{
    const half = shape.size / 2;
    const centerX = shape.x + half;
    const centerY = shape.y + half;
    ctx.save();
    ctx.fillStyle = shape.color;
    if (shape.kind === 'square') {
        ctx.fillRect(shape.x, shape.y, shape.size, shape.size);
    }
    if (shape.kind === 'circle') {
        ctx.beginPath();
        ctx.arc(centerX, centerY, half, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    if (shape.kind === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(centerX, shape.y);
        ctx.lineTo(shape.x + shape.size, shape.y + shape.size);
        ctx.lineTo(shape.x, shape.y + shape.size);
        ctx.closePath();
        ctx.fill();
    }
    if (shape.kind === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(centerX, shape.y);
        ctx.lineTo(shape.x + shape.size, centerY);
        ctx.lineTo(centerX, shape.y + shape.size);
        ctx.lineTo(shape.x, centerY);
        ctx.closePath();
        ctx.fill();
    }
    if (shape.kind === 'star') {
        const outer = half;
        const inner = outer * 0.45;
        ctx.beginPath();
        for(let i = 0; i < 10; i += 1){
            const radius = i % 2 === 0 ? outer : inner;
            const angle = -Math.PI / 2 + Math.PI / 5 * i;
            const px = centerX + Math.cos(angle) * radius;
            const py = centerY + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
    }
    if (shape.kind === 'pentagon' || shape.kind === 'hexagon') {
        const sides = shape.kind === 'pentagon' ? 5 : 6;
        ctx.beginPath();
        for(let i = 0; i < sides; i += 1){
            const angle = -Math.PI / 2 + Math.PI * 2 * i / sides;
            const px = centerX + Math.cos(angle) * half;
            const py = centerY + Math.sin(angle) * half;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
    }
    if (shape.kind === 'heart') {
        const topCurveHeight = shape.size * 0.3;
        ctx.beginPath();
        ctx.moveTo(centerX, shape.y + shape.size);
        ctx.bezierCurveTo(shape.x + shape.size, shape.y + shape.size * 0.7, shape.x + shape.size, shape.y + topCurveHeight, centerX, shape.y + topCurveHeight);
        ctx.bezierCurveTo(shape.x, shape.y + topCurveHeight, shape.x, shape.y + shape.size * 0.7, centerX, shape.y + shape.size);
        ctx.closePath();
        ctx.fill();
    }
    if (shape.kind === 'plus') {
        const thickness = shape.size * 0.32;
        const armOffset = (shape.size - thickness) / 2;
        ctx.fillRect(shape.x + armOffset, shape.y, thickness, shape.size);
        ctx.fillRect(shape.x, shape.y + armOffset, shape.size, thickness);
    }
    if (shape.kind === 'cloud') {
        ctx.beginPath();
        ctx.arc(shape.x + shape.size * 0.33, shape.y + shape.size * 0.58, shape.size * 0.22, Math.PI * 0.9, Math.PI * 1.9);
        ctx.arc(shape.x + shape.size * 0.5, shape.y + shape.size * 0.42, shape.size * 0.25, Math.PI * 1.0, Math.PI * 2.0);
        ctx.arc(shape.x + shape.size * 0.68, shape.y + shape.size * 0.58, shape.size * 0.22, Math.PI * 1.1, Math.PI * 0.1);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();
};
function NewStickerPage() {
    const { data: session, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [existingCategories, setExistingCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(PRESET_CATEGORIES);
    const [categoryMode, setCategoryMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('existing');
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('custom');
    const [newCategory, setNewCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [file, setFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [stickerPreviewUrl, setStickerPreviewUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isDraggingSticker, setIsDraggingSticker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sourceUrl, setSourceUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [importingUrl, setImportingUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSaveConfirmOpen, setIsSaveConfirmOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sourceTab, setSourceTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('upload');
    const [iconQuery, setIconQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('sparkle');
    const [emojiQuery, setEmojiQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('party');
    const [iconItems, setIconItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [emojiItems, setEmojiItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [emojiProvider, setEmojiProvider] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('openmoji');
    const [searchingIcons, setSearchingIcons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchingEmoji, setSearchingEmoji] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [importingRemoteId, setImportingRemoteId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [removeBgLoading, setRemoveBgLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [bgRemoved, setBgRemoved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [originalFileBeforeBgRemove, setOriginalFileBeforeBgRemove] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [drawColor, setDrawColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('#111111');
    const [brushSize, setBrushSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(8);
    const [shapeSize, setShapeSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(140);
    const [shapeSearch, setShapeSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isDrawing, setIsDrawing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [shapes, setShapes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedShapeId, setSelectedShapeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const stickerInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const uploadFormRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasWrapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const shapeDragStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const loadFileIntoCanvas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (targetFile)=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const objectUrl = URL.createObjectURL(targetFile);
        try {
            const image = await loadImage(objectUrl);
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
            const drawWidth = image.width * scale;
            const drawHeight = image.height * scale;
            const drawX = (canvas.width - drawWidth) / 2;
            const drawY = (canvas.height - drawHeight) / 2;
            ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
            setShapes([]);
            setSelectedShapeId(null);
            setMessage({
                type: 'success',
                text: `Sticker ${targetFile.name} loaded into editor. You can draw and add shapes.`
            });
        } finally{
            URL.revokeObjectURL(objectUrl);
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!file) {
            setStickerPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setStickerPreviewUrl(objectUrl);
        return ()=>URL.revokeObjectURL(objectUrl);
    }, [
        file
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchCategories = async ()=>{
            try {
                const res = await fetch('/api/list-sticker', {
                    cache: 'no-store'
                });
                const data = await res.json();
                const items = Array.isArray(data?.stickerItems) ? data.stickerItems : [];
                const found = new Set(PRESET_CATEGORIES);
                for (const item of items){
                    const category = extractCategoryFromObjectName(item?.objectName);
                    if (category) found.add(category);
                }
                const sorted = Array.from(found).sort();
                setExistingCategories(sorted);
                setSelectedCategory((prev)=>sorted.includes(prev) ? prev : sorted[0] || 'custom');
            } catch  {
                setExistingCategories(PRESET_CATEGORIES);
            }
        };
        void fetchCategories();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, []);
    const setStickerFile = (nextFile, source = 'picker')=>{
        if (!nextFile) {
            setFile(null);
            return;
        }
        if (!nextFile.type.startsWith('image/')) {
            setMessage({
                type: 'error',
                text: 'File must be an image.'
            });
            return;
        }
        if (nextFile.size > MAX_FILE_SIZE) {
            setMessage({
                type: 'error',
                text: 'Maximum file size is 5MB.'
            });
            return;
        }
        setFile(nextFile);
        setBgRemoved(false);
        setOriginalFileBeforeBgRemove(null);
        if (source !== 'canvas') {
            void loadFileIntoCanvas(nextFile);
        }
        if (source !== 'canvas') {
            setMessage({
                type: 'success',
                text: `File ${nextFile.name} is ready to upload.`
            });
        }
    };
    const importStickerFromRemote = async (rawUrl, preferredName)=>{
        const normalizedUrl = normalizeExternalImageUrl(rawUrl);
        if (!normalizedUrl) {
            throw new Error('Invalid image URL. Use an http/https URL.');
        }
        const response = await fetch(normalizedUrl, {
            cache: 'no-store'
        });
        if (!response.ok) {
            const payload = await response.json().catch(()=>({}));
            throw new Error(payload?.error || 'Failed to fetch image from URL.');
        }
        const blob = await response.blob();
        if (!blob.type.startsWith('image/')) {
            throw new Error('URL is not an image resource.');
        }
        const extension = blob.type.includes('svg') ? 'svg' : blob.type.split('/')[1] || 'png';
        const safePreferredName = preferredName.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '') || `imported-sticker-${Date.now()}`;
        const importedFile = new File([
            blob
        ], `${safePreferredName}.${extension}`, {
            type: blob.type || 'image/png'
        });
        setStickerFile(importedFile, 'picker');
    };
    const searchStickerProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (provider, query, limit = 24)=>{
        const params = new URLSearchParams({
            provider,
            q: query,
            limit: String(limit)
        });
        const response = await fetch(`/api/sticker-search?${params.toString()}`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            const payload = await response.json().catch(()=>({}));
            throw new Error(payload?.error || `Failed searching ${provider}`);
        }
        const payload = await response.json();
        const items = Array.isArray(payload?.items) ? payload.items : [];
        return items;
    }, []);
    const importImageFromUrl = async ()=>{
        setImportingUrl(true);
        setMessage(null);
        try {
            const filenameFromUrl = (()=>{
                try {
                    const decoded = decodeURIComponent(sourceUrl);
                    const raw = decoded.split('/').pop() || '';
                    const sanitized = raw.replace(/[^a-zA-Z0-9._-]+/g, '-');
                    const base = sanitized.replace(/\.[a-zA-Z0-9]+$/, '');
                    if (base) return base;
                } catch  {
                // Ignore filename parsing errors
                }
                return `google-sticker-${Date.now()}`;
            })();
            await importStickerFromRemote(sourceUrl, filenameFromUrl);
            setMessage({
                type: 'success',
                text: 'Image was imported successfully from URL.'
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred while importing URL image.';
            setMessage({
                type: 'error',
                text: errorMessage
            });
        } finally{
            setImportingUrl(false);
        }
    };
    const handleSearchIcons = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setSearchingIcons(true);
        try {
            const items = await searchStickerProvider('iconify', iconQuery.trim() || 'sparkle', 36);
            setIconItems(items);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to search icons.';
            setMessage({
                type: 'error',
                text: errorMessage
            });
        } finally{
            setSearchingIcons(false);
        }
    }, [
        iconQuery,
        searchStickerProvider
    ]);
    const handleSearchEmoji = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setSearchingEmoji(true);
        try {
            const items = await searchStickerProvider(emojiProvider, emojiQuery.trim() || 'party', 72);
            setEmojiItems(items);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to search emoji stickers.';
            setMessage({
                type: 'error',
                text: errorMessage
            });
        } finally{
            setSearchingEmoji(false);
        }
    }, [
        emojiProvider,
        emojiQuery,
        searchStickerProvider
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (sourceTab === 'icon' && iconItems.length === 0 && !searchingIcons) {
            void handleSearchIcons();
        }
    }, [
        sourceTab,
        iconItems.length,
        searchingIcons,
        handleSearchIcons
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (sourceTab === 'emoji' && emojiItems.length === 0 && !searchingEmoji) {
            void handleSearchEmoji();
        }
    }, [
        sourceTab,
        emojiItems.length,
        searchingEmoji,
        handleSearchEmoji
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (sourceTab !== 'emoji') return;
        setEmojiItems([]);
        void handleSearchEmoji();
    }, [
        emojiProvider,
        sourceTab,
        handleSearchEmoji
    ]);
    const handleImportProviderItem = async (item)=>{
        setImportingRemoteId(item.id);
        setMessage(null);
        try {
            await importStickerFromRemote(item.sourceUrl, item.name);
            setMessage({
                type: 'success',
                text: `${item.name} imported from ${item.provider}.`
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Failed importing ${item.name}.`;
            setMessage({
                type: 'error',
                text: errorMessage
            });
        } finally{
            setImportingRemoteId(null);
        }
    };
    const removeImageBackground = async (src)=>{
        const image = await loadImage(src);
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
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
        return await new Promise((resolve)=>canvas.toBlob(resolve, 'image/png'));
    };
    const toggleRemoveBackground = async ()=>{
        if (!file) {
            setMessage({
                type: 'error',
                text: 'Please choose a sticker file first.'
            });
            return;
        }
        if (bgRemoved) {
            if (!originalFileBeforeBgRemove) {
                setMessage({
                    type: 'error',
                    text: 'Original file is not available for restore.'
                });
                return;
            }
            setFile(originalFileBeforeBgRemove);
            setBgRemoved(false);
            setOriginalFileBeforeBgRemove(null);
            setMessage({
                type: 'success',
                text: 'Original background has been restored.'
            });
            return;
        }
        if (!stickerPreviewUrl) {
            setMessage({
                type: 'error',
                text: 'Sticker preview is not available yet.'
            });
            return;
        }
        setRemoveBgLoading(true);
        setMessage(null);
        try {
            const output = await removeImageBackground(stickerPreviewUrl);
            if (!output) {
                setMessage({
                    type: 'error',
                    text: 'Failed to process background removal.'
                });
                return;
            }
            const baseName = file.name.replace(/\.[^.]+$/, '');
            const processedFile = new File([
                output
            ], `${baseName}-nobg.png`, {
                type: 'image/png'
            });
            setOriginalFileBeforeBgRemove(file);
            setFile(processedFile);
            setBgRemoved(true);
            setMessage({
                type: 'success',
                text: 'Background removal has been applied.'
            });
        } catch  {
            setMessage({
                type: 'error',
                text: 'An error occurred while removing background.'
            });
        } finally{
            setRemoveBgLoading(false);
        }
    };
    const drawAt = (clientX, clientY)=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const point = pointFromEvent(canvas, clientX, clientY);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = brushSize;
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    };
    const hasCanvasInk = ()=>{
        const canvas = canvasRef.current;
        if (!canvas) return false;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for(let i = 3; i < data.length; i += 4){
            if (data[i] > 0) return true;
        }
        return false;
    };
    const hasEditorContent = ()=>hasCanvasInk() || shapes.length > 0;
    const handleCanvasPointerDown = (event)=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        event.preventDefault();
        canvas.setPointerCapture(event.pointerId);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const point = pointFromEvent(canvas, event.clientX, event.clientY);
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        setIsDrawing(true);
    };
    const handleCanvasPointerMove = (event)=>{
        if (!isDrawing) return;
        event.preventDefault();
        drawAt(event.clientX, event.clientY);
    };
    const stopDrawing = (event)=>{
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        event.preventDefault();
        if (canvas.hasPointerCapture(event.pointerId)) {
            canvas.releasePointerCapture(event.pointerId);
        }
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.closePath();
        }
        setIsDrawing(false);
    };
    const clearCanvas = (notify = true)=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setShapes([]);
        setSelectedShapeId(null);
        if (notify) {
            setMessage({
                type: 'success',
                text: 'Canvas has been cleared.'
            });
        }
    };
    const removeSelectedShape = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!selectedShapeId) return;
        setShapes((prev)=>prev.filter((shape)=>shape.id !== selectedShapeId));
        setSelectedShapeId(null);
    }, [
        selectedShapeId
    ]);
    const undoLastShape = ()=>{
        setShapes((prev)=>prev.slice(0, -1));
        setSelectedShapeId(null);
    };
    const addShape = (kind, at)=>{
        const size = Math.max(20, shapeSize);
        const x = clamp(at?.x ?? (CANVAS_SIZE - size) / 2, 0, CANVAS_SIZE - size);
        const y = clamp(at?.y ?? (CANVAS_SIZE - size) / 2, 0, CANVAS_SIZE - size);
        const next = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            kind,
            x,
            y,
            size,
            color: drawColor
        };
        setShapes((prev)=>[
                ...prev,
                next
            ]);
        setSelectedShapeId(next.id);
    };
    const handleShapeDragStart = (kind)=>(event)=>{
            event.dataTransfer.setData(SHAPE_DRAG_TYPE, kind);
            event.dataTransfer.effectAllowed = 'copy';
        };
    const handleCanvasDragOver = (event)=>{
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };
    const handleCanvasDrop = (event)=>{
        event.preventDefault();
        const raw = event.dataTransfer.getData(SHAPE_DRAG_TYPE);
        if (!SHAPE_LIBRARY.some((item)=>item.kind === raw)) return;
        const wrap = canvasWrapRef.current;
        if (!wrap) return;
        const bounds = wrap.getBoundingClientRect();
        const scaleX = CANVAS_SIZE / bounds.width;
        const scaleY = CANVAS_SIZE / bounds.height;
        const size = Math.max(20, shapeSize);
        const x = (event.clientX - bounds.left) * scaleX - size / 2;
        const y = (event.clientY - bounds.top) * scaleY - size / 2;
        addShape(raw, {
            x,
            y
        });
    };
    const handleShapePointerDown = (shapeId)=>(event)=>{
            const wrap = canvasWrapRef.current;
            const shape = shapes.find((item)=>item.id === shapeId);
            if (!wrap || !shape) return;
            event.preventDefault();
            event.stopPropagation();
            const bounds = wrap.getBoundingClientRect();
            const scaleX = CANVAS_SIZE / bounds.width;
            const scaleY = CANVAS_SIZE / bounds.height;
            shapeDragStateRef.current = {
                id: shapeId,
                offsetX: (event.clientX - bounds.left) * scaleX - shape.x,
                offsetY: (event.clientY - bounds.top) * scaleY - shape.y
            };
            setSelectedShapeId(shapeId);
        };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onPointerMove = (event)=>{
            const state = shapeDragStateRef.current;
            const wrap = canvasWrapRef.current;
            if (!state || !wrap) return;
            setShapes((prev)=>prev.map((shape)=>{
                    if (shape.id !== state.id) return shape;
                    const bounds = wrap.getBoundingClientRect();
                    const scaleX = CANVAS_SIZE / bounds.width;
                    const scaleY = CANVAS_SIZE / bounds.height;
                    const x = (event.clientX - bounds.left) * scaleX - state.offsetX;
                    const y = (event.clientY - bounds.top) * scaleY - state.offsetY;
                    return {
                        ...shape,
                        x: clamp(x, 0, CANVAS_SIZE - shape.size),
                        y: clamp(y, 0, CANVAS_SIZE - shape.size)
                    };
                }));
        };
        const stopDrag = ()=>{
            shapeDragStateRef.current = null;
        };
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', stopDrag);
        window.addEventListener('pointercancel', stopDrag);
        return ()=>{
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', stopDrag);
            window.removeEventListener('pointercancel', stopDrag);
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onKeyDown = (event)=>{
            if ((event.key === 'Delete' || event.key === 'Backspace') && selectedShapeId) {
                event.preventDefault();
                removeSelectedShape();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return ()=>window.removeEventListener('keydown', onKeyDown);
    }, [
        selectedShapeId,
        removeSelectedShape
    ]);
    const useCanvasAsStickerFile = async ()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = canvas.width;
        exportCanvas.height = canvas.height;
        const exportCtx = exportCanvas.getContext('2d');
        if (!exportCtx) {
            setMessage({
                type: 'error',
                text: 'Failed to prepare canvas export.'
            });
            return;
        }
        exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
        exportCtx.drawImage(canvas, 0, 0);
        for (const shape of shapes){
            drawShapeOnContext(exportCtx, shape);
        }
        const blob = await new Promise((resolve)=>exportCanvas.toBlob(resolve, 'image/png'));
        if (!blob) {
            setMessage({
                type: 'error',
                text: 'Failed to create sticker from canvas.'
            });
            return;
        }
        const hasInk = blob.size > 1200;
        if (!hasInk) {
            setMessage({
                type: 'error',
                text: 'Canvas is empty. Draw something first before using it as sticker.'
            });
            return;
        }
        const nextName = name.trim() || `drawn-sticker-${Date.now()}`;
        const canvasFile = new File([
            blob
        ], `${nextName}.png`, {
            type: 'image/png'
        });
        setStickerFile(canvasFile, 'canvas');
        setMessage({
            type: 'success',
            text: 'Sticker preview was taken from canvas.'
        });
    };
    const exportEditorToFile = async (fileBaseName)=>{
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = canvas.width;
        exportCanvas.height = canvas.height;
        const exportCtx = exportCanvas.getContext('2d');
        if (!exportCtx) return null;
        exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
        exportCtx.drawImage(canvas, 0, 0);
        for (const shape of shapes){
            drawShapeOnContext(exportCtx, shape);
        }
        const blob = await new Promise((resolve)=>exportCanvas.toBlob(resolve, 'image/png'));
        if (!blob) return null;
        const safeBase = toSafeValue(fileBaseName) || `edited-sticker-${Date.now()}`;
        return new File([
            blob
        ], `${safeBase}.png`, {
            type: 'image/png'
        });
    };
    const handlePasteFromClipboard = async ()=>{
        if (!navigator.clipboard?.read) {
            setMessage({
                type: 'error',
                text: 'This browser does not support image paste from clipboard.'
            });
            return;
        }
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const clipboardItem of clipboardItems){
                const imageType = clipboardItem.types.find((type)=>type.startsWith('image/'));
                if (!imageType) continue;
                const blob = await clipboardItem.getType(imageType);
                const pastedFile = new File([
                    blob
                ], `pasted-sticker-${Date.now()}.png`, {
                    type: blob.type || 'image/png'
                });
                setStickerFile(pastedFile, 'paste');
                return;
            }
            setMessage({
                type: 'error',
                text: 'Clipboard does not contain an image.'
            });
        } catch  {
            setMessage({
                type: 'error',
                text: 'Cannot read image from clipboard.'
            });
        }
    };
    const handleUpload = (event)=>{
        event.preventDefault();
        setMessage(null);
        if (!file && !hasEditorContent()) {
            setMessage({
                type: 'error',
                text: 'Please upload/import an image or draw on canvas first.'
            });
            return;
        }
        setIsSaveConfirmOpen(true);
    };
    const performUpload = async ()=>{
        const formElement = uploadFormRef.current;
        if (!formElement) {
            setMessage({
                type: 'error',
                text: 'Upload form is not ready.'
            });
            return;
        }
        setUploading(true);
        setIsSaveConfirmOpen(false);
        try {
            const resolvedCategory = categoryMode === 'existing' ? selectedCategory : newCategory;
            const safeName = toSafeValue(name) || `sticker_${Date.now()}`;
            const safeCategory = toSafeValue(resolvedCategory) || 'custom';
            const editorFile = await exportEditorToFile(safeName);
            if (!editorFile) {
                setMessage({
                    type: 'error',
                    text: 'Failed to export editor output.'
                });
                return;
            }
            if (!hasEditorContent()) {
                setMessage({
                    type: 'error',
                    text: 'Editor is still empty. Add image, drawing, or shape first.'
                });
                return;
            }
            const formData = new FormData();
            formData.append('file', editorFile);
            formData.append('name', safeName);
            formData.append('category', safeCategory);
            const res = await fetch('/api/upload-sticker', {
                method: 'POST',
                body: formData
            });
            const data = await res.json().catch(()=>({
                    error: 'Invalid server response.'
                }));
            if (!res.ok) {
                setMessage({
                    type: 'error',
                    text: data.error || 'Sticker upload failed.'
                });
                return;
            }
            setMessage({
                type: 'success',
                text: 'Sticker was created successfully.'
            });
            setName('');
            setCategoryMode('existing');
            setSelectedCategory('custom');
            setNewCategory('');
            setFile(null);
            clearCanvas(false);
            formElement.reset();
            window.dispatchEvent(new Event('stickerLibraryUpdated'));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setMessage({
                type: 'error',
                text: `An error occurred while uploading sticker: ${errorMessage}`
            });
        } finally{
            setUploading(false);
        }
    };
    const handleDropSticker = (event)=>{
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (!droppedFile) return;
        setStickerFile(droppedFile, 'drop');
        setIsDraggingSticker(false);
    };
    const selectedShape = shapes.find((shape)=>shape.id === selectedShapeId) || null;
    const filteredShapeLibrary = SHAPE_LIBRARY.filter((item)=>{
        const keyword = shapeSearch.trim().toLowerCase();
        if (!keyword) return true;
        if (item.label.toLowerCase().includes(keyword)) return true;
        return item.keywords.some((entry)=>entry.toLowerCase().includes(keyword));
    });
    const renderShapePreview = (shape)=>{
        const color = shape.color;
        if (shape.kind === 'square') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-full",
            style: {
                backgroundColor: color
            }
        }, void 0, false, {
            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
            lineNumber: 947,
            columnNumber: 41
        }, this);
        if (shape.kind === 'circle') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-full rounded-full",
            style: {
                backgroundColor: color
            }
        }, void 0, false, {
            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
            lineNumber: 948,
            columnNumber: 41
        }, this);
        if (shape.kind === 'triangle') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 100 100",
            className: "w-full h-full",
            "aria-hidden": "true",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: "50,0 100,100 0,100",
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                lineNumber: 949,
                columnNumber: 115
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
            lineNumber: 949,
            columnNumber: 43
        }, this);
        if (shape.kind === 'diamond') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 100 100",
            className: "w-full h-full",
            "aria-hidden": "true",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: "50,0 100,50 50,100 0,50",
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                lineNumber: 950,
                columnNumber: 114
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
            lineNumber: 950,
            columnNumber: 42
        }, this);
        if (shape.kind === 'star') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 100 100",
            className: "w-full h-full",
            "aria-hidden": "true",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: "50,4 61,36 96,36 67,56 78,90 50,70 22,90 33,56 4,36 39,36",
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                lineNumber: 951,
                columnNumber: 111
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
            lineNumber: 951,
            columnNumber: 39
        }, this);
        if (shape.kind === 'pentagon') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 100 100",
            className: "w-full h-full",
            "aria-hidden": "true",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: "50,4 95,38 78,92 22,92 5,38",
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                lineNumber: 952,
                columnNumber: 115
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
            lineNumber: 952,
            columnNumber: 43
        }, this);
        if (shape.kind === 'hexagon') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 100 100",
            className: "w-full h-full",
            "aria-hidden": "true",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: "25,6 75,6 98,50 75,94 25,94 2,50",
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                lineNumber: 953,
                columnNumber: 114
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
            lineNumber: 953,
            columnNumber: 42
        }, this);
        if (shape.kind === 'heart') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 100 100",
            className: "w-full h-full",
            "aria-hidden": "true",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M50 90 C90 62, 96 34, 76 22 C62 14, 53 22, 50 30 C47 22, 38 14, 24 22 C4 34, 10 62, 50 90 Z",
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                lineNumber: 954,
                columnNumber: 112
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
            lineNumber: 954,
            columnNumber: 40
        }, this);
        if (shape.kind === 'plus') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 100 100",
            className: "w-full h-full",
            "aria-hidden": "true",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M38 8 H62 V38 H92 V62 H62 V92 H38 V62 H8 V38 H38 Z",
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                lineNumber: 955,
                columnNumber: 111
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
            lineNumber: 955,
            columnNumber: 39
        }, this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 100 100",
            className: "w-full h-full",
            "aria-hidden": "true",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 70 A20 20 0 1 1 35 36 A20 20 0 1 1 65 36 A18 18 0 1 1 80 70 Z",
                fill: color
            }, void 0, false, {
                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                lineNumber: 956,
                columnNumber: 84
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
            lineNumber: 956,
            columnNumber: 12
        }, this);
    };
    if (status === 'loading') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center px-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-600",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                lineNumber: 962,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
            lineNumber: 961,
            columnNumber: 7
        }, this);
    }
    if (!session || session.user.role !== 'ADMIN') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center px-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl sm:text-3xl font-bold text-red-600 mb-4",
                        children: "Access Denied"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                        lineNumber: 971,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm sm:text-base text-gray-600",
                        children: "You need admin privileges to access this page."
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                        lineNumber: 972,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                lineNumber: 970,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
            lineNumber: 969,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-[#fff7fb] via-[#ffeaf4] to-[#fff5fa] py-8 sm:py-12 px-4 sm:px-6 lg:px-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl sm:text-4xl font-bold text-[#4f3040]",
                                    children: "Create New Sticker"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                    lineNumber: 983,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm sm:text-base text-[#705362] mt-1",
                                    children: "Upload a sticker file, or draw directly on canvas and save it to library."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                    lineNumber: 984,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                            lineNumber: 982,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/admin/sticker/list",
                            className: "inline-flex items-center justify-center px-4 py-2 rounded-lg border border-[#e0b1ca] bg-white text-[#5b3b4b] hover:bg-[#fff4f9]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                    className: "w-4 h-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                    lineNumber: 992,
                                    columnNumber: 13
                                }, this),
                                " Open Sticker List"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                            lineNumber: 988,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                    lineNumber: 981,
                    columnNumber: 9
                }, this),
                message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `rounded-lg p-3 text-sm border ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`,
                    children: message.text
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                    lineNumber: 997,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 xl:grid-cols-2 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-[#f3d7e5]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold text-[#4f3040] mb-4",
                                    children: "Sticker Preview"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                    lineNumber: 1010,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl border border-[#ecd4e1] bg-[#fff7fb] p-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            ref: canvasWrapRef,
                                            onDragOver: handleCanvasDragOver,
                                            onDrop: handleCanvasDrop,
                                            className: "relative w-full max-w-[520px] mx-auto aspect-square rounded-lg bg-white border border-[#f0e2e8] overflow-hidden",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                                                    ref: canvasRef,
                                                    width: CANVAS_SIZE,
                                                    height: CANVAS_SIZE,
                                                    onPointerDown: handleCanvasPointerDown,
                                                    onPointerMove: handleCanvasPointerMove,
                                                    onPointerUp: stopDrawing,
                                                    onPointerCancel: stopDrawing,
                                                    className: "absolute inset-0 w-full h-full touch-none cursor-crosshair"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1018,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 pointer-events-none",
                                                    children: shapes.map((shape)=>{
                                                        const isSelected = shape.id === selectedShapeId;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            onPointerDown: handleShapePointerDown(shape.id),
                                                            className: `absolute pointer-events-auto touch-none cursor-move select-none ${isSelected ? 'ring-2 ring-[#fa75aa]' : ''}`,
                                                            style: {
                                                                left: `${shape.x / CANVAS_SIZE * 100}%`,
                                                                top: `${shape.y / CANVAS_SIZE * 100}%`,
                                                                width: `${shape.size / CANVAS_SIZE * 100}%`,
                                                                height: `${shape.size / CANVAS_SIZE * 100}%`
                                                            },
                                                            children: renderShapePreview(shape)
                                                        }, shape.id, false, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1033,
                                                            columnNumber: 23
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1029,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                            lineNumber: 1012,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-[#705362] mt-2",
                                            children: "Preview only: all controls are on the right panel."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                            lineNumber: 1051,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 text-xs text-[#705362] flex flex-wrap gap-x-4 gap-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Total shapes: ",
                                                        shapes.length
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1053,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Brush size: ",
                                                        brushSize,
                                                        "px"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1054,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Selected shape: ",
                                                        selectedShape ? SHAPE_LIBRARY.find((item)=>item.kind === selectedShape.kind)?.label || selectedShape.kind : '-'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1055,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                            lineNumber: 1052,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                    lineNumber: 1011,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                            lineNumber: 1009,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-2xl shadow-lg p-5 sm:p-6 h-fit border border-[#f3d7e5]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold text-[#4f3040] mb-4",
                                    children: "Sticker Settings"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                    lineNumber: 1062,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    ref: uploadFormRef,
                                    onSubmit: handleUpload,
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-xl border border-[#ecd4e1] bg-[#fff9fd] p-3 space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-semibold text-[#5d4150]",
                                                    children: "Editor Controls"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1065,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-lg border border-[#edd2df] bg-white px-3 py-2 text-xs text-[#6d4a5b]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap items-center gap-x-4 gap-y-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Canvas status:",
                                                                    ' ',
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: hasEditorContent() ? 'text-green-700 font-semibold' : 'text-amber-700 font-semibold',
                                                                        children: hasEditorContent() ? 'Ready' : 'Empty'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                        lineNumber: 1070,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                lineNumber: 1068,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Shapes: ",
                                                                    shapes.length
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                lineNumber: 1074,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "File: ",
                                                                    file ? 'Attached' : 'None'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                lineNumber: 1075,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                        lineNumber: 1067,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1066,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-sm text-[#5d4150] font-medium",
                                                            children: [
                                                                "Drawing Color",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "color",
                                                                    value: drawColor,
                                                                    onChange: (event)=>setDrawColor(event.target.value),
                                                                    className: "mt-1 w-full h-10 rounded border border-[#d9c8d1]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1081,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1079,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-sm text-[#5d4150] font-medium",
                                                            children: [
                                                                "Brush Size (",
                                                                brushSize,
                                                                "px)",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: 1,
                                                                    max: 28,
                                                                    value: brushSize,
                                                                    onChange: (event)=>setBrushSize(Number(event.target.value)),
                                                                    className: "mt-3 w-full"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1090,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1088,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-sm text-[#5d4150] font-medium",
                                                            children: [
                                                                "Shape Size (",
                                                                shapeSize,
                                                                "px)",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: 40,
                                                                    max: 260,
                                                                    value: shapeSize,
                                                                    onChange: (event)=>setShapeSize(Number(event.target.value)),
                                                                    className: "mt-3 w-full"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1101,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1099,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1078,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                            className: "w-4 h-4 text-[#8b6778]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1113,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: shapeSearch,
                                                            onChange: (event)=>setShapeSearch(event.target.value),
                                                            placeholder: "Search shapes...",
                                                            className: "w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1114,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1112,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 sm:grid-cols-5 gap-2",
                                                    children: filteredShapeLibrary.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            draggable: true,
                                                            onDragStart: handleShapeDragStart(item.kind),
                                                            onClick: ()=>addShape(item.kind),
                                                            className: "inline-flex items-center justify-center gap-1 rounded-xl border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-xs text-[#6d3f55] hover:bg-[#ffe7f2] active:scale-[0.98] transition",
                                                            children: item.label
                                                        }, item.kind, false, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1124,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1122,
                                                    columnNumber: 17
                                                }, this),
                                                filteredShapeLibrary.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-[#8d6f7d]",
                                                    children: "No shapes matched your search."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1136,
                                                    columnNumber: 55
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>clearCanvas(),
                                                            className: "inline-flex items-center justify-center gap-1 rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__["Eraser"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1144,
                                                                    columnNumber: 21
                                                                }, this),
                                                                " Clear"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1139,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: useCanvasAsStickerFile,
                                                            className: "inline-flex items-center justify-center gap-1 rounded-lg border border-[#e7a0c2] bg-[#f8bfd7] px-3 py-2 text-sm text-[#4a2337] hover:bg-[#f2aacb]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PencilLine$3e$__["PencilLine"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1151,
                                                                    columnNumber: 21
                                                                }, this),
                                                                " Use Canvas"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1146,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: undoLastShape,
                                                            disabled: shapes.length === 0,
                                                            className: "inline-flex items-center justify-center gap-1 rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2] disabled:opacity-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__["Undo2"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1159,
                                                                    columnNumber: 21
                                                                }, this),
                                                                " Undo"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1153,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1138,
                                                    columnNumber: 17
                                                }, this),
                                                selectedShape && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-lg border border-[#ecd4e1] bg-white p-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs text-[#5d4150] font-medium",
                                                            children: [
                                                                "Selected Shape Color",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "color",
                                                                    value: selectedShape.color,
                                                                    onChange: (event)=>{
                                                                        const nextColor = event.target.value;
                                                                        setShapes((prev)=>prev.map((shape)=>shape.id === selectedShape.id ? {
                                                                                    ...shape,
                                                                                    color: nextColor
                                                                                } : shape));
                                                                    },
                                                                    className: "mt-1 w-full h-9 rounded border border-[#d9c8d1]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1167,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1165,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs text-[#5d4150] font-medium",
                                                            children: [
                                                                "Selected Shape Size (",
                                                                Math.round(selectedShape.size),
                                                                "px)",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: 24,
                                                                    max: 320,
                                                                    value: selectedShape.size,
                                                                    onChange: (event)=>{
                                                                        const nextSize = clamp(Number(event.target.value), 24, 320);
                                                                        setShapes((prev)=>prev.map((shape)=>{
                                                                                if (shape.id !== selectedShape.id) return shape;
                                                                                return {
                                                                                    ...shape,
                                                                                    size: nextSize,
                                                                                    x: clamp(shape.x, 0, CANVAS_SIZE - nextSize),
                                                                                    y: clamp(shape.y, 0, CANVAS_SIZE - nextSize)
                                                                                };
                                                                            }));
                                                                    },
                                                                    className: "mt-2 w-full"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1179,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1177,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-end",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: removeSelectedShape,
                                                                className: "w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                        className: "w-4 h-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                        lineNumber: 1207,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    " Delete Shape"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                lineNumber: 1202,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1201,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1164,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                            lineNumber: 1064,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "sticker-name",
                                                    className: "block text-sm font-medium text-[#5d4150] mb-1",
                                                    children: "Sticker Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1215,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "sticker-name",
                                                    type: "text",
                                                    value: name,
                                                    onChange: (event)=>setName(event.target.value),
                                                    placeholder: "example: heart-sparkle",
                                                    className: "w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1218,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] text-[#8d6f7d] mt-1",
                                                    children: [
                                                        "Auto slug: ",
                                                        toSafeValue(name) || '-'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1226,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                            lineNumber: 1214,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "sticker-category",
                                                    className: "block text-sm font-medium text-[#5d4150] mb-1",
                                                    children: "Category"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1230,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: categoryMode,
                                                            onChange: (event)=>setCategoryMode(event.target.value),
                                                            className: "w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "existing",
                                                                    children: "Choose Existing"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1239,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "new",
                                                                    children: "Create New"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1240,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1234,
                                                            columnNumber: 19
                                                        }, this),
                                                        categoryMode === 'existing' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: selectedCategory,
                                                            onChange: (event)=>setSelectedCategory(event.target.value),
                                                            className: "w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]",
                                                            children: existingCategories.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: item,
                                                                    children: item
                                                                }, item, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1250,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1244,
                                                            columnNumber: 21
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "sticker-category",
                                                            type: "text",
                                                            value: newCategory,
                                                            onChange: (event)=>setNewCategory(event.target.value),
                                                            placeholder: "example: graduation",
                                                            className: "w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1256,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1233,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] text-[#8d6f7d] mt-1",
                                                    children: [
                                                        "Final category slug: ",
                                                        toSafeValue(categoryMode === 'existing' ? selectedCategory : newCategory) || '-'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1266,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                            lineNumber: 1229,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "sticker-file",
                                                    className: "block text-sm font-medium text-[#5d4150] mb-1",
                                                    children: "Sticker Source"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1270,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3",
                                                    children: [
                                                        {
                                                            key: 'upload',
                                                            label: 'Upload File'
                                                        },
                                                        {
                                                            key: 'url',
                                                            label: 'Import URL'
                                                        },
                                                        {
                                                            key: 'icon',
                                                            label: 'Search Icon'
                                                        },
                                                        {
                                                            key: 'emoji',
                                                            label: 'Emoji Sticker'
                                                        }
                                                    ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setSourceTab(tab.key),
                                                            className: `rounded-lg border px-3 py-2 text-xs sm:text-sm transition ${sourceTab === tab.key ? 'border-[#d979ab] bg-[#ffddec] text-[#5b3147]' : 'border-[#e7c7d7] bg-white text-[#6d3f55] hover:bg-[#fff5fa]'}`,
                                                            children: tab.label
                                                        }, tab.key, false, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1280,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1273,
                                                    columnNumber: 17
                                                }, this),
                                                sourceTab === 'upload' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            onDragOver: (event)=>{
                                                                event.preventDefault();
                                                                setIsDraggingSticker(true);
                                                            },
                                                            onDragLeave: ()=>setIsDraggingSticker(false),
                                                            onDrop: handleDropSticker,
                                                            onClick: ()=>stickerInputRef.current?.click(),
                                                            className: `w-full rounded-xl border-2 border-dashed px-4 py-5 text-sm cursor-pointer transition ${isDraggingSticker ? 'border-[#d979ab] bg-[#fff0f7]' : 'border-[#d9c8d1] bg-[#fffafc] hover:bg-[#fff3f8]'}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[#5d4150] font-medium",
                                                                    children: "Drag and drop sticker file here"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1311,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-[#8c6b7a] mt-1",
                                                                    children: "or click to choose file"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1312,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-[#6d3f55] mt-2 truncate",
                                                                    children: file ? file.name : 'No file selected yet'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1313,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1297,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: handlePasteFromClipboard,
                                                            className: "mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clipboard$3e$__["Clipboard"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1321,
                                                                    columnNumber: 23
                                                                }, this),
                                                                " Paste Image from Clipboard"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1316,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] text-[#8d6f7d] mt-1",
                                                            children: "Supported format: any image type, up to 5MB."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1323,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1296,
                                                    columnNumber: 19
                                                }, this),
                                                sourceTab === 'url' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl border border-[#ecd4e1] bg-[#fff9fd] p-3 space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            htmlFor: "sticker-url",
                                                            className: "block text-sm font-medium text-[#5d4150]",
                                                            children: "Import Image from URL (Google)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1329,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col sm:flex-row gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    id: "sticker-url",
                                                                    type: "url",
                                                                    value: sourceUrl,
                                                                    onChange: (event)=>setSourceUrl(event.target.value),
                                                                    placeholder: "https://...",
                                                                    className: "flex-1 rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1333,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: importImageFromUrl,
                                                                    disabled: importingUrl,
                                                                    className: "inline-flex items-center justify-center rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2] disabled:opacity-60",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                                                            className: "w-4 h-4 mr-1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                            lineNumber: 1347,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        importingUrl ? 'Fetching...' : 'Fetch URL'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1341,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1332,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] text-[#8d6f7d]",
                                                            children: "Tip: copy image address from Google Images and paste it here."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1351,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1328,
                                                    columnNumber: 19
                                                }, this),
                                                sourceTab === 'icon' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl border border-[#ecd4e1] bg-[#fff9fd] p-3 space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col sm:flex-row gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: iconQuery,
                                                                    onChange: (event)=>setIconQuery(event.target.value),
                                                                    placeholder: "Search Iconify icons",
                                                                    className: "flex-1 rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1358,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: handleSearchIcons,
                                                                    disabled: searchingIcons,
                                                                    className: "inline-flex items-center justify-center rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2] disabled:opacity-60",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                            className: "w-4 h-4 mr-1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                            lineNumber: 1371,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        searchingIcons ? 'Searching...' : 'Search'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1365,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1357,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1",
                                                            children: [
                                                                iconItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleImportProviderItem(item),
                                                                        disabled: importingRemoteId === item.id,
                                                                        className: "rounded-lg border border-[#e7c7d7] bg-white p-2 text-left hover:bg-[#fff5fa] disabled:opacity-60",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "h-16 rounded-md border border-[#f0e2e8] bg-[#fffafb] flex items-center justify-center",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                    src: item.previewUrl,
                                                                                    alt: item.name,
                                                                                    className: "w-11 h-11 object-contain"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                                    lineNumber: 1386,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                                lineNumber: 1384,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "mt-2 text-xs text-[#5d4150] line-clamp-2",
                                                                                children: item.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                                lineNumber: 1388,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, item.id, true, {
                                                                        fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                        lineNumber: 1377,
                                                                        columnNumber: 25
                                                                    }, this)),
                                                                !searchingIcons && iconItems.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "col-span-full text-xs text-[#8d6f7d]",
                                                                    children: "No icons found. Try another keyword."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1392,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1375,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1356,
                                                    columnNumber: 19
                                                }, this),
                                                sourceTab === 'emoji' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl border border-[#ecd4e1] bg-[#fff9fd] p-3 space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "text-xs text-[#5d4150] font-medium",
                                                                    children: [
                                                                        "Emoji Provider",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            value: emojiProvider,
                                                                            onChange: (event)=>setEmojiProvider(event.target.value),
                                                                            className: "mt-1 w-full rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "openmoji",
                                                                                    children: "OpenMoji API (Free)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                                    lineNumber: 1408,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "emojihub",
                                                                                    children: "EmojiHub + Twemoji (Free)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                                    lineNumber: 1409,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                            lineNumber: 1403,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1401,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-[11px] text-[#8d6f7d] self-end rounded-lg border border-[#edd2df] bg-white px-3 py-2",
                                                                    children: emojiProvider === 'openmoji' ? 'Open source emoji from OpenMoji dataset API' : 'EmojiHub API data with Twemoji SVG assets'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1412,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1400,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col sm:flex-row gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: emojiQuery,
                                                                    onChange: (event)=>setEmojiQuery(event.target.value),
                                                                    placeholder: "Search OpenMoji emoji",
                                                                    className: "flex-1 rounded-lg border border-[#d9c8d1] bg-white px-3 py-2 text-sm text-[#4a2337] placeholder:text-[#a48394] focus:outline-none focus:ring-2 focus:ring-[#f2aacb]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1419,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: handleSearchEmoji,
                                                                    disabled: searchingEmoji,
                                                                    className: "inline-flex items-center justify-center rounded-lg border border-[#e7a0c2] bg-[#fff3f9] px-3 py-2 text-sm text-[#6d3f55] hover:bg-[#ffe7f2] disabled:opacity-60",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__["Smile"], {
                                                                            className: "w-4 h-4 mr-1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                            lineNumber: 1432,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        searchingEmoji ? 'Searching...' : 'Search'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1426,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1418,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1",
                                                            children: [
                                                                emojiItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleImportProviderItem(item),
                                                                        disabled: importingRemoteId === item.id,
                                                                        className: "rounded-lg border border-[#e7c7d7] bg-white p-2 text-left hover:bg-[#fff5fa] disabled:opacity-60",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "h-16 rounded-md border border-[#f0e2e8] bg-[#fffafb] flex items-center justify-center",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                    src: item.previewUrl,
                                                                                    alt: item.name,
                                                                                    className: "w-11 h-11 object-contain"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                                    lineNumber: 1447,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                                lineNumber: 1445,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "mt-2 text-xs text-[#5d4150] line-clamp-2",
                                                                                children: item.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                                lineNumber: 1449,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, item.id, true, {
                                                                        fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                        lineNumber: 1438,
                                                                        columnNumber: 25
                                                                    }, this)),
                                                                !searchingEmoji && emojiItems.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "col-span-full text-xs text-[#8d6f7d]",
                                                                    children: "No emoji stickers found. Try another keyword."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                                    lineNumber: 1453,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                            lineNumber: 1436,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1399,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    ref: stickerInputRef,
                                                    id: "sticker-file",
                                                    type: "file",
                                                    accept: "image/*",
                                                    onChange: (event)=>setStickerFile(event.target.files?.[0] || null, 'picker'),
                                                    className: "hidden"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1459,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                            lineNumber: 1269,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[11px] text-[#8d6f7d]",
                                            children: [
                                                "Source provider:",
                                                ' ',
                                                sourceTab === 'icon' ? 'Iconify (free)' : sourceTab === 'emoji' ? emojiProvider === 'openmoji' ? 'OpenMoji API (free)' : 'EmojiHub + Twemoji (free)' : 'Manual import'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                            lineNumber: 1469,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-medium text-[#5d4150] mb-1",
                                                    children: "Selected Sticker File"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1481,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-[#6d3f55] truncate rounded-lg border border-[#ecd4e1] bg-[#fffafc] px-3 py-2",
                                                    children: file ? file.name : 'No file selected yet'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1482,
                                                    columnNumber: 17
                                                }, this),
                                                file && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] text-[#8d6f7d] mt-1",
                                                    children: [
                                                        "Size: ",
                                                        formatFileSize(file.size)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1485,
                                                    columnNumber: 26
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                            lineNumber: 1480,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: toggleRemoveBackground,
                                            disabled: removeBgLoading || !file,
                                            className: "w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#d89bbd] bg-[#ffddec] px-3 py-2 text-sm text-[#5b3147] hover:bg-[#ffcde2] disabled:opacity-60",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WandSparkles$3e$__["WandSparkles"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1494,
                                                    columnNumber: 17
                                                }, this),
                                                removeBgLoading ? 'Processing Remove BG...' : bgRemoved ? 'Restore Background' : 'Remove Background'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                            lineNumber: 1488,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: uploading,
                                            className: "w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#f8bfd7] text-[#4a2337] border border-[#e7a0c2] hover:bg-[#f2aacb] transition disabled:opacity-60",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                    className: "w-4 h-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                                    lineNumber: 1503,
                                                    columnNumber: 17
                                                }, this),
                                                uploading ? 'Uploading...' : 'Save Sticker'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                            lineNumber: 1498,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] text-[#8d6f7d] text-center",
                                            children: "You can save from drawing-only canvas, imported image, or a combination of both."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                            lineNumber: 1506,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                                    lineNumber: 1063,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                            lineNumber: 1061,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                    lineNumber: 1008,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ConfirmDialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    open: isSaveConfirmOpen,
                    title: "Save Sticker",
                    message: "Are you sure you want to save this sticker? The current canvas preview will be used as final output.",
                    confirmLabel: "Yes, Save",
                    cancelLabel: "Cancel",
                    loading: uploading,
                    onCancel: ()=>setIsSaveConfirmOpen(false),
                    onConfirm: ()=>void performUpload()
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/sticker/new/page.tsx",
                    lineNumber: 1513,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/admin/sticker/new/page.tsx",
            lineNumber: 980,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/admin/sticker/new/page.tsx",
        lineNumber: 979,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_c4bd5932._.js.map