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
  const [showCamera, setShowCamera] = useState(true);
  const [layout, setLayout] = useState(4);
  const [filter] = useState('none');
  const [retakePhotoIndex, setRetakePhotoIndex] = useState<number | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [mobileCaptureFullscreen, setMobileCaptureFullscreen] = useState(true);
  const [, setCapturedLiveVideoUrl] = useState<string | null>(null);
  const [awaitingLiveVideo, setAwaitingLiveVideo] = useState(false);
  const [liveWaitSeconds, setLiveWaitSeconds] = useState(0);
  
  const [liveMode, setLiveMode] = useState(true);

  const effectiveFullscreen = isFullscreen || isPseudoFullscreen;

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
    const media = window.matchMedia('(max-width: 767px)');
    const apply = () => {
      const isCompact = media.matches;
      setIsCompactViewport(isCompact);
      if (isCompact) {
        setMobileCaptureFullscreen(true);
      }
    };
    apply();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }

    media.addListener(apply);
    return () => media.removeListener(apply);
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

      if (isPseudoFullscreen) {
        setIsPseudoFullscreen(false);
        return;
      }

      const requestFullscreen =
        currentMain.requestFullscreen ||
        ((currentMain as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen);

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
  const fullscreenCaptureMode =
    isCaptureMode && (effectiveFullscreen || (isCompactViewport && mobileCaptureFullscreen));
  const fullscreenToggleHandler = isCompactViewport
    ? () => setMobileCaptureFullscreen(prev => !prev)
    : toggleFullscreen;
  const pagePaddingClass = isCompactViewport ? 'px-1 sm:px-2 lg:px-5 py-1 sm:py-2 lg:py-4' : 'px-2 sm:px-4 lg:px-5 py-2 sm:py-4';
  const pageGridClass = isCompactViewport
    ? 'min-h-[calc(100dvh-0.5rem)] lg:h-full max-w-none mx-auto grid grid-cols-1 gap-2'
    : 'min-h-[calc(100dvh-1rem)] lg:h-full max-w-[1100px] mx-auto grid grid-cols-1 gap-3 sm:gap-4';
  const sectionClass = isCompactViewport
    ? 'lg:h-full p-1 sm:p-2 flex flex-col overflow-visible lg:overflow-hidden'
    : 'lg:h-full p-2 sm:p-4 flex flex-col overflow-visible lg:overflow-hidden';

  return (
    <main
      ref={mainRef}
      className={`pb-page-bg w-full min-h-dvh lg:h-dvh overflow-x-hidden overflow-y-auto lg:overflow-hidden ${pagePaddingClass}`}
    >
      {fullscreenError && (
        <div className="w-full max-w-5xl mx-auto mb-2">
          <div className="text-sm text-[#8c295c] bg-[#fff4fa] border border-[#f3b7d1] rounded-xl px-3 py-2 text-center">
            {fullscreenError}
          </div>
        </div>
      )}

      <div className={pageGridClass}>
        <section className={sectionClass}>
          {!fullscreenCaptureMode && (
            <div className="text-center mb-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[#d72688]">
                  {photos.length < layout || retakePhotoIndex !== null ? 'Step 1 of 3:' : 'Step 2 of 3:'}
                </span>{' '}
                {photos.length < layout || retakePhotoIndex !== null ? 'Capture Photos' : 'Review & Edit Photos'}
              </p>
            </div>
          )}

          {awaitingLiveVideo && (
            <div className="fixed inset-0 z-[80] bg-[#1f0012]/45 backdrop-blur-[2px] flex items-center justify-center px-4">
              <div className="w-full max-w-sm rounded-2xl border border-pink-200 bg-white shadow-xl p-5 sm:p-6" role="status" aria-live="polite">
                <div className="mx-auto h-11 w-11 rounded-full border-4 border-pink-200 border-t-[#d72688] animate-spin" />
                <p className="text-base sm:text-lg text-[#d72688] font-semibold text-center mt-4">
                  Saving live video result...
                </p>
                <p className="text-xs sm:text-sm text-gray-600 text-center mt-1">
                  Please wait, you will continue to editor automatically.
                </p>
                <p className="text-xs sm:text-sm text-[#d72688] text-center mt-3 font-semibold">
                  Running: {liveWaitSeconds}s
                </p>
              </div>
            </div>
          )}

          <div className="w-full flex lg:flex-1 lg:min-h-0 items-start lg:items-center justify-center overflow-visible lg:overflow-hidden">
            {showCamera && (photos.length < layout || retakePhotoIndex !== null) && (
              <div className={fullscreenCaptureMode ? 'fixed inset-0 z-[60] bg-black' : 'w-full lg:h-full flex items-start lg:items-center justify-center'}>
                <Camera
                  onCapture={handleCapture}
                  photosToTake={retakePhotoIndex !== null ? 1 : layout - photos.length}
                  poseCount={layout}
                  onPoseCountChange={handleLayoutChange}
                  onStartCapture={handleStartCapture}
                  filter={filter}
                  frameColor="white"
                  liveMode={liveMode}
                  onToggleLiveMode={() => setLiveMode(!liveMode)}
                  onLiveVideoCapture={handleLiveVideoCapture}
                  isFullscreen={fullscreenCaptureMode}
                  onToggleFullscreen={fullscreenToggleHandler}
                  fullscreenMode={fullscreenCaptureMode}
                />
              </div>
            )}
          </div>

          {!fullscreenCaptureMode && photos.length > 0 && photos.length < layout && (
            <div className="mt-2 rounded-lg border border-[#f3b7d1] px-3 py-2 text-xs text-[#d72688] text-center font-medium max-w-md mx-auto">
              {`${photos.length} of ${layout} photos uploaded. Need ${layout - photos.length} more.`}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}