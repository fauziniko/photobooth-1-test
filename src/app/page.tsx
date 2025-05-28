'use client';
import { useState } from 'react';
import Camera from '../../components/Camera';
import LayoutSelector from '../../components/LayoutSelector';
import PhotoPreview from '../../components/PhotoPreview';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import PhotoEditor from '../../components/PhotoEditor';

const STICKERS = [
  { src: '/stickers/ballon.png', label: 'Ballon' },
  { src: '/stickers/topi.png', label: 'Topi' },
  { src: '/stickers/flamingo.png', label: 'flamingo' },
  // Tambahkan stiker lain sesuai kebutuhan
];

const FRAME_TEMPLATES = [
  { name: 'none', label: 'No Template', src: '' },
  { name: 'classic', label: 'Classic', src: '/frames/baru.png' },
  { name: 'modern', label: 'Modern', src: '/frames/kedua.png' },
  // Tambahkan template lain sesuai kebutuhan
];

export default function Home() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(3);
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

  const handleLayoutChange = (n: number) => {
    setLayout(n);
    setPhotos([]);
  };

  const handleStartCapture = () => {
    setPhotos([]);
  };

  const handleCapture = (photo: string) => {
    setPhotos(prev => [...prev, photo]);
  };

  const handleDownloadStrip = () => {
    const node = document.getElementById('strip');
    if (!node) return;
    node.classList.add('hide-resize-handle');
    html2canvas(node).then(canvas => {
      node.classList.remove('hide-resize-handle');
      const link = document.createElement('a');
      link.download = 'photostrip.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
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

    // Buat image pertama untuk ambil ukuran asli
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

      // Render ke canvas dengan ukuran asli kamera
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
      const a = document.createElement('a');
      a.href = url;
      a.download = 'photobooth.gif';
      a.click();
      URL.revokeObjectURL(url);
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
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const target = event.target as FileReader | null;
      if (target && typeof target.result === 'string') {
        setPhotos(prev => [...prev, target.result as string]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <>
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
            color: '#111',
            fontSize: 48,
            fontWeight: 'bold',
            marginBottom: 16,
            letterSpacing: 2,
          }}
        >
          Photo Booth
        </h1>
        {photos.length < layout ? (
          <>
            {/* Pindahkan ke sini */}
            {photos.length > 0 && (
              <div style={{
                marginBottom: 18,
                fontSize: 24,
                fontWeight: 'bold',
                color: '#111',
                letterSpacing: 1,
              }}>
                {`Photos taken: ${photos.length} / ${layout}`}
              </div>
            )}
            {/* Kamera di atas */}
            <Camera
              onCapture={handleCapture}
              photosToTake={layout}
              countdown={countdown}
              onStartCapture={handleStartCapture}
            />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
              <label
                htmlFor="upload-image"
                style={{
                  display: 'inline-block',
                  padding: '10px 24px',
                  background: '#fa75aa',
                  color: '#fff',
                  borderRadius: 16,
                  fontWeight: 'bold',
                  fontSize: 15,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px #fa75aa22',
                }}
              >
                Upload Image
                <input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImage}
                  style={{ display: 'none' }}
                />
              </label>
              {/* Tombol Start Capture sudah ada di komponen Camera */}
            </div>
            {/* Countdown di atas, lalu Pilih Layout */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 16 }}>
              <label style={{ color: '#111', fontWeight: 'bold' }}>
                Countdown:
                <select
                  value={countdown}
                  onChange={e => setCountdown(Number(e.target.value))}
                  style={{
                    marginLeft: 8,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    color: '#111',
                    background: '#fff',
                  }}
                >
                  <option value={1}>1s</option>
                  <option value={3}>3s</option>
                  <option value={5}>5s</option>
                </select>
              </label>
              <LayoutSelector onSelect={handleLayoutChange} />
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
                frameTemplates={FRAME_TEMPLATES} // <-- tambahkan ini
                selectedFrameTemplate={selectedFrameTemplate} // <-- dan ini
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
                onSelectFilter={setFilter}
                selectedFilter={filter}
                onSelectFrame={setFrameColor}
                selectedFrame={frameColor}
                frameTemplates={FRAME_TEMPLATES}
                selectedFrameTemplate={selectedFrameTemplate}
                onSelectFrameTemplate={setSelectedFrameTemplate}
                availableStickers={STICKERS}
                availableFilters={[
                  { name: 'none', label: 'Normal', color: '#fff' },
                  { name: 'grayscale(1)', label: 'BW', color: '#bbb' },
                  { name: 'sepia(1)', label: 'Sepia', color: '#e2c799' },
                  { name: 'contrast(1.5)', label: 'Contrast', color: '#f7e6ff' },
                ]}
                availableFrames={[
                  { name: 'white', label: 'White', color: '#fff' },
                  { name: 'pink', label: 'Pink', color: '#fa75aa' },
                  { name: 'yellow', label: 'Yellow', color: '#ffe066' },
                  { name: 'blue', label: 'Blue', color: '#7ecbff' },
                ]}
                frameBorderRadius={frameBorderRadius}
                onChangeFrameBorderRadius={setFrameBorderRadius}
                photoGap={photoGap}
                onChangePhotoGap={setPhotoGap}
                photoBorderRadius={photoBorderRadius}
                onChangePhotoBorderRadius={setPhotoBorderRadius}
                onResetDefault={handleResetDefault} // <-- tambahkan baris ini
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
          &copy; 2024 Photobooth App v1.0<br />
          <span style={{ fontSize: 12, color: '#b95b8e' }}>
            A digital photobooth app to capture, edit, and share photo strips with filters, stickers, and colorful frames.
          </span>
        </div>
      </footer>
    </>
  );
}
