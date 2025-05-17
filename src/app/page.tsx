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
  const [bottomSpace, setBottomSpace] = useState(200);

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
      <h1>Photo Booth</h1>
      {photos.length < layout ? (
        <>
          <LayoutSelector onSelect={handleLayoutChange} />
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
        // Responsive layout for desktop
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <div
            className="strip-controls-wrapper"
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: 900,
              gap: 32,
            }}
          >
            {/* Flex row for desktop, column for mobile */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 32,
              }}
              className="strip-controls-flex"
            >
              <style>
                {`
                  @media (min-width: 900px) {
                    .strip-controls-flex {
                      flex-direction: row;
                      align-items: flex-start;
                      justify-content: center;
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
                    .strip-controls-col, .strip-frame-col {
                      width: 100%;
                      margin: 0;
                      justify-content: center;
                      align-items: center;
                    }
                  }
                `}
              </style>
              {/* Frame strip di kiri */}
              <div className="strip-frame-col">
                <PhotoPreview
                  photos={photos}
                  filter={filter}
                  frameColor={frameColor}
                  bottomSpace={bottomSpace}
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
                <FilterSelector onSelect={setFilter} />
                <FrameCustomizer onColorChange={setFrameColor} />
                <button
                  onClick={() => setPhotos([])}
                  style={{
                    marginTop: '20px',
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
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
