'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Camera from '@/components/Camera';
import { 
  savePhotosToIndexedDB, 
  loadPhotosFromIndexedDB, 
  clearPhotosFromIndexedDB,
  isIndexedDBSupported 
} from '@/lib/indexedDB';
import {
  clearTempPhotosFromSessionStorage,
  clearTempLiveVideoUrlFromSessionStorage,
  loadTempPhotosFromSessionStorage,
  saveTempLiveVideoUrlToSessionStorage,
  saveTempPhotosToSessionStorage,
} from '@/lib/tempPhotoStorage';

export default function Page() {
  const router = useRouter();
  const mainRef = useRef<HTMLElement | null>(null);
  const photosRef = useRef<string[]>([]);
  const isRedirectingRef = useRef(false);
  const awaitingLiveVideoRef = useRef(false);

  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadPhotos, setUploadPhotos] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(true);
  const [layout, setLayout] = useState(4);
  const [filter] = useState('none');
  const [retakePhotoIndex, setRetakePhotoIndex] = useState<number | null>(null);
  
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const [, setCapturedLiveVideoUrl] = useState<string | null>(null);
  const [awaitingLiveVideo, setAwaitingLiveVideo] = useState(false);
  const [liveWaitSeconds, setLiveWaitSeconds] = useState(0);
  
  const [liveMode, setLiveMode] = useState(true);

  const isValidPhotoData = (value: string) =>
    typeof value === 'string' && value.startsWith('data:image/') && value.length > 1000;

  useEffect(() => {
    const loadSavedPhotos = async () => {
      const params = new URLSearchParams(window.location.search);
      const layoutParam = Number(params.get('layout'));
      if (Number.isFinite(layoutParam) && layoutParam >= 1) {
        setLayout(layoutParam);
      }

      const retakeParam = params.get('retake');
      const isRetakeFlow = retakeParam === '1' || sessionStorage.getItem('photobooth-retake-reset') === '1';
      const isSingleRetakeFlow = retakeParam === 'single' || sessionStorage.getItem('photobooth-retake-single') === '1';

      if (isRetakeFlow) {
        if (isIndexedDBSupported()) {
          try {
            await clearPhotosFromIndexedDB();
          } catch (error) {
            console.error('❌ Failed to clear IndexedDB during retake reset:', error);
          }
        }

        setPhotos([]);
        setUploadPhotos([]);
        photosRef.current = [];
        clearTempPhotosFromSessionStorage();
        clearTempLiveVideoUrlFromSessionStorage();
        sessionStorage.removeItem('photobooth-retake-reset');
        window.history.replaceState({}, '', '/photo');
        return;
      }

      if (isSingleRetakeFlow) {
        const retakeIndexRaw = params.get('index') ?? sessionStorage.getItem('photobooth-retake-index');
        const retakeIndex = Number(retakeIndexRaw);

        let savedPhotos: string[] = [];
        savedPhotos = loadTempPhotosFromSessionStorage().filter(isValidPhotoData);

        if (savedPhotos.length === 0 && isIndexedDBSupported()) {
          try {
            const indexedPhotos = await loadPhotosFromIndexedDB();
            savedPhotos = indexedPhotos.filter(isValidPhotoData);
          } catch (error) {
            console.error('❌ Failed to load photos for single retake:', error);
          }
        }

        if (savedPhotos.length > 0) {
          setPhotos(savedPhotos);
          photosRef.current = savedPhotos;
        }

        clearTempLiveVideoUrlFromSessionStorage();
        setCapturedLiveVideoUrl(null);

        if (Number.isFinite(retakeIndex) && retakeIndex >= 0) {
          setRetakePhotoIndex(retakeIndex);
        }

        setShowCamera(true);
        return;
      }

      // Default entry to /photo should always start a fresh capture session.
      if (isIndexedDBSupported()) {
        try {
          await clearPhotosFromIndexedDB();
        } catch (error) {
          console.error('❌ Failed to clear stale photos on fresh capture start:', error);
        }
      }

      clearTempPhotosFromSessionStorage();
      clearTempLiveVideoUrlFromSessionStorage();
      sessionStorage.removeItem('photobooth-retake-reset');
      sessionStorage.removeItem('photobooth-retake-single');
      sessionStorage.removeItem('photobooth-retake-index');

      setPhotos([]);
      setUploadPhotos([]);
      photosRef.current = [];
      setRetakePhotoIndex(null);
      setCapturedLiveVideoUrl(null);
      setAwaitingLiveVideo(false);
      awaitingLiveVideoRef.current = false;
      setShowCamera(true);
    };
    loadSavedPhotos();
  }, []);

  useEffect(() => {
    photosRef.current = photos;
    if (photos.length > 0 && isIndexedDBSupported()) {
      savePhotosToIndexedDB(photos).catch(error => {
        console.error('❌ Failed to save photos to IndexedDB:', error);
      });
    }
  }, [photos]);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const mobileCheck = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobileCheck);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as Document & { webkitFullscreenElement?: Element | null };
      setIsFullscreen(Boolean(doc.fullscreenElement || doc.webkitFullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange as EventListener);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange as EventListener);
    };
  }, []);

  const handleLayoutChange = (n: number) => {
    isRedirectingRef.current = false;
    awaitingLiveVideoRef.current = false;
    setLayout(n);
    setPhotos([]);
    setUploadPhotos([]);
    setRetakePhotoIndex(null);
    setCapturedLiveVideoUrl(null);
    setAwaitingLiveVideo(false);
    clearTempLiveVideoUrlFromSessionStorage();
    photosRef.current = [];
    sessionStorage.removeItem('photobooth-retake-single');
    sessionStorage.removeItem('photobooth-retake-index');
    setShowCamera(true);
  };

  const handleStartCapture = () => {
    isRedirectingRef.current = false;
    awaitingLiveVideoRef.current = false;
    setShowCamera(true);
  };

  const uploadLiveVideoBlobToCloud = async (blob: Blob): Promise<string | null> => {
    const mimeType = blob.type || 'video/webm';
    const extension = mimeType.includes('mp4')
      ? 'mp4'
      : mimeType.includes('quicktime')
        ? 'mov'
        : 'webm';

    const file = new File([blob], `live-${Date.now()}.${extension}`, {
      type: mimeType,
    });

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const formData = new FormData();
        formData.append('media', file);
        formData.append('kind', 'live');

        const res = await fetch('/api/upload-strip', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          return typeof data?.url === 'string' ? data.url : null;
        }
      } catch {
        // Retry transient upload failure.
      }

      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 350 * attempt));
      }
    }

    return null;
  };

  const finalizeRedirectToEditor = useCallback(async () => {
    if (isRedirectingRef.current) return;
    if (photosRef.current.length < layout) return;

    isRedirectingRef.current = true;
    try {
      if (isIndexedDBSupported()) {
        await savePhotosToIndexedDB(photosRef.current);
      }
      saveTempPhotosToSessionStorage(photosRef.current);
    } catch (error) {
      console.error('❌ Failed to persist photos before redirect:', error);
    }

    router.push('/photo/edit?layout=' + layout);
  }, [layout, router]);

  useEffect(() => {
    if (!awaitingLiveVideo || photosRef.current.length < layout || isRedirectingRef.current) return;

    const timeoutId = window.setTimeout(() => {
      // Fallback: avoid getting stuck if recorder callback is delayed or skipped by browser.
      awaitingLiveVideoRef.current = false;
      setAwaitingLiveVideo(false);
      void finalizeRedirectToEditor();
    }, 7000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [awaitingLiveVideo, layout, finalizeRedirectToEditor]);

  useEffect(() => {
    if (!awaitingLiveVideo) {
      setLiveWaitSeconds(0);
      return;
    }

    setLiveWaitSeconds(1);
    const intervalId = window.setInterval(() => {
      setLiveWaitSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [awaitingLiveVideo]);

  const handleCapture = async (photoDataUrl: string) => {
    if (!isValidPhotoData(photoDataUrl)) {
      return;
    }

    const canReplaceRetakePhoto =
      retakePhotoIndex !== null &&
      retakePhotoIndex >= 0 &&
      retakePhotoIndex < photosRef.current.length;

    const updatedPhotos = canReplaceRetakePhoto
      ? photosRef.current.map((photo, idx) => (idx === retakePhotoIndex ? photoDataUrl : photo))
      : [...photosRef.current, photoDataUrl];

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

  const handleLiveVideoCapture = async (blob: Blob | null) => {
    const shouldFinalizeAfterLive = awaitingLiveVideoRef.current && photosRef.current.length >= layout && !isRedirectingRef.current;
    let uploadedLiveUrl: string | null = null;

    if (blob && blob.size > 0) {
      uploadedLiveUrl = await uploadLiveVideoBlobToCloud(blob);
    }

    setCapturedLiveVideoUrl(uploadedLiveUrl);

    if (uploadedLiveUrl) {
      saveTempLiveVideoUrlToSessionStorage(uploadedLiveUrl);
    } else {
      clearTempLiveVideoUrlFromSessionStorage();
    }

    awaitingLiveVideoRef.current = false;
    setAwaitingLiveVideo(false);

    if (shouldFinalizeAfterLive) {
      await finalizeRedirectToEditor();
    }
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);

    if (files.length > layout - uploadPhotos.length) {
      setUploadError(`You can only upload ${layout - uploadPhotos.length} more photo${layout - uploadPhotos.length > 1 ? 's' : ''}. Please try again.`);
      e.target.value = '';
      return;
    }

    const fileArr = Array.from(files);
    const readers = fileArr.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(async imgs => {
      const validImgs = imgs.filter(isValidPhotoData);
      const combined = [...uploadPhotos, ...validImgs].slice(0, layout);
      setUploadPhotos(combined);
      setPhotos(combined);
      photosRef.current = combined;
      setShowCamera(false);
      setCapturedLiveVideoUrl(null);
      setAwaitingLiveVideo(false);
      awaitingLiveVideoRef.current = false;
      clearTempLiveVideoUrlFromSessionStorage();

      if (combined.length >= layout && !isRedirectingRef.current) {
        isRedirectingRef.current = true;
        try {
          if (isIndexedDBSupported()) {
            await savePhotosToIndexedDB(combined);
          }
          saveTempPhotosToSessionStorage(combined);
        } catch (error) {
          console.error('❌ Failed to persist uploaded photos before redirect:', error);
        }
        router.push('/photo/edit?layout=' + layout);
      }
    });

    e.target.value = '';
  };

  const toggleFullscreen = async () => {
    const doc = document as Document & {
      webkitExitFullscreen?: () => Promise<void>;
      webkitFullscreenElement?: Element | null;
    };

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

      const requestFullscreen =
        currentMain.requestFullscreen ||
        ((currentMain as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen);

      if (!requestFullscreen) {
        setFullscreenError('Browser ini belum mendukung mode full screen.');
        return;
      }

      await requestFullscreen.call(currentMain);
    } catch (error) {
      console.error('❌ Failed to toggle fullscreen mode:', error);
      setFullscreenError('Gagal mengaktifkan mode full screen. Coba lagi.');
    }
  };

  const isCaptureMode = showCamera && (photos.length < layout || retakePhotoIndex !== null);

  return (
    <>
      <main ref={mainRef} className="pb-page-bg min-h-screen w-full flex flex-col items-center justify-center gap-6 py-8 px-4 sm:px-6 lg:px-8">
        {!isFullscreen && (
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#d72688] tracking-wide text-center">
            Photo Booth
          </h1>
        )}
        
        {!isFullscreen && (
          <div className="text-center mb-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-[#d72688]">
                {photos.length < layout || retakePhotoIndex !== null ? 'Step 1 of 3:' : 'Step 2 of 3:'}
              </span>{' '}
              {photos.length < layout || retakePhotoIndex !== null ? ' Capture Photos' : ' Review & Edit Photos'}
            </p>
          </div>
        )}

        {fullscreenError && (
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
            <div className="text-sm text-[#8c295c] bg-[#fff4fa] border border-[#f3b7d1] rounded-xl px-3 py-2 text-center">
              {fullscreenError}
            </div>
          </div>
        )}

        {!isFullscreen && uploadPhotos.length > 0 && (
          <div className="flex flex-col gap-3 items-center mb-4 w-full max-w-md sm:max-w-lg">
            <div className="flex justify-start w-full mb-2 px-3 sm:px-4">
              <h3 className="m-0 text-[#d72688] text-base sm:text-lg font-semibold">
                Uploaded Photos
              </h3>
            </div>
            <div className="flex flex-col gap-3 items-center w-full">
              {uploadPhotos.map((src, idx) => (
                <div key={idx} className="relative w-full max-w-xs sm:max-w-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`uploaded-${idx}`}
                    className="w-full h-auto aspect-[4/3] object-cover rounded-xl shadow-md bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {awaitingLiveVideo && (
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
            <div className="bg-white/95 border border-pink-200 rounded-2xl shadow-sm p-4 sm:p-5">
              <p className="text-sm sm:text-base text-[#d72688] font-semibold text-center">
                Menyimpan hasil live video...
              </p>
              <p className="text-xs sm:text-sm text-gray-600 text-center mt-1">
                Mohon tunggu, Anda akan otomatis lanjut ke editor.
              </p>
              <p className="text-xs sm:text-sm text-[#d72688] text-center mt-2 font-semibold">
                Proses berjalan: {liveWaitSeconds} detik
              </p>
            </div>
          </div>
        )}

        {showCamera && (photos.length < layout || retakePhotoIndex !== null) && (
          <div className={isFullscreen ? 'fixed inset-0 z-[60] bg-black' : 'w-full max-w-4xl mx-auto px-2 sm:px-4'}>
            <Camera
              onCapture={handleCapture}
              photosToTake={retakePhotoIndex !== null ? 1 : layout - photos.length}
              onStartCapture={handleStartCapture}
              filter={filter}
              frameColor="white"
              liveMode={liveMode}
              onToggleLiveMode={() => setLiveMode(!liveMode)}
              onLiveVideoCapture={handleLiveVideoCapture}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              fullscreenMode={isFullscreen && isCaptureMode}
            />
          </div>
        )}

        {!isFullscreen && (
        <>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column', 
            gap: '12px',
            justifyContent: 'center',
            marginTop: 16,
            alignItems: 'stretch',
            paddingLeft: isMobile ? 8 : 16,
            paddingRight: isMobile ? 8 : 16,
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: isMobile ? '100%' : 500,
          }}
        >
          <label
            htmlFor="upload-image"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              margin: 0,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              height: isMobile ? 44 : 48,
              width: '100%',
            }}
          >
            <span
              style={{
                padding: isMobile ? '8px 12px' : '8px 16px',
                background: '#fff',
                color: '#d72688',
                borderRadius: 12,
                border: '1px solid #fa75aa',
                fontWeight: 500,
                fontSize: isMobile ? 14 : 15,
                cursor: 'pointer',
                transition: 'background 0.2s',
                height: isMobile ? 44 : 48,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Upload Images ({layout} max)
            </span>
            <input
              id="upload-image"
              type="file"
              accept="image/*"
              multiple
              onChange={handleUploadImage}
              style={{ display: 'none' }}
            />
          </label>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: '8px',
              width: '100%',
            }}
          >
            <div 
              style={{ 
                height: isMobile ? 44 : 48, 
                display: 'flex', 
                alignItems: 'center',
                flex: 1,
              }}
            >
              <select
                value={layout}
                onChange={e => handleLayoutChange(Number(e.target.value))}
                style={{
                  padding: isMobile ? '8px 4px' : '8px 16px',
                  borderRadius: 12,
                  border: '1px solid #fa75aa',
                  color: '#d72688',
                  fontWeight: 500,
                  fontSize: isMobile ? 13 : 15,
                  background: '#fff',
                  outline: 'none',
                  cursor: 'pointer',
                  height: isMobile ? 44 : 48,
                  width: '100%',
                }}
              >
                <option value={2}>2 Pose</option>
                <option value={3}>3 Pose</option>
                <option value={4}>4 Pose</option>
              </select>
            </div>
          </div>
        </div>

        {uploadError && (
          <div style={{
            marginTop: 8,
            padding: '8px 12px',
            backgroundColor: '#fff4fa',
            color: '#8c295c',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            textAlign: 'center',
            border: '1px solid #f3b7d1',
          }}>
            {uploadError}
          </div>
        )}

        {photos.length > 0 && photos.length < layout && !uploadError && (
          <div style={{
            marginTop: 8,
            fontSize: 14,
            color: '#d72688',
            textAlign: 'center',
            fontWeight: 500,
          }}>
            {`${photos.length} of ${layout} photos uploaded. Need ${layout - photos.length} more.`}
          </div>
        )}
        </>
        )}
      </main>

      {!isFullscreen && (
      <footer
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          background: 'transparent',
          marginTop: isMobile ? 24 : 48,
          padding: isMobile ? '0 8px 16px' : undefined,
        }}
      >
        <div
          style={{
            background: '#fff',
            boxShadow: '0 2px 12px #fa75aa22',
            padding: isMobile ? '12px 14px' : '14px 32px',
            minWidth: isMobile ? 'auto' : 280,
            width: '100%',
            maxWidth: isMobile ? '100%' : 760,
            textAlign: 'center',
            fontSize: isMobile ? 12 : 13,
            color: '#d72688',
            fontWeight: 500,
            borderRadius: 12,
          }}
        >
          <span style={{ fontSize: isMobile ? 12 : 14, color: '#b95b8e' }}>
            PhotoBooth - A digital photobooth app to capture, edit, and share photo strips.
          </span>
          <br />
          <span style={{ fontSize: isMobile ? 14 : 16, color: '#d72688', fontWeight: 500 }}>
            &copy; 2026 PhotoBooth
          </span>
        </div>
      </footer>
      )}

    </>
  );
}