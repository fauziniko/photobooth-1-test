'use client';
import { useState } from 'react';
import Camera from '../../components/Camera';
import LayoutSelector from '../../components/LayoutSelector';
import FilterSelector from '../../components/FilterSelector';
import FrameCustomizer from '../../components/FrameCustomizer';
import PhotoPreview from '../../components/PhotoPreview';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';

export default function Home() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [layout, setLayout] = useState(4);
  const [filter, setFilter] = useState('none');
  const [frameColor, setFrameColor] = useState('white');
  const [bottomSpace, setBottomSpace] = useState(85); // default 85
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [frameBorderRadius, setFrameBorderRadius] = useState(24);
  const [photoBorderRadius, setPhotoBorderRadius] = useState(24);

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
    html2canvas(node).then(canvas => {
      const link = document.createElement('a');
      link.download = 'photostrip.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  const handleShowQR = async () => {
    const node = document.getElementById('strip');
    if (!node) return;
    const canvas = await html2canvas(node);
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
          {/* Kamera di atas */}
          <Camera
            onCapture={handleCapture}
            photosToTake={layout}
            countdown={countdown}
            onStartCapture={handleStartCapture}
          />
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
          <div style={{ marginTop: 16, color: '#888' }}>
            {photos.length > 0 && `Foto diambil: ${photos.length} / ${layout}`}
          </div>
        </>
      ) : (
        <div
          className="strip-controls-wrapper"
          style={{
            width: '100%',
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          <style>
            {`
              @media (min-width: 900px) {
                .strip-controls-flex {
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  justify-content: center;
                  gap: 32px;
                }
                .strip-frame-col {
                  flex: 1 1 0%;
                  display: flex;
                  justify-content: flex-end;
                }
                .strip-controls-col {
                  flex: 1 1 0%;
                  min-width: 280px;
                  max-width: 340px;
                  display: flex;
                  flex-direction: column;
                  gap: 24px;
                  align-items: flex-start;
                  margin-left: 40px;
                }
              }
              @media (max-width: 899px) {
                .strip-controls-flex {
                  display: flex;
                  flex-direction: column;
                  gap: 32px;
                  align-items: center;
                }
                .strip-controls-col, .strip-frame-col {
                  width: 100%;
                  margin: 0;
                  justify-content: center;
                  align-items: center;
                }
              }
            `}
          </style>
          <div className="strip-controls-flex">
            {/* Frame strip di kiri */}
            <div className="strip-frame-col">
              <PhotoPreview
                photos={photos}
                filter={filter}
                frameColor={frameColor}
                bottomSpace={bottomSpace}
                frameBorderRadius={frameBorderRadius}
                photoBorderRadius={photoBorderRadius}
              />
            </div>
            {/* Kontrol di kanan */}
            <div className="strip-controls-col">
              <div style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <label htmlFor="bottom-space" style={{ fontWeight: 'bold', color: '#111' }}>
                  Space Bawah:
                </label>
                <input
                  id="bottom-space"
                  type="range"
                  min={0}
                  max={400}
                  value={bottomSpace}
                  onChange={e => setBottomSpace(Number(e.target.value))}
                  style={{ width: 120 }}
                />
                <span style={{ color: '#111', minWidth: 40 }}>{bottomSpace}px</span>
              </div>
              <div style={{ margin: '16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <label htmlFor="frame-border-radius" style={{ fontWeight: 'bold', color: '#111' }}>
                  Frame Border Radius:
                </label>
                <input
                  id="frame-border-radius"
                  type="range"
                  min={0}
                  max={100}
                  value={frameBorderRadius}
                  onChange={e => setFrameBorderRadius(Number(e.target.value))}
                  style={{ width: 120 }}
                />
                <span style={{ color: '#111', minWidth: 40 }}>{frameBorderRadius}px</span>
              </div>
              <div style={{ margin: '16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <label htmlFor="photo-border-radius" style={{ fontWeight: 'bold', color: '#111' }}>
                  Foto Border Radius:
                </label>
                <input
                  id="photo-border-radius"
                  type="range"
                  min={0}
                  max={100}
                  value={photoBorderRadius}
                  onChange={e => setPhotoBorderRadius(Number(e.target.value))}
                  style={{ width: 120 }}
                />
                <span style={{ color: '#111', minWidth: 40 }}>{photoBorderRadius}px</span>
              </div>
              <FilterSelector onSelect={setFilter} />
              <FrameCustomizer onColorChange={setFrameColor} />
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button
                  onClick={() => setPhotos([])}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#ff1744',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(255,23,68,0.15)',
                    transition: 'background 0.2s',
                  }}
                >
                  Ambil Ulang
                </button>
                <button
                  onClick={handleDownloadStrip}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Download Strip
                </button>
                <button
                  onClick={handleShowQR}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#FFD600',
                    color: '#222',
                    border: 'none',
                    borderRadius: '24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  QR Code
                </button>
                <button
                  onClick={handleDownloadGIF}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#00B8D9',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '24px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Download GIF
                </button>
              </div>
            </div>
          </div>
          {/* Popup QR Code */}
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
        </div>
      )}
    </main>
  );
}
