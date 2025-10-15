'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Camera from '@/components/Camera';
import PhotoPreview from '@/components/PhotoPreview';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import PhotoEditor from '@/components/PhotoEditor';
import UploadFrameTemplateModal from '@/components/UploadFrameTemplateModal';
import FilterSelector from '@/components/FilterSelector';
import PhotoResult from '@/components/PhotoResult'; // pastikan sudah ada
import CropModal from '@/components/CropModal';
import { 
  savePhotosToIndexedDB, 
  loadPhotosFromIndexedDB, 
  clearPhotosFromIndexedDB,
  isIndexedDBSupported 
} from '@/lib/indexedDB';

type FrameTemplate = { name: string; frameUrl: string; stickerUrl: string };
type FrameTemplateForUI = { name: string; label: string; src: string; sticker?: string };

export default function Home() {
  const { data: session } = useSession();
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadPhotos, setUploadPhotos] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(true);
  const [layout, setLayout] = useState(4);
  const [filter, setFilter] = useState('none');
  const [frameColor, setFrameColor] = useState('white');
  const [bottomSpace, setBottomSpace] = useState(85); // default 85
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [frameBorderRadius, setFrameBorderRadius] = useState(0);
  const [photoBorderRadius, setPhotoBorderRadius] = useState(11); // default 11
  const [stickers, setStickers] = useState<{src: string, x: number, y: number, size: number, rotate?: number}[]>([]);
  const [photoGap, setPhotoGap] = useState(8); // default 8px, bisa diubah
  const [selectedFrameTemplate, setSelectedFrameTemplate] = useState('none');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [frameTemplates, setFrameTemplates] = useState<FrameTemplateForUI[]>([]);
  const [showPhotoResult, setShowPhotoResult] = useState(false);
  const [photoResultData, setPhotoResultData] = useState<string | null>(null);
  const [photoResultGifUrl, setPhotoResultGifUrl] = useState<string | undefined>(undefined);
  // Add state for error message
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  // New states for Live Mode and Crop
  const [liveMode, setLiveMode] = useState(true);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState('');
  const [cropPhotoIndex, setCropPhotoIndex] = useState(0);
  const [showEditMode, setShowEditMode] = useState(false); // New state for edit mode
  const [photoFileNames, setPhotoFileNames] = useState<string[]>([]); // Store MinIO file names for deletion
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false); // Loading state

  // Load photos from IndexedDB on mount
  useEffect(() => {
    const loadSavedPhotos = async () => {
      if (isIndexedDBSupported()) {
        try {
          const savedPhotos = await loadPhotosFromIndexedDB();
          if (savedPhotos.length > 0) {
            setPhotos(savedPhotos);
            setPhotoFileNames(savedPhotos.map(() => '')); // All are base64, no filenames
            console.log('📦 Restored', savedPhotos.length, 'photos from IndexedDB');
            
            // Don't auto-enable edit mode on restore - let user see the photos first
            // User can manually go to edit mode if they want
          }
        } catch (error) {
          console.error('❌ Failed to load photos from IndexedDB:', error);
        }
      }
    };
    
    loadSavedPhotos();
  }, []); // Only run once on mount

  // Save photos to IndexedDB whenever they change
  useEffect(() => {
    if (photos.length > 0 && isIndexedDBSupported()) {
      savePhotosToIndexedDB(photos).catch(error => {
        console.error('❌ Failed to save photos to IndexedDB:', error);
      });
    }
  }, [photos]); // Run whenever photos array changes

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const mobileCheck = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobileCheck);
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
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
    };
    fetchTemplates();
    window.addEventListener('frameTemplatesUpdated', fetchTemplates);
    return () => window.removeEventListener('frameTemplatesUpdated', fetchTemplates);
  }, []);

  // Ubah handleLayoutChange agar kamera muncul lagi saat layout diganti
  const handleLayoutChange = (n: number) => {
    setLayout(n);
    setPhotos([]);
    setShowCamera(true); // <-- Tambahkan ini
  };

  const handleStartCapture = () => {
    setPhotos([]);
    setShowCamera(true); // <-- Tambahkan ini
  };

  // Handler untuk upload image
  // (duplicate removed)

  // Handler untuk kamera/capture - Simpan ke browser cache (base64) saja
  const handleCapture = (photoDataUrl: string) => {
    setIsUploadingPhoto(true);
    console.log('📸 Photo captured, saving to browser cache...');
    
    // Simpan langsung ke state sebagai base64 (tidak upload ke MinIO)
    const updatedPhotos = [...photos, photoDataUrl];
    const updatedFileNames = [...photoFileNames, ''];
    
    setPhotos(updatedPhotos);
    setPhotoFileNames(updatedFileNames);
    console.log('✅ Photo saved! Total:', updatedPhotos.length);
    
    setIsUploadingPhoto(false);
    
    // Jika semua foto sudah diambil, masuk ke edit mode
    if (updatedPhotos.length >= layout) {
      setShowEditMode(true);
      setShowCamera(false);
    }
  };

  // Ubah handleDownloadStrip agar ada loading popup
  const handleDownloadStrip = async () => {
    setIsLoadingResult(true);
    try {
      const node = document.getElementById('strip');
      if (!node) return;

      // Apply filter ke setiap foto jika perlu
      if (filter && filter !== 'none') {
        const imgEls = node.querySelectorAll('img[alt^="photo-"]');
        await Promise.all(
          Array.from(imgEls).map(async (img, idx) => {
            const filtered = await applyFilterToDataUrl(photos[idx], filter);
            img.setAttribute('src', filtered);
          })
        );
      }

      // Tunggu semua gambar di dalam #strip selesai load
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
      const dataUrl = canvas.toDataURL('image/png');

      // Kembalikan src img ke original (agar preview tetap interaktif)
      if (filter && filter !== 'none') {
        const imgEls = node.querySelectorAll('img[alt^="photo-"]');
        imgEls.forEach((img, idx) => {
          img.setAttribute('src', photos[idx]);
        });
      }

      // Generate GIF otomatis
      const GIF = (await import('gif.js')).default;
      const firstImg = new window.Image();
      firstImg.src = photos[0];
      await new Promise(resolve => { firstImg.onload = resolve; });
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
        await new Promise(resolve => { img.onload = resolve; });
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        gif.addFrame(canvas, { delay: 800 });
      }
      const gifUrl = await new Promise<string>(resolve => {
        gif.on('finished', function(blob: Blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        });
        gif.render();
      });

      setPhotoResultData(dataUrl);
      setPhotoResultGifUrl(gifUrl);
      
      // Upload final photo strip to MinIO
      console.log('📤 Uploading photo strip to MinIO...');
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const formData = new FormData();
        formData.append('strip', blob, `photo-strip-${Date.now()}.png`);
        
        const uploadResponse = await fetch('/api/upload-strip', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          console.log('✅ Photo strip uploaded to MinIO:', uploadResult.url);
        } else {
          console.warn('⚠️ Failed to upload photo strip to MinIO');
        }
      } catch (uploadError) {
        console.error('❌ MinIO upload error:', uploadError);
        // Don't block the UI, just log the error
      }
      
      setShowPhotoResult(true);
    } finally {
      setIsLoadingResult(false);
    }
  };

  const handleShowQR = async () => {
    setIsLoadingResult(true); // Tampilkan loading
    try {
      const node = document.getElementById('strip');
      if (!node) return;
      node.classList.add('hide-resize-handle');
      const canvas = await html2canvas(node);
      node.classList.remove('hide-resize-handle');
      const dataUrl = canvas.toDataURL('image/png');

      // Upload ke API
      const res = await fetch('/api/upload-strip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      });
      const { url } = await res.json();

      setQrData(url);
      setShowQR(true);
    } finally {
      setIsLoadingResult(false); // Sembunyikan loading setelah selesai
    }
  };

  const handleCloseQR = () => {
    setShowQR(false);
    setQrData(null);
  };

  // Handler untuk delete foto dari MinIO
  const handleDeletePhoto = (index: number) => {
    console.log('🗑️ Deleting photo from browser cache:', index);
    
    // Remove from arrays
    const newPhotos = [...photos];
    const newFileNames = [...photoFileNames];
    newPhotos.splice(index, 1);
    newFileNames.splice(index, 1);
      
    setPhotos(newPhotos);
    setPhotoFileNames(newFileNames);
    setShowCamera(true);
    setShowEditMode(false);
  };

  // Handler untuk reset semua foto
  const handleResetAllPhotos = async () => {
    console.log('🗑️ Resetting all photos from browser cache and IndexedDB');
    
    // Clear IndexedDB
    if (isIndexedDBSupported()) {
      try {
        await clearPhotosFromIndexedDB();
        console.log('✅ IndexedDB cleared');
      } catch (error) {
        console.error('❌ Failed to clear IndexedDB:', error);
      }
    }
    
    setPhotos([]);
    setPhotoFileNames([]);
    setShowCamera(true);
    setShowEditMode(false);
  };

  // Fungsi untuk menambah stiker ke posisi default (tengah frame)
  const handleAddSticker = (src: string) => {
    setStickers(prev => [...prev, { src, x: 100, y: 100, size: 48, rotate: 0 }]);
  };

  // Fungsi untuk mengubah posisi stiker (drag & drop)
  const handleMoveSticker = (idx: number, x: number, y: number) => {
    setStickers(prev => prev.map((s, i) => i === idx ? { ...s, x, y } : s));
  };

  // Fungsi untuk mengubah ukuran stiker
  const handleResizeSticker = (idx: number, newSize: number) => {
    setStickers(prev =>
      newSize === 0
        ? prev.filter((_, i) => i !== idx)
        : prev.map((s, i) => i === idx ? { ...s, size: newSize } : s)
    );
  };

  // Fungsi untuk memutar stiker
  const handleRotateSticker = (idx: number, delta: number) => {
    setStickers(prev =>
      prev.map((s, i) =>
        i === idx ? { ...s, rotate: ((s.rotate ?? 0) + delta) % 360 } : s
      )
    );
  };

  // Fungsi untuk menghapus stiker
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
  };

  // Update the handleUploadImage function to handle previews properly

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

    Promise.all(readers).then(imgs => {
      setUploadPhotos(prev => {
        const combined = [...prev, ...imgs].slice(0, layout);
        setPhotos(combined); // agar proses selanjutnya tetap pakai photos
        setShowCamera(false);
        return combined;
      });
    });

    e.target.value = '';
  };

  // Handler for saving cropped image
  const handleSaveCroppedImage = (croppedImageUrl: string) => {
    const newPhotos = [...photos];
    newPhotos[cropPhotoIndex] = croppedImageUrl;
    setPhotos(newPhotos);
  };

  // Fungsi untuk apply filter ke dataURL
  async function applyFilterToDataUrl(src: string, filter: string): Promise<string> {
    if (!filter || filter === 'none') return src;
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.filter = filter;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = src;
    });
  }

  return (
    <>
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] p-4">
          <UploadFrameTemplateModal
            onClose={() => setShowUploadModal(false)}
            // tambahkan prop lain jika perlu
          />
        </div>
      )}
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 py-8 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#d72688] tracking-wide text-center">
          Photo Booth
        </h1>
        
        {/* Step indicator - matching screenshot */}
        <div className="text-center mb-2">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-purple-600">
              {photos.length < layout ? 'Step 1 of 3:' : photos.length === layout && !uploadPhotos.length ? 'Step 2 of 3:' : 'Step 3 of 3:'}
            </span> 
            {photos.length < layout ? ' Capture Photos' : photos.length === layout && !uploadPhotos.length ? ' Review & Edit Photos' : ' Customize & Generate'}
          </p>
        </div>

        {/* Camera and upload section - only show when not in edit mode */}
        {!showEditMode && (
          <>
            {/* Remove the duplicate settings panel */}
            
            {/* Tampilkan foto hasil upload/capture secara vertikal - Always shown when photos exist */}
            {uploadPhotos.length > 0 && (
              <div className="flex flex-col gap-3 items-center mb-4 w-full max-w-md sm:max-w-lg">
                <div className="flex justify-start w-full mb-2 px-3 sm:px-4">
                  <h3 className="m-0 text-[#d72688] text-base sm:text-lg font-semibold">
                    Uploaded Photos
                  </h3>
                </div>
                <div className="flex flex-col gap-3 items-center w-full">
                  {uploadPhotos.map((src, idx) => (
                    <div 
                      key={idx}
                      className="relative w-full max-w-xs sm:max-w-sm"
                    >
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
            
            {/* Loading indicator saat upload foto */}
            {isUploadingPhoto && (
              <div className="w-full max-w-2xl mx-auto px-4 mt-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                  <div className="flex-1">
                    <span className="text-purple-700 font-medium block">Uploading photo to cloud storage...</span>
                    <span className="text-purple-600 text-xs">If this takes too long, check if MinIO is running</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tampilkan kamera hanya jika showCamera true dan belum semua foto diambil */}
            {showCamera && photos.length < layout && (
              <div className="w-full max-w-2xl mx-auto px-4">
                <Camera
                  onCapture={handleCapture}
                  photosToTake={layout}
                  onStartCapture={handleStartCapture}
                  filter={filter}
                  frameColor={frameColor}
                  liveMode={liveMode}
                  onToggleLiveMode={() => setLiveMode(!liveMode)}
                />
              </div>
            )}

            {/* Photo Thumbnails with Retake & Crop buttons - Below camera */}
            {photos.length > 0 && (
              <div className="w-full max-w-2xl mx-auto px-4 mt-6">
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      Photos
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        {photos.length}/{layout}
                      </span>
                      {photos.length > 0 && (
                        <span className="ml-2 text-xs text-blue-600" title="Saved in browser storage">
                          💾
                        </span>
                      )}
                    </h3>
                    {photos.length === layout && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 font-medium">Complete!</span>
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '100%', maxWidth: 100 }} />
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-auto rounded-lg border-2 border-gray-200 bg-gray-100"
                          style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                          onLoad={() => {
                            console.log('✅ Photo', index + 1, 'loaded successfully');
                          }}
                        />
                        
                        {/* Overlay buttons on hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center gap-2">
                          {/* Retake button */}
                          <button
                            onClick={() => handleDeletePhoto(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-purple-600 p-2 rounded-full hover:bg-purple-50 shadow-lg"
                            title="Retake this photo"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          {/* Crop button */}
                          <button
                            onClick={() => {
                              setCropImageUrl(photo);
                              setCropPhotoIndex(index);
                              setCropModalOpen(true);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-purple-600 p-2 rounded-full hover:bg-purple-50 shadow-lg"
                            title="Crop this photo"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Photo number badge */}
                        <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                    
                    {/* Empty slots */}
                    {Array.from({ length: layout - photos.length }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400"
                        style={{ aspectRatio: '4/3' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                  
                  {/* Reset button and Continue button */}
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleResetAllPhotos}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                    >
                      Reset All Photos
                    </button>
                    
                    {photos.length < layout && (
                      <button
                        onClick={() => {
                          setShowCamera(true);
                          setShowEditMode(false);
                        }}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium text-sm shadow-md"
                      >
                        Continue Capture ({photos.length}/{layout}) →
                      </button>
                    )}
                    
                    {photos.length === layout && (
                      <button
                        onClick={() => {
                          setShowEditMode(false);
                          setUploadPhotos(photos);
                        }}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium text-sm shadow-md"
                      >
                        Continue to Customize →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Hide upload section when in edit mode */}
            {!showEditMode && (
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
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {/* Upload Image button - Always visible */}
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
              
              {/* Row Container for Pose and Filter */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: '8px',
                  width: '100%',
                }}
              >
                {/* Layout Dropdown */}
                <div 
                  style={{ 
                    height: isMobile ? 44 : 48, 
                    display: 'flex', 
                    alignItems: 'center',
                    flex: 1,
                    width: '50%',
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
                      display: 'flex',
                      alignItems: 'center',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <option value={2}>2 Pose</option>
                    <option value={3}>3 Pose</option>
                    <option value={4}>4 Pose</option>
                  </select>
                </div>
                
                {/* Filter Dropdown */}
                <div 
                  style={{ 
                    height: isMobile ? 44 : 48, 
                    flex: 1,
                    display: 'flex', 
                    alignItems: 'center',
                    width: '50%',
                  }}
                >
                  <FilterSelector 
                    value={filter} 
                    onSelect={setFilter} 
                    isMobile={isMobile} 
                  />
                </div>
              </div>
            </div>
            )}
            {/* End of hidden upload section */}
            
            {/* Display upload error message */}
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

            {/* Display upload status */}
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

        {/* Edit Mode Section - show when all photos are captured */}
        {showEditMode && photos.length === layout && (
          <div className="w-full max-w-4xl mx-auto px-4 mt-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Review Your Photos
                </h3>
                <span className="text-sm text-green-600 font-medium">
                  {photos.length}/{layout} Complete!
                </span>
              </div>

              {/* Photos Grid for Review */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-auto rounded-lg border-2 border-gray-200 bg-gray-100 transition-transform group-hover:scale-105"
                      style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                    />
                    <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowEditMode(false);
                    setShowCamera(true);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                >
                  ← Retake Photos
                </button>
                <button
                  onClick={() => {
                    setShowEditMode(false);
                    setUploadPhotos(photos);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium"
                >
                  Continue to Customize →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Photo customization section - show when photos are ready */}
        {uploadPhotos.length > 0 && (
          <div className="strip-controls-wrapper">
            <div style={{ flex: 2, minWidth: 0 }}>
              {/* Frame Preview dan tombol */}
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
                frameTemplates={frameTemplates} // <-- gunakan state, bukan FRAME_TEMPLATES
                selectedFrameTemplate={selectedFrameTemplate}
              />
            </div>
            <div
              className="photo-editor-panel"
              style={{
                flex: 1,
                minWidth: 0,
                maxWidth: 900, // Lebih lebar, misal 700px
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
              {/* Tombol-tombol di bawah editor */}
              <div className="photo-editor-actions" style={{ marginTop: 24 }}>
                <button
                  onClick={() => setPhotos([])}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#fa75aa',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
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
                    cursor: 'pointer'
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
                    cursor: 'pointer'
                  }}
                >
                  QR Code
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
      cursor: 'pointer'
    }}
  >
    Print
  </button>
              </div>
            </div>
            {/* Popup QR Code tetap di luar baru*/}
            {showQR && qrData && (
              <div
                style={{
                  position: 'fixed',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
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
                    minWidth: 320
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
                      cursor: 'pointer'
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
                  top: 0, left: 0, right: 0, bottom: 0,
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
      {/* Footer */}
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
            A digital photobooth app to capture, edit, and share photo strips with filters, stickers, and colorful frames.
          </span>
          <br />
          <span style={{ fontSize: 16, color: '#d72688', fontWeight: 500 }}>
            &copy; 2025 Photobooth App v2.0
          </span>
        </div>
      </footer>
      {isLoadingResult && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
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
            {/* Bisa tambahkan spinner di sini */}
          </div>
        </div>
      )}

      {/* Crop Modal */}
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