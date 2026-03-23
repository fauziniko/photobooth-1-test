'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, ChevronLeft, ChevronRight, Copy, Download, ExternalLink, ImageIcon, Printer, QrCode, Share2 } from 'lucide-react';
import { isIndexedDBSupported, savePhotosToIndexedDB } from '@/lib/indexedDB';
import {
  clearTempLiveVideoUrlFromSessionStorage,
  saveTempLiveVideoUrlToSessionStorage,
  saveTempPhotosToSessionStorage,
} from '@/lib/tempPhotoStorage';

type GalleryDetailItem = {
  id: string;
  createdAt: string;
  imageUrl: string;
  layout: number;
  filter: string;
  canvasWidth: number | null;
  canvasHeight: number | null;
  previewDataUrl: string | null;
  stripDataUrl: string | null;
  gifDataUrl: string | null;
  liveVideoDataUrl: string | null;
  photoFrames: string[];
  livePhotos: string[];
  selectedFrameTemplate: string;
  templateSettings: {
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
    photoSlots: Array<{ x: number; y: number; width: number; height: number }>;
  } | null;
  frameTemplateUrl: string | null;
  frameStickerUrl: string | null;
  frameColor: string | null;
};

const normalizeVideoSource = (value: string | null | undefined) => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('data:video/')) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return trimmed;
  return null;
};

const isGifSource = (value: string | null | undefined) => {
  if (!value || typeof value !== 'string') return false;
  if (value.startsWith('data:image/gif')) return true;
  return /\.gif(\?|#|$)/i.test(value);
};

export default function GalleryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { status } = useSession();

  const [item, setItem] = useState<GalleryDetailItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState('');
  const [mediaIndex, setMediaIndex] = useState(0);
  const [showQrPopup, setShowQrPopup] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [generatedGifDataUrl, setGeneratedGifDataUrl] = useState<string | null>(null);
  const [, setIsGeneratingGif] = useState(false);
  const [isPreparingEditor, setIsPreparingEditor] = useState(false);
  const mediaTouchStartXRef = useRef<number | null>(null);

  const normalizeEditorImageSource = (value: string): string | null => {
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        setError('Invalid gallery ID.');
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/gallery/${id}`, { cache: 'no-store' });
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
      } catch {
        setError('An error occurred while loading gallery details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const detailLink = useMemo(() => {
    if (!origin || !id) return '/photo/gallery';
    return `${origin}/photo/gallery/${id}`;
  }, [origin, id]);

  const imagePreview = item?.stripDataUrl ?? item?.previewDataUrl ?? item?.imageUrl ?? '';
  const capturePhotos = useMemo(() => {
    if (!item) return [] as string[];
    if (item.photoFrames.length > 0) return item.photoFrames;
    if (item.livePhotos.length > 0) return item.livePhotos;
    return imagePreview ? [imagePreview] : [];
  }, [item, imagePreview]);

  const rawLiveCandidate = item?.liveVideoDataUrl;
  const rawGifCandidate = item?.gifDataUrl ?? generatedGifDataUrl;
  const liveVideoSrc = normalizeVideoSource(rawLiveCandidate);
  const gifSrc = isGifSource(rawGifCandidate)
    ? rawGifCandidate
    : (!liveVideoSrc && isGifSource(rawLiveCandidate) ? rawLiveCandidate : null);

  const mediaSlides = useMemo(() => {
    const slides: Array<{
      key: string;
      type: 'image' | 'video';
      label: string;
      src: string;
      downloadName: string;
      downloadLabel: string;
    }> = [];

    const stripSrc = item?.stripDataUrl ?? imagePreview ?? item?.imageUrl ?? '';
    if (stripSrc) {
      slides.push({
        key: 'strip',
        type: 'image',
        label: 'Strip',
        src: stripSrc,
        downloadName: `strip-${id}.png`,
        downloadLabel: 'Download Strip',
      });
    }

    if (liveVideoSrc) {
      const liveExt = /\.mp4(\?|#|$)/i.test(liveVideoSrc)
        ? 'mp4'
        : /\.(mov|m4v)(\?|#|$)/i.test(liveVideoSrc)
          ? 'mov'
          : 'webm';

      slides.push({
        key: 'live-video',
        type: 'video',
        label: 'Live Video',
        src: liveVideoSrc,
        downloadName: `live-${id}.${liveExt}`,
        downloadLabel: 'Download Live',
      });
    }

    if (gifSrc) {
      slides.push({
        key: 'gif',
        type: 'image',
        label: 'GIF',
        src: gifSrc,
        downloadName: `gif-${id}.gif`,
        downloadLabel: 'Download GIF',
      });
    }

    capturePhotos.forEach((src, idx) => {
      slides.push({
        key: `capture-${idx}`,
        type: 'image',
        label: `Captured Photo ${idx + 1}`,
        src,
        downloadName: `capture-${id}-${idx + 1}.png`,
        downloadLabel: 'Download Photo',
      });
    });

    return slides;
  }, [capturePhotos, gifSrc, id, imagePreview, item?.imageUrl, item?.stripDataUrl, liveVideoSrc]);

  useEffect(() => {
    setMediaIndex(0);
  }, [mediaSlides.length]);

  useEffect(() => {
    setGeneratedGifDataUrl(null);
    setMediaIndex(0);
  }, [item?.id]);

  const createGifFromFrames = async (frames: string[]): Promise<string | null> => {
    if (frames.length === 0) return null;

    try {
      const GIF = (await import('gif.js')).default;
      const firstImg = new window.Image();
      firstImg.src = frames[0];
      await new Promise(resolve => {
        firstImg.onload = resolve;
      });

      const width = firstImg.naturalWidth || 640;
      const height = firstImg.naturalHeight || 480;

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width,
        height,
        workerScript: '/gif.worker.js',
      });

      const sequence = frames.length > 1 ? [...frames, ...frames.slice().reverse()] : [...frames];

      for (const src of sequence) {
        const image = new window.Image();
        image.src = src;
        await new Promise(resolve => {
          image.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.drawImage(image, 0, 0, width, height);
        gif.addFrame(canvas, { delay: 700 });
      }

      const blob = await new Promise<Blob>(resolve => {
        gif.on('finished', function(generatedBlob: Blob) {
          resolve(generatedBlob);
        });
        gif.render();
      });

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });

      return dataUrl;
    } catch {
      return null;
    }
  };


  const handleDownload = async (url: string | null | undefined, filename: string) => {
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
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const ensureGif = async () => {
      if (!item || item.gifDataUrl || capturePhotos.length === 0 || generatedGifDataUrl) return;
      setIsGeneratingGif(true);
      const generated = await createGifFromFrames(capturePhotos);
      if (isMounted) {
        setGeneratedGifDataUrl(generated);
        setIsGeneratingGif(false);
      }
    };

    ensureGif();

    return () => {
      isMounted = false;
    };
  }, [capturePhotos, generatedGifDataUrl, item]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(detailLink);
      alert('Detail link copied successfully');
    } catch {
      alert('Failed to copy detail link');
    }
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({
          title: 'Gallery Detail',
          text: `View photobooth result ID ${item?.id ?? ''}`,
          url: detailLink,
        });
        return;
      }

      await copyLink();
    } catch {
      // Ignore aborted share
    }
  };

  const handleEditInEditor = async () => {
    if (!item) return;

    setIsPreparingEditor(true);
    try {
      const sourcePhotos = [
        ...(Array.isArray(item.photoFrames) ? item.photoFrames : []),
      ];

      if (sourcePhotos.length === 0 && Array.isArray(item.livePhotos)) {
        sourcePhotos.push(...item.livePhotos);
      }

      if (sourcePhotos.length === 0) {
        if (item.stripDataUrl) sourcePhotos.push(item.stripDataUrl);
        else if (item.previewDataUrl) sourcePhotos.push(item.previewDataUrl);
        else if (item.imageUrl) sourcePhotos.push(item.imageUrl);
      }

      const normalizedPhotos = sourcePhotos
        .map(normalizeEditorImageSource)
        .filter((v): v is string => Boolean(v));
      if (normalizedPhotos.length === 0) {
        alert('Photos for this item are not available in the editor.');
        return;
      }

      saveTempPhotosToSessionStorage(normalizedPhotos);
      if (isIndexedDBSupported()) {
        await savePhotosToIndexedDB(normalizedPhotos);
      }

      if (item.liveVideoDataUrl && typeof item.liveVideoDataUrl === 'string') {
        saveTempLiveVideoUrlToSessionStorage(item.liveVideoDataUrl);
      } else {
        clearTempLiveVideoUrlFromSessionStorage();
      }

      const nextLayout = Number.isFinite(Number(item.layout))
        ? Number(item.layout)
        : Math.max(1, normalizedPhotos.length);

      router.push(`/photo/edit?layout=${nextLayout}&source=gallery&id=${item.id}`);
    } catch {
      alert('An error occurred while preparing the editor.');
    } finally {
      setIsPreparingEditor(false);
    }
  };

  const handlePrintCurrent = () => {
    const currentSlide = mediaSlides[mediaIndex];
    const fallbackImageSlide = mediaSlides.find(slide => slide.type === 'image');
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

  const handleDownloadAll = async () => {
    if (mediaSlides.length === 0 || isDownloadingAll) return;
    setIsDownloadingAll(true);

    try {
      for (const slide of mediaSlides) {
        await handleDownload(slide.src, slide.downloadName);
        await new Promise(resolve => setTimeout(resolve, 180));
      }
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const onMediaSwipeStart = (event: React.TouchEvent<HTMLDivElement>) => {
    mediaTouchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const onMediaSwipeEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (mediaTouchStartXRef.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? mediaTouchStartXRef.current;
    const delta = endX - mediaTouchStartXRef.current;
    mediaTouchStartXRef.current = null;

    if (Math.abs(delta) < 35) return;
    if (delta < 0) {
      setMediaIndex(prev => Math.min(prev + 1, Math.max(mediaSlides.length - 1, 0)));
    } else {
      setMediaIndex(prev => Math.max(prev - 1, 0));
    }
  };

  return (
    <main className="pb-page-bg min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {status === 'authenticated' ? (
          <div className="mb-4">
            <Link
              href="/photo/gallery"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Link>
          </div>
        ) : null}

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-pink-100 shadow-md p-10 text-center text-gray-500 font-medium">
            Loading gallery details...
          </div>
        ) : error || !item ? (
          <div className="bg-white rounded-2xl border border-pink-100 shadow-md p-10 text-center">
            <ImageIcon className="w-10 h-10 text-pink-300 mx-auto mb-3" />
            <p className="text-gray-700 font-medium">{error ?? 'Gallery item not found.'}</p>
            <p className="text-sm text-gray-500 mt-1">Please make sure the opened link is correct.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-pink-100 shadow-md overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-pink-50 p-4 flex items-center justify-center">
                  {mediaSlides.length === 0 ? (
                    <p className="text-sm text-gray-500">Media is not available for this item yet.</p>
                  ) : (
                    <div className="space-y-3 w-full">
                      <div
                        className="relative"
                        onTouchStart={onMediaSwipeStart}
                        onTouchEnd={onMediaSwipeEnd}
                      >
                        <div className="overflow-hidden rounded-xl border border-pink-100 bg-white">
                          <div
                            className="flex transition-transform duration-300 ease-out"
                            style={{ transform: `translateX(-${mediaIndex * 100}%)` }}
                          >
                            {mediaSlides.map((slide) => {
                              const isStripSlide = slide.key === 'strip';

                              return (
                                <div key={slide.key} className="w-full shrink-0 p-3">
                                  {slide.type === 'video' ? (
                                    <div className="w-full h-[62vh] max-h-[70vh] rounded-xl border border-pink-100 bg-black flex items-center justify-center overflow-hidden">
                                      <video
                                        src={slide.src}
                                        controls
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="max-w-full max-h-full object-contain object-center rounded-xl bg-black"
                                      />
                                    </div>
                                  ) : isStripSlide ? (
                                    <div className="w-full h-[62vh] max-h-[70vh] rounded-xl border border-pink-100 bg-white flex items-center justify-center overflow-hidden">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={slide.src}
                                        alt={slide.label}
                                        className="max-w-full max-h-full object-contain object-center"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-full h-[62vh] max-h-[70vh] rounded-xl border border-pink-100 bg-white flex items-center justify-center overflow-hidden">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={slide.src}
                                        alt={slide.label}
                                        className="max-w-full max-h-full object-contain object-center"
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {mediaSlides.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setMediaIndex(prev => Math.max(prev - 1, 0))}
                              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#d72688]/80 text-white flex items-center justify-center hover:bg-[#d72688] transition"
                              aria-label="Previous media"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setMediaIndex(prev => Math.min(prev + 1, mediaSlides.length - 1))}
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-[#d72688]/80 text-white flex items-center justify-center hover:bg-[#d72688] transition"
                              aria-label="Next media"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-[#d72688] font-medium">
                          {mediaSlides[mediaIndex]?.label ?? 'Media'} ({mediaIndex + 1}/{mediaSlides.length})
                        </p>
                        <button
                          onClick={() => handleDownload(mediaSlides[mediaIndex]?.src, mediaSlides[mediaIndex]?.downloadName ?? `media-${item.id}`)}
                          className="gallery-detail-action-btn inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition"
                        >
                          <Download className="w-4 h-4" />
                          {mediaSlides[mediaIndex]?.downloadLabel ?? 'Download'}
                        </button>
                      </div>

                      {mediaSlides.length > 1 && (
                        <div className="flex justify-center gap-1.5 flex-wrap">
                          {mediaSlides.map((slide, idx) => (
                            <button
                              key={`media-dot-${slide.key}`}
                              type="button"
                              onClick={() => setMediaIndex(idx)}
                              aria-label={`View ${slide.label}`}
                              className={`h-2.5 rounded-full transition-all ${idx === mediaIndex ? 'w-6 bg-[#d72688]' : 'w-2.5 bg-pink-200 hover:bg-pink-300'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="rounded-xl border border-[#f3b7d1] bg-[#fff8fc] p-4">
                    <h1 className="text-2xl font-bold text-[#d72688]">Gallery Detail</h1>
                    <p className="text-xs text-gray-500 mt-1 break-all">ID: {item.id}</p>

                    <div className="mt-4 space-y-2 text-sm text-gray-700">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-[#d72688]">Date</span>
                        <span className="text-right">{new Date(item.createdAt).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-[#d72688]">Layout</span>
                        <span className="text-right">{item.layout}</span>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-[#d72688]">Filter</span>
                        <span className="text-right">{item.filter}</span>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-[#d72688]">Photo Count</span>
                        <span className="text-right">{capturePhotos.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="gallery-detail-actions mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={copyLink}
                        className="gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#f8bfd7] text-[#d72688] bg-[#fff7fb] hover:bg-[#ffe4ef] transition"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </button>

                      <a
                        href={item.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#fa75aa] hover:bg-[#d72688] text-white transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Strip URL
                      </a>
                    </div>

                    <div className="rounded-xl border border-[#f3b7d1] bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide font-semibold text-[#a13d70]">Download Media</p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleDownload(item.stripDataUrl ?? imagePreview ?? item.imageUrl, `strip-${item.id}.png`)}
                          className="gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition"
                        >
                          <Download className="w-4 h-4" />
                          Download Strip
                        </button>

                        <button
                          onClick={() => handleDownload(gifSrc, `gif-${item.id}.gif`)}
                          className="gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!gifSrc}
                        >
                          <Download className="w-4 h-4" />
                          Download GIF
                        </button>

                        <button
                          onClick={() => handleDownload(liveVideoSrc, `live-${item.id}.webm`)}
                          className="gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!liveVideoSrc}
                        >
                          <Download className="w-4 h-4" />
                          Download Live
                        </button>

                        <button
                          onClick={handleDownloadAll}
                          disabled={isDownloadingAll || mediaSlides.length === 0}
                          className="gallery-detail-action-btn col-span-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#fa75aa] bg-[#fff7fb] text-[#d72688] hover:bg-[#ffeaf3] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Download className="w-4 h-4" />
                          {isDownloadingAll ? 'Downloading...' : 'Download All'}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#f3b7d1] bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide font-semibold text-[#a13d70]">Quick Actions</p>
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          onClick={handleEditInEditor}
                          disabled={isPreparingEditor}
                          className="gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-2 py-2 rounded-lg border border-[#f8bfd7] bg-white text-[#d72688] hover:bg-[#fff7fb] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ImageIcon className="w-4 h-4" />
                          {isPreparingEditor ? 'Preparing...' : 'Edit in Editor'}
                        </button>

                        <button
                          onClick={() => setShowQrPopup(true)}
                          className="gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-2 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition"
                        >
                          <QrCode className="w-4 h-4" />
                          QR Code
                        </button>

                        <button
                          onClick={handlePrintCurrent}
                          className="gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-2 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition"
                        >
                          <Printer className="w-4 h-4" />
                          Print
                        </button>

                        <button
                          onClick={handleShare}
                          className="gallery-detail-action-btn w-full inline-flex items-center justify-center gap-2 px-2 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition"
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showQrPopup && (
          <div
            className="fixed inset-0 z-50 bg-[#fa75aa]/25 backdrop-blur-[2px] flex items-center justify-center p-4"
            onClick={() => setShowQrPopup(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-[#f3b7d1] bg-white p-6 shadow-[0_20px_45px_rgba(250,117,170,0.22)]"
              onClick={event => event.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-[#d72688]">QR Link Detail</h3>
                <button
                  type="button"
                  onClick={() => setShowQrPopup(false)}
                  className="px-2 py-1 text-sm text-[#d72688] hover:bg-pink-50 rounded-md"
                >
                  Tutup
                </button>
              </div>
              <div className="rounded-xl border border-[#f3b7d1] bg-[#fff7fb] p-4 flex flex-col items-center gap-3">
                <QRCodeCanvas value={detailLink} size={220} includeMargin />
                <p className="text-xs text-gray-600 break-all text-center">{detailLink}</p>
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
