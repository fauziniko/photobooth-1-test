'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import CropModal from '@/components/CropModal';
import PhotoPreview from '@/components/PhotoPreview';
import PhotoEditor from '@/components/PhotoEditor';
import UploadFrameTemplateModal from '@/components/UploadFrameTemplateModal';
import PhotoResult from '@/components/PhotoResult';
import {
  clearPhotosFromIndexedDB,
  isIndexedDBSupported,
  loadPhotosFromIndexedDB,
  savePhotosToIndexedDB,
} from '@/lib/indexedDB';
import { addGalleryItem, updateGalleryItemPublicUrl } from '@/lib/photoGallery';
import {
  clearTempPhotosFromSessionStorage,
  loadTempPhotosFromSessionStorage,
  saveTempPhotosToSessionStorage,
} from '@/lib/tempPhotoStorage';

type FrameTemplate = { name: string; frameUrl: string; stickerUrl: string };
type FrameTemplateForUI = { name: string; label: string; src: string; sticker?: string };
type PersistedGallery = { id: string };

export default function PhotoEditPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [photos, setPhotos] = useState<string[]>([]);
  const [layout, setLayout] = useState(4);

  const [filter, setFilter] = useState('none');
  const [frameColor, setFrameColor] = useState('white');
  const [bottomSpace, setBottomSpace] = useState(85);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [frameBorderRadius, setFrameBorderRadius] = useState(0);
  const [photoBorderRadius, setPhotoBorderRadius] = useState(11);
  const [stickers, setStickers] = useState<{ src: string; x: number; y: number; size: number; rotate?: number }[]>([]);
  const [photoGap, setPhotoGap] = useState(8);
  const [selectedFrameTemplate, setSelectedFrameTemplate] = useState('none');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [frameTemplates, setFrameTemplates] = useState<FrameTemplateForUI[]>([]);
  const [showPhotoResult, setShowPhotoResult] = useState(false);
  const [photoResultData, setPhotoResultData] = useState<string | null>(null);
  const [photoResultGifUrl, setPhotoResultGifUrl] = useState<string | undefined>(undefined);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [isSavingGallery, setIsSavingGallery] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState('');
  const [cropPhotoIndex, setCropPhotoIndex] = useState(0);
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const latestGalleryItemRef = useRef<{ signature: string; id: string } | null>(null);
  const latestPersistedGalleryRef = useRef<{ signature: string; id: string } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isValidPhotoData = (value: string) =>
    typeof value === 'string' && value.startsWith('data:image/') && value.length > 1000;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const layoutParam = Number(params.get('layout') || 4);
    if (Number.isFinite(layoutParam) && layoutParam >= 1) {
      setLayout(layoutParam);
    }
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

    setSelectedCropIndex(prev => (prev > Math.max(photos.length - 1, 0) ? 0 : prev));
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
    clearTempPhotosFromSessionStorage();
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
    const canvas = await html2canvas(node, {
      useCORS: true,
      backgroundColor: null,
    });
    node.classList.remove('hide-resize-handle');

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
      const res = await fetch('/api/upload-strip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageDataUrl }),
      });

      if (!res.ok) return null;
      const data = await res.json();
      return typeof data?.url === 'string' ? data.url : null;
    } catch {
      return null;
    }
  };

  const convertBlobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  };

  const createGifAssets = async (): Promise<{ objectUrl: string; dataUrl: string } | null> => {
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
    const dataUrl = await convertBlobToDataUrl(blob);
    return { objectUrl, dataUrl };
  };

  const createLiveVideoAssets = async (): Promise<{ objectUrl: string; dataUrl: string } | null> => {
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
      const dataUrl = await convertBlobToDataUrl(blob);
      return { objectUrl, dataUrl };
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
    previewDataUrl: string;
    stripDataUrl: string;
    gifDataUrl: string | null;
    liveVideoDataUrl: string | null;
    photoFrames: string[];
    livePhotos: string[];
  }): Promise<PersistedGallery | null> => {
    const signature = `${params.stripDataUrl.length}-${params.stripDataUrl.slice(0, 120)}`;
    if (latestPersistedGalleryRef.current?.signature === signature) {
      return { id: latestPersistedGalleryRef.current.id };
    }

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: params.imageUrl,
          previewDataUrl: params.previewDataUrl,
          stripDataUrl: params.stripDataUrl,
          gifDataUrl: params.gifDataUrl,
          liveVideoDataUrl: params.liveVideoDataUrl,
          photoFrames: params.photoFrames,
          livePhotos: params.livePhotos,
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
      const liveVideoAssets = await createLiveVideoAssets();

      await persistStripToGalleryDatabase({
        imageUrl: uploadedUrl ?? dataUrl,
        previewDataUrl: dataUrl,
        stripDataUrl: dataUrl,
        gifDataUrl: gifAssets?.dataUrl ?? null,
        liveVideoDataUrl: liveVideoAssets?.dataUrl ?? null,
        photoFrames: photos,
        livePhotos: photos,
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

  const handleShowQR = async () => {
    setIsLoadingResult(true);
    try {
      const dataUrl = await buildStripDataUrl(false);
      if (!dataUrl) return;

      const uploadedUrl = await uploadStripToCloud(dataUrl);
      const galleryItemId = saveStripToGallery(dataUrl, uploadedUrl ?? undefined);
      const gifAssets = await createGifAssets();
      const liveVideoAssets = await createLiveVideoAssets();

      const persisted = await persistStripToGalleryDatabase({
        imageUrl: uploadedUrl ?? dataUrl,
        previewDataUrl: dataUrl,
        stripDataUrl: dataUrl,
        gifDataUrl: gifAssets?.dataUrl ?? null,
        liveVideoDataUrl: liveVideoAssets?.dataUrl ?? null,
        photoFrames: photos,
        livePhotos: photos,
      });

      if (gifAssets?.objectUrl) {
        URL.revokeObjectURL(gifAssets.objectUrl);
      }

      if (liveVideoAssets?.objectUrl) {
        URL.revokeObjectURL(liveVideoAssets.objectUrl);
      }

      const galleryItemLink = persisted?.id
        ? `${window.location.origin}/photo/gallery/${persisted.id}`
        : `${window.location.origin}/photo/gallery?item=${galleryItemId}`;
      setQrData(galleryItemLink);
      setShowQR(true);
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
      const liveVideoAssets = await createLiveVideoAssets();

      const persisted = await persistStripToGalleryDatabase({
        imageUrl: uploadedUrl ?? dataUrl,
        previewDataUrl: dataUrl,
        stripDataUrl: dataUrl,
        gifDataUrl: gifAssets?.dataUrl ?? null,
        liveVideoDataUrl: liveVideoAssets?.dataUrl ?? null,
        photoFrames: photos,
        livePhotos: photos,
      });

      if (gifAssets?.objectUrl) {
        URL.revokeObjectURL(gifAssets.objectUrl);
      }

      if (liveVideoAssets?.objectUrl) {
        URL.revokeObjectURL(liveVideoAssets.objectUrl);
      }

      if (persisted?.id) {
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

  const handleCloseQR = () => {
    setShowQR(false);
    setQrData(null);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4">
        <p className="text-[#d72688] font-semibold">Memuat editor...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4">
        <p className="text-red-600 font-medium text-center">{error}</p>
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
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] p-4">
          <UploadFrameTemplateModal onClose={() => setShowUploadModal(false)} />
        </div>
      )}

      <main className="min-h-screen flex flex-col items-center justify-center gap-6 py-8 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
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
            <div style={{ flex: 2, minWidth: 0 }}>
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
                onRetake={handleRetakePhoto}
              />
            </div>

            <div
              className="photo-editor-panel"
              style={{
                flex: 1,
                minWidth: 0,
                maxWidth: 900,
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
                onShowUploadModal={() => setShowUploadModal(true)}
                userRole={session?.user?.role}
              />

              <div className="photo-editor-actions" style={{ marginTop: 24 }}>
                <div style={{ width: '100%', marginBottom: 8 }}>
                  <div style={{ color: '#d72688', fontWeight: 600, marginBottom: 6, fontSize: 14 }}>Crop Photo</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select
                      value={selectedCropIndex}
                      onChange={e => setSelectedCropIndex(Number(e.target.value))}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: 10,
                        border: '1px solid #fa75aa',
                        color: '#d72688',
                        background: '#fff',
                        fontWeight: 500,
                      }}
                    >
                      {photos.map((_, idx) => (
                        <option key={idx} value={idx}>
                          Photo {idx + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleOpenCrop(selectedCropIndex)}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#fa75aa',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Crop
                    </button>
                  </div>
                </div>

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
                  onClick={handleShowQR}
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
                  QR Code
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
                <button
                  onClick={async () => {
                    const node = document.getElementById('strip');
                    if (!node) return;
                    let win: Window | null = null;
                    try {
                      win = window.open('');
                    } catch {
                      win = null;
                    }
                    if (!win) {
                      alert('Popup blocked! Please allow popups for this site to print.');
                      return;
                    }
                    node.classList.add('hide-resize-handle');
                    const canvas = await html2canvas(node, { useCORS: true, backgroundColor: null });
                    node.classList.remove('hide-resize-handle');
                    const dataUrl = canvas.toDataURL('image/png');
                    const mmWidth = 297 - 25;
                    const mmHeight = 210 - 25;
                    try {
                      win.document.write(`
<html>
  <head>
    <title>Print Photo Strip</title>
    <style>
      @media print {
        @page {
          size: A4 landscape;
          margin: 12mm;
        }
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          background: #fff;
          text-align: left !important;
        }
        img {
          display: block;
          margin: 0 !important;
          width: ${mmWidth}mm !important;
          height: ${mmHeight}mm !important;
          max-width: none !important;
          max-height: none !important;
          object-fit: contain;
        }
      }
      body {
        margin: 0;
        padding: 0;
        background: #fff;
        text-align: left !important;
      }
    </style>
  </head>
  <body>
    <img src="${dataUrl}" style="width:${mmWidth}mm;height:${mmHeight}mm;display:block;margin:0;" />
    <script>
      window.onload = function(){
        try { window.print(); } catch(e){}
      }
    </script>
  </body>
</html>
`);
                      win.document.close();
                    } catch {
                      win.location.href = dataUrl;
                    }
                  }}
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
                  Print
                </button>
              </div>
            </div>

            {showQR && qrData && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}
                onClick={handleCloseQR}
              >
                <div
                  style={{
                    background: '#fff',
                    padding: 32,
                    borderRadius: 16,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                    minWidth: 320,
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <h2 style={{ margin: 0, color: '#111' }}>Scan QR to Download</h2>
                  <QRCodeCanvas value={qrData} size={220} />
                  <button
                    onClick={handleCloseQR}
                    style={{
                      marginTop: 16,
                      padding: '8px 24px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#ff1744',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: 16,
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {showPhotoResult && photoResultData && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
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
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
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
            background: 'rgba(0,0,0,0.5)',
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
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
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
