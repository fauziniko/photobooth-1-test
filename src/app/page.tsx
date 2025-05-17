'use client';
import { useState } from 'react';
import Camera from '../../components/Camera';
import LayoutSelector from '../../components/LayoutSelector';
import FilterSelector from '../../components/FilterSelector';
import FrameCustomizer from '../../components/FrameCustomizer';
import PhotoPreview from '../../components/PhotoPreview';

export default function Home() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [layout, setLayout] = useState(4);
  const [filter, setFilter] = useState('none');
  const [frameColor, setFrameColor] = useState('white');

  // Reset photos setiap kali layout berubah
  const handleLayoutChange = (n: number) => {
    setLayout(n);
    setPhotos([]);
  };

  // Reset photos sebelum mulai capture baru
  const handleStartCapture = () => {
    setPhotos([]);
  };

  const handleCapture = (photo: string) => {
    setPhotos(prev => [...prev, photo]);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <h1>Photo Booth</h1>
      {photos.length < layout ? (
        <>
          <LayoutSelector onSelect={handleLayoutChange} />
          <label>
            Countdown:
            <select value={countdown} onChange={e => setCountdown(Number(e.target.value))} style={{ marginLeft: 8 }}>
              <option value={1}>1s</option>
              <option value={3}>3s</option>
              <option value={5}>5s</option>
            </select>
          </label>
          <Camera
            onCapture={handleCapture}
            countdown={countdown}
            photosToTake={layout}
            onStartCapture={handleStartCapture}
          />
          <div style={{ marginTop: 16, color: '#888' }}>
            {photos.length > 0 && `Foto diambil: ${photos.length} / ${layout}`}
          </div>
        </>
      ) : (
        <>
          <FilterSelector onSelect={setFilter} />
          <FrameCustomizer onColorChange={setFrameColor} />
          <PhotoPreview photos={photos} filter={filter} frameColor={frameColor} />
          <button
            onClick={() => setPhotos([])}
            style={{
              marginTop: '20px',
              padding: '14px 32px',
              backgroundColor: '#ff1744', // merah terang
              color: '#fff',
              border: 'none',
              borderRadius: '28px',
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255,23,68,0.15)',
              transition: 'background 0.2s'
            }}
          >
            Ambil Ulang
          </button>
        </>
      )}
    </main>
  );
}
