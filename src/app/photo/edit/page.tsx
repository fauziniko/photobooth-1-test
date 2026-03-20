'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import CropModal from '@/components/CropModal';
import PhotoPreview from '@/components/PhotoPreview';
import PhotoEditor from '@/components/PhotoEditor';
import PhotoResult from '@/components/PhotoResult';
import {
  clearPhotosFromIndexedDB,
  isIndexedDBSupported,
  loadPhotosFromIndexedDB,
  savePhotosToIndexedDB,
} from '@/lib/indexedDB';
import { addGalleryItem, updateGalleryItemPublicUrl } from '@/lib/photoGallery';
import {
  clearTempLiveVideoUrlFromSessionStorage,
  clearTempPhotosFromSessionStorage,
  loadTempLiveVideoUrlFromSessionStorage,
  loadTempPhotosFromSessionStorage,
  saveTempPhotosToSessionStorage,
} from '@/lib/tempPhotoStorage';

type TemplateSlot = { x: number; y: number; width: number; height: number };
type TemplateSettings = {
  canvasWidth: number;
  canvasHeight: number;
  padding: number;
  gap: number;
  bottomSpace: number;
  frameBorderRadius: number;
  photoBorderRadius: number;
  photoWidth: number;
  photoHeight: number;
  slotCount: number;
  photoSlots: TemplateSlot[];
};
type FrameTemplate = { name: string; frameUrl: string; stickerUrl: string; settings?: TemplateSettings | null };
type FrameTemplateForUI = { name: string; label: string; src: string; sticker?: string; settings?: TemplateSettings | null };
type PersistedGallery = { id: string };

const toFiniteNumber = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeTemplateSettings = (value: unknown): TemplateSettings | null => {
  if (!value || typeof value !== 'object') return null;

  const raw = value as Partial<TemplateSettings>;
  const canvasWidth = Math.max(1, Math.round(toFiniteNumber(raw.canvasWidth, 0)));
  const canvasHeight = Math.max(1, Math.round(toFiniteNumber(raw.canvasHeight, 0)));
  if (!canvasWidth || !canvasHeight) return null;

  const normalizedSlots = Array.isArray(raw.photoSlots)
    ? raw.photoSlots
        .map(slot => {
          if (!slot || typeof slot !== 'object') return null;
          const x = Math.round(toFiniteNumber(slot.x, NaN));
          const y = Math.round(toFiniteNumber(slot.y, NaN));
          const width = Math.round(toFiniteNumber(slot.width, NaN));
          const height = Math.round(toFiniteNumber(slot.height, NaN));
          if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) {
            return null;
          }
          if (width <= 0 || height <= 0) return null;
          return { x, y, width, height };
        })
        .filter((slot): slot is TemplateSlot => Boolean(slot))
    : [];

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
    photoSlots: normalizedSlots,
  };
};

export default function PhotoEditPage() {
  const router = useRouter();

  const [photos, setPhotos] = useState<string[]>([]);
  const [layout, setLayout] = useState(4);

  const [filter, setFilter] = useState('none');
  const [frameColor, setFrameColor] = useState('white');
  const [bottomSpace, setBottomSpace] = useState(85);
  const [frameBorderRadius, setFrameBorderRadius] = useState(0);
  const [photoBorderRadius, setPhotoBorderRadius] = useState(11);
  const [stickers, setStickers] = useState<{ src: string; x: number; y: number; size: number; rotate?: number }[]>([]);
  const [photoGap, setPhotoGap] = useState(8);
  const [selectedFrameTemplate, setSelectedFrameTemplate] = useState('none');
  const [frameTemplates, setFrameTemplates] = useState<FrameTemplateForUI[]>([]);
  const [showPhotoResult, setShowPhotoResult] = useState(false);
  const [photoResultData, setPhotoResultData] = useState<string | null>(null);
  const [photoResultGifUrl, setPhotoResultGifUrl] = useState<string | undefined>(undefined);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [isSavingGallery, setIsSavingGallery] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState('');
  const [cropPhotoIndex, setCropPhotoIndex] = useState(0);
  const [capturedLiveVideoUrl, setCapturedLiveVideoUrl] = useState<string | null>(null);
  const latestGalleryItemRef = useRef<{ signature: string; id: string } | null>(null);
  const latestPersistedGalleryRef = useRef<{ signature: string; id: string } | null>(null);
  const preTemplateAdjustRef = useRef<{
    bottomSpace: number;
    frameBorderRadius: number;
    photoGap: number;
    photoBorderRadius: number;
  } | null>(null);
  const wasTemplateModeRef = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedTemplateSettings = useMemo(() => {
    if (selectedFrameTemplate === 'none') return null;
    const selectedTemplate = frameTemplates.find(template => template.name === selectedFrameTemplate);
    return selectedTemplate?.settings ?? null;
  }, [frameTemplates, selectedFrameTemplate]);

  const isValidPhotoData = (value: string) =>
    typeof value === 'string' && value.startsWith('data:image/') && value.length > 1000;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const layoutParam = Number(params.get('layout') || 4);
    if (Number.isFinite(layoutParam) && layoutParam >= 1) {
      setLayout(layoutParam);
    }

    const savedLiveVideoUrl = loadTempLiveVideoUrlFromSessionStorage();
    setCapturedLiveVideoUrl(savedLiveVideoUrl);
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/list-frame-template');
        const data = await res.json();
        const templates: FrameTemplateForUI[] = [
          { name: 'none', label: 'No Template', src: '' },
          ...(data.templates || []).map((tpl: FrameTemplate) => ({
            name: tpl.name,
            label: tpl.name,
            src: tpl.frameUrl || '',
            sticker: tpl.stickerUrl || '',
            settings: normalizeTemplateSettings(tpl.settings),
          })),
        ];
        setFrameTemplates(templates);
      } catch {
        setFrameTemplates([{ name: 'none', label: 'No Template', src: '' }]);
      }
    };

    fetchTemplates();
    window.addEventListener('frameTemplatesUpdated', fetchTemplates);
    return () => window.removeEventListener('frameTemplatesUpdated', fetchTemplates);
  }, []);

  useEffect(() => {
    const loadPhotos = async () => {
      if (!isIndexedDBSupported()) {
        setError('Browser Anda tidak mendukung IndexedDB.');
        setIsLoading(false);
        return;
      }

      try {
        const cachedPhotos = await loadPhotosFromIndexedDB();
        const validCachedPhotos = cachedPhotos.filter(isValidPhotoData);

        if (validCachedPhotos.length > 0) {
          setPhotos(validCachedPhotos);
          return;
        }

        const tempPhotos = loadTempPhotosFromSessionStorage().filter(isValidPhotoData);
        if (tempPhotos.length > 0) {
          setPhotos(tempPhotos);
          await savePhotosToIndexedDB(tempPhotos);
        }
      } catch {
        setError('Gagal memuat foto dari penyimpanan lokal.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, []);

  useEffect(() => {
    const isTemplateMode = selectedFrameTemplate !== 'none';
    const templatePreset = {
      bottomSpace: selectedTemplateSettings?.bottomSpace ?? 0,
      frameBorderRadius: selectedTemplateSettings?.frameBorderRadius ?? 0,
      photoGap: selectedTemplateSettings?.gap ?? 8,
      photoBorderRadius: selectedTemplateSettings?.photoBorderRadius ?? 0,
    };

    if (isTemplateMode) {
      if (!wasTemplateModeRef.current) {
        preTemplateAdjustRef.current = {
          bottomSpace,
          frameBorderRadius,
          photoGap,
          photoBorderRadius,
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
  }, [selectedFrameTemplate, selectedTemplateSettings, bottomSpace, frameBorderRadius, photoGap, photoBorderRadius]);

  useEffect(() => {
    if (isIndexedDBSupported()) {
      savePhotosToIndexedDB(photos).catch(() => {
        // No-op: we keep UI usable even when persistence fails.
      });
    }
    if (photos.length === 0) {
      clearTempPhotosFromSessionStorage();
    } else {
      saveTempPhotosToSessionStorage(photos);
    }

  }, [photos]);

  const handleRetakePhoto = async (index: number) => {
    if (index < 0 || index >= photos.length) return;

    try {
      if (isIndexedDBSupported()) {
        await savePhotosToIndexedDB(photos);
      }
    } catch {
      // Keep navigation flow working even if persistence fails.
    }

    saveTempPhotosToSessionStorage(photos);
    sessionStorage.setItem('photobooth-retake-single', '1');
    sessionStorage.setItem('photobooth-retake-index', String(index));
    router.push(`/photo?retake=single&index=${index}&layout=${layout}`);
  };

  const handleOpenCrop = (index: number) => {
    if (!photos[index]) return;
    setCropPhotoIndex(index);
    setCropImageUrl(photos[index]);
    setCropModalOpen(true);
  };

  const handleSaveCroppedImage = (croppedImageUrl: string) => {
    setPhotos(prev => prev.map((photo, idx) => (idx === cropPhotoIndex ? croppedImageUrl : photo)));
  };

  const handleAddSticker = (src: string) => {
    setStickers(prev => [...prev, { src, x: 100, y: 100, size: 48, rotate: 0 }]);
  };

  const handleMoveSticker = (idx: number, x: number, y: number) => {
    setStickers(prev => prev.map((s, i) => (i === idx ? { ...s, x, y } : s)));
  };

  const handleResizeSticker = (idx: number, newSize: number) => {
    setStickers(prev =>
      newSize === 0
        ? prev.filter((_, i) => i !== idx)
        : prev.map((s, i) => (i === idx ? { ...s, size: newSize } : s))
    );
  };

  const handleRotateSticker = (idx: number, delta: number) => {
    setStickers(prev => prev.map((s, i) => (i === idx ? { ...s, rotate: ((s.rotate ?? 0) + delta) % 360 } : s)));
  };

  const handleDeleteSticker = (idx: number) => {
    setStickers(prev => prev.filter((_, i) => i !== idx));
  };

  const handleResetDefault = () => {
    setBottomSpace(85);
    setFrameBorderRadius(0);
    setPhotoGap(8);
    setPhotoBorderRadius(11);
    setFilter('none');
    setFrameColor('white');
    setStickers([]);
    setSelectedFrameTemplate('none');
  };

  const handleRetakeAll = async () => {
    if (isIndexedDBSupported()) {
      await clearPhotosFromIndexedDB();
    }
    setPhotos([]);
    setCapturedLiveVideoUrl(null);
    clearTempPhotosFromSessionStorage();
    clearTempLiveVideoUrlFromSessionStorage();
    sessionStorage.setItem('photobooth-retake-reset', '1');
    router.push('/photo?retake=1');
  };

  async function applyFilterToDataUrl(src: string, selectedFilter: string): Promise<string> {
    if (!selectedFilter || selectedFilter === 'none') return src;
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.filter = selectedFilter;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = src;
    });
  }

  const buildStripDataUrl = async (applyActiveFilter: boolean): Promise<string | null> => {
    const node = document.getElementById('strip');
    if (!node) return null;

    const renderWidth = Number(node.getAttribute('data-render-width')) || 0;
    const renderHeight = Number(node.getAttribute('data-render-height')) || 0;
    const nodeRect = node.getBoundingClientRect();
    const widthScale = renderWidth > 0 && nodeRect.width > 0 ? renderWidth / nodeRect.width : 1;
    const heightScale = renderHeight > 0 && nodeRect.height > 0 ? renderHeight / nodeRect.height : 1;
    const targetScale = Math.max(1, widthScale, heightScale);

    if (applyActiveFilter && filter && filter !== 'none') {
      const imgEls = node.querySelectorAll('img[alt^="photo-"]');
      await Promise.all(
        Array.from(imgEls).map(async (img, idx) => {
          const filtered = await applyFilterToDataUrl(photos[idx], filter);
          img.setAttribute('src', filtered);
        })
      );
    }

    const images = Array.from(node.querySelectorAll('img'));
    await Promise.all(
      images.map(
        img =>
          img.complete
            ? Promise.resolve()
            : new Promise(resolve => {
                img.onload = img.onerror = resolve;
              })
      )
    );

    node.classList.add('hide-resize-handle');
    node.classList.add('hide-editor-overlay-controls');
    const canvas = await html2canvas(node, {
      useCORS: true,
      backgroundColor: null,
      scale: (window.devicePixelRatio || 1) * targetScale,
    });
    node.classList.remove('hide-resize-handle');
    node.classList.remove('hide-editor-overlay-controls');

    if (applyActiveFilter && filter && filter !== 'none') {
      const imgEls = node.querySelectorAll('img[alt^="photo-"]');
      imgEls.forEach((img, idx) => {
        img.setAttribute('src', photos[idx]);
      });
    }

    return canvas.toDataURL('image/png');
  };

  const uploadStripToCloud = async (imageDataUrl: string): Promise<string | null> => {
    try {
      // Use FormData path for better upload stability compared to large JSON base64 payloads.
      const blobResponse = await fetch(imageDataUrl);
      const blob = await blobResponse.blob();
      const formData = new FormData();
      formData.append('media', new File([blob], `strip-${Date.now()}.png`, { type: blob.type || 'image/png' }));
      formData.append('kind', 'strip');

      const res = await fetch('/api/upload-strip', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return typeof data?.url === 'string' ? data.url : null;
      }

      // Fallback to legacy JSON upload path.
      const fallbackRes = await fetch('/api/upload-strip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageDataUrl }),
      });

      if (!fallbackRes.ok) return null;
      const fallbackData = await fallbackRes.json();
      return typeof fallbackData?.url === 'string' ? fallbackData.url : null;
    } catch {
      return null;
    }
  };

  const uploadMediaBlobToCloud = async (blob: Blob, kind: 'gif' | 'live' | 'frame'): Promise<string | null> => {
    try {
      const extension = kind === 'gif' ? 'gif' : kind === 'live' ? 'webm' : 'png';
      const mimeType = blob.type || (kind === 'gif' ? 'image/gif' : kind === 'live' ? 'video/webm' : 'image/png');
      const file = new File([blob], `${kind}.${extension}`, { type: mimeType });
      const formData = new FormData();
      formData.append('media', file);
      formData.append('kind', kind);

      const res = await fetch('/api/upload-strip', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) return null;
      const data = await res.json();
      return typeof data?.url === 'string' ? data.url : null;
    } catch {
      return null;
    }
  };

  const uploadCaptureFramesToCloud = async (sources: string[]): Promise<string[]> => {
    const uploaded: string[] = [];

    for (const src of sources) {
      if (typeof src !== 'string' || !src) continue;

      try {
        const response = await fetch(src);
        if (!response.ok) continue;
        const blob = await response.blob();
        const url = await uploadMediaBlobToCloud(blob, 'frame');
        if (url) {
          uploaded.push(url);
        }
      } catch {
        // Skip failed frames so process can continue for other photos.
      }
    }

    return uploaded;
  };

  const createGifAssets = async (): Promise<{ objectUrl: string; blob: Blob } | null> => {
    if (photos.length === 0) return null;

    const GIF = (await import('gif.js')).default;
    const firstImg = new window.Image();
    firstImg.src = photos[0];
    await new Promise(resolve => {
      firstImg.onload = resolve;
    });

    const width = firstImg.naturalWidth;
    const height = firstImg.naturalHeight;
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width,
      height,
      workerScript: '/gif.worker.js',
    });

    for (let i = 0; i < photos.length; i++) {
      const img = new window.Image();
      img.src = photos[i];
      await new Promise(resolve => {
        img.onload = resolve;
      });

      const gifCanvas = document.createElement('canvas');
      gifCanvas.width = width;
      gifCanvas.height = height;
      const ctx = gifCanvas.getContext('2d');
      if (!ctx) continue;

      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      gif.addFrame(gifCanvas, { delay: 800 });
    }

    const blob = await new Promise<Blob>(resolve => {
      gif.on('finished', function(generatedBlob: Blob) {
        resolve(generatedBlob);
      });
      gif.render();
    });

    const objectUrl = URL.createObjectURL(blob);
    return { objectUrl, blob };
  };

  const createLiveVideoAssets = async (): Promise<{ objectUrl: string; blob: Blob } | null> => {
    if (photos.length === 0 || typeof MediaRecorder === 'undefined') return null;

    const candidateTypes = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    const supportedType = candidateTypes.find(type =>
      typeof MediaRecorder.isTypeSupported === 'function' ? MediaRecorder.isTypeSupported(type) : false
    );

    try {
      const firstImg = new window.Image();
      firstImg.src = photos[0];
      await new Promise(resolve => {
        firstImg.onload = resolve;
      });

      const baseWidth = firstImg.naturalWidth || 640;
      const baseHeight = firstImg.naturalHeight || 480;
      const minTargetWidth = 960;
      const maxTargetWidth = 1280;

      let width = baseWidth;
      let height = baseHeight;

      if (width < minTargetWidth) {
        const upscale = minTargetWidth / width;
        width = Math.round(width * upscale);
        height = Math.round(height * upscale);
      }

      if (width > maxTargetWidth) {
        const downscale = maxTargetWidth / width;
        width = Math.round(width * downscale);
        height = Math.round(height * downscale);
      }

      width = width % 2 === 0 ? width : width - 1;
      height = height % 2 === 0 ? height : height - 1;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const stream = canvas.captureStream(30);
      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(
        stream,
        supportedType ? { mimeType: supportedType, videoBitsPerSecond: 6_000_000 } : undefined
      );

      recorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      const stopped = new Promise<void>(resolve => {
        recorder.onstop = () => resolve();
      });

      recorder.start(200);

      const baseSequence = photos.length > 1 ? [...photos, ...photos.slice().reverse()] : [...photos];
      const frameHoldMs = 450;
      const minDurationMs = 9000;
      const loopCount = Math.min(5, Math.max(2, Math.ceil(minDurationMs / (baseSequence.length * frameHoldMs))));

      for (let loop = 0; loop < loopCount; loop++) {
        for (const src of baseSequence) {
          const frame = new window.Image();
          frame.src = src;
          await new Promise(resolve => {
            frame.onload = resolve;
          });
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(frame, 0, 0, width, height);
          await new Promise(resolve => setTimeout(resolve, frameHoldMs));
        }
      }

      await new Promise(resolve => setTimeout(resolve, 250));

      recorder.stop();
      await stopped;

      const blob = new Blob(chunks, { type: supportedType || 'video/webm' });
      if (blob.size === 0) return null;

      const objectUrl = URL.createObjectURL(blob);
      return { objectUrl, blob };
    } catch {
      return null;
    }
  };

  const saveStripToGallery = (stripDataUrl: string, publicUrl?: string): string => {
    const signature = `${stripDataUrl.length}-${stripDataUrl.slice(0, 120)}`;

    if (latestGalleryItemRef.current?.signature === signature) {
      if (publicUrl) {
        updateGalleryItemPublicUrl(latestGalleryItemRef.current.id, publicUrl);
      }
      return latestGalleryItemRef.current.id;
    }

    const item = addGalleryItem({
      stripDataUrl,
      publicUrl,
      layout,
      filter,
    });

    latestGalleryItemRef.current = { signature, id: item.id };
    return item.id;
  };

  const persistStripToGalleryDatabase = async (params: {
    imageUrl: string;
    previewDataUrl?: string | null;
    gifDataUrl?: string | null;
    liveVideoDataUrl?: string | null;
    photoFrames?: string[];
    livePhotos?: string[];
    title?: string;
  }): Promise<PersistedGallery | null> => {
    if (!params.imageUrl || params.imageUrl.startsWith('data:image/')) {
      return null;
    }

    const signature = `${params.imageUrl.length}-${params.imageUrl.slice(0, 120)}`;
    if (latestPersistedGalleryRef.current?.signature === signature) {
      return { id: latestPersistedGalleryRef.current.id };
    }

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: params.imageUrl,
          previewDataUrl: params.previewDataUrl ?? null,
          gifDataUrl: params.gifDataUrl ?? null,
          liveVideoDataUrl: params.liveVideoDataUrl ?? null,
          photoFrames: params.photoFrames ?? [],
          livePhotos: params.livePhotos ?? [],
          title: params.title ?? 'Photo Strip',
          layout,
          filter,
        }),
      });

      if (!res.ok) return null;
      const data = await res.json();
      if (typeof data?.item?.id !== 'string') return null;
      latestPersistedGalleryRef.current = { signature, id: data.item.id };
      return { id: data.item.id };
    } catch {
      return null;
    }
  };

  const handleDownloadStrip = async () => {
    setIsLoadingResult(true);
    try {
      const dataUrl = await buildStripDataUrl(true);
      if (!dataUrl) return;

      const uploadedUrl = await uploadStripToCloud(dataUrl);
      saveStripToGallery(dataUrl, uploadedUrl ?? undefined);
      const gifAssets = await createGifAssets();
      const liveVideoAssets = capturedLiveVideoUrl ? null : await createLiveVideoAssets();
      const uploadedGifUrl = gifAssets?.blob ? await uploadMediaBlobToCloud(gifAssets.blob, 'gif') : null;
      const uploadedLiveUrl = capturedLiveVideoUrl ?? (liveVideoAssets?.blob ? await uploadMediaBlobToCloud(liveVideoAssets.blob, 'live') : null);
      const uploadedFrameUrls = await uploadCaptureFramesToCloud(photos);

      await persistStripToGalleryDatabase({
        imageUrl: uploadedUrl ?? dataUrl,
        previewDataUrl: uploadedUrl ?? null,
        gifDataUrl: uploadedGifUrl,
        liveVideoDataUrl: uploadedLiveUrl,
        photoFrames: uploadedFrameUrls,
        livePhotos: uploadedFrameUrls,
      });

      if (liveVideoAssets?.objectUrl) {
        URL.revokeObjectURL(liveVideoAssets.objectUrl);
      }

      setPhotoResultData(dataUrl);
      setPhotoResultGifUrl(gifAssets?.objectUrl);
      setShowPhotoResult(true);
    } finally {
      setIsLoadingResult(false);
    }
  };

  const handleSaveGallery = async () => {
    setIsSavingGallery(true);
    setIsLoadingResult(true);

    try {
      const dataUrl = await buildStripDataUrl(true);
      if (!dataUrl) return;

      const uploadedUrl = await uploadStripToCloud(dataUrl);
      saveStripToGallery(dataUrl, uploadedUrl ?? undefined);

      const gifAssets = await createGifAssets();
      const liveVideoAssets = capturedLiveVideoUrl ? null : await createLiveVideoAssets();
      const uploadedGifUrl = gifAssets?.blob ? await uploadMediaBlobToCloud(gifAssets.blob, 'gif') : null;
      const uploadedLiveUrl = capturedLiveVideoUrl ?? (liveVideoAssets?.blob ? await uploadMediaBlobToCloud(liveVideoAssets.blob, 'live') : null);
      const uploadedFrameUrls = await uploadCaptureFramesToCloud(photos);

      const persisted = await persistStripToGalleryDatabase({
        imageUrl: uploadedUrl ?? dataUrl,
        previewDataUrl: uploadedUrl ?? null,
        gifDataUrl: uploadedGifUrl,
        liveVideoDataUrl: uploadedLiveUrl,
        photoFrames: uploadedFrameUrls,
        livePhotos: uploadedFrameUrls,
      });

      if (gifAssets?.objectUrl) {
        URL.revokeObjectURL(gifAssets.objectUrl);
      }

      if (liveVideoAssets?.objectUrl) {
        URL.revokeObjectURL(liveVideoAssets.objectUrl);
      }

      if (persisted?.id) {
        clearTempLiveVideoUrlFromSessionStorage();
        router.push(`/photo/gallery/${persisted.id}`);
      } else {
        alert('Gagal membuat ID gallery. Silakan coba lagi.');
        router.push('/photo/gallery');
      }
    } finally {
      setIsSavingGallery(false);
      setIsLoadingResult(false);
    }
  };

  if (isLoading) {
    return (
      <main className="pb-page-bg min-h-screen flex items-center justify-center px-4">
        <p className="text-[#d72688] font-semibold">Memuat editor...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pb-page-bg min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#c43779] font-medium text-center">{error}</p>
        <button
          onClick={() => router.push('/photo')}
          className="px-5 py-2 rounded-xl bg-[#fa75aa] text-white hover:bg-[#e35d95] transition"
        >
          Kembali ke Capture
        </button>
      </main>
    );
  }

  return (
    <>
      <main className="pb-page-bg min-h-screen flex flex-col items-center justify-center gap-6 py-8 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#d72688] text-center">PhotoBooth Editor</h1>
        <p className="text-gray-600 text-sm">{photos.length}/{layout} foto siap untuk diedit</p>

        {photos.length === 0 ? (
          <div className="w-full max-w-5xl bg-white rounded-2xl p-10 shadow-md text-center">
            <p className="text-gray-600 mb-4">Belum ada foto. Kembali ke halaman capture.</p>
            <button
              onClick={() => router.push('/photo')}
              className="px-6 py-2 rounded-xl bg-[#fa75aa] text-white hover:bg-[#e35d95] transition"
            >
              Kembali ke Capture
            </button>
          </div>
        ) : (
          <div className="strip-controls-wrapper">
            <div className="strip-preview-panel" style={{ minWidth: 0 }}>
              <PhotoPreview
                photos={photos}
                filter={filter}
                frameColor={frameColor}
                bottomSpace={bottomSpace}
                frameBorderRadius={frameBorderRadius}
                photoBorderRadius={photoBorderRadius}
                stickers={stickers}
                onMoveSticker={handleMoveSticker}
                onResizeSticker={handleResizeSticker}
                onRotateSticker={handleRotateSticker}
                onDeleteSticker={handleDeleteSticker}
                gap={photoGap}
                frameTemplates={frameTemplates}
                selectedFrameTemplate={selectedFrameTemplate}
                selectedTemplateSettings={selectedTemplateSettings}
                onRetake={handleRetakePhoto}
                onCrop={handleOpenCrop}
              />
            </div>

            <div
              className="photo-editor-panel"
              style={{
                minWidth: 0,
                position: 'sticky',
                top: 32,
              }}
            >
              <PhotoEditor
                onChangeSlider={setBottomSpace}
                sliderValue={bottomSpace}
                onAddSticker={handleAddSticker}
                onSelectFrame={setFrameColor}
                selectedFrame={frameColor}
                frameTemplates={frameTemplates}
                selectedFrameTemplate={selectedFrameTemplate}
                onSelectFrameTemplate={setSelectedFrameTemplate}
                availableFrames={[
                  { name: 'white', label: 'White', color: '#fff' },
                  { name: 'pink', label: 'Pink', color: '#fa75aa' },
                  { name: 'yellow', label: 'Yellow', color: '#ffe066' },
                  { name: 'blue', label: 'Blue', color: '#7ecbff' },
                ]}
                availableStickers={[]}
                frameBorderRadius={frameBorderRadius}
                onChangeFrameBorderRadius={setFrameBorderRadius}
                photoGap={photoGap}
                onChangePhotoGap={setPhotoGap}
                photoBorderRadius={photoBorderRadius}
                onChangePhotoBorderRadius={setPhotoBorderRadius}
                onResetDefault={handleResetDefault}
              />

              <div className="photo-editor-actions" style={{ marginTop: 24 }}>
                <button
                  onClick={handleRetakeAll}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#fa75aa',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Retake
                </button>
                <button
                  onClick={handleDownloadStrip}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#fa75aa',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Download Strip
                </button>
                <button
                  onClick={handleSaveGallery}
                  disabled={isSavingGallery}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#fff',
                    color: '#d72688',
                    border: '1px solid #fa75aa',
                    borderRadius: '24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isSavingGallery ? 'not-allowed' : 'pointer',
                    opacity: isSavingGallery ? 0.6 : 1,
                  }}
                >
                  {isSavingGallery ? 'Menyimpan...' : 'Simpan Gallery'}
                </button>
              </div>
            </div>

            {showPhotoResult && photoResultData && (
              <div
                style={{
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
                  zIndex: 2000,
                }}
                onClick={() => setShowPhotoResult(false)}
              >
                <div
                  style={{
                    background: '#fff',
                    padding: 24,
                    borderRadius: 16,
                    border: '1px solid #f3b7d1',
                    boxShadow: '0 16px 40px rgba(250,117,170,0.2)',
                    minWidth: 340,
                    maxWidth: 420,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <PhotoResult
                    photos={photos}
                    frames={[photoResultData]}
                    gifUrl={photoResultGifUrl}
                    onClose={() => setShowPhotoResult(false)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {isLoadingResult && (
        <div
          style={{
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
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: 32,
              borderRadius: 16,
              border: '1px solid #f3b7d1',
              boxShadow: '0 16px 40px rgba(250,117,170,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              minWidth: 320,
            }}
          >
            <span style={{ color: '#d72688', fontWeight: 600, fontSize: 18 }}>Processing...</span>
          </div>
        </div>
      )}

      <CropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageUrl={cropImageUrl}
        onSave={handleSaveCroppedImage}
        photoIndex={cropPhotoIndex}
      />

    </>
  );
}
