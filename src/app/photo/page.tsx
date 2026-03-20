'use client';

import { useState, useEffect, useRef } from 'react';
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
  loadTempPhotosFromSessionStorage,
  saveTempPhotosToSessionStorage,
} from '@/lib/tempPhotoStorage';

export default function Page() {
  const router = useRouter();
  const photosRef = useRef<string[]>([]);
  const isRedirectingRef = useRef(false);

  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadPhotos, setUploadPhotos] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(true);
  const [layout, setLayout] = useState(4);
  const [filter] = useState('none');
  const [retakePhotoIndex, setRetakePhotoIndex] = useState<number | null>(null);
  
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
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

        if (Number.isFinite(retakeIndex) && retakeIndex >= 0) {
          setRetakePhotoIndex(retakeIndex);
        }

        setShowCamera(true);
        return;
      }

      if (isIndexedDBSupported()) {
        try {
          const savedPhotos = await loadPhotosFromIndexedDB();
          const validPhotos = savedPhotos.filter(isValidPhotoData);
          if (validPhotos.length > 0) {
            setPhotos(validPhotos);
            photosRef.current = validPhotos;
          }
        } catch (error) {
          console.error('❌ Failed to load photos from IndexedDB:', error);
        }
      }
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

  const handleLayoutChange = (n: number) => {
    isRedirectingRef.current = false;
    setLayout(n);
    setPhotos([]);
    setUploadPhotos([]);
    setRetakePhotoIndex(null);
    photosRef.current = [];
    sessionStorage.removeItem('photobooth-retake-single');
    sessionStorage.removeItem('photobooth-retake-index');
    setShowCamera(true);
  };

  const handleStartCapture = () => {
    isRedirectingRef.current = false;
    setShowCamera(true);
  };

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
      isRedirectingRef.current = true;
      try {
        if (isIndexedDBSupported()) {
          await savePhotosToIndexedDB(updatedPhotos);
        }
        saveTempPhotosToSessionStorage(updatedPhotos);
      } catch (error) {
        console.error('❌ Failed to persist photos before redirect:', error);
      }
      router.push('/photo/edit?layout=' + layout);
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

  const handleStartFreshCapture = async () => {
    if (isIndexedDBSupported()) {
      try {
        await clearPhotosFromIndexedDB();
      } catch (error) {
        console.error('❌ Failed to clear cached photos for fresh capture:', error);
      }
    }

    clearTempPhotosFromSessionStorage();
    sessionStorage.removeItem('photobooth-retake-single');
    sessionStorage.removeItem('photobooth-retake-index');

    isRedirectingRef.current = false;
    photosRef.current = [];
    setPhotos([]);
    setUploadPhotos([]);
    setRetakePhotoIndex(null);
    setShowCamera(true);
  };

  const hasCompletedCapture = photos.length >= layout && retakePhotoIndex === null;

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 py-8 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#d72688] tracking-wide text-center">
          Photo Booth
        </h1>
        
        <div className="text-center mb-2">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-purple-600">
              {photos.length < layout || retakePhotoIndex !== null ? 'Step 1 of 3:' : 'Step 2 of 3:'}
            </span> 
            {photos.length < layout || retakePhotoIndex !== null ? ' Capture Photos' : ' Review & Edit Photos'}
          </p>
        </div>

        {uploadPhotos.length > 0 && (
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

        {hasCompletedCapture && (
          <div className="w-full max-w-2xl mx-auto px-4">
            <div className="bg-white/95 border border-pink-200 rounded-2xl shadow-sm p-4 sm:p-5">
              <p className="text-sm sm:text-base text-[#d72688] font-semibold text-center">
                Foto untuk {layout} pose sudah tersedia.
              </p>
              <p className="text-xs sm:text-sm text-gray-600 text-center mt-1">
                Lanjutkan edit atau mulai sesi capture baru.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => router.push(`/photo/edit?layout=${layout}`)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#fa75aa] text-white hover:bg-[#d72688] transition font-semibold"
                >
                  Lanjut ke Editor
                </button>
                <button
                  onClick={handleStartFreshCapture}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#fa75aa] text-[#d72688] bg-white hover:bg-pink-50 transition font-semibold"
                >
                  Capture Ulang
                </button>
              </div>
            </div>
          </div>
        )}

        {showCamera && (photos.length < layout || retakePhotoIndex !== null) && (
          <div className="w-full max-w-2xl mx-auto px-4">
            <Camera
              onCapture={handleCapture}
              photosToTake={retakePhotoIndex !== null ? 1 : layout - photos.length}
              onStartCapture={handleStartCapture}
              filter={filter}
              frameColor="white"
              liveMode={liveMode}
              onToggleLiveMode={() => setLiveMode(!liveMode)}
            />
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column', 
            gap: '12px',
            justifyContent: 'center',
            marginTop: 16,
            alignItems: 'stretch',
            paddingLeft: isMobile ? 12 : 16,
            paddingRight: isMobile ? 12 : 16,
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: 500,
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
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            textAlign: 'center',
            border: '1px solid #ef9a9a',
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
      </main>

      <footer
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          background: 'transparent',
          marginTop: 48,
        }}
      >
        <div
          style={{
            background: '#fff',
            boxShadow: '0 2px 12px #fa75aa22',
            padding: '14px 32px',
            minWidth: 280,
            width: '100%',
            textAlign: 'center',
            fontSize: 13,
            color: '#d72688',
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: 14, color: '#b95b8e' }}>
            PhotoBooth - A digital photobooth app to capture, edit, and share photo strips.
          </span>
          <br />
          <span style={{ fontSize: 16, color: '#d72688', fontWeight: 500 }}>
            &copy; 2026 PhotoBooth
          </span>
        </div>
      </footer>

    </>
  );
}