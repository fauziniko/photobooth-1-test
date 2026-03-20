'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowLeft, Copy, Download, ExternalLink, ImageIcon } from 'lucide-react';

type GalleryDetailItem = {
  id: string;
  createdAt: string;
  imageUrl: string;
  layout: number;
  filter: string;
  previewDataUrl: string | null;
  stripDataUrl: string | null;
  gifDataUrl: string | null;
  liveVideoDataUrl: string | null;
  photoFrames: string[];
  livePhotos: string[];
};

export default function GalleryDetailPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';

  const [item, setItem] = useState<GalleryDetailItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState('');
  const [generatedLiveVideoDataUrl, setGeneratedLiveVideoDataUrl] = useState<string | null>(null);
  const [isGeneratingLiveVideo, setIsGeneratingLiveVideo] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        setError('ID gallery tidak valid.');
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/gallery/${id}`, { cache: 'no-store' });
        if (res.status === 404) {
          setError('Item gallery tidak ditemukan.');
          setIsLoading(false);
          return;
        }

        if (!res.ok) {
          setError('Gagal memuat detail gallery.');
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        setItem(data?.item ?? null);
      } catch {
        setError('Terjadi kesalahan saat memuat detail gallery.');
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
    return imagePreview ? [imagePreview] : [];
  }, [item, imagePreview]);

  const livePhotos = useMemo(() => {
    if (!item) return [] as string[];
    if (item.livePhotos.length > 0) return item.livePhotos;
    return capturePhotos;
  }, [item, capturePhotos]);
  const liveVideoSrc = item?.liveVideoDataUrl ?? generatedLiveVideoDataUrl;

  const createLiveVideoFromFrames = async (frames: string[]): Promise<string | null> => {
    if (frames.length === 0 || typeof MediaRecorder === 'undefined') return null;

    const candidateTypes = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    const supportedType = candidateTypes.find(type =>
      typeof MediaRecorder.isTypeSupported === 'function' ? MediaRecorder.isTypeSupported(type) : false
    );

    try {
      const firstImg = new window.Image();
      firstImg.src = frames[0];
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
      const sequence = frames.length > 1 ? [...frames, ...frames.slice().reverse()] : [...frames];
      const frameHoldMs = 450;
      const minDurationMs = 9000;
      const loopCount = Math.min(5, Math.max(2, Math.ceil(minDurationMs / (sequence.length * frameHoldMs))));

      for (let loop = 0; loop < loopCount; loop++) {
        for (const src of sequence) {
          const image = new window.Image();
          image.src = src;
          await new Promise(resolve => {
            image.onload = resolve;
          });
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(image, 0, 0, width, height);
          await new Promise(resolve => setTimeout(resolve, frameHoldMs));
        }
      }

      await new Promise(resolve => setTimeout(resolve, 250));

      recorder.stop();
      await stopped;

      const blob = new Blob(chunks, { type: supportedType || 'video/webm' });
      if (blob.size === 0) return null;

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

    const ensureLiveVideo = async () => {
      if (!item || item.liveVideoDataUrl || livePhotos.length === 0 || generatedLiveVideoDataUrl) return;
      setIsGeneratingLiveVideo(true);
      const generated = await createLiveVideoFromFrames(livePhotos);
      if (isMounted) {
        setGeneratedLiveVideoDataUrl(generated);
        setIsGeneratingLiveVideo(false);
      }
    };

    ensureLiveVideo();

    return () => {
      isMounted = false;
    };
  }, [generatedLiveVideoDataUrl, item, livePhotos]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(detailLink);
      alert('Link detail berhasil disalin');
    } catch {
      alert('Gagal menyalin link detail');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Link
            href="/photo/gallery"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Gallery
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-pink-100 shadow-md p-10 text-center text-gray-500 font-medium">
            Memuat detail gallery...
          </div>
        ) : error || !item ? (
          <div className="bg-white rounded-2xl border border-pink-100 shadow-md p-10 text-center">
            <ImageIcon className="w-10 h-10 text-pink-300 mx-auto mb-3" />
            <p className="text-gray-700 font-medium">{error ?? 'Item gallery tidak ditemukan.'}</p>
            <p className="text-sm text-gray-500 mt-1">Pastikan link yang dibuka benar.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-pink-100 shadow-md overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-pink-50 p-4 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt={`gallery-strip-${item.id}`}
                    className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-sm"
                  />
                </div>

                <div className="p-6">
                  <h1 className="text-2xl font-bold text-[#d72688]">Gallery Detail</h1>
                  <p className="text-sm text-gray-500 mt-1">ID: {item.id}</p>

                  <div className="mt-5 space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold text-[#d72688]">Tanggal:</span> {new Date(item.createdAt).toLocaleString('id-ID')}
                    </p>
                    <p>
                      <span className="font-semibold text-[#d72688]">Layout:</span> {item.layout}
                    </p>
                    <p>
                      <span className="font-semibold text-[#d72688]">Filter:</span> {item.filter}
                    </p>
                    <p>
                      <span className="font-semibold text-[#d72688]">Jumlah Foto:</span> {capturePhotos.length}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <button
                      onClick={copyLink}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#f8bfd7] text-[#d72688] bg-[#fff7fb] hover:bg-[#ffe4ef] transition"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </button>

                    <a
                      href={item.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fa75aa] hover:bg-[#d72688] text-white transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Strip URL
                    </a>

                    <button
                      onClick={() => handleDownload(item.stripDataUrl ?? imagePreview ?? item.imageUrl, `strip-${item.id}.png`)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition"
                    >
                      <Download className="w-4 h-4" />
                      Download Strip
                    </button>

                    <button
                      onClick={() => handleDownload(item.gifDataUrl, `gif-${item.id}.gif`)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition"
                      disabled={!item.gifDataUrl}
                    >
                      <Download className="w-4 h-4" />
                      Download GIF
                    </button>

                    <button
                      onClick={() => handleDownload(liveVideoSrc, `live-${item.id}.webm`)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!liveVideoSrc}
                    >
                      <Download className="w-4 h-4" />
                      Download Live
                    </button>
                  </div>

                  <div className="mt-6 p-4 rounded-xl border border-pink-100 bg-[#fff7fb]">
                    <p className="text-sm font-semibold text-[#d72688] mb-2">QR Link Detail</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <QRCodeCanvas value={detailLink} size={120} includeMargin />
                      <p className="text-xs text-gray-600 break-all">{detailLink}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="bg-white rounded-2xl border border-pink-100 shadow-md p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-lg font-bold text-[#d72688]">GIF</h2>
                <button
                  onClick={() => handleDownload(item.gifDataUrl, `gif-${item.id}.gif`)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!item.gifDataUrl}
                >
                  <Download className="w-4 h-4" />
                  Download GIF
                </button>
              </div>
              {item.gifDataUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item.gifDataUrl}
                  alt={`gallery-gif-${item.id}`}
                  className="max-h-[360px] w-auto rounded-xl border border-pink-100"
                />
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-2">GIF belum tersedia untuk item ini (kemungkinan data lama).</p>
                  {imagePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt={`gallery-gif-fallback-${item.id}`}
                      className="max-h-[280px] w-auto rounded-xl border border-pink-100"
                    />
                  )}
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl border border-pink-100 shadow-md p-5">
              <h2 className="text-lg font-bold text-[#d72688] mb-3">Foto Capture</h2>
              {capturePhotos.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada foto capture tersimpan.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {capturePhotos.map((src, idx) => (
                    <div key={`frame-${idx}`} className="space-y-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`capture-${idx + 1}`}
                        className="w-full aspect-[4/3] object-cover rounded-xl border border-pink-100"
                      />
                      <button
                        onClick={() => handleDownload(src, `capture-${item.id}-${idx + 1}.png`)}
                        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl border border-pink-100 shadow-md p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-lg font-bold text-[#d72688]">Live Foto</h2>
                <button
                  onClick={() => handleDownload(liveVideoSrc, `live-${item.id}.webm`)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!liveVideoSrc}
                >
                  <Download className="w-4 h-4" />
                  Download Live
                </button>
              </div>

              {liveVideoSrc ? (
                <video
                  src={liveVideoSrc}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full max-h-[420px] rounded-xl border border-pink-100 bg-black"
                />
              ) : isGeneratingLiveVideo ? (
                <p className="text-sm text-gray-500">Membuat live video dari foto...</p>
              ) : livePhotos.length === 0 ? (
                <p className="text-sm text-gray-500">Live foto belum tersedia untuk item ini.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                  {livePhotos.map((src, idx) => (
                    <div key={`live-${idx}`} className="space-y-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`live-${idx + 1}`}
                        className="w-full aspect-[4/3] object-cover rounded-xl border border-pink-100"
                      />
                      <button
                        onClick={() => handleDownload(src, `live-frame-${item.id}-${idx + 1}.png`)}
                        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-pink-200 bg-white text-[#d72688] hover:bg-[#fff7fb] transition"
                      >
                        <Download className="w-4 h-4" />
                        Download Frame
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
