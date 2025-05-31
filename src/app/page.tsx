'use client';
import { useState } from 'react';
import Camera from '../../components/Camera';
import LayoutSelector from '../../components/LayoutSelector';
import PhotoPreview from '../../components/PhotoPreview';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import PhotoEditor from '../../components/PhotoEditor';
import PhotoResult from '../../components/PhotoResult';
import GIF from 'gif.js';

const STICKERS = [
  { src: '/stickers/ballon.png', label: 'Ballon' },
  { src: '/stickers/topi.png', label: 'Topi' },
  { src: '/stickers/flamingo.png', label: 'flamingo' },
];

async function generateGifFromPhotos(photos: string[], frameColor: string): Promise<string> {
  if (photos.length === 0) return '';
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
  return new Promise<string>(resolve => {
    gif.on('finished', function(blob: Blob) {
      const url = URL.createObjectURL(blob);
      resolve(url);
    });
    gif.render();
  });
}

export default function Home() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [layout, setLayout] = useState(4);
  const [filter, setFilter] = useState('none');
  const [frameColor, setFrameColor] = useState('white');
  const [bottomSpace, setBottomSpace] = useState(85);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [frameBorderRadius, setFrameBorderRadius] = useState(0);
  const [photoBorderRadius, setPhotoBorderRadius] = useState(11);
  const [stickers, setStickers] = useState<{src: string, x: number, y: number, size: number, rotate?: number}[]>([]);
  const [photoGap, setPhotoGap] = useState(8);
  const [hasilStripUrl, setHasilStripUrl] = useState<string | undefined>(undefined);

  const [showPhotoResult, setShowPhotoResult] = useState(false);
  const [photoResultData, setPhotoResultData] = useState<{
    photos: string[];
    frames?: string[];
    gifUrl?: string;
  } | null>(null);

  const [hasilFrameArray, setHasilFrameArray] = useState<string[]>([]);
  const [hasilGifUrl, setHasilGifUrl] = useState<string | undefined>(undefined);

  const handleLayoutChange = (n: number) => {
    setLayout(n);
    setPhotos([]);
    setHasilFrameArray([]);
    setHasilGifUrl(undefined);
  };

  const handleStartCapture = () => {
    setPhotos([]);
    setHasilFrameArray([]);
    setHasilGifUrl(undefined);
  };

  const handleCapture = (photo: string) => {
    setPhotos(prev => [...prev, photo]);
  };

  const handleGenerateFrames = () => {
    const frames = photos.map((src) => src);
    setHasilFrameArray(frames);
  };

const handleDownloadStrip = async () => {
  const node = document.getElementById('strip');
  if (!node) return;
  node.classList.add('hide-resize-handle');
  const canvas = await html2canvas(node);
  node.classList.remove('hide-resize-handle');
  const dataUrl = canvas.toDataURL('image/png');

  setHasilStripUrl(dataUrl); // simpan strip png

  if (hasilFrameArray.length === 0) handleGenerateFrames();

  let gifUrl = hasilGifUrl;
  if (!gifUrl) {
    gifUrl = await generateGifFromPhotos(photos, frameColor);
    setHasilGifUrl(gifUrl);
  }

  setPhotoResultData({
    photos,
    frames: [dataUrl], // tambahkan strip ke frames
    gifUrl,
  });
  setShowPhotoResult(true);
};

  const handleShowQR = async () => {
    const node = document.getElementById('strip');
    if (!node) return;
    node.classList.add('hide-resize-handle');
    const canvas = await html2canvas(node);
    node.classList.remove('hide-resize-handle');
    const dataUrl = canvas.toDataURL('image/png');

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
  const gifUrl = await generateGifFromPhotos(photos, frameColor);
  setHasilGifUrl(gifUrl);

  // Download GIF saja, tidak membuka galeri
  const link = document.createElement('a');
  link.download = 'photobooth.gif';
  link.href = gifUrl;
  link.click();
};
  const handleAddSticker = (src: string) => {
    setStickers(prev => [...prev, { src, x: 100, y: 100, size: 48, rotate: 0 }]);
  };

  const handleMoveSticker = (idx: number, x: number, y: number) => {
    setStickers(prev => prev.map((s, i) => i === idx ? { ...s, x, y } : s));
  };

  const handleResizeSticker = (idx: number, newSize: number) => {
    setStickers(prev =>
      newSize === 0
        ? prev.filter((_, i) => i !== idx)
        : prev.map((s, i) => i === idx ? { ...s, size: newSize } : s)
    );
  };

  const handleRotateSticker = (idx: number, delta: number) => {
    setStickers(prev =>
      prev.map((s, i) =>
        i === idx ? { ...s, rotate: ((s.rotate ?? 0) + delta) % 360 } : s
      )
    );
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
          {photos.length > 0 && (
            <div style={{
              marginBottom: 18,
              fontSize: 24,
              fontWeight: 'bold',
              color: '#111',
              letterSpacing: 1,
            }}>
              {`Foto diambil: ${photos.length} / ${layout}`}
            </div>
          )}
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
          </div>
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
          <div style={{ marginTop: 16, color: '#888' }}>
            {photos.length > 0 && `Foto diambil: ${photos.length} / ${layout}`}
          </div>
        </>
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
              onSelectFilter={setFilter}
              selectedFilter={filter}
              onSelectFrame={setFrameColor}
              selectedFrame={frameColor}
              availableStickers={STICKERS}
              availableFilters={[
                { name: 'none', label: 'Normal', color: '#fff' },
                { name: 'grayscale(1)', label: 'BW', color: '#bbb' },
                { name: 'sepia(1)', label: 'Sepia', color: '#e2c799' },
                { name: 'contrast(1.5)', label: 'Kontras', color: '#f7e6ff' },
              ]}
              availableFrames={[
                { name: 'white', label: 'Putih', color: '#fff' },
                { name: 'pink', label: 'Pink', color: '#fa75aa' },
                { name: 'yellow', label: 'Kuning', color: '#ffe066' },
                { name: 'blue', label: 'Biru', color: '#7ecbff' },
              ]}
              frameBorderRadius={frameBorderRadius}
              onChangeFrameBorderRadius={setFrameBorderRadius}
              photoGap={photoGap}
              onChangePhotoGap={setPhotoGap}
              photoBorderRadius={photoBorderRadius}
              onChangePhotoBorderRadius={setPhotoBorderRadius}
              onResetDefault={handleResetDefault}
            />
            <div className="photo-editor-actions" style={{ marginTop: 24 }}>
              <button onClick={() => setPhotos([])} style={{ padding: '12px 24px', backgroundColor: '#ff1744', color: '#fff', border: 'none', borderRadius: '24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Ambil Ulang</button>
              <button onClick={handleDownloadStrip} style={{ padding: '12px 24px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Lihat Hasil</button>
              <button onClick={handleShowQR} style={{ padding: '12px 24px', backgroundColor: '#FFD600', color: '#222', border: 'none', borderRadius: '24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>QR Code</button>
              {/* <button onClick={handleDownloadGIF} style={{ padding: '12px 24px', backgroundColor: '#00B8D9', color: '#fff', border: 'none', borderRadius: '24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Download GIF</button> */}
            </div>
          </div>
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
                <h2 style={{ margin: 0, color: '#111' }}>Scan QR untuk Download</h2>
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
                  Tutup
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
                  photos={photoResultData.photos}
                  frames={photoResultData.frames}
                  gifUrl={photoResultData.gifUrl}
                  onClose={() => setShowPhotoResult(false)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}