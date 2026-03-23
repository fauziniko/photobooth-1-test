module.exports = [
"[project]/components/CropModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CropModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-cw.js [app-ssr] (ecmascript) <export default as RotateCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-in.js [app-ssr] (ecmascript) <export default as ZoomIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-out.js [app-ssr] (ecmascript) <export default as ZoomOut>");
'use client';
;
;
;
function CropModal({ isOpen, onClose, imageUrl, onSave, photoIndex }) {
    const theme = {
        primary: '#fa75aa',
        primaryDark: '#d72688',
        borderSoft: '#f3b7d1',
        surface: '#fff7fb'
    };
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const imageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [zoom, setZoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [rotation, setRotation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [aspectRatio, setAspectRatio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('free');
    const [cropBox, setCropBox] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        x: 50,
        y: 50,
        width: 200,
        height: 200
    });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isResizing, setIsResizing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragStart, setDragStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const drawCanvas = ()=>{
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Save context
        ctx.save();
        // Apply transformations
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.scale(zoom, zoom);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        // Draw image
        ctx.drawImage(img, 0, 0, img.width, img.height);
        // Restore context
        ctx.restore();
        // Draw overlay (darkened area outside crop box)
        ctx.fillStyle = 'rgba(250, 117, 170, 0.28)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Clear crop box area
        ctx.clearRect(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
        // Redraw image in crop box area
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.scale(zoom, zoom);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(img, 0, 0, img.width, img.height);
        ctx.restore();
        // Draw crop box border
        ctx.strokeStyle = theme.primaryDark;
        ctx.lineWidth = 2;
        ctx.strokeRect(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
        // Draw corner handles
        const handleSize = 10;
        ctx.fillStyle = theme.primary;
        // Top-left
        ctx.fillRect(cropBox.x - handleSize / 2, cropBox.y - handleSize / 2, handleSize, handleSize);
        // Top-right
        ctx.fillRect(cropBox.x + cropBox.width - handleSize / 2, cropBox.y - handleSize / 2, handleSize, handleSize);
        // Bottom-left
        ctx.fillRect(cropBox.x - handleSize / 2, cropBox.y + cropBox.height - handleSize / 2, handleSize, handleSize);
        // Bottom-right
        ctx.fillRect(cropBox.x + cropBox.width - handleSize / 2, cropBox.y + cropBox.height - handleSize / 2, handleSize, handleSize);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen) return;
        const img = new Image();
        img.src = imageUrl;
        img.onload = ()=>{
            imageRef.current = img;
            drawCanvas();
            // Initialize crop box to center of image
            const canvas = canvasRef.current;
            if (canvas) {
                const boxWidth = Math.min(img.width * 0.7, 300);
                const boxHeight = Math.min(img.height * 0.7, 300);
                setCropBox({
                    x: (img.width - boxWidth) / 2,
                    y: (img.height - boxHeight) / 2,
                    width: boxWidth,
                    height: boxHeight
                });
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isOpen,
        imageUrl
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        zoom,
        rotation,
        cropBox
    ]);
    const handleMouseDown = (e)=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        const handleSize = 10;
        // Check if clicking on corner handles
        if (Math.abs(x - cropBox.x) < handleSize && Math.abs(y - cropBox.y) < handleSize) {
            setIsResizing('top-left');
        } else if (Math.abs(x - (cropBox.x + cropBox.width)) < handleSize && Math.abs(y - cropBox.y) < handleSize) {
            setIsResizing('top-right');
        } else if (Math.abs(x - cropBox.x) < handleSize && Math.abs(y - (cropBox.y + cropBox.height)) < handleSize) {
            setIsResizing('bottom-left');
        } else if (Math.abs(x - (cropBox.x + cropBox.width)) < handleSize && Math.abs(y - (cropBox.y + cropBox.height)) < handleSize) {
            setIsResizing('bottom-right');
        } else if (x >= cropBox.x && x <= cropBox.x + cropBox.width && y >= cropBox.y && y <= cropBox.y + cropBox.height) {
            // Inside crop box - drag
            setIsDragging(true);
        }
        setDragStart({
            x,
            y
        });
    };
    const handleMouseMove = (e)=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        const dx = x - dragStart.x;
        const dy = y - dragStart.y;
        if (isDragging) {
            setCropBox((prev)=>({
                    ...prev,
                    x: Math.max(0, Math.min(canvas.width - prev.width, prev.x + dx)),
                    y: Math.max(0, Math.min(canvas.height - prev.height, prev.y + dy))
                }));
            setDragStart({
                x,
                y
            });
        } else if (isResizing) {
            const newBox = {
                ...cropBox
            };
            switch(isResizing){
                case 'top-left':
                    newBox.width = Math.max(50, cropBox.width - dx);
                    newBox.height = Math.max(50, cropBox.height - dy);
                    newBox.x = cropBox.x + dx;
                    newBox.y = cropBox.y + dy;
                    break;
                case 'top-right':
                    newBox.width = Math.max(50, cropBox.width + dx);
                    newBox.height = Math.max(50, cropBox.height - dy);
                    newBox.y = cropBox.y + dy;
                    break;
                case 'bottom-left':
                    newBox.width = Math.max(50, cropBox.width - dx);
                    newBox.height = Math.max(50, cropBox.height + dy);
                    newBox.x = cropBox.x + dx;
                    break;
                case 'bottom-right':
                    newBox.width = Math.max(50, cropBox.width + dx);
                    newBox.height = Math.max(50, cropBox.height + dy);
                    break;
            }
            // Apply aspect ratio constraint
            if (aspectRatio !== 'free') {
                const ratios = {
                    '1:1': 1,
                    '4:3': 4 / 3,
                    '16:9': 16 / 9
                };
                const ratio = ratios[aspectRatio];
                newBox.height = newBox.width / ratio;
            }
            setCropBox(newBox);
            setDragStart({
                x,
                y
            });
        }
    };
    const handleMouseUp = ()=>{
        setIsDragging(false);
        setIsResizing(null);
    };
    const handleSave = ()=>{
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;
        // Create a new canvas for the cropped image
        const croppedCanvas = document.createElement('canvas');
        const ctx = croppedCanvas.getContext('2d');
        if (!ctx) return;
        croppedCanvas.width = cropBox.width;
        croppedCanvas.height = cropBox.height;
        // Draw the cropped portion
        ctx.save();
        ctx.translate(croppedCanvas.width / 2, croppedCanvas.height / 2);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.scale(zoom, zoom);
        ctx.translate(-cropBox.x - cropBox.width / 2, -cropBox.y - cropBox.height / 2);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
        // Convert to data URL
        const croppedImageUrl = croppedCanvas.toDataURL('image/png');
        onSave(croppedImageUrl);
        onClose();
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pb-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "pb-modal-shell max-w-[98vw] sm:max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between p-4 border-b",
                    style: {
                        borderColor: theme.borderSoft,
                        background: theme.surface
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg sm:text-xl font-semibold",
                            style: {
                                color: theme.primaryDark
                            },
                            children: [
                                "Crop Photo ",
                                photoIndex + 1
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CropModal.tsx",
                            lineNumber: 259,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-2 rounded-lg transition hover:bg-[#ffeaf3]",
                            style: {
                                color: theme.primaryDark
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/components/CropModal.tsx",
                                lineNumber: 267,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/CropModal.tsx",
                            lineNumber: 262,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CropModal.tsx",
                    lineNumber: 258,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-auto p-2 sm:p-4",
                    style: {
                        backgroundColor: '#fff2f8'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center min-h-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                                ref: canvasRef,
                                className: "max-w-full max-h-full border-2 cursor-move rounded-xl shadow-sm",
                                style: {
                                    borderColor: theme.borderSoft,
                                    backgroundColor: '#fff'
                                },
                                onMouseDown: handleMouseDown,
                                onMouseMove: handleMouseMove,
                                onMouseUp: handleMouseUp,
                                onMouseLeave: handleMouseUp
                            }, void 0, false, {
                                fileName: "[project]/components/CropModal.tsx",
                                lineNumber: 274,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/CropModal.tsx",
                            lineNumber: 273,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-center mt-3",
                            style: {
                                color: '#9f4d74'
                            },
                            children: "Geser kotak untuk memindahkan area crop, tarik sudut untuk mengubah ukuran."
                        }, void 0, false, {
                            fileName: "[project]/components/CropModal.tsx",
                            lineNumber: 284,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CropModal.tsx",
                    lineNumber: 272,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 sm:p-4 border-t bg-white",
                    style: {
                        borderColor: theme.borderSoft
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-semibold mb-2",
                                            style: {
                                                color: theme.primaryDark
                                            },
                                            children: "Aspect Ratio"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CropModal.tsx",
                                            lineNumber: 294,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: aspectRatio,
                                            onChange: (e)=>setAspectRatio(e.target.value),
                                            className: "w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:border-transparent focus:ring-[#fa75aa]",
                                            style: {
                                                borderColor: theme.borderSoft,
                                                color: theme.primaryDark,
                                                boxShadow: 'none'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "free",
                                                    children: "Free"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CropModal.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "1:1",
                                                    children: "1:1 (Square)"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CropModal.tsx",
                                                    lineNumber: 304,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "4:3",
                                                    children: "4:3"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CropModal.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "16:9",
                                                    children: "16:9"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CropModal.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CropModal.tsx",
                                            lineNumber: 297,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CropModal.tsx",
                                    lineNumber: 293,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-semibold mb-2",
                                            style: {
                                                color: theme.primaryDark
                                            },
                                            children: [
                                                "Zoom: ",
                                                zoom.toFixed(1),
                                                "x"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CropModal.tsx",
                                            lineNumber: 312,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setZoom(Math.max(0.5, zoom - 0.1)),
                                                    disabled: zoom <= 0.5,
                                                    className: "p-2 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed",
                                                    style: {
                                                        backgroundColor: '#ffe4ef',
                                                        color: theme.primaryDark
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__["ZoomOut"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CropModal.tsx",
                                                        lineNumber: 322,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CropModal.tsx",
                                                    lineNumber: 316,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "range",
                                                    min: "0.5",
                                                    max: "3",
                                                    step: "0.1",
                                                    value: zoom,
                                                    onChange: (e)=>setZoom(Number(e.target.value)),
                                                    className: "flex-1",
                                                    style: {
                                                        accentColor: theme.primary
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CropModal.tsx",
                                                    lineNumber: 324,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setZoom(Math.min(3, zoom + 0.1)),
                                                    disabled: zoom >= 3,
                                                    className: "p-2 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed",
                                                    style: {
                                                        backgroundColor: '#ffe4ef',
                                                        color: theme.primaryDark
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__["ZoomIn"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CropModal.tsx",
                                                        lineNumber: 340,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CropModal.tsx",
                                                    lineNumber: 334,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CropModal.tsx",
                                            lineNumber: 315,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CropModal.tsx",
                                    lineNumber: 311,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-semibold mb-2",
                                            style: {
                                                color: theme.primaryDark
                                            },
                                            children: [
                                                "Rotation: ",
                                                rotation,
                                                "°"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CropModal.tsx",
                                            lineNumber: 347,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setRotation((rotation - 90) % 360),
                                                    className: "flex-1 px-3 py-2 rounded-lg transition text-sm font-semibold",
                                                    style: {
                                                        backgroundColor: '#ffe4ef',
                                                        color: theme.primaryDark
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__["RotateCw"], {
                                                            className: "w-4 h-4 inline mr-1 transform rotate-180"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CropModal.tsx",
                                                            lineNumber: 356,
                                                            columnNumber: 19
                                                        }, this),
                                                        " -90°"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CropModal.tsx",
                                                    lineNumber: 351,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setRotation((rotation + 90) % 360),
                                                    className: "flex-1 px-3 py-2 rounded-lg transition text-sm font-semibold",
                                                    style: {
                                                        backgroundColor: '#ffe4ef',
                                                        color: theme.primaryDark
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__["RotateCw"], {
                                                            className: "w-4 h-4 inline mr-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CropModal.tsx",
                                                            lineNumber: 363,
                                                            columnNumber: 19
                                                        }, this),
                                                        " +90°"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CropModal.tsx",
                                                    lineNumber: 358,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CropModal.tsx",
                                            lineNumber: 350,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CropModal.tsx",
                                    lineNumber: 346,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CropModal.tsx",
                            lineNumber: 291,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "w-full sm:w-auto px-6 py-2.5 font-semibold rounded-lg transition",
                                    style: {
                                        backgroundColor: '#ffe4ef',
                                        color: theme.primaryDark
                                    },
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/components/CropModal.tsx",
                                    lineNumber: 371,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSave,
                                    className: "w-full sm:w-auto px-6 py-2.5 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg",
                                    style: {
                                        background: `linear-gradient(90deg, ${theme.primaryDark}, ${theme.primary})`
                                    },
                                    children: "Save Cropped Image"
                                }, void 0, false, {
                                    fileName: "[project]/components/CropModal.tsx",
                                    lineNumber: 378,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CropModal.tsx",
                            lineNumber: 370,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CropModal.tsx",
                    lineNumber: 290,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/CropModal.tsx",
            lineNumber: 256,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/CropModal.tsx",
        lineNumber: 255,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/PhotoPreview.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PhotoPreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
;
;
;
const TEMPLATE_CANVAS = {
    padding: 20,
    gap: 8,
    photoWidth: 240,
    photoHeight: 180,
    photoCount: 4,
    bottomSpace: 0,
    frameBorderRadius: 0,
    photoBorderRadius: 0
};
const TEMPLATE_STRIP_WIDTH = TEMPLATE_CANVAS.padding * 2 + TEMPLATE_CANVAS.photoWidth;
const TEMPLATE_STRIP_HEIGHT = TEMPLATE_CANVAS.padding * 2 + TEMPLATE_CANVAS.photoHeight * TEMPLATE_CANVAS.photoCount + TEMPLATE_CANVAS.gap * (TEMPLATE_CANVAS.photoCount - 1);
const PHOTO_PAN_SCALE = 1.18;
const TEMPLATE_SLOT_PAN_SCALE = 1;
function PhotoPreview({ photos, filter, frameColor, bottomSpace, frameBorderRadius, photoBorderRadius, stickers = [], onMoveSticker, onResizeSticker, onRotateSticker, onDeleteSticker, gap = 8, frameTemplates, selectedFrameTemplate, selectedTemplateSettings, onRetake, onCrop }) {
    const [dragIdx, setDragIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [resizeIdx, setResizeIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [touchOffset, setTouchOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [resizeStart, setResizeStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [photoPanOffsets, setPhotoPanOffsets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const photoDragState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Untuk long press
    const longPressTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const movedDuringResize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Untuk menghapus stiker
    const handleDeleteSticker = (idx)=>{
        if (!onDeleteSticker) return;
        onDeleteSticker(idx);
    };
    const getLogicalScale = (rect)=>{
        const scaleX = rect.width > 0 ? effectiveStripWidth / rect.width : 1;
        const scaleY = rect.height > 0 ? effectiveStripHeight / rect.height : 1;
        return {
            scaleX: Number.isFinite(scaleX) && scaleX > 0 ? scaleX : 1,
            scaleY: Number.isFinite(scaleY) && scaleY > 0 ? scaleY : 1
        };
    };
    // Mouse resize
    const handleResizeMouseDown = (idx)=>(e)=>{
            e.stopPropagation();
            setResizeIdx(idx);
            setResizeStart({
                startX: e.clientX,
                startY: e.clientY,
                startSize: stickers[idx]?.size ?? 48
            });
            movedDuringResize.current = false;
            longPressTimeout.current = setTimeout(()=>{
                if (!movedDuringResize.current) {
                    handleDeleteSticker(idx);
                    setResizeIdx(null);
                    setResizeStart(null);
                }
            }, 700);
        };
    // Touch resize
    const handleResizeTouchStart = (idx)=>(e)=>{
            e.stopPropagation();
            const touch = e.touches[0];
            setResizeIdx(idx);
            setResizeStart({
                startX: touch.clientX,
                startY: touch.clientY,
                startSize: stickers[idx]?.size ?? 48
            });
            movedDuringResize.current = false;
            longPressTimeout.current = setTimeout(()=>{
                if (!movedDuringResize.current) {
                    handleDeleteSticker(idx);
                    setResizeIdx(null);
                    setResizeStart(null);
                }
            }, 700);
        };
    // Mouse/touch move: resize
    const handleMouseMove = (e)=>{
        // Resize
        if (resizeIdx !== null && onResizeSticker && resizeStart) {
            movedDuringResize.current = true;
            if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
            const rect = e.currentTarget.querySelector('#strip')?.getBoundingClientRect();
            if (!rect) return;
            const { scaleX, scaleY } = getLogicalScale(rect);
            const deltaScale = (scaleX + scaleY) / 2;
            const dx = e.clientX - resizeStart.startX;
            const dy = e.clientY - resizeStart.startY;
            const delta = Math.max(dx, dy);
            let newSize = Math.max(24, Math.min(200, resizeStart.startSize + delta * deltaScale));
            const sticker = stickers[resizeIdx];
            if (sticker) {
                // Batasi agar stiker tidak keluar frame
                newSize = Math.min(newSize, effectiveStripWidth - sticker.x, effectiveStripHeight - sticker.y);
            }
            onResizeSticker(resizeIdx, newSize);
        }
        // Drag
        if (dragIdx !== null && onMoveSticker) {
            const rect = e.currentTarget.querySelector('#strip')?.getBoundingClientRect();
            if (!rect) return;
            const { scaleX, scaleY } = getLogicalScale(rect);
            const size = stickers[dragIdx]?.size ?? 48;
            let x = (e.clientX - rect.left) * scaleX - size / 2;
            let y = (e.clientY - rect.top) * scaleY - size / 2;
            // Batasi agar stiker tidak keluar frame (tidak boleh negatif, tidak boleh lebih dari sisi frame)
            x = Math.max(0, Math.min(x, effectiveStripWidth - size));
            y = Math.max(0, Math.min(y, effectiveStripHeight - size));
            onMoveSticker(dragIdx, x, y);
        }
    };
    const handleTouchMove = (e)=>{
        // Resize
        if (resizeIdx !== null && onResizeSticker && resizeStart) {
            movedDuringResize.current = true;
            if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
            const rect = e.currentTarget.querySelector('#strip')?.getBoundingClientRect();
            if (!rect) return;
            const { scaleX, scaleY } = getLogicalScale(rect);
            const deltaScale = (scaleX + scaleY) / 2;
            const touch = e.touches[0];
            const dx = touch.clientX - resizeStart.startX;
            const dy = touch.clientY - resizeStart.startY;
            const delta = Math.max(dx, dy);
            let newSize = Math.max(24, Math.min(200, resizeStart.startSize + delta * deltaScale));
            const sticker = stickers[resizeIdx];
            if (sticker) {
                // Batasi agar stiker tidak keluar frame
                newSize = Math.min(newSize, effectiveStripWidth - sticker.x, effectiveStripHeight - sticker.y);
            }
            onResizeSticker(resizeIdx, newSize);
        }
        // Drag
        if (dragIdx !== null && onMoveSticker && touchOffset) {
            const rect = e.currentTarget.querySelector('#strip')?.getBoundingClientRect();
            if (!rect) return;
            const { scaleX, scaleY } = getLogicalScale(rect);
            const touch = e.touches[0];
            const size = stickers[dragIdx]?.size ?? 48;
            let x = (touch.clientX - rect.left) * scaleX - touchOffset.x;
            let y = (touch.clientY - rect.top) * scaleY - touchOffset.y;
            // Batasi agar stiker tidak keluar frame (tidak boleh negatif, tidak boleh lebih dari sisi frame)
            x = Math.max(0, Math.min(x, effectiveStripWidth - size));
            y = Math.max(0, Math.min(y, effectiveStripHeight - size));
            onMoveSticker(dragIdx, x, y);
        }
    };
    // Mouse/touch up: resetx
    const handleMouseUp = ()=>{
        if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
        setDragIdx(null);
        setResizeIdx(null);
        setResizeStart(null);
    };
    const handleTouchEnd = ()=>{
        if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
        setDragIdx(null);
        setTouchOffset(null);
        setResizeIdx(null);
        setResizeStart(null);
    };
    const handlePhotoDragMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        const state = photoDragState.current;
        if (!state) return;
        const dx = event.clientX - state.startX;
        const dy = event.clientY - state.startY;
        const nextX = Math.max(-state.maxX, Math.min(state.maxX, state.originX + dx));
        const nextY = Math.max(-state.maxY, Math.min(state.maxY, state.originY + dy));
        setPhotoPanOffsets((prev)=>({
                ...prev,
                [state.idx]: {
                    x: nextX,
                    y: nextY
                }
            }));
    }, []);
    const stopPhotoDrag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        photoDragState.current = null;
        window.removeEventListener('pointermove', handlePhotoDragMove);
        window.removeEventListener('pointerup', stopPhotoDrag);
        window.removeEventListener('pointercancel', stopPhotoDrag);
    }, [
        handlePhotoDragMove
    ]);
    const startPhotoDrag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((idx, slot)=>(event)=>{
            if (!slot) return;
            if (event.target.closest('.frame-action-controls')) return;
            const scale = TEMPLATE_SLOT_PAN_SCALE;
            if (scale <= 1) return;
            event.preventDefault();
            const current = photoPanOffsets[idx] ?? {
                x: 0,
                y: 0
            };
            const maxX = Math.max(0, (slot.width * scale - slot.width) / 2);
            const maxY = Math.max(0, (slot.height * scale - slot.height) / 2);
            photoDragState.current = {
                idx,
                startX: event.clientX,
                startY: event.clientY,
                originX: current.x,
                originY: current.y,
                maxX,
                maxY
            };
            window.addEventListener('pointermove', handlePhotoDragMove);
            window.addEventListener('pointerup', stopPhotoDrag);
            window.addEventListener('pointercancel', stopPhotoDrag);
        }, [
        handlePhotoDragMove,
        photoPanOffsets,
        stopPhotoDrag
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            stopPhotoDrag();
        };
    }, [
        stopPhotoDrag
    ]);
    // Drag sticker (move)
    const handleMouseDown = (idx)=>(e)=>{
            if (e.target.classList.contains('resize-handle')) return;
            setDragIdx(idx);
        };
    const handleTouchStart = (idx)=>(e)=>{
            if (e.target.classList.contains('resize-handle')) return;
            setDragIdx(idx);
            const rect = e.target.closest('#strip')?.getBoundingClientRect();
            if (!rect) return;
            const { scaleX, scaleY } = getLogicalScale(rect);
            const touch = e.touches[0];
            const sticker = stickers[idx];
            setTouchOffset({
                x: (touch.clientX - rect.left) * scaleX - sticker.x,
                y: (touch.clientY - rect.top) * scaleY - sticker.y
            });
        };
    // Cari sticker url dari template yang dipilih
    const selectedTemplate = frameTemplates.find((t)=>t.name === selectedFrameTemplate);
    const stickerUrl = selectedTemplate?.sticker;
    const isTemplateMode = selectedFrameTemplate !== 'none' && Boolean(selectedTemplate?.src);
    const templateSettings = selectedTemplateSettings ?? selectedTemplate?.settings ?? null;
    const normalizeTemplateSlot = (value)=>{
        const x = Number(value?.x);
        const y = Number(value?.y);
        const width = Number(value?.width);
        const height = Number(value?.height);
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) {
            return null;
        }
        if (width <= 0 || height <= 0) return null;
        return {
            x,
            y,
            width,
            height
        };
    };
    const templateSlots = Array.isArray(templateSettings?.photoSlots) ? templateSettings.photoSlots.map((slot)=>normalizeTemplateSlot(slot)).filter((slot)=>Boolean(slot)) : [];
    // Template admin dibuat dengan ukuran canvas tetap, jadi preview perlu ikut ukuran itu agar slot foto sejajar.
    const effectiveGap = isTemplateMode ? Number(templateSettings?.gap ?? TEMPLATE_CANVAS.gap) : gap;
    const effectiveBottomSpace = isTemplateMode ? Number(templateSettings?.bottomSpace ?? TEMPLATE_CANVAS.bottomSpace) : bottomSpace;
    const effectiveStripPadding = isTemplateMode ? Number(templateSettings?.padding ?? TEMPLATE_CANVAS.padding) : 20;
    const effectivePhotoWidth = isTemplateMode ? Number(templateSettings?.photoWidth ?? TEMPLATE_CANVAS.photoWidth) : 240;
    const effectivePhotoHeight = isTemplateMode ? Number(templateSettings?.photoHeight ?? TEMPLATE_CANVAS.photoHeight) : 180;
    const effectiveFrameBorderRadius = isTemplateMode ? Number(templateSettings?.frameBorderRadius ?? TEMPLATE_CANVAS.frameBorderRadius) : frameBorderRadius;
    const effectivePhotoBorderRadius = isTemplateMode ? Number(templateSettings?.photoBorderRadius ?? TEMPLATE_CANVAS.photoBorderRadius) : photoBorderRadius;
    const effectiveStripWidth = isTemplateMode ? Number(templateSettings?.canvasWidth ?? TEMPLATE_STRIP_WIDTH) : effectivePhotoWidth + effectiveStripPadding * 2;
    const effectiveStripHeight = isTemplateMode ? Number(templateSettings?.canvasHeight ?? TEMPLATE_STRIP_HEIGHT) : effectiveStripPadding * 2 + photos.length * effectivePhotoHeight + Math.max(0, photos.length - 1) * effectiveGap + effectiveBottomSpace;
    const fallbackTemplateSlots = isTemplateMode ? Array.from({
        length: Math.max(photos.length, Number(templateSettings?.slotCount ?? photos.length))
    }, (_, index)=>{
        const x = (effectiveStripWidth - effectivePhotoWidth) / 2;
        const y = effectiveStripPadding + index * (effectivePhotoHeight + effectiveGap);
        return {
            x: Math.max(0, Math.round(x)),
            y: Math.max(0, Math.round(y)),
            width: Math.round(effectivePhotoWidth),
            height: Math.round(effectivePhotoHeight)
        };
    }) : [];
    const effectiveTemplateSlots = templateSlots.length > 0 ? templateSlots : fallbackTemplateSlots;
    const hasTemplateSlots = isTemplateMode && effectiveTemplateSlots.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: effectiveGap,
            alignItems: 'center',
            width: '100%'
        },
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        onTouchCancel: handleTouchEnd,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            id: "strip",
            "data-render-width": Math.round(effectiveStripWidth),
            "data-render-height": Math.round(effectiveStripHeight),
            style: {
                backgroundColor: frameColor,
                padding: effectiveStripPadding,
                borderRadius: effectiveFrameBorderRadius,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: effectiveGap,
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                width: effectiveStripWidth,
                height: effectiveStripHeight,
                maxWidth: '90vw',
                position: 'relative',
                overflow: 'hidden'
            },
            children: [
                selectedFrameTemplate !== 'none' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        zIndex: 0
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: selectedTemplate?.src || '',
                        alt: "Frame Template",
                        style: {
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            pointerEvents: 'none',
                            userSelect: 'none'
                        },
                        draggable: false
                    }, void 0, false, {
                        fileName: "[project]/components/PhotoPreview.tsx",
                        lineNumber: 445,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/PhotoPreview.tsx",
                    lineNumber: 436,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        position: hasTemplateSlots ? 'absolute' : 'relative',
                        inset: hasTemplateSlots ? 0 : undefined,
                        zIndex: 1,
                        width: '100%',
                        height: hasTemplateSlots ? '100%' : undefined,
                        display: hasTemplateSlots ? 'block' : 'flex',
                        flexDirection: hasTemplateSlots ? undefined : 'column',
                        gap: hasTemplateSlots ? undefined : effectiveGap,
                        alignItems: hasTemplateSlots ? undefined : 'center'
                    },
                    children: photos.map((src, i)=>{
                        const slot = effectiveTemplateSlots[i];
                        const hasSlot = Boolean(slot);
                        const photoOffset = photoPanOffsets[i] ?? {
                            x: 0,
                            y: 0
                        };
                        const slotPhotoScale = hasSlot ? TEMPLATE_SLOT_PAN_SCALE : PHOTO_PAN_SCALE;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: hasSlot ? {
                                position: 'absolute',
                                left: slot.x,
                                top: slot.y,
                                width: slot.width,
                                height: slot.height,
                                overflow: 'hidden',
                                cursor: slotPhotoScale > 1 ? 'grab' : 'default',
                                touchAction: 'none'
                            } : {
                                position: 'relative',
                                width: effectivePhotoWidth,
                                height: effectivePhotoHeight,
                                margin: '0 auto'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: src,
                                    alt: `photo-${i}`,
                                    width: hasSlot ? slot.width : effectivePhotoWidth,
                                    height: hasSlot ? slot.height : effectivePhotoHeight,
                                    onPointerDown: hasSlot ? startPhotoDrag(i, slot) : undefined,
                                    style: {
                                        filter,
                                        objectFit: 'cover',
                                        position: hasSlot ? 'absolute' : 'relative',
                                        left: hasSlot ? '50%' : undefined,
                                        top: hasSlot ? '50%' : undefined,
                                        width: hasSlot ? `${slotPhotoScale * 100}%` : undefined,
                                        height: hasSlot ? `${slotPhotoScale * 100}%` : undefined,
                                        transform: hasSlot ? `translate(calc(-50% + ${photoOffset.x}px), calc(-50% + ${photoOffset.y}px))` : undefined,
                                        borderRadius: effectivePhotoBorderRadius,
                                        display: 'block',
                                        zIndex: 1
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/PhotoPreview.tsx",
                                    lineNumber: 504,
                                    columnNumber: 15
                                }, this),
                                (onRetake || onCrop) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "frame-action-controls",
                                    style: {
                                        position: 'absolute',
                                        top: 6,
                                        right: 6,
                                        display: 'flex',
                                        gap: 6,
                                        zIndex: 2
                                    },
                                    children: [
                                        onCrop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "frame-action-control",
                                            onClick: ()=>onCrop(i),
                                            style: {
                                                background: '#fff',
                                                border: '1.5px solid #fa75aa',
                                                borderRadius: '50%',
                                                width: 22,
                                                height: 22,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 1px 4px #fa75aa22',
                                                padding: 0
                                            },
                                            title: "Crop Photo",
                                            "aria-label": "Crop Photo",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "13",
                                                height: "13",
                                                viewBox: "0 0 20 20",
                                                fill: "none",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M6 4V14.5A1.5 1.5 0 0 0 7.5 16H16",
                                                        stroke: "#d72688",
                                                        strokeWidth: "1.7",
                                                        strokeLinecap: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/PhotoPreview.tsx",
                                                        lineNumber: 559,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M4 6H14.5A1.5 1.5 0 0 1 16 7.5V10",
                                                        stroke: "#d72688",
                                                        strokeWidth: "1.7",
                                                        strokeLinecap: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/PhotoPreview.tsx",
                                                        lineNumber: 560,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/PhotoPreview.tsx",
                                                lineNumber: 558,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/PhotoPreview.tsx",
                                            lineNumber: 539,
                                            columnNumber: 21
                                        }, this),
                                        onRetake && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "frame-action-control",
                                            onClick: ()=>onRetake(i),
                                            style: {
                                                background: '#fff',
                                                border: '1.5px solid #fa75aa',
                                                borderRadius: '50%',
                                                width: 22,
                                                height: 22,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                boxShadow: '0 1px 4px #fa75aa22',
                                                padding: 0
                                            },
                                            title: "Retake Photo",
                                            "aria-label": "Retake Photo",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "13",
                                                height: "13",
                                                viewBox: "0 0 20 20",
                                                fill: "none",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M16.5 7.5A6.5 6.5 0 1 0 17 10M16.5 7.5V4M16.5 7.5H13.5",
                                                    stroke: "#d72688",
                                                    strokeWidth: "1.7",
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/PhotoPreview.tsx",
                                                    lineNumber: 587,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/PhotoPreview.tsx",
                                                lineNumber: 586,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/PhotoPreview.tsx",
                                            lineNumber: 566,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/PhotoPreview.tsx",
                                    lineNumber: 527,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/components/PhotoPreview.tsx",
                            lineNumber: 482,
                            columnNumber: 13
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/PhotoPreview.tsx",
                    lineNumber: 463,
                    columnNumber: 9
                }, this),
                stickerUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        zIndex: 3
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: stickerUrl,
                        alt: "Sticker",
                        style: {
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            pointerEvents: 'none',
                            userSelect: 'none'
                        },
                        draggable: false
                    }, void 0, false, {
                        fileName: "[project]/components/PhotoPreview.tsx",
                        lineNumber: 608,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/PhotoPreview.tsx",
                    lineNumber: 599,
                    columnNumber: 11
                }, this),
                stickers.map((sticker, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sticker-handle-group",
                                style: {
                                    position: 'absolute',
                                    left: sticker.x + sticker.size / 2,
                                    top: sticker.y + sticker.size + 8,
                                    transform: 'translateX(-50%)',
                                    zIndex: 31,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 2,
                                    pointerEvents: 'auto',
                                    minWidth: 0,
                                    maxWidth: 'none'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "sticker-handle sticker-rotate",
                                        style: {
                                            width: 22,
                                            height: 22,
                                            borderRadius: '50%',
                                            border: '2px solid #d72688',
                                            background: '#fff',
                                            outline: '2px solid #fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 2,
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                            padding: 0,
                                            zIndex: 1002
                                        },
                                        title: "Putar Kiri",
                                        tabIndex: -1,
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onRotateSticker?.(idx, -15); // putar -15 derajat (kiri)
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "100%",
                                            height: "100%",
                                            viewBox: "0 0 20 20",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M10 4V1L6 5l4 4V6c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5",
                                                fill: "none",
                                                stroke: "#d72688",
                                                strokeWidth: "2",
                                                transform: "scale(-1,1) translate(-20,0)"
                                            }, void 0, false, {
                                                fileName: "[project]/components/PhotoPreview.tsx",
                                                lineNumber: 672,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/PhotoPreview.tsx",
                                            lineNumber: 671,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoPreview.tsx",
                                        lineNumber: 645,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "sticker-handle sticker-rotate",
                                        style: {
                                            width: 22,
                                            height: 22,
                                            borderRadius: '50%',
                                            border: '2px solid #d72688',
                                            background: '#fff',
                                            outline: '2px solid #fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 2,
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                            padding: 0,
                                            zIndex: 1002
                                        },
                                        title: "Putar Kanan",
                                        tabIndex: -1,
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onRotateSticker?.(idx, 15); // putar +15 derajat (kanan)
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "100%",
                                            height: "100%",
                                            viewBox: "0 0 20 20",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M10 4V1L6 5l4 4V6c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5",
                                                fill: "none",
                                                stroke: "#d72688",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/PhotoPreview.tsx",
                                                lineNumber: 703,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/PhotoPreview.tsx",
                                            lineNumber: 702,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoPreview.tsx",
                                        lineNumber: 676,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "sticker-handle sticker-delete",
                                        style: {
                                            width: 22,
                                            height: 22,
                                            borderRadius: '50%',
                                            border: '2px solid #d72688',
                                            background: '#fff',
                                            outline: '2px solid #fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 2,
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                            padding: 0,
                                            zIndex: 1002
                                        },
                                        title: "Delete",
                                        tabIndex: -1,
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onDeleteSticker?.(idx);
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "14",
                                            height: "14",
                                            viewBox: "0 0 20 20",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "5",
                                                    y1: "5",
                                                    x2: "15",
                                                    y2: "15",
                                                    stroke: "#d72688",
                                                    strokeWidth: "2"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/PhotoPreview.tsx",
                                                    lineNumber: 734,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                    x1: "15",
                                                    y1: "5",
                                                    x2: "5",
                                                    y2: "15",
                                                    stroke: "#d72688",
                                                    strokeWidth: "2"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/PhotoPreview.tsx",
                                                    lineNumber: 735,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/PhotoPreview.tsx",
                                            lineNumber: 733,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoPreview.tsx",
                                        lineNumber: 707,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "resize-handle sticker-handle",
                                        style: {
                                            width: 22,
                                            height: 22,
                                            borderRadius: '50%',
                                            border: '1.5px solid #d72688',
                                            background: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'nwse-resize',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                            padding: 0,
                                            touchAction: 'none'
                                        },
                                        onMouseDown: handleResizeMouseDown(idx),
                                        onTouchStart: handleResizeTouchStart(idx),
                                        title: "Resize",
                                        tabIndex: -1,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            width: "14",
                                            height: "14",
                                            viewBox: "0 0 16 16",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                points: "4,12 12,12 12,4",
                                                fill: "none",
                                                stroke: "#d72688",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/PhotoPreview.tsx",
                                                lineNumber: 761,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/PhotoPreview.tsx",
                                            lineNumber: 760,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoPreview.tsx",
                                        lineNumber: 739,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PhotoPreview.tsx",
                                lineNumber: 628,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                src: sticker.src,
                                alt: "",
                                width: sticker.size,
                                height: sticker.size,
                                style: {
                                    position: 'absolute',
                                    left: sticker.x,
                                    top: sticker.y,
                                    cursor: dragIdx === idx ? 'grabbing' : 'move',
                                    zIndex: 10,
                                    userSelect: 'none',
                                    transition: 'width 0.1s, height 0.1s, transform 0.2s',
                                    touchAction: 'none',
                                    pointerEvents: resizeIdx === idx ? 'none' : 'auto',
                                    transform: `rotate(${sticker.rotate ?? 0}deg)`
                                },
                                onMouseDown: handleMouseDown(idx),
                                onTouchStart: handleTouchStart(idx),
                                draggable: false
                            }, void 0, false, {
                                fileName: "[project]/components/PhotoPreview.tsx",
                                lineNumber: 766,
                                columnNumber: 13
                            }, this)
                        ]
                    }, idx, true, {
                        fileName: "[project]/components/PhotoPreview.tsx",
                        lineNumber: 626,
                        columnNumber: 11
                    }, this)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: 200,
                        height: effectiveBottomSpace,
                        background: 'transparent'
                    }
                }, void 0, false, {
                    fileName: "[project]/components/PhotoPreview.tsx",
                    lineNumber: 789,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/PhotoPreview.tsx",
            lineNumber: 414,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/PhotoPreview.tsx",
        lineNumber: 399,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/PhotoEditor.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PhotoEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
;
;
;
const TABS = [
    {
        key: 'color',
        label: 'Color'
    },
    {
        key: 'frame',
        label: 'Frame'
    },
    {
        key: 'sticker',
        label: 'Sticker'
    },
    {
        key: 'adjust',
        label: 'Settings'
    }
];
const PRESET_COLOR_OPTIONS = [
    {
        value: '#FFDCDC',
        label: 'Pastel Pink',
        swatch: '#FFDCDC'
    },
    {
        value: '#FFF2EB',
        label: 'Pastel Peach',
        swatch: '#FFF2EB'
    },
    {
        value: '#FFE8CD',
        label: 'Pastel Yellow',
        swatch: '#FFE8CD'
    },
    {
        value: '#FFD6BA',
        label: 'Pastel Orange',
        swatch: '#FFD6BA'
    },
    {
        value: '#FFE99A',
        label: 'Vintage Yellow',
        swatch: '#FFE99A'
    },
    {
        value: '#FFD586',
        label: 'Vintage Orange',
        swatch: '#FFD586'
    },
    {
        value: '#FFAAAA',
        label: 'Vintage Pink',
        swatch: '#FFAAAA'
    },
    {
        value: '#FF9898',
        label: 'Vintage Red',
        swatch: '#FF9898'
    },
    {
        value: '#309898',
        label: 'Retro Green',
        swatch: '#309898'
    },
    {
        value: '#FF9F00',
        label: 'Retro Orange',
        swatch: '#FF9F00'
    },
    {
        value: '#F4631E',
        label: 'Retro Brown',
        swatch: '#F4631E'
    },
    {
        value: '#CB0404',
        label: 'Retro Red',
        swatch: '#CB0404'
    }
];
function PhotoEditor({ onChangeSlider, sliderValue, onAddSticker, onSelectFrame, selectedFrame, availableFrames, frameBorderRadius, onChangeFrameBorderRadius, photoGap, onChangePhotoGap, photoBorderRadius, onChangePhotoBorderRadius, onResetDefault, frameTemplates, selectedFrameTemplate, onSelectFrameTemplate }) {
    // Ubah 'filter' menjadi 'frame' agar tab default adalah Frame
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('frame');
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [openPicker, setOpenPicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleResize = ()=>{
            setIsMobile(window.innerWidth < 640);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return ()=>window.removeEventListener('resize', handleResize);
    }, []);
    const colorGridCols = isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))';
    const assetGridCols = isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))';
    const allColorOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const optionMap = new Map();
        availableFrames.forEach((frame)=>{
            const value = String(frame.name || '').trim();
            const swatch = String(frame.color || frame.name || '').trim();
            if (!value || !swatch) return;
            optionMap.set(value, {
                value,
                label: frame.label || frame.name || value,
                swatch
            });
        });
        PRESET_COLOR_OPTIONS.forEach((option)=>{
            if (!optionMap.has(option.value)) {
                optionMap.set(option.value, option);
            }
        });
        return Array.from(optionMap.values());
    }, [
        availableFrames
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!openPicker) return;
        const onEscape = (event)=>{
            if (event.key === 'Escape') {
                setOpenPicker(null);
            }
        };
        window.addEventListener('keydown', onEscape);
        return ()=>window.removeEventListener('keydown', onEscape);
    }, [
        openPicker
    ]);
    const isTemplateMode = selectedFrameTemplate !== 'none';
    // Untuk menambah stiker ke list
    // Gabungkan stiker default dan user
    const [minioStickers, setMinioStickers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetch('/api/list-sticker').then((res)=>res.json()).then((data)=>{
            if (data.stickers) {
                setMinioStickers(data.stickers.map((src)=>({
                        src,
                        label: src.split('/').pop() || 'sticker'
                    })));
            }
        });
    }, []);
    const reloadStickers = ()=>{
        fetch('/api/list-sticker').then((res)=>{
            if (!res.ok) {
                console.error('Failed to fetch stickers:', res.status);
                return {
                    stickers: []
                };
            }
            return res.json();
        }).then((data)=>{
            if (data.stickers && Array.isArray(data.stickers)) {
                setMinioStickers(data.stickers.map((src)=>({
                        src,
                        label: src.split('/').pop() || 'sticker'
                    })));
            } else {
                console.error('Invalid sticker data format:', data);
            }
        }).catch((err)=>{
            console.error('Error loading stickers:', err);
        });
    };
    const pickerModal = openPicker ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pb-modal-backdrop fixed inset-0 z-[2147483640] flex items-center justify-center p-4",
        style: {
            zIndex: 2147483640
        },
        onClick: ()=>setOpenPicker(null),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "pb-modal-shell w-full max-w-3xl",
            style: {
                maxHeight: '85vh',
                overflow: 'hidden'
            },
            onClick: (event)=>event.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderBottom: '1px solid #f3b7d1'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                margin: 0,
                                color: '#4a2337',
                                fontWeight: 700,
                                fontSize: 18
                            },
                            children: [
                                openPicker === 'color' && 'All Color Options',
                                openPicker === 'frame' && 'All Frame Options',
                                openPicker === 'sticker' && 'All Sticker Options'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/PhotoEditor.tsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setOpenPicker(null),
                            style: {
                                background: '#fff4fa',
                                color: '#d72688',
                                border: '1px solid #f3b7d1',
                                borderRadius: 8,
                                padding: '6px 12px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            },
                            children: "Close"
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoEditor.tsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/PhotoEditor.tsx",
                    lineNumber: 177,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: 16,
                        overflowY: 'auto',
                        maxHeight: 'calc(85vh - 64px)'
                    },
                    children: [
                        openPicker === 'color' && (allColorOptions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                margin: 0,
                                color: '#7a5b6d'
                            },
                            children: "No color options available yet."
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoEditor.tsx",
                            lineNumber: 210,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(6, minmax(0, 1fr))',
                                gap: 12
                            },
                            children: allColorOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        onSelectFrame(option.value);
                                        setOpenPicker(null);
                                    },
                                    style: {
                                        border: selectedFrame === option.value ? '3px solid #fa75aa' : '1.5px solid #f3b7d1',
                                        borderRadius: 12,
                                        background: '#fff',
                                        padding: '10px 8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 8
                                    },
                                    title: option.label,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                width: 34,
                                                height: 34,
                                                borderRadius: '50%',
                                                background: option.swatch,
                                                border: '1px solid #e7c8d7',
                                                display: 'inline-block'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/PhotoEditor.tsx",
                                            lineNumber: 233,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#5a2a42',
                                                fontSize: 11,
                                                fontWeight: 600,
                                                textAlign: 'center',
                                                lineHeight: 1.2
                                            },
                                            children: option.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/PhotoEditor.tsx",
                                            lineNumber: 243,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, `picker-color-${option.value}`, true, {
                                    fileName: "[project]/components/PhotoEditor.tsx",
                                    lineNumber: 214,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoEditor.tsx",
                            lineNumber: 212,
                            columnNumber: 15
                        }, this)),
                        openPicker === 'frame' && (frameTemplates.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                margin: 0,
                                color: '#7a5b6d'
                            },
                            children: "No frame templates available yet."
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoEditor.tsx",
                            lineNumber: 254,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(5, minmax(0, 1fr))',
                                gap: 12
                            },
                            children: frameTemplates.map((template)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        onSelectFrameTemplate(template.name);
                                        setOpenPicker(null);
                                    },
                                    style: {
                                        border: selectedFrameTemplate === template.name ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                        borderRadius: 12,
                                        padding: 0,
                                        background: '#fff',
                                        cursor: 'pointer',
                                        width: '100%',
                                        aspectRatio: '1 / 1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    },
                                    title: template.label,
                                    children: template.src ? // eslint-disable-next-line @next/next/no-img-element
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: template.src,
                                        alt: template.label,
                                        style: {
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 281,
                                        columnNumber: 23
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: '#d72688',
                                            fontSize: 12
                                        },
                                        children: template.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 283,
                                        columnNumber: 23
                                    }, this)
                                }, `picker-frame-${template.name}`, false, {
                                    fileName: "[project]/components/PhotoEditor.tsx",
                                    lineNumber: 258,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoEditor.tsx",
                            lineNumber: 256,
                            columnNumber: 15
                        }, this)),
                        openPicker === 'sticker' && (minioStickers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                margin: 0,
                                color: '#7a5b6d'
                            },
                            children: "No stickers available yet."
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoEditor.tsx",
                            lineNumber: 293,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(5, minmax(0, 1fr))',
                                gap: 12
                            },
                            children: minioStickers.map((sticker)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        onAddSticker(sticker.src);
                                        setOpenPicker(null);
                                    },
                                    style: {
                                        border: '2px solid #fa75aa33',
                                        borderRadius: 12,
                                        padding: 8,
                                        background: '#fff',
                                        cursor: 'pointer',
                                        width: '100%',
                                        aspectRatio: '1 / 1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 8px #fa75aa11'
                                    },
                                    title: sticker.label,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: sticker.src,
                                        alt: sticker.label,
                                        style: {
                                            width: '90%',
                                            height: '90%',
                                            objectFit: 'contain'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 320,
                                        columnNumber: 21
                                    }, this)
                                }, `picker-sticker-${sticker.src}`, false, {
                                    fileName: "[project]/components/PhotoEditor.tsx",
                                    lineNumber: 297,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoEditor.tsx",
                            lineNumber: 295,
                            columnNumber: 15
                        }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/PhotoEditor.tsx",
                    lineNumber: 207,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/PhotoEditor.tsx",
            lineNumber: 172,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/PhotoEditor.tsx",
        lineNumber: 167,
        columnNumber: 5
    }, this) : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 4px 24px rgba(250,117,170,0.08)',
            maxWidth: 800,
            margin: '0 auto',
            padding: 0,
            overflow: 'hidden',
            width: '100%',
            position: 'relative',
            zIndex: 1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    borderBottom: '1.5px solid #fa75aa22',
                    background: '#ffe4f0',
                    padding: isMobile ? '8px 8px' : '12px 12px',
                    justifyContent: 'center'
                },
                children: TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab(tab.key),
                        style: {
                            flex: 1,
                            padding: '5px 5px',
                            background: activeTab === tab.key ? '#fae0ef' : 'transparent',
                            color: '#d72688',
                            fontWeight: activeTab === tab.key ? 'bold' : 700,
                            border: 'none',
                            fontSize: isMobile ? 13 : 15
                        },
                        children: tab.label
                    }, tab.key, false, {
                        fileName: "[project]/components/PhotoEditor.tsx",
                        lineNumber: 365,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/PhotoEditor.tsx",
                lineNumber: 355,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: isMobile ? 16 : 28,
                    background: '#fff'
                },
                children: [
                    activeTab === 'color' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: 12,
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 600,
                                            color: '#d72688'
                                        },
                                        children: "Choose Frame Color"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 388,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setOpenPicker('color'),
                                        style: {
                                            background: '#fff4fa',
                                            color: '#d72688',
                                            border: '1px solid #f3b7d1',
                                            borderRadius: 10,
                                            padding: '6px 12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: 12
                                        },
                                        title: "Lihat semua color",
                                        children: "Lihat Semua"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 389,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 387,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: colorGridCols,
                                    gap: 10,
                                    marginBottom: 24
                                },
                                children: availableFrames.map((frame)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrame(frame.name),
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: frame.color,
                                            border: selectedFrame === frame.name ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            cursor: 'pointer',
                                            outline: selectedFrame === frame.name ? '2px solid #fff' : 'none'
                                        },
                                        "aria-label": frame.label,
                                        title: frame.label
                                    }, frame.name, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 408,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 406,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontWeight: 500,
                                    color: '#d72688',
                                    marginBottom: 8,
                                    marginTop: 8
                                },
                                children: "Pastel"
                            }, void 0, false, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 426,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: colorGridCols,
                                    gap: 10,
                                    marginBottom: 24
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrame('#FFDCDC'),
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#FFDCDC',
                                            border: selectedFrame === '#FFDCDC' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            cursor: 'pointer',
                                            outline: selectedFrame === '#FFDCDC' ? '2px solid #fff' : 'none'
                                        },
                                        "aria-label": "Pastel Pink",
                                        title: "Pastel Pink"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 435,
                                        columnNumber: 3
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrame('#FFF2EB'),
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#FFF2EB',
                                            border: selectedFrame === '#FFF2EB' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            cursor: 'pointer',
                                            outline: selectedFrame === '#FFF2EB' ? '2px solid #fff' : 'none'
                                        },
                                        "aria-label": "Pastel Peach",
                                        title: "Pastel Peach"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 449,
                                        columnNumber: 3
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrame('#FFE8CD'),
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#FFE8CD',
                                            border: selectedFrame === '#FFE8CD' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            cursor: 'pointer',
                                            outline: selectedFrame === '#FFE8CD' ? '2px solid #fff' : 'none'
                                        },
                                        "aria-label": "Pastel Yellow",
                                        title: "Pastel Yellow"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 463,
                                        columnNumber: 3
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrame('#FFD6BA'),
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#FFD6BA',
                                            border: selectedFrame === '#FFD6BA' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            cursor: 'pointer',
                                            outline: selectedFrame === '#FFD6BA' ? '2px solid #fff' : 'none'
                                        },
                                        "aria-label": "Pastel Orange",
                                        title: "Pastel Orange"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 477,
                                        columnNumber: 3
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 427,
                                columnNumber: 1
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontWeight: 500,
                                    color: '#d72688',
                                    marginBottom: 8,
                                    marginTop: 8
                                },
                                children: "Vintage"
                            }, void 0, false, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 493,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: colorGridCols,
                                    gap: 10,
                                    marginBottom: 24
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrame('#FFE99A'),
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#FFE99A',
                                            border: selectedFrame === '#FFE99A' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            cursor: 'pointer',
                                            outline: selectedFrame === '#FFE99A' ? '2px solid #fff' : 'none'
                                        },
                                        "aria-label": "Vintage Yellow",
                                        title: "Vintage Yellow"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 495,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrame('#FFD586'),
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#FFD586',
                                            border: selectedFrame === '#FFD586' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            cursor: 'pointer',
                                            outline: selectedFrame === '#FFD586' ? '2px solid #fff' : 'none'
                                        },
                                        "aria-label": "Vintage Orange",
                                        title: "Vintage Orange"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 509,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrame('#FFAAAA'),
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#FFAAAA',
                                            border: selectedFrame === '#FFAAAA' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            cursor: 'pointer',
                                            outline: selectedFrame === '#FFAAAA' ? '2px solid #fff' : 'none'
                                        },
                                        "aria-label": "Vintage Pink",
                                        title: "Vintage Pink"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 523,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrame('#FF9898'),
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#FF9898',
                                            border: selectedFrame === '#FF9898' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            cursor: 'pointer',
                                            outline: selectedFrame === '#FF9898' ? '2px solid #fff' : 'none'
                                        },
                                        "aria-label": "Vintage Red",
                                        title: "Vintage Red"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 537,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 494,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontWeight: 500,
                                    color: '#d72688',
                                    marginBottom: 8,
                                    marginTop: 8
                                },
                                children: "Retro"
                            }, void 0, false, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 553,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: colorGridCols,
                                    gap: 10,
                                    marginBottom: 24
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrame('#309898'),
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#309898',
                                            border: selectedFrame === '#309898' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            cursor: 'pointer',
                                            outline: selectedFrame === '#309898' ? '2px solid #fff' : 'none'
                                        },
                                        "aria-label": "Retro Green",
                                        title: "Retro Green"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 555,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrame('#FF9F00'),
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#FF9F00',
                                            border: selectedFrame === '#FF9F00' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            cursor: 'pointer',
                                            outline: selectedFrame === '#FF9F00' ? '2px solid #fff' : 'none'
                                        },
                                        "aria-label": "Retro Orange",
                                        title: "Retro Orange"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 569,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrame('#F4631E'),
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#F4631E',
                                            border: selectedFrame === '#F4631E' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            cursor: 'pointer',
                                            outline: selectedFrame === '#F4631E' ? '2px solid #fff' : 'none'
                                        },
                                        "aria-label": "Retro Brown",
                                        title: "Retro Brown"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 583,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrame('#CB0404'),
                                        style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: '#CB0404',
                                            border: selectedFrame === '#CB0404' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            cursor: 'pointer',
                                            outline: selectedFrame === '#CB0404' ? '2px solid #fff' : 'none'
                                        },
                                        "aria-label": "Retro Red",
                                        title: "Retro Red"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 597,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 554,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PhotoEditor.tsx",
                        lineNumber: 386,
                        columnNumber: 11
                    }, this),
                    activeTab === 'frame' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: 12,
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 600,
                                            color: '#d72688'
                                        },
                                        children: "Choose Frame Template"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 618,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setOpenPicker('frame'),
                                        style: {
                                            background: '#fff4fa',
                                            color: '#d72688',
                                            border: '1px solid #f3b7d1',
                                            borderRadius: 10,
                                            padding: '6px 12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: 12
                                        },
                                        title: "Lihat semua frame",
                                        children: "Lihat Semua"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 619,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 617,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: assetGridCols,
                                    gap: 10,
                                    marginBottom: 24
                                },
                                children: frameTemplates.map((template)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onSelectFrameTemplate(template.name),
                                        style: {
                                            border: selectedFrameTemplate === template.name ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                                            borderRadius: 12,
                                            padding: 0,
                                            background: '#fff',
                                            cursor: 'pointer',
                                            width: '100%',
                                            maxWidth: isMobile ? 68 : 80,
                                            aspectRatio: '1 / 1',
                                            justifySelf: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden'
                                        },
                                        title: template.label,
                                        children: template.src ? // eslint-disable-next-line @next/next/no-img-element
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: template.src,
                                            alt: template.label,
                                            style: {
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/PhotoEditor.tsx",
                                            lineNumber: 660,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#d72688',
                                                fontSize: 12
                                            },
                                            children: template.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/PhotoEditor.tsx",
                                            lineNumber: 662,
                                            columnNumber: 21
                                        }, this)
                                    }, template.name, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 638,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 636,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PhotoEditor.tsx",
                        lineNumber: 616,
                        columnNumber: 11
                    }, this),
                    activeTab === 'sticker' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 600,
                                            color: '#d72688',
                                            marginRight: 12
                                        },
                                        children: "Choose Sticker"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 673,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: reloadStickers,
                                        style: {
                                            background: '#fa75aa',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 8,
                                            padding: '4px 14px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: 13
                                        },
                                        title: "Reload sticker list",
                                        children: "Reload"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 674,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setOpenPicker('sticker'),
                                        style: {
                                            background: '#fff4fa',
                                            color: '#d72688',
                                            border: '1px solid #f3b7d1',
                                            borderRadius: 8,
                                            padding: '4px 12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            marginLeft: 8
                                        },
                                        title: "Lihat semua sticker",
                                        children: "Lihat Semua"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 690,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 672,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: assetGridCols,
                                    gap: 10,
                                    marginBottom: 24
                                },
                                children: minioStickers.map((sticker)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            border: '2px solid #fa75aa33',
                                            borderRadius: 12,
                                            padding: 0,
                                            background: '#fff',
                                            cursor: 'pointer',
                                            width: '100%',
                                            maxWidth: isMobile ? 70 : 80,
                                            aspectRatio: '1 / 1',
                                            justifySelf: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 8px #fa75aa11',
                                            transition: 'transform 0.1s'
                                        },
                                        onClick: ()=>onAddSticker(sticker.src),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: sticker.src,
                                            alt: sticker.label,
                                            style: {
                                                width: '90%',
                                                height: '90%',
                                                objectFit: 'contain'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/PhotoEditor.tsx",
                                            lineNumber: 732,
                                            columnNumber: 19
                                        }, this)
                                    }, sticker.src, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 710,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 708,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PhotoEditor.tsx",
                        lineNumber: 671,
                        columnNumber: 11
                    }, this),
                    activeTab === 'adjust' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onResetDefault,
                                disabled: isTemplateMode,
                                style: {
                                    marginBottom: 18,
                                    padding: '10px 24px',
                                    background: '#fa75aa',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 16,
                                    fontWeight: 'bold',
                                    fontSize: 15,
                                    cursor: isTemplateMode ? 'not-allowed' : 'pointer',
                                    opacity: isTemplateMode ? 0.55 : 1,
                                    boxShadow: '0 2px 8px #fa75aa22'
                                },
                                children: "Reset to Default"
                            }, void 0, false, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 749,
                                columnNumber: 13
                            }, this),
                            isTemplateMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    marginTop: -6,
                                    marginBottom: 14,
                                    fontSize: 12,
                                    color: '#7a5b6d'
                                },
                                children: "Mode template aktif: pengaturan size/radius/gap mengikuti template canvas."
                            }, void 0, false, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 769,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    color: '#d72688',
                                    fontWeight: 600,
                                    fontSize: 15,
                                    marginBottom: 8,
                                    display: 'block'
                                },
                                children: "Frame Bottom Size"
                            }, void 0, false, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 773,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "range",
                                min: 0,
                                max: 200,
                                value: sliderValue,
                                onChange: (e)=>onChangeSlider(Number(e.target.value)),
                                disabled: isTemplateMode,
                                style: {
                                    width: '100%',
                                    accentColor: '#fa75aa',
                                    marginBottom: 12,
                                    opacity: isTemplateMode ? 0.5 : 1
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 776,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: '#d72688',
                                    fontWeight: 500,
                                    fontSize: 14
                                },
                                children: [
                                    sliderValue,
                                    "px"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 790,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 24
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            color: '#d72688',
                                            fontWeight: 600,
                                            fontSize: 15,
                                            marginBottom: 8,
                                            display: 'block'
                                        },
                                        children: "Frame Border Radius"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 796,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: 0,
                                        max: 48,
                                        value: frameBorderRadius,
                                        onChange: (e)=>onChangeFrameBorderRadius(Number(e.target.value)),
                                        disabled: isTemplateMode,
                                        style: {
                                            width: '100%',
                                            maxWidth: 400,
                                            accentColor: '#fa75aa',
                                            opacity: isTemplateMode ? 0.5 : 1
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 799,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: '#d72688',
                                            fontWeight: 500,
                                            fontSize: 14
                                        },
                                        children: [
                                            frameBorderRadius,
                                            "px"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 813,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 795,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 24
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            color: '#d72688',
                                            fontWeight: 600,
                                            fontSize: 15,
                                            marginBottom: 8,
                                            display: 'block'
                                        },
                                        children: "Photo Gap"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 820,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: 0,
                                        max: 48,
                                        value: photoGap,
                                        onChange: (e)=>onChangePhotoGap(Number(e.target.value)),
                                        disabled: isTemplateMode,
                                        style: {
                                            width: '100%',
                                            maxWidth: 400,
                                            accentColor: '#fa75aa',
                                            opacity: isTemplateMode ? 0.5 : 1
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 823,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: '#d72688',
                                            fontWeight: 500,
                                            fontSize: 14
                                        },
                                        children: [
                                            photoGap,
                                            "px"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 837,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 819,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 24
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            color: '#d72688',
                                            fontWeight: 600,
                                            fontSize: 15,
                                            marginBottom: 8,
                                            display: 'block'
                                        },
                                        children: "Photo Border Radius"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 844,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "range",
                                        min: 0,
                                        max: 48,
                                        value: photoBorderRadius,
                                        onChange: (e)=>onChangePhotoBorderRadius(Number(e.target.value)),
                                        disabled: isTemplateMode,
                                        style: {
                                            width: '100%',
                                            maxWidth: 400,
                                            accentColor: '#fa75aa',
                                            opacity: isTemplateMode ? 0.5 : 1
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 847,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: '#d72688',
                                            fontWeight: 500,
                                            fontSize: 14
                                        },
                                        children: [
                                            photoBorderRadius,
                                            "px"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/PhotoEditor.tsx",
                                        lineNumber: 861,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PhotoEditor.tsx",
                                lineNumber: 843,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/components/PhotoEditor.tsx",
                lineNumber: 384,
                columnNumber: 7
            }, this),
            openPicker && typeof document !== 'undefined' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(pickerModal, document.body) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/PhotoEditor.tsx",
        lineNumber: 340,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/PhotoResult.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PhotoResult
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
;
;
;
;
function PhotoResult({ photos, frames = [], gifUrl, onClose }) {
    // Gabungkan semua item untuk thumbnail bar
    const items = [
        ...photos.map((src)=>({
                type: 'photo',
                src
            })),
        ...frames.map((src)=>({
                type: 'frame',
                src
            })),
        ...gifUrl ? [
            {
                type: 'gif',
                src: gifUrl
            }
        ] : []
    ];
    const [current, setCurrent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [shareError, setShareError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [touchStart, setTouchStart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [touchEnd, setTouchEnd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const imageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Minimum swipe distance
    const minSwipeDistance = 50;
    // Navigation functions
    const goToPrevious = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setCurrent((prev)=>prev > 0 ? prev - 1 : items.length - 1);
    }, [
        items.length
    ]);
    const goToNext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setCurrent((prev)=>prev < items.length - 1 ? prev + 1 : 0);
    }, [
        items.length
    ]);
    // Touch event handlers
    const onTouchStart = (e)=>{
        setTouchEnd(0); // Reset touchEnd
        setTouchStart(e.targetTouches[0].clientX);
    };
    const onTouchMove = (e)=>{
        setTouchEnd(e.targetTouches[0].clientX);
    };
    const onTouchEnd = ()=>{
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }
    };
    // Mouse event handlers for desktop
    const onMouseDown = (e)=>{
        if (e.button === 0) {
            const rect = imageRef.current?.getBoundingClientRect();
            if (rect) {
                const x = e.clientX - rect.left;
                const centerX = rect.width / 2;
                if (x < centerX) {
                    goToPrevious();
                } else {
                    goToNext();
                }
            }
        }
    };
    // Keyboard navigation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyDown = (e)=>{
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'Escape' && onClose) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return ()=>window.removeEventListener('keydown', handleKeyDown);
    }, [
        onClose,
        goToNext,
        goToPrevious
    ]);
    // Share handler
    const handleShare = async ()=>{
        setShareError(null);
        const item = items[current];
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Photo Booth Result',
                    text: 'Check out my photo!',
                    url: item.src.startsWith('http') ? item.src : undefined,
                    files: item.src.startsWith('data:') && window.File ? [
                        await fetch(item.src).then((res)=>res.blob()).then((blob)=>new window.File([
                                blob
                            ], getDownloadName(), {
                                type: blob.type
                            }))
                    ] : undefined
                });
            } catch  {
                setShareError('Share cancelled or failed.');
            }
        } else {
            // Fallback: copy link or show message
            if (item.src.startsWith('http')) {
                await navigator.clipboard.writeText(item.src);
                setShareError('Link copied to clipboard!');
            } else {
                setShareError('Sharing is not supported on this device.');
            }
        }
    };
    const getDownloadName = ()=>{
        if (items[current].type === 'gif') return 'photobooth.gif';
        if (items[current].type === 'frame') {
            if (items[current].src.startsWith('data:image/png;base64') && items[current].src.length > 100000) {
                return 'photostrip.png';
            }
            return `frame_${current + 1}.png`;
        }
        return `photo_${current + 1}.png`;
    };
    // --- Pindahkan pengecekan items.length === 0 ke sini ---
    if (items.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                textAlign: 'center',
                color: '#888',
                marginTop: 40
            }
        }, void 0, false, {
            fileName: "[project]/components/PhotoResult.tsx",
            lineNumber: 140,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                background: '#fff',
                borderRadius: 20,
                boxShadow: '0 8px 32px rgba(250, 117, 170, 0.3)',
                padding: '32px',
                maxWidth: '600px',
                maxHeight: '90vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    style: {
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '32px',
                        height: '32px',
                        border: 'none',
                        background: 'rgba(215, 38, 136, 0.1)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#d72688',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        zIndex: 1
                    },
                    title: "Close (ESC)",
                    children: "×"
                }, void 0, false, {
                    fileName: "[project]/components/PhotoResult.tsx",
                    lineNumber: 177,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    style: {
                        color: '#d72688',
                        marginBottom: '24px',
                        fontWeight: 700,
                        fontSize: '28px',
                        letterSpacing: '0.5px',
                        textAlign: 'center',
                        margin: '0 0 24px 0'
                    },
                    children: "Photo Gallery"
                }, void 0, false, {
                    fileName: "[project]/components/PhotoResult.tsx",
                    lineNumber: 203,
                    columnNumber: 17
                }, this),
                items.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: goToPrevious,
                            style: {
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '2px solid #fa75aa',
                                background: 'rgba(255, 255, 255, 0.9)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 2,
                                transition: 'all 0.2s ease'
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.background = '#fa75aa';
                                e.currentTarget.style.color = '#fff';
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                                e.currentTarget.style.color = '#fa75aa';
                            },
                            title: "Previous (←)",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "16",
                                height: "16",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M15 18l-6-6 6-6",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/components/PhotoResult.tsx",
                                    lineNumber: 248,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/PhotoResult.tsx",
                                lineNumber: 247,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoResult.tsx",
                            lineNumber: 218,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: goToNext,
                            style: {
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '2px solid #fa75aa',
                                background: 'rgba(255, 255, 255, 0.9)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 2,
                                transition: 'all 0.2s ease'
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.background = '#fa75aa';
                                e.currentTarget.style.color = '#fff';
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                                e.currentTarget.style.color = '#fa75aa';
                            },
                            title: "Next (→)",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "16",
                                height: "16",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M9 18l6-6-6-6",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/components/PhotoResult.tsx",
                                    lineNumber: 282,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/PhotoResult.tsx",
                                lineNumber: 281,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoResult.tsx",
                            lineNumber: 252,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: imageRef,
                    style: {
                        width: '100%',
                        height: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: items.length > 1 ? 'pointer' : 'default',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#f8f9fa'
                    },
                    onTouchStart: onTouchStart,
                    onTouchMove: onTouchMove,
                    onTouchEnd: onTouchEnd,
                    onMouseDown: onMouseDown,
                    children: [
                        items[current].type === 'gif' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: items[current].src,
                            alt: "GIF",
                            fill: true,
                            style: {
                                objectFit: 'contain',
                                borderRadius: '8px',
                                userSelect: 'none',
                                pointerEvents: 'none'
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoResult.tsx",
                            lineNumber: 309,
                            columnNumber: 25
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: items[current].src,
                            alt: items[current].type === 'frame' ? 'Photo Strip' : `Photo ${current + 1}`,
                            fill: true,
                            style: {
                                objectFit: 'contain',
                                borderRadius: '8px',
                                userSelect: 'none',
                                pointerEvents: 'none'
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoResult.tsx",
                            lineNumber: 321,
                            columnNumber: 25
                        }, this),
                        items.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: 'absolute',
                                bottom: '8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                opacity: 0.7
                            },
                            children: "Swipe or click to navigate"
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoResult.tsx",
                            lineNumber: 336,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/PhotoResult.tsx",
                    lineNumber: 289,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: '16px',
                        textAlign: 'center',
                        color: '#d72688',
                        fontWeight: 600,
                        fontSize: '18px'
                    },
                    children: [
                        items[current].type === 'gif' ? 'GIF' : items[current].type === 'frame' ? items[current].src.startsWith('data:image/png;base64') && items[current].src.length > 100000 ? 'Photo Strip' : 'Frame' : 'Photo',
                        " (",
                        current + 1,
                        " / ",
                        items.length,
                        ")"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/PhotoResult.tsx",
                    lineNumber: 357,
                    columnNumber: 17
                }, this),
                items.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: '20px',
                        display: 'flex',
                        gap: '12px',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        padding: '10px 0',
                        maxWidth: '100%',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    },
                    className: "jsx-32056c9d697f659b" + " " + "photoresult-thumbnails",
                    children: [
                        items.map((item, idx)=>{
                            const isPhotoStrip = item.type === 'frame' && item.src.startsWith('data:image/png;base64') && item.src.length > 100000;
                            const isActive = idx === current;
                            const thumbSize = 56;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>setCurrent(idx),
                                style: {
                                    border: isActive ? '3px solid #fa75aa' : '2px solid #e0e0e0',
                                    borderRadius: '10px',
                                    padding: '3px',
                                    background: isActive ? isPhotoStrip ? '#ffe0f0' : '#fff6fa' : '#fff',
                                    cursor: 'pointer',
                                    boxShadow: isActive ? '0 2px 8px rgba(250, 117, 170, 0.18)' : undefined,
                                    transition: 'all 0.2s',
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: thumbSize + 6,
                                    minHeight: thumbSize + 6
                                },
                                title: item.type === 'gif' ? 'GIF' : item.type === 'frame' ? 'Photo Strip' : 'Photo',
                                className: "jsx-32056c9d697f659b",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: item.src,
                                    alt: item.type === 'gif' ? 'GIF' : item.type,
                                    width: thumbSize,
                                    height: thumbSize,
                                    style: {
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        display: 'block',
                                        background: '#f8f9fa'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/PhotoResult.tsx",
                                    lineNumber: 429,
                                    columnNumber: 37
                                }, this)
                            }, idx, false, {
                                fileName: "[project]/components/PhotoResult.tsx",
                                lineNumber: 401,
                                columnNumber: 33
                            }, this);
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            id: "32056c9d697f659b",
                            children: ".photoresult-thumbnails.jsx-32056c9d697f659b{scrollbar-width:none;-ms-overflow-style:none}.photoresult-thumbnails.jsx-32056c9d697f659b::-webkit-scrollbar{display:none}@media (width<=480px){.photoresult-thumbnails.jsx-32056c9d697f659b{gap:8px!important;padding:6px 0!important}}"
                        }, void 0, false, void 0, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/PhotoResult.tsx",
                    lineNumber: 376,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        gap: '12px',
                        marginTop: '24px',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: items[current].src,
                            download: getDownloadName(),
                            style: {
                                padding: '12px 24px',
                                background: '#fae0ef',
                                color: '#d72688',
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '16px',
                                textDecoration: 'none',
                                boxShadow: '0 2px 8px rgba(250, 117, 170, 0.2)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                border: 'none',
                                transition: 'all 0.2s ease',
                                minWidth: '120px'
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.background = '#d72688';
                                e.currentTarget.style.color = '#fff';
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.background = '#fae0ef';
                                e.currentTarget.style.color = '#d72688';
                            },
                            children: "Download"
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoResult.tsx",
                            lineNumber: 474,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleShare,
                            style: {
                                padding: '12px 24px',
                                background: '#fff0fa',
                                color: '#d72688',
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '16px',
                                border: '2px solid #fa75aa',
                                boxShadow: '0 2px 8px rgba(250, 117, 170, 0.2)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s ease',
                                minWidth: '120px'
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.background = '#fa75aa';
                                e.currentTarget.style.color = '#fff';
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.background = '#fff0fa';
                                e.currentTarget.style.color = '#d72688';
                            },
                            title: "Share",
                            children: "Share"
                        }, void 0, false, {
                            fileName: "[project]/components/PhotoResult.tsx",
                            lineNumber: 504,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/PhotoResult.tsx",
                    lineNumber: 463,
                    columnNumber: 17
                }, this),
                shareError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: '12px',
                        color: '#d72688',
                        fontSize: '14px',
                        textAlign: 'center',
                        fontWeight: 500,
                        padding: '8px',
                        background: '#fff0fa',
                        borderRadius: '6px',
                        border: '1px solid #fae0ef'
                    },
                    children: shareError
                }, void 0, false, {
                    fileName: "[project]/components/PhotoResult.tsx",
                    lineNumber: 535,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/PhotoResult.tsx",
            lineNumber: 160,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/PhotoResult.tsx",
        lineNumber: 145,
        columnNumber: 9
    }, this);
}
}),
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
"[project]/src/lib/photoGallery.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addGalleryItem",
    ()=>addGalleryItem,
    "clearGalleryItems",
    ()=>clearGalleryItems,
    "getGalleryItems",
    ()=>getGalleryItems,
    "updateGalleryItemPublicUrl",
    ()=>updateGalleryItemPublicUrl
]);
const GALLERY_STORAGE_KEY = 'photobooth-gallery-v1';
const GALLERY_MAX_ITEMS = 40;
const isBrowser = ()=>"undefined" !== 'undefined';
const readGallery = ()=>{
    if (!isBrowser()) return [];
    //TURBOPACK unreachable
    ;
};
const writeGallery = (items)=>{
    if (!isBrowser()) return;
    //TURBOPACK unreachable
    ;
    let trimmed;
};
const getGalleryItems = ()=>{
    const items = readGallery();
    return items.sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
const addGalleryItem = (input)=>{
    const nextItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        createdAt: new Date().toISOString(),
        stripDataUrl: input.stripDataUrl,
        publicUrl: input.publicUrl,
        layout: input.layout,
        filter: input.filter
    };
    const current = readGallery();
    writeGallery([
        nextItem,
        ...current
    ]);
    return nextItem;
};
const updateGalleryItemPublicUrl = (id, publicUrl)=>{
    const items = readGallery();
    const updated = items.map((item)=>item.id === id ? {
            ...item,
            publicUrl
        } : item);
    writeGallery(updated);
};
const clearGalleryItems = ()=>{
    if (!isBrowser()) return;
    //TURBOPACK unreachable
    ;
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
"[project]/src/app/photo/edit/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PhotoEditPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html2canvas/dist/html2canvas.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CropModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CropModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PhotoPreview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PhotoPreview.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PhotoEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PhotoEditor.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PhotoResult$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PhotoResult.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/indexedDB.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$photoGallery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/photoGallery.ts [app-ssr] (ecmascript)");
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
;
const INLINE_GALLERY_STRIP_MAX_LENGTH = 1_200_000;
const EXPORT_STEP_TIMEOUT_MS = 20_000;
const MOBILE_EXPORT_MAX_PIXELS = 2_400_000;
const DEFAULT_EXPORT_MAX_PIXELS = 5_000_000;
const toFiniteNumber = (value, fallback)=>{
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
};
const isIPadLikeDevice = ()=>{
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    return /iPad/i.test(ua) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
};
const isLowMemoryMobileDevice = ()=>{
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    return isIPadLikeDevice() || /iPhone|iPod|Android|Mobile/i.test(ua);
};
const getSafeExportScale = (renderWidth, renderHeight)=>{
    if ("TURBOPACK compile-time truthy", 1) return 1;
    //TURBOPACK unreachable
    ;
    const width = undefined;
    const height = undefined;
    const nativeScale = undefined;
    const maxPixels = undefined;
    const safeScaleByPixels = undefined;
    const nextScale = undefined;
};
const loadImageElement = (src)=>new Promise((resolve, reject)=>{
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = ()=>resolve(img);
        img.onerror = ()=>reject(new Error(`Failed loading image: ${src.slice(0, 120)}`));
        img.src = src;
    });
const withTimeout = async (promise, timeoutMs, message)=>{
    let timeoutId;
    try {
        return await Promise.race([
            promise,
            new Promise((_, reject)=>{
                timeoutId = window.setTimeout(()=>{
                    reject(new Error(message));
                }, timeoutMs);
            })
        ]);
    } finally{
        if (typeof timeoutId === 'number') {
            window.clearTimeout(timeoutId);
        }
    }
};
const normalizeTemplateSettings = (value)=>{
    if (!value || typeof value !== 'object') return null;
    const raw = value;
    const canvasWidth = Math.max(1, Math.round(toFiniteNumber(raw.canvasWidth, 0)));
    const canvasHeight = Math.max(1, Math.round(toFiniteNumber(raw.canvasHeight, 0)));
    if (!canvasWidth || !canvasHeight) return null;
    const normalizedSlots = Array.isArray(raw.photoSlots) ? raw.photoSlots.map((slot)=>{
        if (!slot || typeof slot !== 'object') return null;
        const x = Math.round(toFiniteNumber(slot.x, NaN));
        const y = Math.round(toFiniteNumber(slot.y, NaN));
        const width = Math.round(toFiniteNumber(slot.width, NaN));
        const height = Math.round(toFiniteNumber(slot.height, NaN));
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) {
            return null;
        }
        if (width <= 0 || height <= 0) return null;
        return {
            x,
            y,
            width,
            height
        };
    }).filter((slot)=>Boolean(slot)) : [];
    return {
        canvasWidth,
        canvasHeight,
        padding: Math.max(0, Math.round(toFiniteNumber(raw.padding, 20))),
        gap: Math.max(0, Math.round(toFiniteNumber(raw.gap, 8))),
        bottomSpace: Math.max(0, Math.round(toFiniteNumber(raw.bottomSpace, 0))),
        frameBorderRadius: Math.max(0, Math.round(toFiniteNumber(raw.frameBorderRadius, 0))),
        photoBorderRadius: Math.max(0, Math.round(toFiniteNumber(raw.photoBorderRadius, 0))),
        photoWidth: Math.max(1, Math.round(toFiniteNumber(raw.photoWidth, 240))),
        photoHeight: Math.max(1, Math.round(toFiniteNumber(raw.photoHeight, 180))),
        slotCount: Math.max(1, Math.round(toFiniteNumber(raw.slotCount, Math.max(normalizedSlots.length, 1)))),
        photoSlots: normalizedSlots
    };
};
function PhotoEditPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [photos, setPhotos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [layout, setLayout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(4);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('none');
    const [frameColor, setFrameColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('white');
    const [bottomSpace, setBottomSpace] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(85);
    const [frameBorderRadius, setFrameBorderRadius] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [photoBorderRadius, setPhotoBorderRadius] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(11);
    const [stickers, setStickers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [photoGap, setPhotoGap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(8);
    const [selectedFrameTemplate, setSelectedFrameTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('none');
    const [frameTemplates, setFrameTemplates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showPhotoResult, setShowPhotoResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [photoResultData, setPhotoResultData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [photoResultGifUrl, setPhotoResultGifUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [isLoadingResult, setIsLoadingResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSavingGallery, setIsSavingGallery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [processingSeconds, setProcessingSeconds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [cropModalOpen, setCropModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [cropImageUrl, setCropImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [cropPhotoIndex, setCropPhotoIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [capturedLiveVideoUrl, setCapturedLiveVideoUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const latestGalleryItemRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const latestPersistedGalleryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const preTemplateAdjustRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const wasTemplateModeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [saveGalleryError, setSaveGalleryError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const selectedTemplateSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (selectedFrameTemplate === 'none') return null;
        const selectedTemplate = frameTemplates.find((template)=>template.name === selectedFrameTemplate);
        return selectedTemplate?.settings ?? null;
    }, [
        frameTemplates,
        selectedFrameTemplate
    ]);
    const normalizeEditablePhotoSource = (value)=>{
        if (typeof value !== 'string') return null;
        const trimmed = value.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith('data:image/') && trimmed.length > 1000) {
            return trimmed;
        }
        if (trimmed.startsWith('/api/image-proxy?url=')) {
            return trimmed;
        }
        if (trimmed.startsWith('/')) {
            return trimmed;
        }
        if (trimmed.startsWith('blob:')) {
            return trimmed;
        }
        if (/^https?:\/\//i.test(trimmed)) {
            return `/api/image-proxy?url=${encodeURIComponent(trimmed)}`;
        }
        return null;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const params = new URLSearchParams(window.location.search);
        const layoutParam = Number(params.get('layout') || 4);
        if (Number.isFinite(layoutParam) && layoutParam >= 1) {
            setLayout(layoutParam);
        }
        const savedLiveVideoUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadTempLiveVideoUrlFromSessionStorage"])();
        setCapturedLiveVideoUrl(savedLiveVideoUrl);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchTemplates = async ()=>{
            try {
                const res = await fetch('/api/list-frame-template');
                const data = await res.json();
                const templates = [
                    {
                        name: 'none',
                        label: 'No Template',
                        src: ''
                    },
                    ...(data.templates || []).map((tpl)=>({
                            name: tpl.name,
                            label: tpl.name,
                            src: tpl.frameUrl || '',
                            sticker: tpl.stickerUrl || '',
                            settings: normalizeTemplateSettings(tpl.settings)
                        }))
                ];
                setFrameTemplates(templates);
            } catch  {
                setFrameTemplates([
                    {
                        name: 'none',
                        label: 'No Template',
                        src: ''
                    }
                ]);
            }
        };
        fetchTemplates();
        window.addEventListener('frameTemplatesUpdated', fetchTemplates);
        return ()=>window.removeEventListener('frameTemplatesUpdated', fetchTemplates);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadPhotos = async ()=>{
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIndexedDBSupported"])()) {
                setError('Browser Anda tidak mendukung IndexedDB.');
                setIsLoading(false);
                return;
            }
            try {
                const cachedPhotos = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadPhotosFromIndexedDB"])();
                const validCachedPhotos = cachedPhotos.map(normalizeEditablePhotoSource).filter((value)=>Boolean(value));
                if (validCachedPhotos.length > 0) {
                    setPhotos(validCachedPhotos);
                    return;
                }
                const tempPhotos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadTempPhotosFromSessionStorage"])().map(normalizeEditablePhotoSource).filter((value)=>Boolean(value));
                if (tempPhotos.length > 0) {
                    setPhotos(tempPhotos);
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["savePhotosToIndexedDB"])(tempPhotos);
                }
            } catch  {
                setError('Failed to load photos from local storage.');
            } finally{
                setIsLoading(false);
            }
        };
        loadPhotos();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const isTemplateMode = selectedFrameTemplate !== 'none';
        const templatePreset = {
            bottomSpace: selectedTemplateSettings?.bottomSpace ?? 0,
            frameBorderRadius: selectedTemplateSettings?.frameBorderRadius ?? 0,
            photoGap: selectedTemplateSettings?.gap ?? 8,
            photoBorderRadius: selectedTemplateSettings?.photoBorderRadius ?? 0
        };
        if (isTemplateMode) {
            if (!wasTemplateModeRef.current) {
                preTemplateAdjustRef.current = {
                    bottomSpace,
                    frameBorderRadius,
                    photoGap,
                    photoBorderRadius
                };
            }
            wasTemplateModeRef.current = true;
            setBottomSpace(templatePreset.bottomSpace);
            setFrameBorderRadius(templatePreset.frameBorderRadius);
            setPhotoGap(templatePreset.photoGap);
            setPhotoBorderRadius(templatePreset.photoBorderRadius);
            return;
        }
        if (wasTemplateModeRef.current && preTemplateAdjustRef.current) {
            setBottomSpace(preTemplateAdjustRef.current.bottomSpace);
            setFrameBorderRadius(preTemplateAdjustRef.current.frameBorderRadius);
            setPhotoGap(preTemplateAdjustRef.current.photoGap);
            setPhotoBorderRadius(preTemplateAdjustRef.current.photoBorderRadius);
            preTemplateAdjustRef.current = null;
        }
        wasTemplateModeRef.current = false;
    }, [
        selectedFrameTemplate,
        selectedTemplateSettings,
        bottomSpace,
        frameBorderRadius,
        photoGap,
        photoBorderRadius
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIndexedDBSupported"])()) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["savePhotosToIndexedDB"])(photos).catch(()=>{
            // No-op: we keep UI usable even when persistence fails.
            });
        }
        if (photos.length === 0) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearTempPhotosFromSessionStorage"])();
        } else {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveTempPhotosToSessionStorage"])(photos);
        }
    }, [
        photos
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isLoadingResult) {
            setProcessingSeconds(0);
            return;
        }
        setProcessingSeconds(1);
        const intervalId = window.setInterval(()=>{
            setProcessingSeconds((prev)=>prev + 1);
        }, 1000);
        return ()=>{
            window.clearInterval(intervalId);
        };
    }, [
        isLoadingResult
    ]);
    const handleRetakePhoto = async (index)=>{
        if (index < 0 || index >= photos.length) return;
        try {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIndexedDBSupported"])()) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["savePhotosToIndexedDB"])(photos);
            }
        } catch  {
        // Keep navigation flow working even if persistence fails.
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveTempPhotosToSessionStorage"])(photos);
        sessionStorage.setItem('photobooth-retake-single', '1');
        sessionStorage.setItem('photobooth-retake-index', String(index));
        router.push(`/photo?retake=single&index=${index}&layout=${layout}`);
    };
    const handleOpenCrop = (index)=>{
        if (!photos[index]) return;
        setCropPhotoIndex(index);
        setCropImageUrl(photos[index]);
        setCropModalOpen(true);
    };
    const handleSaveCroppedImage = (croppedImageUrl)=>{
        setPhotos((prev)=>prev.map((photo, idx)=>idx === cropPhotoIndex ? croppedImageUrl : photo));
    };
    const handleAddSticker = (src)=>{
        setStickers((prev)=>[
                ...prev,
                {
                    src,
                    x: 100,
                    y: 100,
                    size: 48,
                    rotate: 0
                }
            ]);
    };
    const handleMoveSticker = (idx, x, y)=>{
        setStickers((prev)=>prev.map((s, i)=>i === idx ? {
                    ...s,
                    x,
                    y
                } : s));
    };
    const handleResizeSticker = (idx, newSize)=>{
        setStickers((prev)=>newSize === 0 ? prev.filter((_, i)=>i !== idx) : prev.map((s, i)=>i === idx ? {
                    ...s,
                    size: newSize
                } : s));
    };
    const handleRotateSticker = (idx, delta)=>{
        setStickers((prev)=>prev.map((s, i)=>i === idx ? {
                    ...s,
                    rotate: ((s.rotate ?? 0) + delta) % 360
                } : s));
    };
    const handleDeleteSticker = (idx)=>{
        setStickers((prev)=>prev.filter((_, i)=>i !== idx));
    };
    const handleResetDefault = ()=>{
        setBottomSpace(85);
        setFrameBorderRadius(0);
        setPhotoGap(8);
        setPhotoBorderRadius(11);
        setFilter('none');
        setFrameColor('white');
        setStickers([]);
        setSelectedFrameTemplate('none');
    };
    const handleRetakeAll = async ()=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIndexedDBSupported"])()) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearPhotosFromIndexedDB"])();
        }
        setPhotos([]);
        setCapturedLiveVideoUrl(null);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearTempPhotosFromSessionStorage"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearTempLiveVideoUrlFromSessionStorage"])();
        sessionStorage.setItem('photobooth-retake-reset', '1');
        router.push('/photo?retake=1');
    };
    async function applyFilterToDataUrl(src, selectedFilter) {
        if (!selectedFilter || selectedFilter === 'none') return src;
        return new Promise((resolve)=>{
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            img.onload = ()=>{
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.filter = selectedFilter;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = src;
        });
    }
    const buildStripDataUrl = async (applyActiveFilter)=>{
        const node = document.getElementById('strip');
        if (!node) return null;
        const nodeRect = node.getBoundingClientRect();
        // Export using the exact visible size so saved result matches editor layout 1:1.
        const renderWidth = Math.max(1, Math.round(nodeRect.width));
        const renderHeight = Math.max(1, Math.round(nodeRect.height));
        const exportScale = getSafeExportScale(renderWidth, renderHeight);
        const captureNode = node.cloneNode(true);
        captureNode.id = 'strip-capture-clone';
        captureNode.style.position = 'fixed';
        captureNode.style.left = '-10000px';
        captureNode.style.top = '0';
        captureNode.style.width = `${Math.max(1, renderWidth)}px`;
        captureNode.style.height = `${Math.max(1, renderHeight)}px`;
        captureNode.style.maxWidth = 'none';
        captureNode.style.margin = '0';
        captureNode.style.transform = 'none';
        captureNode.style.zIndex = '-1';
        captureNode.classList.add('hide-resize-handle');
        captureNode.classList.add('hide-editor-overlay-controls');
        document.body.appendChild(captureNode);
        try {
            if (applyActiveFilter && filter && filter !== 'none') {
                const imgEls = captureNode.querySelectorAll('img[alt^="photo-"]');
                await Promise.all(Array.from(imgEls).map(async (img, idx)=>{
                    const filtered = await applyFilterToDataUrl(photos[idx], filter);
                    img.setAttribute('src', filtered);
                }));
            }
            const images = Array.from(captureNode.querySelectorAll('img'));
            await Promise.all(images.map((img)=>img.complete ? Promise.resolve() : new Promise((resolve)=>{
                    img.onload = img.onerror = resolve;
                })));
            const canvas = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2f$dist$2f$html2canvas$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(captureNode, {
                useCORS: true,
                backgroundColor: null,
                scale: exportScale,
                width: Math.max(1, renderWidth),
                height: Math.max(1, renderHeight)
            });
            return canvas.toDataURL('image/png');
        } finally{
            captureNode.remove();
        }
    };
    const getStripRenderSize = ()=>{
        const node = document.getElementById('strip');
        if (!node) return null;
        const rect = node.getBoundingClientRect();
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);
        if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
            return {
                canvasWidth: Math.round(width),
                canvasHeight: Math.round(height)
            };
        }
        return null;
    };
    const uploadStripToCloud = async (imageDataUrl)=>{
        try {
            // Use FormData path for better upload stability compared to large JSON base64 payloads.
            const blobResponse = await fetch(imageDataUrl);
            const blob = await blobResponse.blob();
            const formData = new FormData();
            formData.append('media', new File([
                blob
            ], `strip-${Date.now()}.png`, {
                type: blob.type || 'image/png'
            }));
            formData.append('kind', 'strip');
            const res = await fetch('/api/upload-strip', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                return typeof data?.url === 'string' ? data.url : null;
            }
            // Fallback to legacy JSON upload path.
            const fallbackRes = await fetch('/api/upload-strip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: imageDataUrl
                })
            });
            if (!fallbackRes.ok) return null;
            const fallbackData = await fallbackRes.json();
            return typeof fallbackData?.url === 'string' ? fallbackData.url : null;
        } catch  {
            return null;
        }
    };
    const uploadMediaBlobToCloud = async (blob, kind)=>{
        try {
            const extension = kind === 'gif' ? 'gif' : kind === 'live' ? 'webm' : 'png';
            const mimeType = blob.type || (kind === 'gif' ? 'image/gif' : kind === 'live' ? 'video/webm' : 'image/png');
            const file = new File([
                blob
            ], `${kind}.${extension}`, {
                type: mimeType
            });
            const formData = new FormData();
            formData.append('media', file);
            formData.append('kind', kind);
            const res = await fetch('/api/upload-strip', {
                method: 'POST',
                body: formData
            });
            if (!res.ok) return null;
            const data = await res.json();
            return typeof data?.url === 'string' ? data.url : null;
        } catch  {
            return null;
        }
    };
    const uploadCaptureFramesToCloud = async (sources)=>{
        const uploaded = [];
        for (const src of sources){
            if (typeof src !== 'string' || !src) continue;
            try {
                const response = await fetch(src);
                if (!response.ok) continue;
                const blob = await response.blob();
                const url = await uploadMediaBlobToCloud(blob, 'frame');
                if (url) {
                    uploaded.push(url);
                }
            } catch  {
            // Skip failed frames so process can continue for other photos.
            }
        }
        return uploaded;
    };
    const createGifAssets = async ()=>{
        if (photos.length === 0) return null;
        try {
            const GIF = (await __turbopack_context__.A("[project]/node_modules/gif.js/index.js [app-ssr] (ecmascript, async loader)")).default;
            const firstImg = await withTimeout(loadImageElement(photos[0]), 8_000, 'Timeout while loading the first GIF frame.');
            const width = firstImg.naturalWidth || 640;
            const height = firstImg.naturalHeight || 480;
            const gif = new GIF({
                workers: isLowMemoryMobileDevice() ? 1 : 2,
                quality: isLowMemoryMobileDevice() ? 14 : 10,
                width,
                height,
                workerScript: '/gif.worker.js'
            });
            for(let i = 0; i < photos.length; i++){
                const img = await withTimeout(loadImageElement(photos[i]), 8_000, `Timeout while loading GIF frame ${i + 1}.`);
                const gifCanvas = document.createElement('canvas');
                gifCanvas.width = width;
                gifCanvas.height = height;
                const ctx = gifCanvas.getContext('2d');
                if (!ctx) continue;
                ctx.fillStyle = frameColor;
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
                gif.addFrame(gifCanvas, {
                    delay: 800
                });
            }
            const blob = await withTimeout(new Promise((resolve, reject)=>{
                gif.on('finished', (generatedBlob)=>{
                    if (generatedBlob instanceof Blob && generatedBlob.size > 0) {
                        resolve(generatedBlob);
                        return;
                    }
                    reject(new Error('GIF is empty or failed to generate.'));
                });
                gif.on('abort', ()=>{
                    reject(new Error('GIF process was aborted.'));
                });
                try {
                    gif.render();
                } catch (error) {
                    reject(error instanceof Error ? error : new Error('Failed to run GIF rendering.'));
                }
            }), EXPORT_STEP_TIMEOUT_MS, 'GIF generation took too long and was stopped.');
            const objectUrl = URL.createObjectURL(blob);
            return {
                objectUrl,
                blob
            };
        } catch (error) {
            console.error('Failed to generate GIF assets:', error);
            return null;
        }
    };
    const saveStripToGallery = (stripDataUrl, publicUrl)=>{
        const signature = `${stripDataUrl.length}-${stripDataUrl.slice(0, 120)}`;
        if (latestGalleryItemRef.current?.signature === signature) {
            if (publicUrl) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$photoGallery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateGalleryItemPublicUrl"])(latestGalleryItemRef.current.id, publicUrl);
            }
            return latestGalleryItemRef.current.id;
        }
        const item = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$photoGallery$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addGalleryItem"])({
            stripDataUrl,
            publicUrl,
            layout,
            filter
        });
        latestGalleryItemRef.current = {
            signature,
            id: item.id
        };
        return item.id;
    };
    const persistStripToGalleryDatabase = async (params)=>{
        if (!params.imageUrl || params.imageUrl.startsWith('data:image/')) {
            return null;
        }
        const signature = `${params.imageUrl.length}-${params.imageUrl.slice(0, 120)}`;
        if (latestPersistedGalleryRef.current?.signature === signature) {
            return {
                id: latestPersistedGalleryRef.current.id
            };
        }
        try {
            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageUrl: params.imageUrl,
                    stripDataUrl: typeof params.stripDataUrl === 'string' && params.stripDataUrl.length <= INLINE_GALLERY_STRIP_MAX_LENGTH && params.imageUrl.startsWith('data:image/') ? params.stripDataUrl : null,
                    canvasWidth: params.canvasWidth ?? null,
                    canvasHeight: params.canvasHeight ?? null,
                    previewDataUrl: params.previewDataUrl ?? null,
                    gifDataUrl: params.gifDataUrl ?? null,
                    liveVideoDataUrl: params.liveVideoDataUrl ?? null,
                    photoFrames: params.photoFrames ?? [],
                    livePhotos: params.livePhotos ?? [],
                    selectedFrameTemplate: params.selectedFrameTemplate ?? 'none',
                    templateSettings: params.templateSettings ?? null,
                    frameTemplateUrl: params.frameTemplateUrl ?? null,
                    frameStickerUrl: params.frameStickerUrl ?? null,
                    frameColor: params.frameColor ?? null,
                    title: params.title ?? 'Photo Strip',
                    layout,
                    filter
                })
            });
            if (!res.ok) return null;
            const data = await res.json();
            if (typeof data?.item?.id !== 'string') return null;
            latestPersistedGalleryRef.current = {
                signature,
                id: data.item.id
            };
            return {
                id: data.item.id
            };
        } catch  {
            return null;
        }
    };
    const handleDownloadStrip = async ()=>{
        setSaveGalleryError(null);
        setIsLoadingResult(true);
        try {
            const dataUrl = await buildStripDataUrl(true);
            if (!dataUrl) return;
            const uploadedUrl = await uploadStripToCloud(dataUrl);
            if (!uploadedUrl) {
                setSaveGalleryError('Strip upload failed. Try download again or use a lighter template.');
                return;
            }
            saveStripToGallery(dataUrl, uploadedUrl ?? undefined);
            const gifAssets = await createGifAssets();
            const uploadedGifUrl = gifAssets?.blob ? await uploadMediaBlobToCloud(gifAssets.blob, 'gif') : null;
            const uploadedLiveUrl = capturedLiveVideoUrl || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadTempLiveVideoUrlFromSessionStorage"])();
            const uploadedFrameUrls = await uploadCaptureFramesToCloud(photos);
            const renderSize = getStripRenderSize();
            const selectedTemplate = frameTemplates.find((template)=>template.name === selectedFrameTemplate);
            await persistStripToGalleryDatabase({
                imageUrl: uploadedUrl,
                stripDataUrl: null,
                canvasWidth: renderSize?.canvasWidth ?? null,
                canvasHeight: renderSize?.canvasHeight ?? null,
                previewDataUrl: uploadedUrl ?? null,
                gifDataUrl: uploadedGifUrl,
                liveVideoDataUrl: uploadedLiveUrl,
                photoFrames: uploadedFrameUrls,
                livePhotos: uploadedFrameUrls,
                selectedFrameTemplate,
                templateSettings: selectedTemplateSettings,
                frameTemplateUrl: selectedTemplate?.src ?? null,
                frameStickerUrl: selectedTemplate?.sticker ?? null,
                frameColor
            });
            setPhotoResultData(dataUrl);
            setPhotoResultGifUrl(gifAssets?.objectUrl);
            setShowPhotoResult(true);
        } finally{
            setIsLoadingResult(false);
        }
    };
    const handleSaveGallery = async ()=>{
        setSaveGalleryError(null);
        setIsSavingGallery(true);
        setIsLoadingResult(true);
        try {
            const dataUrl = await buildStripDataUrl(true);
            if (!dataUrl) return;
            const uploadedUrl = await withTimeout(uploadStripToCloud(dataUrl), EXPORT_STEP_TIMEOUT_MS, 'Timeout while uploading strip image.');
            if (!uploadedUrl) {
                setSaveGalleryError('Strip upload failed. On iPad mode, use a lighter template and save again.');
                return;
            }
            saveStripToGallery(dataUrl, uploadedUrl ?? undefined);
            const gifAssets = await withTimeout(createGifAssets(), EXPORT_STEP_TIMEOUT_MS * 2, 'Timeout while generating GIF assets.');
            const uploadedGifUrl = gifAssets?.blob ? await uploadMediaBlobToCloud(gifAssets.blob, 'gif') : null;
            const uploadedLiveUrl = capturedLiveVideoUrl || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadTempLiveVideoUrlFromSessionStorage"])();
            const uploadedFrameUrls = await withTimeout(uploadCaptureFramesToCloud(photos), EXPORT_STEP_TIMEOUT_MS * 2, 'Timeout while uploading captured frames.');
            const renderSize = getStripRenderSize();
            const selectedTemplate = frameTemplates.find((template)=>template.name === selectedFrameTemplate);
            const persisted = await withTimeout(persistStripToGalleryDatabase({
                imageUrl: uploadedUrl,
                stripDataUrl: null,
                canvasWidth: renderSize?.canvasWidth ?? null,
                canvasHeight: renderSize?.canvasHeight ?? null,
                previewDataUrl: uploadedUrl ?? null,
                gifDataUrl: uploadedGifUrl,
                liveVideoDataUrl: uploadedLiveUrl,
                photoFrames: uploadedFrameUrls,
                livePhotos: uploadedFrameUrls,
                selectedFrameTemplate,
                templateSettings: selectedTemplateSettings,
                frameTemplateUrl: selectedTemplate?.src ?? null,
                frameStickerUrl: selectedTemplate?.sticker ?? null,
                frameColor
            }), EXPORT_STEP_TIMEOUT_MS, 'Timeout while saving gallery metadata.');
            if (gifAssets?.objectUrl) {
                URL.revokeObjectURL(gifAssets.objectUrl);
            }
            if (persisted?.id) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearTempLiveVideoUrlFromSessionStorage"])();
                router.push(`/photo/gallery/${persisted.id}`);
            } else {
                router.push('/photo/gallery');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save gallery.';
            setSaveGalleryError(errorMessage);
        } finally{
            setIsSavingGallery(false);
            setIsLoadingResult(false);
        }
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "pb-page-bg min-h-screen flex items-center justify-center px-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[#d72688] font-semibold",
                children: "Loading editor..."
            }, void 0, false, {
                fileName: "[project]/src/app/photo/edit/page.tsx",
                lineNumber: 916,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/photo/edit/page.tsx",
            lineNumber: 915,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "pb-page-bg min-h-screen flex flex-col items-center justify-center gap-4 px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-[#c43779] font-medium text-center",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/photo/edit/page.tsx",
                    lineNumber: 924,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>router.push('/photo'),
                    className: "px-5 py-2 rounded-xl bg-[#fa75aa] text-white hover:bg-[#e35d95] transition",
                    children: "Back to Capture"
                }, void 0, false, {
                    fileName: "[project]/src/app/photo/edit/page.tsx",
                    lineNumber: 925,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/photo/edit/page.tsx",
            lineNumber: 923,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "pb-page-bg min-h-screen flex flex-col items-center justify-center gap-6 py-8 px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl sm:text-4xl font-bold text-[#d72688] text-center",
                        children: "PhotoBooth Editor"
                    }, void 0, false, {
                        fileName: "[project]/src/app/photo/edit/page.tsx",
                        lineNumber: 938,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 text-sm",
                        children: [
                            photos.length,
                            "/",
                            layout,
                            " photos ready to edit"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/photo/edit/page.tsx",
                        lineNumber: 939,
                        columnNumber: 9
                    }, this),
                    photos.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-5xl bg-white rounded-2xl p-10 shadow-md text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mb-4",
                                children: "No photos available yet. Return to capture page."
                            }, void 0, false, {
                                fileName: "[project]/src/app/photo/edit/page.tsx",
                                lineNumber: 943,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push('/photo'),
                                className: "px-6 py-2 rounded-xl bg-[#fa75aa] text-white hover:bg-[#e35d95] transition",
                                children: "Back to Capture"
                            }, void 0, false, {
                                fileName: "[project]/src/app/photo/edit/page.tsx",
                                lineNumber: 944,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/photo/edit/page.tsx",
                        lineNumber: 942,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "strip-controls-wrapper",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "strip-preview-panel",
                                style: {
                                    minWidth: 0
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PhotoPreview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    photos: photos,
                                    filter: filter,
                                    frameColor: frameColor,
                                    bottomSpace: bottomSpace,
                                    frameBorderRadius: frameBorderRadius,
                                    photoBorderRadius: photoBorderRadius,
                                    stickers: stickers,
                                    onMoveSticker: handleMoveSticker,
                                    onResizeSticker: handleResizeSticker,
                                    onRotateSticker: handleRotateSticker,
                                    onDeleteSticker: handleDeleteSticker,
                                    gap: photoGap,
                                    frameTemplates: frameTemplates,
                                    selectedFrameTemplate: selectedFrameTemplate,
                                    selectedTemplateSettings: selectedTemplateSettings,
                                    onRetake: handleRetakePhoto,
                                    onCrop: handleOpenCrop
                                }, void 0, false, {
                                    fileName: "[project]/src/app/photo/edit/page.tsx",
                                    lineNumber: 954,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/photo/edit/page.tsx",
                                lineNumber: 953,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "photo-editor-panel",
                                style: {
                                    minWidth: 0,
                                    position: 'sticky',
                                    top: 32
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PhotoEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        onChangeSlider: setBottomSpace,
                                        sliderValue: bottomSpace,
                                        onAddSticker: handleAddSticker,
                                        onSelectFrame: setFrameColor,
                                        selectedFrame: frameColor,
                                        frameTemplates: frameTemplates,
                                        selectedFrameTemplate: selectedFrameTemplate,
                                        onSelectFrameTemplate: setSelectedFrameTemplate,
                                        availableFrames: [
                                            {
                                                name: 'white',
                                                label: 'White',
                                                color: '#fff'
                                            },
                                            {
                                                name: 'pink',
                                                label: 'Pink',
                                                color: '#fa75aa'
                                            },
                                            {
                                                name: 'yellow',
                                                label: 'Yellow',
                                                color: '#ffe066'
                                            },
                                            {
                                                name: 'blue',
                                                label: 'Blue',
                                                color: '#7ecbff'
                                            }
                                        ],
                                        availableStickers: [],
                                        frameBorderRadius: frameBorderRadius,
                                        onChangeFrameBorderRadius: setFrameBorderRadius,
                                        photoGap: photoGap,
                                        onChangePhotoGap: setPhotoGap,
                                        photoBorderRadius: photoBorderRadius,
                                        onChangePhotoBorderRadius: setPhotoBorderRadius,
                                        onResetDefault: handleResetDefault
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/photo/edit/page.tsx",
                                        lineNumber: 983,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "photo-editor-actions",
                                        style: {
                                            marginTop: 24
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleRetakeAll,
                                                style: {
                                                    padding: '12px 24px',
                                                    backgroundColor: '#fa75aa',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '24px',
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer'
                                                },
                                                children: "Retake"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/photo/edit/page.tsx",
                                                lineNumber: 1009,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleDownloadStrip,
                                                style: {
                                                    padding: '12px 24px',
                                                    backgroundColor: '#fa75aa',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '24px',
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer'
                                                },
                                                children: "Download Strip"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/photo/edit/page.tsx",
                                                lineNumber: 1024,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleSaveGallery,
                                                disabled: isSavingGallery,
                                                style: {
                                                    padding: '12px 24px',
                                                    backgroundColor: '#fff',
                                                    color: '#d72688',
                                                    border: '1px solid #fa75aa',
                                                    borderRadius: '24px',
                                                    fontSize: '16px',
                                                    fontWeight: 'bold',
                                                    cursor: isSavingGallery ? 'not-allowed' : 'pointer',
                                                    opacity: isSavingGallery ? 0.6 : 1
                                                },
                                                children: isSavingGallery ? 'Saving...' : 'Save Gallery'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/photo/edit/page.tsx",
                                                lineNumber: 1039,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/photo/edit/page.tsx",
                                        lineNumber: 1008,
                                        columnNumber: 15
                                    }, this),
                                    saveGalleryError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 12,
                                            padding: '10px 14px',
                                            backgroundColor: '#fff4fa',
                                            color: '#8c295c',
                                            borderRadius: 12,
                                            border: '1px solid #f3b7d1',
                                            fontSize: 13,
                                            fontWeight: 500,
                                            lineHeight: 1.5
                                        },
                                        children: saveGalleryError
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/photo/edit/page.tsx",
                                        lineNumber: 1059,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/photo/edit/page.tsx",
                                lineNumber: 975,
                                columnNumber: 13
                            }, this),
                            showPhotoResult && photoResultData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'rgba(250,117,170,0.22)',
                                    backdropFilter: 'blur(2px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 2000
                                },
                                onClick: ()=>setShowPhotoResult(false),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: '#fff',
                                        padding: 24,
                                        borderRadius: 16,
                                        border: '1px solid #f3b7d1',
                                        boxShadow: '0 16px 40px rgba(250,117,170,0.2)',
                                        minWidth: 340,
                                        maxWidth: 420,
                                        maxHeight: '90vh',
                                        overflowY: 'auto',
                                        position: 'relative'
                                    },
                                    onClick: (e)=>e.stopPropagation(),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PhotoResult$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        photos: photos,
                                        frames: [
                                            photoResultData
                                        ],
                                        gifUrl: photoResultGifUrl,
                                        onClose: ()=>setShowPhotoResult(false)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/photo/edit/page.tsx",
                                        lineNumber: 1109,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/photo/edit/page.tsx",
                                    lineNumber: 1094,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/photo/edit/page.tsx",
                                lineNumber: 1078,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/photo/edit/page.tsx",
                        lineNumber: 952,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/photo/edit/page.tsx",
                lineNumber: 937,
                columnNumber: 7
            }, this),
            isLoadingResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(250,117,170,0.22)',
                    backdropFilter: 'blur(2px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: '#fff',
                        padding: 32,
                        borderRadius: 16,
                        border: '1px solid #f3b7d1',
                        boxShadow: '0 16px 40px rgba(250,117,170,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 16,
                        minWidth: 320
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                color: '#d72688',
                                fontWeight: 600,
                                fontSize: 18
                            },
                            children: "Processing..."
                        }, void 0, false, {
                            fileName: "[project]/src/app/photo/edit/page.tsx",
                            lineNumber: 1152,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                color: '#b84f84',
                                fontWeight: 600,
                                fontSize: 14
                            },
                            children: [
                                processingSeconds,
                                " detik berjalan"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/photo/edit/page.tsx",
                            lineNumber: 1153,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/photo/edit/page.tsx",
                    lineNumber: 1138,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/photo/edit/page.tsx",
                lineNumber: 1123,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CropModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: cropModalOpen,
                onClose: ()=>setCropModalOpen(false),
                imageUrl: cropImageUrl,
                onSave: handleSaveCroppedImage,
                photoIndex: cropPhotoIndex
            }, void 0, false, {
                fileName: "[project]/src/app/photo/edit/page.tsx",
                lineNumber: 1160,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
];

//# sourceMappingURL=_7f03fdb5._.js.map