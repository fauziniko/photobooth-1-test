(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/Camera.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Camera
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/camera.js [app-client] (ecmascript) <export default as Camera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.js [app-client] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minimize-2.js [app-client] (ecmascript) <export default as Minimize2>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const CAPTURE_ASPECT_RATIO = 4 / 3;
function Camera(param) {
    let { onCapture, onLiveVideoCapture, photosToTake, poseCount, onPoseCountChange, onStartCapture, filter, frameColor, liveMode = true, onToggleLiveMode, isFullscreen = false, onToggleFullscreen, fullscreenMode = false } = param;
    _s();
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isTabletViewport, setIsTabletViewport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCompactViewport, setIsCompactViewport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCapturing, setIsCapturing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [count, setCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [devices, setDevices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedDeviceId, setSelectedDeviceId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [cameraMode, setCameraMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('user');
    const [isMirrored, setIsMirrored] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [countdown, setCountdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(3);
    const [strictAspectLock, setStrictAspectLock] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const stopCurrentStream = ()=>{
        var _videoRef_current;
        const media = (_videoRef_current = videoRef.current) === null || _videoRef_current === void 0 ? void 0 : _videoRef_current.srcObject;
        if (media instanceof MediaStream) {
            media.getTracks().forEach((track)=>track.stop());
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Camera.useEffect": ()=>{
            const userAgent = navigator.userAgent;
            const mobileCheck = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            setIsMobile(mobileCheck);
            const iPadLike = /iPad/i.test(userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
            setIsTabletViewport(iPadLike || window.innerWidth >= 768);
            setIsCompactViewport(window.innerWidth <= 1024 || window.innerHeight <= 900);
            if (mobileCheck) {
                setCameraMode('user');
            } else {
                setCameraMode('environment');
            }
            const onResize = {
                "Camera.useEffect.onResize": ()=>{
                    setIsTabletViewport(window.innerWidth >= 768);
                    setIsCompactViewport(window.innerWidth <= 1024 || window.innerHeight <= 900);
                }
            }["Camera.useEffect.onResize"];
            window.addEventListener('resize', onResize);
            return ({
                "Camera.useEffect": ()=>{
                    window.removeEventListener('resize', onResize);
                }
            })["Camera.useEffect"];
        }
    }["Camera.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Camera.useEffect": ()=>{
            var _navigator_mediaDevices;
            if ("object" !== 'undefined' && ((_navigator_mediaDevices = navigator.mediaDevices) === null || _navigator_mediaDevices === void 0 ? void 0 : _navigator_mediaDevices.enumerateDevices)) {
                navigator.mediaDevices.enumerateDevices().then({
                    "Camera.useEffect": (deviceList)=>{
                        const videoDevices = deviceList.filter({
                            "Camera.useEffect.videoDevices": (d)=>d.kind === 'videoinput'
                        }["Camera.useEffect.videoDevices"]);
                        setDevices(videoDevices);
                        if (videoDevices.length > 0) setSelectedDeviceId(videoDevices[0].deviceId);
                    }
                }["Camera.useEffect"]);
            }
        }
    }["Camera.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Camera.useEffect": ()=>{
            var _navigator_mediaDevices;
            if ("object" === 'undefined' || !((_navigator_mediaDevices = navigator.mediaDevices) === null || _navigator_mediaDevices === void 0 ? void 0 : _navigator_mediaDevices.getUserMedia)) return;
            let cancelled = false;
            const strictQuality = {
                aspectRatio: {
                    ideal: CAPTURE_ASPECT_RATIO
                },
                width: {
                    ideal: 1920
                },
                height: {
                    ideal: 1440
                },
                frameRate: {
                    ideal: 60,
                    max: 60
                }
            };
            const relaxedQuality = {
                width: {
                    ideal: 1600
                },
                height: {
                    ideal: 1200
                },
                frameRate: {
                    ideal: 30,
                    max: 60
                }
            };
            const buildConstraints = {
                "Camera.useEffect.buildConstraints": (strictMode)=>{
                    const quality = strictMode ? strictQuality : relaxedQuality;
                    if (isMobile) {
                        return {
                            video: {
                                facingMode: cameraMode,
                                ...quality
                            }
                        };
                    }
                    if (selectedDeviceId) {
                        return {
                            video: {
                                deviceId: {
                                    exact: selectedDeviceId
                                },
                                ...quality
                            }
                        };
                    }
                    return {
                        video: quality
                    };
                }
            }["Camera.useEffect.buildConstraints"];
            const startCamera = {
                "Camera.useEffect.startCamera": async ()=>{
                    stopCurrentStream();
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia(buildConstraints(strictAspectLock));
                        if (cancelled) {
                            stream.getTracks().forEach({
                                "Camera.useEffect.startCamera": (track)=>track.stop()
                            }["Camera.useEffect.startCamera"]);
                            return;
                        }
                        if (videoRef.current) videoRef.current.srcObject = stream;
                        return;
                    } catch (error) {
                        if (!strictAspectLock) {
                            const err = error;
                            alert('Cannot access camera: ' + err.name + ' - ' + err.message);
                            return;
                        }
                    }
                    try {
                        const fallbackStream = await navigator.mediaDevices.getUserMedia(buildConstraints(false));
                        if (cancelled) {
                            fallbackStream.getTracks().forEach({
                                "Camera.useEffect.startCamera": (track)=>track.stop()
                            }["Camera.useEffect.startCamera"]);
                            return;
                        }
                        if (videoRef.current) videoRef.current.srcObject = fallbackStream;
                    } catch (error) {
                        const err = error;
                        alert('Cannot access camera: ' + err.name + ' - ' + err.message);
                    }
                }
            }["Camera.useEffect.startCamera"];
            void startCamera();
            return ({
                "Camera.useEffect": ()=>{
                    cancelled = true;
                    stopCurrentStream();
                }
            })["Camera.useEffect"];
        }
    }["Camera.useEffect"], [
        selectedDeviceId,
        cameraMode,
        isMobile,
        strictAspectLock
    ]);
    const handleDeviceChange = (e)=>{
        setSelectedDeviceId(e.target.value);
    };
    const takePhotos = async ()=>{
        if (isCapturing) return;
        setIsCapturing(true);
        if (onStartCapture) onStartCapture();
        let recorder = null;
        let recordChunks = [];
        let resolveRecorderStopped = ()=>{};
        const recorderStopped = new Promise((resolve)=>{
            resolveRecorderStopped = resolve;
        });
        const stopRecorderSafely = async ()=>{
            if (!recorder) return;
            if (recorder.state !== 'inactive') {
                recorder.stop();
            }
            await recorderStopped;
        };
        try {
            var _videoRef_current;
            const stream = (_videoRef_current = videoRef.current) === null || _videoRef_current === void 0 ? void 0 : _videoRef_current.srcObject;
            if (liveMode && stream instanceof MediaStream && typeof MediaRecorder !== 'undefined') {
                const candidateTypes = [
                    'video/mp4;codecs=h264',
                    'video/mp4',
                    'video/webm;codecs=vp9',
                    'video/webm;codecs=vp8',
                    'video/webm'
                ];
                const supportedType = candidateTypes.find((type)=>typeof MediaRecorder.isTypeSupported === 'function' ? MediaRecorder.isTypeSupported(type) : false);
                recorder = new MediaRecorder(stream, supportedType ? {
                    mimeType: supportedType,
                    videoBitsPerSecond: 12_000_000
                } : undefined);
                recorder.ondataavailable = (event)=>{
                    if (event.data && event.data.size > 0) {
                        recordChunks.push(event.data);
                    }
                };
                recorder.onstop = ()=>{
                    resolveRecorderStopped();
                };
                recorder.start(250);
            } else {
                resolveRecorderStopped();
            }
            for(let shot = 0; shot < photosToTake; shot++){
                for(let i = countdown; i > 0; i--){
                    setCount(i);
                    await new Promise((res)=>setTimeout(res, 1000));
                }
                setCount(null);
                const video = videoRef.current;
                if (!video || video.readyState < 2) {
                    alert('Video not ready. Please wait a few seconds and try again.');
                    await stopRecorderSafely();
                    if (onLiveVideoCapture) await onLiveVideoCapture(null);
                    return;
                }
                let waitTry = 0;
                while((video.videoWidth === 0 || video.videoHeight === 0) && waitTry < 8){
                    await new Promise((res)=>setTimeout(res, 120));
                    waitTry++;
                }
                if (video.videoWidth === 0 || video.videoHeight === 0) {
                    alert('Camera frame is not ready yet. Please try again.');
                    await stopRecorderSafely();
                    if (onLiveVideoCapture) await onLiveVideoCapture(null);
                    return;
                }
                const targetRatio = 4 / 3;
                const vw = video.videoWidth;
                const vh = video.videoHeight;
                let sx = 0;
                let sy = 0;
                let sw = vw;
                let sh = vh;
                if (vw / vh > targetRatio) {
                    sw = vh * targetRatio;
                    sx = (vw - sw) / 2;
                } else if (vw / vh < targetRatio) {
                    sh = vw / targetRatio;
                    sy = (vh - sh) / 2;
                }
                const canvas = document.createElement('canvas');
                canvas.width = 640;
                canvas.height = 480;
                const ctx = canvas.getContext('2d');
                if (filter && filter !== 'none') {
                    ctx.filter = filter;
                }
                if (isMirrored) {
                    ctx.save();
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
                    ctx.restore();
                } else {
                    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
                }
                onCapture(canvas.toDataURL('image/png'));
                await new Promise((res)=>setTimeout(res, 500));
            }
            await stopRecorderSafely();
            if (onLiveVideoCapture) {
                const liveBlob = recordChunks.length > 0 ? new Blob(recordChunks, {
                    type: (recorder === null || recorder === void 0 ? void 0 : recorder.mimeType) || 'video/webm'
                }) : null;
                await onLiveVideoCapture(liveBlob && liveBlob.size > 0 ? liveBlob : null);
            }
        } finally{
            setIsCapturing(false);
            recordChunks = [];
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: fullscreenMode ? '0px' : isCompactViewport ? '10px' : '16px',
            position: 'relative',
            width: fullscreenMode ? '100vw' : '100%',
            maxWidth: fullscreenMode ? 'none' : '640px',
            height: fullscreenMode ? '100dvh' : 'auto',
            maxHeight: fullscreenMode ? '100dvh' : isCompactViewport ? '100dvh' : 'none',
            boxSizing: 'border-box',
            paddingTop: fullscreenMode ? 'env(safe-area-inset-top, 0px)' : 0,
            paddingBottom: fullscreenMode ? 'calc(env(safe-area-inset-bottom, 0px) + 8px)' : isCompactViewport ? '8px' : 0,
            margin: '0 auto'
        },
        children: [
            !fullscreenMode && onToggleLiveMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: isCompactViewport ? '6px 12px' : '8px 16px',
                    background: '#fff2f8',
                    borderRadius: 12,
                    border: '1px solid #f3bfd7'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#b84f84'
                        },
                        children: "Live Mode"
                    }, void 0, false, {
                        fileName: "[project]/components/Camera.tsx",
                        lineNumber: 354,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            position: 'relative',
                            display: 'inline-block',
                            width: 48,
                            height: 24,
                            cursor: 'pointer'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: liveMode,
                                onChange: onToggleLiveMode,
                                style: {
                                    opacity: 0,
                                    width: 0,
                                    height: 0
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/Camera.tsx",
                                lineNumber: 356,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: liveMode ? '#fa75aa' : '#efc3d8',
                                    borderRadius: 24,
                                    transition: 'all 0.3s'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        position: 'absolute',
                                        left: liveMode ? 26 : 2,
                                        top: 2,
                                        width: 20,
                                        height: 20,
                                        background: 'white',
                                        borderRadius: '50%',
                                        transition: 'all 0.3s'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/Camera.tsx",
                                    lineNumber: 374,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Camera.tsx",
                                lineNumber: 362,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Camera.tsx",
                        lineNumber: 355,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 14,
                            fontWeight: 700,
                            color: liveMode ? '#d72688' : '#a06a86'
                        },
                        children: liveMode ? 'ON' : 'OFF'
                    }, void 0, false, {
                        fileName: "[project]/components/Camera.tsx",
                        lineNumber: 388,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Camera.tsx",
                lineNumber: 343,
                columnNumber: 9
            }, this),
            !fullscreenMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: isCompactViewport ? 6 : 12,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: isCompactViewport ? 8 : 10,
                    width: '100%',
                    padding: '0 8px',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    },
                    children: [
                        isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: cameraMode,
                                    onChange: (e)=>setCameraMode(e.target.value),
                                    style: {
                                        padding: '8px 12px',
                                        borderRadius: 12,
                                        border: '1px solid #fa75aa',
                                        color: '#d72688',
                                        fontWeight: 500,
                                        fontSize: 14,
                                        background: '#fff',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        flex: '1 1 auto',
                                        minWidth: '110px',
                                        maxWidth: '150px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "environment",
                                            children: "Back Camera"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Camera.tsx",
                                            lineNumber: 435,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "user",
                                            children: "Front Camera"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Camera.tsx",
                                            lineNumber: 436,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Camera.tsx",
                                    lineNumber: 417,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setIsMirrored((m)=>!m),
                                    style: {
                                        background: isMirrored ? '#fa75aa' : '#eee',
                                        color: isMirrored ? '#fff' : '#d72688',
                                        border: 'none',
                                        borderRadius: 8,
                                        padding: 8,
                                        marginLeft: 4,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: 36
                                    },
                                    title: isMirrored ? 'Mirrored (Click to unmirror)' : 'Not mirrored (Click to mirror)',
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                        style: {
                                            transform: isMirrored ? 'scaleX(-1)' : undefined
                                        },
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/Camera.tsx",
                                        lineNumber: 455,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/Camera.tsx",
                                    lineNumber: 438,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: selectedDeviceId,
                                    onChange: handleDeviceChange,
                                    style: {
                                        padding: '8px 12px',
                                        borderRadius: 12,
                                        border: '1px solid #fa75aa',
                                        color: '#d72688',
                                        fontWeight: 500,
                                        fontSize: 14,
                                        background: '#fff',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        flex: '1 1 auto',
                                        minWidth: '110px',
                                        maxWidth: '180px'
                                    },
                                    children: devices.map((device)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: device.deviceId,
                                            style: {
                                                color: '#d72688',
                                                background: '#fff'
                                            },
                                            children: device.label || "Kamera ".concat(device.deviceId.slice(-4))
                                        }, device.deviceId, false, {
                                            fileName: "[project]/components/Camera.tsx",
                                            lineNumber: 479,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/Camera.tsx",
                                    lineNumber: 460,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setIsMirrored((m)=>!m),
                                    style: {
                                        background: isMirrored ? '#fa75aa' : '#eee',
                                        color: isMirrored ? '#fff' : '#d72688',
                                        border: 'none',
                                        borderRadius: 8,
                                        padding: 8,
                                        marginLeft: 4,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: 36
                                    },
                                    title: isMirrored ? 'Mirrored (Click to unmirror)' : 'Not mirrored (Click to mirror)',
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                        style: {
                                            transform: isMirrored ? 'scaleX(-1)' : undefined
                                        },
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/Camera.tsx",
                                        lineNumber: 505,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/Camera.tsx",
                                    lineNumber: 488,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: countdown,
                            onChange: (e)=>setCountdown(Number(e.target.value)),
                            style: {
                                padding: '8px 12px',
                                borderRadius: 12,
                                border: '1px solid #fa75aa',
                                color: '#d72688',
                                fontWeight: 500,
                                fontSize: 14,
                                background: '#fff',
                                outline: 'none',
                                cursor: 'pointer',
                                width: '80px',
                                textAlign: 'center',
                                flex: '0 0 auto'
                            },
                            disabled: isCapturing,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: 1,
                                    children: "1s"
                                }, void 0, false, {
                                    fileName: "[project]/components/Camera.tsx",
                                    lineNumber: 529,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: 3,
                                    children: "3s"
                                }, void 0, false, {
                                    fileName: "[project]/components/Camera.tsx",
                                    lineNumber: 530,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: 5,
                                    children: "5s"
                                }, void 0, false, {
                                    fileName: "[project]/components/Camera.tsx",
                                    lineNumber: 531,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Camera.tsx",
                            lineNumber: 510,
                            columnNumber: 11
                        }, this),
                        !isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setStrictAspectLock((prev)=>!prev),
                            style: {
                                padding: '8px 12px',
                                borderRadius: 12,
                                border: '1px solid #fa75aa',
                                color: strictAspectLock ? '#fff' : '#d72688',
                                fontWeight: 600,
                                fontSize: 13,
                                background: strictAspectLock ? '#fa75aa' : '#fff',
                                outline: 'none',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            },
                            title: "Lock rasio 4:3 agar framing desktop lebih stabil",
                            children: strictAspectLock ? '4:3 Locked' : '4:3 Unlocked'
                        }, void 0, false, {
                            fileName: "[project]/components/Camera.tsx",
                            lineNumber: 535,
                            columnNumber: 13
                        }, this),
                        typeof poseCount === 'number' && onPoseCountChange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: poseCount,
                            onChange: (e)=>onPoseCountChange(Number(e.target.value)),
                            style: {
                                padding: '8px 12px',
                                borderRadius: 12,
                                border: '1px solid #fa75aa',
                                color: '#d72688',
                                fontWeight: 600,
                                fontSize: 14,
                                background: '#fff',
                                outline: 'none',
                                cursor: 'pointer',
                                width: '160px',
                                textAlign: 'center'
                            },
                            disabled: isCapturing,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: 2,
                                    children: "2 Pose"
                                }, void 0, false, {
                                    fileName: "[project]/components/Camera.tsx",
                                    lineNumber: 575,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: 3,
                                    children: "3 Pose"
                                }, void 0, false, {
                                    fileName: "[project]/components/Camera.tsx",
                                    lineNumber: 576,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: 4,
                                    children: "4 Pose"
                                }, void 0, false, {
                                    fileName: "[project]/components/Camera.tsx",
                                    lineNumber: 577,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Camera.tsx",
                            lineNumber: 557,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Camera.tsx",
                    lineNumber: 408,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Camera.tsx",
                lineNumber: 395,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: isMobile ? 'camera-43-container' : undefined,
                style: {
                    position: 'relative',
                    width: fullscreenMode ? '100vw' : isMobile ? '100%' : 640,
                    height: fullscreenMode ? '100dvh' : isMobile ? 'auto' : 480,
                    maxHeight: fullscreenMode ? 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))' : isCompactViewport ? '58dvh' : 'none',
                    maxWidth: '100%',
                    aspectRatio: fullscreenMode ? undefined : '4/3',
                    background: frameColor,
                    borderRadius: fullscreenMode ? 0 : 8,
                    overflow: 'hidden',
                    marginBottom: fullscreenMode ? 0 : isCompactViewport ? 6 : 12
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                        ref: videoRef,
                        autoPlay: true,
                        playsInline: true,
                        muted: true,
                        style: {
                            width: '100%',
                            height: '100%',
                            objectFit: fullscreenMode && isTabletViewport ? 'contain' : 'cover',
                            borderRadius: fullscreenMode ? 0 : 8,
                            transform: isMirrored ? 'scaleX(-1)' : undefined,
                            background: '#000',
                            filter: filter
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/Camera.tsx",
                        lineNumber: 603,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            inset: 0,
                            border: '2px solid rgba(255,255,255,0.35)',
                            borderRadius: fullscreenMode ? 0 : 8,
                            pointerEvents: 'none',
                            zIndex: 1,
                            boxSizing: 'border-box'
                        },
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/components/Camera.tsx",
                        lineNumber: 620,
                        columnNumber: 9
                    }, this),
                    count !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: isMobile ? '48px' : '64px',
                            color: '#fff',
                            background: 'rgba(0,0,0,0.4)',
                            fontWeight: 'bold',
                            zIndex: 2
                        },
                        children: count
                    }, void 0, false, {
                        fileName: "[project]/components/Camera.tsx",
                        lineNumber: 634,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Camera.tsx",
                lineNumber: 584,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: fullscreenMode ? 'absolute' : 'static',
                    bottom: fullscreenMode ? isMobile ? 'calc(env(safe-area-inset-bottom, 0px) + 12px)' : '20px' : undefined,
                    left: fullscreenMode ? '50%' : undefined,
                    transform: fullscreenMode ? 'translateX(-50%)' : undefined,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isCompactViewport ? 8 : 10,
                    zIndex: 4,
                    width: fullscreenMode ? 'auto' : isMobile ? '100%' : 'auto',
                    maxWidth: fullscreenMode ? 'none' : '420px',
                    padding: fullscreenMode ? 0 : isMobile ? '0 8px' : 0,
                    flexShrink: 0
                },
                children: [
                    onToggleFullscreen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onToggleFullscreen,
                        "aria-label": isFullscreen ? 'Keluar full screen' : 'Masuk full screen',
                        title: isFullscreen ? 'Keluar full screen' : 'Mode full screen',
                        style: {
                            width: fullscreenMode ? '60px' : '48px',
                            height: fullscreenMode ? '60px' : '48px',
                            borderRadius: '9999px',
                            border: fullscreenMode ? 'none' : '1px solid #f3bfd7',
                            background: '#fa75aa',
                            color: '#4a1033',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 14px rgba(215, 38, 136, 0.32)',
                            transition: 'all 0.25s ease'
                        },
                        children: isFullscreen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__["Minimize2"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/components/Camera.tsx",
                            lineNumber: 694,
                            columnNumber: 29
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/components/Camera.tsx",
                            lineNumber: 694,
                            columnNumber: 55
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Camera.tsx",
                        lineNumber: 674,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: takePhotos,
                        disabled: isCapturing,
                        style: {
                            padding: fullscreenMode ? '0' : '12px 20px',
                            fontSize: isMobile ? '14px' : '16px',
                            fontWeight: 'bold',
                            backgroundColor: '#fa75aa',
                            color: 'white',
                            border: 'none',
                            borderRadius: fullscreenMode ? '9999px' : '24px',
                            cursor: isCapturing ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease',
                            width: fullscreenMode ? '72px' : isMobile ? 'auto' : 'auto',
                            height: fullscreenMode ? '72px' : 'auto',
                            maxWidth: fullscreenMode ? '72px' : '320px',
                            minWidth: fullscreenMode ? '72px' : isMobile ? 0 : 'auto',
                            flex: fullscreenMode ? '0 0 auto' : isMobile ? 1 : '0 0 auto',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        "aria-label": isCapturing ? 'Taking photo' : "Start capture ".concat(photosToTake, " photos"),
                        title: isCapturing ? 'Taking Photo...' : 'Start Capture',
                        children: fullscreenMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                            size: 28
                        }, void 0, false, {
                            fileName: "[project]/components/Camera.tsx",
                            lineNumber: 726,
                            columnNumber: 13
                        }, this) : isCapturing ? 'Taking Photo...' : "Start Capture (".concat(photosToTake, " photos)")
                    }, void 0, false, {
                        fileName: "[project]/components/Camera.tsx",
                        lineNumber: 698,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Camera.tsx",
                lineNumber: 656,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Camera.tsx",
        lineNumber: 321,
        columnNumber: 5
    }, this);
}
_s(Camera, "r75oYX5lkF0LV87ZFJV38eT1+BA=");
_c = Camera;
var _c;
__turbopack_context__.k.register(_c, "Camera");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/indexedDB.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/tempPhotoStorage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    } catch (e) {
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
    } catch (e) {
        // QuotaExceededError or unavailable session storage should not break flow.
        try {
            sessionStorage.removeItem(TEMP_PHOTOS_KEY);
        } catch (e) {
        // Ignore remove errors.
        }
        return false;
    }
};
const clearTempPhotosFromSessionStorage = ()=>{
    try {
        sessionStorage.removeItem(TEMP_PHOTOS_KEY);
    } catch (e) {
    // Ignore remove errors.
    }
};
const loadTempLiveVideoUrlFromSessionStorage = ()=>{
    try {
        const raw = sessionStorage.getItem(TEMP_LIVE_VIDEO_URL_KEY);
        if (!raw || typeof raw !== 'string') return null;
        return raw;
    } catch (e) {
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
    } catch (e) {
        try {
            sessionStorage.removeItem(TEMP_LIVE_VIDEO_URL_KEY);
        } catch (e) {
        // Ignore remove errors.
        }
        return false;
    }
};
const clearTempLiveVideoUrlFromSessionStorage = ()=>{
    try {
        sessionStorage.removeItem(TEMP_LIVE_VIDEO_URL_KEY);
    } catch (e) {
    // Ignore remove errors.
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/photo/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Camera$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Camera.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/indexedDB.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tempPhotoStorage.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function Page() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const mainRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const photosRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const isRedirectingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const awaitingLiveVideoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [photos, setPhotos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showCamera, setShowCamera] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [layout, setLayout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(4);
    const [filter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('none');
    const [retakePhotoIndex, setRetakePhotoIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFullscreen, setIsFullscreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isPseudoFullscreen, setIsPseudoFullscreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [fullscreenError, setFullscreenError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCompactViewport, setIsCompactViewport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mobileCaptureFullscreen, setMobileCaptureFullscreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [, setCapturedLiveVideoUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [awaitingLiveVideo, setAwaitingLiveVideo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [liveWaitSeconds, setLiveWaitSeconds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [liveMode, setLiveMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const effectiveFullscreen = isFullscreen || isPseudoFullscreen;
    const isValidPhotoData = (value)=>typeof value === 'string' && value.startsWith('data:image/') && value.length > 1000;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Page.useEffect": ()=>{
            const loadSavedPhotos = {
                "Page.useEffect.loadSavedPhotos": async ()=>{
                    const params = new URLSearchParams(window.location.search);
                    const layoutParam = Number(params.get('layout'));
                    if (Number.isFinite(layoutParam) && layoutParam >= 1) {
                        setLayout(layoutParam);
                    }
                    const retakeParam = params.get('retake');
                    const isRetakeFlow = retakeParam === '1' || sessionStorage.getItem('photobooth-retake-reset') === '1';
                    const isSingleRetakeFlow = retakeParam === 'single' || sessionStorage.getItem('photobooth-retake-single') === '1';
                    if (isRetakeFlow) {
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIndexedDBSupported"])()) {
                            try {
                                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearPhotosFromIndexedDB"])();
                            } catch (error) {
                                console.error('❌ Failed to clear IndexedDB during retake reset:', error);
                            }
                        }
                        setPhotos([]);
                        photosRef.current = [];
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTempPhotosFromSessionStorage"])();
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTempLiveVideoUrlFromSessionStorage"])();
                        sessionStorage.removeItem('photobooth-retake-reset');
                        window.history.replaceState({}, '', '/photo');
                        return;
                    }
                    if (isSingleRetakeFlow) {
                        var _params_get;
                        const retakeIndexRaw = (_params_get = params.get('index')) !== null && _params_get !== void 0 ? _params_get : sessionStorage.getItem('photobooth-retake-index');
                        const retakeIndex = Number(retakeIndexRaw);
                        let savedPhotos = [];
                        savedPhotos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadTempPhotosFromSessionStorage"])().filter(isValidPhotoData);
                        if (savedPhotos.length === 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIndexedDBSupported"])()) {
                            try {
                                const indexedPhotos = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadPhotosFromIndexedDB"])();
                                savedPhotos = indexedPhotos.filter(isValidPhotoData);
                            } catch (error) {
                                console.error('❌ Failed to load photos for single retake:', error);
                            }
                        }
                        if (savedPhotos.length > 0) {
                            setPhotos(savedPhotos);
                            photosRef.current = savedPhotos;
                        }
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTempLiveVideoUrlFromSessionStorage"])();
                        setCapturedLiveVideoUrl(null);
                        if (Number.isFinite(retakeIndex) && retakeIndex >= 0) {
                            setRetakePhotoIndex(retakeIndex);
                        }
                        setShowCamera(true);
                        return;
                    }
                    // Default entry to /photo should always start a fresh capture session.
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIndexedDBSupported"])()) {
                        try {
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearPhotosFromIndexedDB"])();
                        } catch (error) {
                            console.error('❌ Failed to clear stale photos on fresh capture start:', error);
                        }
                    }
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTempPhotosFromSessionStorage"])();
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTempLiveVideoUrlFromSessionStorage"])();
                    sessionStorage.removeItem('photobooth-retake-reset');
                    sessionStorage.removeItem('photobooth-retake-single');
                    sessionStorage.removeItem('photobooth-retake-index');
                    setPhotos([]);
                    photosRef.current = [];
                    setRetakePhotoIndex(null);
                    setCapturedLiveVideoUrl(null);
                    setAwaitingLiveVideo(false);
                    awaitingLiveVideoRef.current = false;
                    setShowCamera(true);
                }
            }["Page.useEffect.loadSavedPhotos"];
            loadSavedPhotos();
        }
    }["Page.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Page.useEffect": ()=>{
            const media = window.matchMedia('(max-width: 767px)');
            const apply = {
                "Page.useEffect.apply": ()=>{
                    const isCompact = media.matches;
                    setIsCompactViewport(isCompact);
                    if (isCompact) {
                        setMobileCaptureFullscreen(true);
                    }
                }
            }["Page.useEffect.apply"];
            apply();
            if (typeof media.addEventListener === 'function') {
                media.addEventListener('change', apply);
                return ({
                    "Page.useEffect": ()=>media.removeEventListener('change', apply)
                })["Page.useEffect"];
            }
            media.addListener(apply);
            return ({
                "Page.useEffect": ()=>media.removeListener(apply)
            })["Page.useEffect"];
        }
    }["Page.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Page.useEffect": ()=>{
            photosRef.current = photos;
            if (photos.length > 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIndexedDBSupported"])()) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["savePhotosToIndexedDB"])(photos).catch({
                    "Page.useEffect": (error)=>{
                        console.error('❌ Failed to save photos to IndexedDB:', error);
                    }
                }["Page.useEffect"]);
            }
        }
    }["Page.useEffect"], [
        photos
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Page.useEffect": ()=>{
            const handleFullscreenChange = {
                "Page.useEffect.handleFullscreenChange": ()=>{
                    const doc = document;
                    setIsFullscreen(Boolean(doc.fullscreenElement || doc.webkitFullscreenElement));
                }
            }["Page.useEffect.handleFullscreenChange"];
            document.addEventListener('fullscreenchange', handleFullscreenChange);
            document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
            return ({
                "Page.useEffect": ()=>{
                    document.removeEventListener('fullscreenchange', handleFullscreenChange);
                    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
                }
            })["Page.useEffect"];
        }
    }["Page.useEffect"], []);
    const handleLayoutChange = (n)=>{
        isRedirectingRef.current = false;
        awaitingLiveVideoRef.current = false;
        setLayout(n);
        setPhotos([]);
        setRetakePhotoIndex(null);
        setCapturedLiveVideoUrl(null);
        setAwaitingLiveVideo(false);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTempLiveVideoUrlFromSessionStorage"])();
        photosRef.current = [];
        sessionStorage.removeItem('photobooth-retake-single');
        sessionStorage.removeItem('photobooth-retake-index');
        setShowCamera(true);
    };
    const handleStartCapture = ()=>{
        isRedirectingRef.current = false;
        awaitingLiveVideoRef.current = false;
        setShowCamera(true);
    };
    const uploadLiveVideoBlobToCloud = async (blob)=>{
        const mimeType = blob.type || 'video/webm';
        const extension = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('quicktime') ? 'mov' : 'webm';
        const file = new File([
            blob
        ], "live-".concat(Date.now(), ".").concat(extension), {
            type: mimeType
        });
        for(let attempt = 1; attempt <= 3; attempt += 1){
            try {
                const formData = new FormData();
                formData.append('media', file);
                formData.append('kind', 'live');
                const res = await fetch('/api/upload-strip', {
                    method: 'POST',
                    body: formData
                });
                if (res.ok) {
                    const data = await res.json();
                    return typeof (data === null || data === void 0 ? void 0 : data.url) === 'string' ? data.url : null;
                }
            } catch (e) {
            // Retry transient upload failure.
            }
            if (attempt < 3) {
                await new Promise((resolve)=>setTimeout(resolve, 350 * attempt));
            }
        }
        return null;
    };
    const finalizeRedirectToEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Page.useCallback[finalizeRedirectToEditor]": async ()=>{
            if (isRedirectingRef.current) return;
            if (photosRef.current.length < layout) return;
            isRedirectingRef.current = true;
            try {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIndexedDBSupported"])()) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indexedDB$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["savePhotosToIndexedDB"])(photosRef.current);
                }
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveTempPhotosToSessionStorage"])(photosRef.current);
            } catch (error) {
                console.error('❌ Failed to persist photos before redirect:', error);
            }
            router.push('/photo/edit?layout=' + layout);
        }
    }["Page.useCallback[finalizeRedirectToEditor]"], [
        layout,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Page.useEffect": ()=>{
            if (!awaitingLiveVideo || photosRef.current.length < layout || isRedirectingRef.current) return;
            const timeoutId = window.setTimeout({
                "Page.useEffect.timeoutId": ()=>{
                    // Fallback: avoid getting stuck if recorder callback is delayed or skipped by browser.
                    awaitingLiveVideoRef.current = false;
                    setAwaitingLiveVideo(false);
                    void finalizeRedirectToEditor();
                }
            }["Page.useEffect.timeoutId"], 7000);
            return ({
                "Page.useEffect": ()=>{
                    window.clearTimeout(timeoutId);
                }
            })["Page.useEffect"];
        }
    }["Page.useEffect"], [
        awaitingLiveVideo,
        layout,
        finalizeRedirectToEditor
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Page.useEffect": ()=>{
            if (!awaitingLiveVideo) {
                setLiveWaitSeconds(0);
                return;
            }
            setLiveWaitSeconds(1);
            const intervalId = window.setInterval({
                "Page.useEffect.intervalId": ()=>{
                    setLiveWaitSeconds({
                        "Page.useEffect.intervalId": (prev)=>prev + 1
                    }["Page.useEffect.intervalId"]);
                }
            }["Page.useEffect.intervalId"], 1000);
            return ({
                "Page.useEffect": ()=>{
                    window.clearInterval(intervalId);
                }
            })["Page.useEffect"];
        }
    }["Page.useEffect"], [
        awaitingLiveVideo
    ]);
    const handleCapture = async (photoDataUrl)=>{
        if (!isValidPhotoData(photoDataUrl)) {
            return;
        }
        const canReplaceRetakePhoto = retakePhotoIndex !== null && retakePhotoIndex >= 0 && retakePhotoIndex < photosRef.current.length;
        const updatedPhotos = canReplaceRetakePhoto ? photosRef.current.map((photo, idx)=>idx === retakePhotoIndex ? photoDataUrl : photo) : [
            ...photosRef.current,
            photoDataUrl
        ];
        if (canReplaceRetakePhoto) {
            sessionStorage.removeItem('photobooth-retake-single');
            sessionStorage.removeItem('photobooth-retake-index');
            setRetakePhotoIndex(null);
        }
        photosRef.current = updatedPhotos;
        setPhotos(updatedPhotos);
        if (updatedPhotos.length >= layout && !isRedirectingRef.current) {
            if (liveMode) {
                // Wait for onLiveVideoCapture so redirect happens after recording is fully finalized.
                awaitingLiveVideoRef.current = true;
                setAwaitingLiveVideo(true);
                return;
            }
            await finalizeRedirectToEditor();
        }
    };
    const handleLiveVideoCapture = async (blob)=>{
        const shouldFinalizeAfterLive = awaitingLiveVideoRef.current && photosRef.current.length >= layout && !isRedirectingRef.current;
        let uploadedLiveUrl = null;
        if (blob && blob.size > 0) {
            uploadedLiveUrl = await uploadLiveVideoBlobToCloud(blob);
        }
        setCapturedLiveVideoUrl(uploadedLiveUrl);
        if (uploadedLiveUrl) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveTempLiveVideoUrlToSessionStorage"])(uploadedLiveUrl);
        } else {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tempPhotoStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTempLiveVideoUrlFromSessionStorage"])();
        }
        awaitingLiveVideoRef.current = false;
        setAwaitingLiveVideo(false);
        if (shouldFinalizeAfterLive) {
            await finalizeRedirectToEditor();
        }
    };
    const toggleFullscreen = async ()=>{
        const doc = document;
        const currentMain = mainRef.current;
        if (!currentMain) return;
        setFullscreenError(null);
        try {
            if (doc.fullscreenElement || doc.webkitFullscreenElement) {
                if (doc.exitFullscreen) {
                    await doc.exitFullscreen();
                    return;
                }
                if (doc.webkitExitFullscreen) {
                    await doc.webkitExitFullscreen();
                    return;
                }
            }
            if (isPseudoFullscreen) {
                setIsPseudoFullscreen(false);
                return;
            }
            const requestFullscreen = currentMain.requestFullscreen || currentMain.webkitRequestFullscreen;
            if (!requestFullscreen) {
                // Safari/iPad fallback: emulate fullscreen without Fullscreen API.
                setIsPseudoFullscreen(true);
                return;
            }
            await requestFullscreen.call(currentMain);
        } catch (error) {
            console.error('❌ Failed to toggle fullscreen mode:', error);
            // Fallback mode for browsers with unstable Fullscreen API behavior.
            setIsPseudoFullscreen(true);
        }
    };
    const isCaptureMode = showCamera && (photos.length < layout || retakePhotoIndex !== null);
    const fullscreenCaptureMode = isCaptureMode && (effectiveFullscreen || isCompactViewport && mobileCaptureFullscreen);
    const fullscreenToggleHandler = isCompactViewport ? ()=>setMobileCaptureFullscreen((prev)=>!prev) : toggleFullscreen;
    const pagePaddingClass = isCompactViewport ? 'px-1 sm:px-2 lg:px-5 py-1 sm:py-2 lg:py-4' : 'px-2 sm:px-4 lg:px-5 py-2 sm:py-4';
    const pageGridClass = isCompactViewport ? 'min-h-[calc(100dvh-0.5rem)] lg:h-full max-w-none mx-auto grid grid-cols-1 gap-2' : 'min-h-[calc(100dvh-1rem)] lg:h-full max-w-[1100px] mx-auto grid grid-cols-1 gap-3 sm:gap-4';
    const sectionClass = isCompactViewport ? 'lg:h-full p-1 sm:p-2 flex flex-col overflow-visible lg:overflow-hidden' : 'lg:h-full p-2 sm:p-4 flex flex-col overflow-visible lg:overflow-hidden';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        ref: mainRef,
        className: "pb-page-bg w-full min-h-dvh lg:h-dvh overflow-x-hidden overflow-y-auto lg:overflow-hidden ".concat(pagePaddingClass),
        children: [
            fullscreenError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-5xl mx-auto mb-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm text-[#8c295c] bg-[#fff4fa] border border-[#f3b7d1] rounded-xl px-3 py-2 text-center",
                    children: fullscreenError
                }, void 0, false, {
                    fileName: "[project]/src/app/photo/page.tsx",
                    lineNumber: 416,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/photo/page.tsx",
                lineNumber: 415,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: pageGridClass,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: sectionClass,
                    children: [
                        !fullscreenCaptureMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold text-[#d72688]",
                                        children: photos.length < layout || retakePhotoIndex !== null ? 'Step 1 of 3:' : 'Step 2 of 3:'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/photo/page.tsx",
                                        lineNumber: 427,
                                        columnNumber: 17
                                    }, this),
                                    ' ',
                                    photos.length < layout || retakePhotoIndex !== null ? 'Capture Photos' : 'Review & Edit Photos'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/photo/page.tsx",
                                lineNumber: 426,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/photo/page.tsx",
                            lineNumber: 425,
                            columnNumber: 13
                        }, this),
                        awaitingLiveVideo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fixed inset-0 z-[80] bg-[#1f0012]/45 backdrop-blur-[2px] flex items-center justify-center px-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full max-w-sm rounded-2xl border border-pink-200 bg-white shadow-xl p-5 sm:p-6",
                                role: "status",
                                "aria-live": "polite",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mx-auto h-11 w-11 rounded-full border-4 border-pink-200 border-t-[#d72688] animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/photo/page.tsx",
                                        lineNumber: 438,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-base sm:text-lg text-[#d72688] font-semibold text-center mt-4",
                                        children: "Saving live video result..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/photo/page.tsx",
                                        lineNumber: 439,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs sm:text-sm text-gray-600 text-center mt-1",
                                        children: "Please wait, you will continue to editor automatically."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/photo/page.tsx",
                                        lineNumber: 442,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs sm:text-sm text-[#d72688] text-center mt-3 font-semibold",
                                        children: [
                                            "Running: ",
                                            liveWaitSeconds,
                                            "s"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/photo/page.tsx",
                                        lineNumber: 445,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/photo/page.tsx",
                                lineNumber: 437,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/photo/page.tsx",
                            lineNumber: 436,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full flex lg:flex-1 lg:min-h-0 items-start lg:items-center justify-center overflow-visible lg:overflow-hidden",
                            children: showCamera && (photos.length < layout || retakePhotoIndex !== null) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: fullscreenCaptureMode ? 'fixed inset-0 z-[60] bg-black' : 'w-full lg:h-full flex items-start lg:items-center justify-center',
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Camera$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    onCapture: handleCapture,
                                    photosToTake: retakePhotoIndex !== null ? 1 : layout - photos.length,
                                    poseCount: layout,
                                    onPoseCountChange: handleLayoutChange,
                                    onStartCapture: handleStartCapture,
                                    filter: filter,
                                    frameColor: "white",
                                    liveMode: liveMode,
                                    onToggleLiveMode: ()=>setLiveMode(!liveMode),
                                    onLiveVideoCapture: handleLiveVideoCapture,
                                    isFullscreen: fullscreenCaptureMode,
                                    onToggleFullscreen: fullscreenToggleHandler,
                                    fullscreenMode: fullscreenCaptureMode
                                }, void 0, false, {
                                    fileName: "[project]/src/app/photo/page.tsx",
                                    lineNumber: 455,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/photo/page.tsx",
                                lineNumber: 454,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/photo/page.tsx",
                            lineNumber: 452,
                            columnNumber: 11
                        }, this),
                        !fullscreenCaptureMode && photos.length > 0 && photos.length < layout && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 rounded-lg border border-[#f3b7d1] px-3 py-2 text-xs text-[#d72688] text-center font-medium max-w-md mx-auto",
                            children: "".concat(photos.length, " of ").concat(layout, " photos uploaded. Need ").concat(layout - photos.length, " more.")
                        }, void 0, false, {
                            fileName: "[project]/src/app/photo/page.tsx",
                            lineNumber: 475,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/photo/page.tsx",
                    lineNumber: 423,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/photo/page.tsx",
                lineNumber: 422,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/photo/page.tsx",
        lineNumber: 410,
        columnNumber: 5
    }, this);
}
_s(Page, "BZYZLubI39qnoV+t6Wb8cDASu08=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Page;
var _c;
__turbopack_context__.k.register(_c, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Copy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "14",
            height: "14",
            x: "8",
            y: "8",
            rx: "2",
            ry: "2",
            key: "17jyea"
        }
    ],
    [
        "path",
        {
            d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
            key: "zix9uf"
        }
    ]
];
const Copy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("copy", __iconNode);
;
 //# sourceMappingURL=copy.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Copy",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Maximize2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M15 3h6v6",
            key: "1q9fwt"
        }
    ],
    [
        "path",
        {
            d: "m21 3-7 7",
            key: "1l2asr"
        }
    ],
    [
        "path",
        {
            d: "m3 21 7-7",
            key: "tjx5ai"
        }
    ],
    [
        "path",
        {
            d: "M9 21H3v-6",
            key: "wtvkvv"
        }
    ]
];
const Maximize2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("maximize-2", __iconNode);
;
 //# sourceMappingURL=maximize-2.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.js [app-client] (ecmascript) <export default as Maximize2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Maximize2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/minimize-2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.545.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Minimize2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m14 10 7-7",
            key: "oa77jy"
        }
    ],
    [
        "path",
        {
            d: "M20 10h-6V4",
            key: "mjg0md"
        }
    ],
    [
        "path",
        {
            d: "m3 21 7-7",
            key: "tjx5ai"
        }
    ],
    [
        "path",
        {
            d: "M4 14h6v6",
            key: "rmj7iw"
        }
    ]
];
const Minimize2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("minimize-2", __iconNode);
;
 //# sourceMappingURL=minimize-2.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/minimize-2.js [app-client] (ecmascript) <export default as Minimize2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Minimize2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minimize-2.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_910367a3._.js.map