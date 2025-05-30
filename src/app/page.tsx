'use client';
import { useState, useEffect } from 'react';
import Camera from '../../components/Camera';
import PhotoPreview from '../../components/PhotoPreview';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import PhotoEditor from '../../components/PhotoEditor';
import UploadFrameTemplateModal from '../../components/UploadFrameTemplateModal';
import FilterSelector from '../../components/FilterSelector';
import PhotoResult from '../../components/PhotoResult'; // pastikan sudah ada

type FrameTemplate = { name: string; frameUrl: string; stickerUrl: string };
type FrameTemplateForUI = { name: string; label: string; src: string; sticker?: string };

export default function Home() {
  const [photos, setPhotos] = useState<string[]>([]);
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

  const handleCapture = (photo: string) => {
    setPhotos(prev => [...prev, photo]);
  };

const handleDownloadStrip = async () => {
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
  const gifUrl: string = await new Promise(resolve => {
    gif.on('finished', function(blob: Blob) {
      const url = URL.createObjectURL(blob);
      resolve(url);
    });
    gif.render();
  });

  // Tampilkan popup PhotoResult dengan GIF
  setPhotoResultData(dataUrl);
  setPhotoResultGifUrl(gifUrl);
  setShowPhotoResult(true);
};

  const handleShowQR = async () => {
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
  };

  const handleCloseQR = () => {
    setShowQR(false);
    setQrData(null);
  };

  const handleDownloadGIF = async () => {
    if (photos.length === 0) return;

    const firstImg = new window.Image();
    firstImg.src = photos[0];
    await new Promise(resolve => { firstImg.onload = resolve; });

    const width = firstImg.naturalWidth;
    const height = firstImg.naturalHeight;

    const GIF = (await import('gif.js')).default;

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

    gif.on('finished', function(blob: Blob) {
      const url = URL.createObjectURL(blob);
      setPhotoResultGifUrl(url); // <-- simpan ke state
      // Download otomatis (opsional)
      const a = document.createElement('a');
      a.href = url;
      a.download = 'photobooth.gif';
      a.click();
      // URL.revokeObjectURL(url); // jangan revoke dulu, biar bisa dipreview
    });

    gif.render();
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

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
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
      setPhotos(prev => {
        const newPhotos = [...prev, ...imgs].slice(0, layout);
        setShowCamera(false); // <-- Ini sekarang sudah benar
        return newPhotos;
      });
    });
    e.target.value = '';
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
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
        }}>
          <UploadFrameTemplateModal
            onClose={() => setShowUploadModal(false)}
            // tambahkan prop lain jika perlu
          />
        </div>
      )}
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <h1
          style={{
            color: '#d72688',
            fontSize: 40,
            fontWeight: 'bold',
            marginBottom: 0, // dari 16 jadi 4 agar lebih dekat ke bawah
            letterSpacing: 1,
          }}
        >
          Photo Booth
        </h1>
        {photos.length < layout ? (
          <>
            {photos.length > 0 && (
              <div
                style={{
                  marginTop: 0,         // dari -1 jadi 0
                  marginBottom: 2,
                  fontSize: 18,
                  fontWeight: 400,
                  color: '#111',
                  letterSpacing: 1,
                }}
              >
                {`Photos taken: ${photos.length} / ${layout}`}
              </div>
            )}
            {/* Tampilkan foto hasil upload/capture secara vertikal */}
            {(!showCamera && photos.length > 0) && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  alignItems: 'center',
                  marginBottom: 18,
                }}
              >
                {photos.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`uploaded-${idx}`}
                    style={{
                      width: 240,
                      height: 180,
                      objectFit: 'cover',
                      borderRadius: 12,
                      boxShadow: '0 2px 8px #fa75aa22',
                      background: '#fff',
                    }}
                  />
                ))}
              </div>
            )}
            {/* Tampilkan kamera hanya jika showCamera true */}
            {showCamera && (
              <Camera
                onCapture={handleCapture}
                photosToTake={layout}
                onStartCapture={handleStartCapture}
                filter={filter}
                frameColor={frameColor}
              />
            )}
            <div
              style={{
                display: 'flex',
                gap: 24,
                justifyContent: 'center',
                marginTop: 16,
                alignItems: 'center',
                paddingLeft: 16,
                paddingRight: 16,
                boxSizing: 'border-box',
                width: '100%',
                maxWidth: 500, // Batasi lebar agar tidak nabrak dinding layar
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {/* Layout Dropdown */}
              <div style={{ height: 48, minWidth: 140, display: 'flex', alignItems: 'center' }}>
                <select
                  value={layout}
                  onChange={e => handleLayoutChange(Number(e.target.value))}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 12,
                    border: '1px solid #fa75aa',
                    color: '#d72688',
                    fontWeight: 500,
                    fontSize: 15,
                    background: '#fff',
                    outline: 'none',
                    cursor: 'pointer',
                    height: 48,
                    minWidth: 140,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <option value={2}>2 Pose</option>
                  <option value={3}>3 Pose</option>
                  <option value={4}>4 Pose</option>
                  <option value={6}>6 Pose</option>
                </select>
              </div>
              {/* Upload Image */}
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
                  height: 48,
                  minWidth: 140,
                }}
              >
                <span
                  style={{
                    padding: '8px 16px',
                    background: '#fff',
                    color: '#d72688',
                    borderRadius: 12,
                    border: '1px solid #fa75aa',
                    fontWeight: 500,
                    fontSize: 15,
                    marginRight: 8,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    height: 48,
                    minWidth: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Upload Image
                </span>
                <input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  style={{ display: 'none' }}
                />
              </label>
              {/* Filter Dropdown */}
              <div style={{ height: 48, minWidth: 140, display: 'flex', alignItems: 'center' }}>
                <FilterSelector value={filter} onSelect={setFilter} />
              </div>
            </div>
          </>
        ) : (
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
              />
              {/* Tombol-tombol di bawah editor */}
              <div className="photo-editor-actions" style={{ marginTop: 24 }}>
                <button onClick={() => setPhotos([])} style={{ padding: '12px 24px', backgroundColor: '#ff1744', color: '#fff', border: 'none', borderRadius: '24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Retake
                </button>
                <button onClick={handleDownloadStrip} style={{ padding: '12px 24px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Download Strip
                </button>
                <button onClick={handleShowQR} style={{ padding: '12px 24px', backgroundColor: '#FFD600', color: '#222', border: 'none', borderRadius: '24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  QR Code
                </button>
                <button onClick={handleDownloadGIF} style={{ padding: '12px 24px', backgroundColor: '#00B8D9', color: '#fff', border: 'none', borderRadius: '24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Download GIF
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
    </>
  );
}