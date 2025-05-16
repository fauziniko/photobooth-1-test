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

  const handleCapture = (photo: string) => {
    setPhotos(prev => [...prev, photo]);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <h1>Photo Booth</h1>
      {!photos.length ? (
        <>
          <LayoutSelector onSelect={setLayout} />
          <label>
            Countdown:
            <select value={countdown} onChange={e => setCountdown(Number(e.target.value))} style={{ marginLeft: 8 }}>
              <option value={1}>1s</option>
              <option value={3}>3s</option>
              <option value={5}>5s</option>
            </select>
          </label>
          <Camera onCapture={handleCapture} countdown={countdown} photosToTake={layout} />
        </>
      ) : (
        <>
          <FilterSelector onSelect={setFilter} />
          <FrameCustomizer onColorChange={setFrameColor} />
          <PhotoPreview photos={photos} filter={filter} frameColor={frameColor} />
          <button onClick={() => setPhotos([])}>Ambil Ulang</button>
        </>
      )}
    </main>
  );
}
