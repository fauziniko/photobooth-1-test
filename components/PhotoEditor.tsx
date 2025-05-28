import React, { useState } from 'react';

const TABS = [
  { key: 'adjust', label: 'Settings' },
  { key: 'sticker', label: 'Sticker' },
  { key: 'filter', label: 'Filter' },
  { key: 'frame', label: 'Color' },
];

export default function PhotoEditor({
  onChangeSlider,
  sliderValue,
  onAddSticker,
  onSelectFilter,
  selectedFilter,
  onSelectFrame,
  selectedFrame,
  availableStickers,
  availableFilters,
  availableFrames,
  frameBorderRadius,
  onChangeFrameBorderRadius,
  photoGap,
  onChangePhotoGap,
  photoBorderRadius,
  onChangePhotoBorderRadius,
  onResetDefault,
}: {
  onChangeSlider: (v: number) => void;
  sliderValue: number;
  onAddSticker: (src: string) => void;
  onSelectFilter: (filter: string) => void;
  selectedFilter: string;
  onSelectFrame: (frame: string) => void;
  selectedFrame: string;
  availableStickers: { src: string; label: string }[];
  availableFilters: { name: string; label: string; color: string }[];
  availableFrames: { name: string; label: string; color: string }[];
  frameBorderRadius: number;
  onChangeFrameBorderRadius: (v: number) => void;
  photoGap: number;
  onChangePhotoGap: (v: number) => void;
  photoBorderRadius: number;
  onChangePhotoBorderRadius: (v: number) => void;
  onResetDefault: () => void;
}) {
  const [activeTab, setActiveTab] = useState('adjust');
  const [uploading, setUploading] = useState(false);

  // Untuk menambah stiker ke list
  const handleUploadSticker = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload-sticker', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    if (data.url) {
      // Tambahkan stiker baru ke list
      if (typeof window !== 'undefined') {
        const localStickers = JSON.parse(localStorage.getItem('userStickers') || '[]');
        localStickers.push({ src: data.url, label: data.name });
        localStorage.setItem('userStickers', JSON.stringify(localStickers));
        window.dispatchEvent(new Event('userStickersUpdated'));
      }
    } else {
      alert('Failed to upload sticker');
    }
    e.target.value = '';
  };

  // Gabungkan stiker default dan user
  const [minioStickers, setMinioStickers] = useState<{ src: string; label: string }[]>([]);
  React.useEffect(() => {
    fetch('/api/list-sticker')
      .then(res => res.json())
      .then(data => {
        if (data.stickers) {
          setMinioStickers(
            data.stickers.map((src: string) => ({
              src,
              label: src.split('/').pop() || 'sticker',
            }))
          );
        }
      });
  }, []);

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 4px 24px rgba(250,117,170,0.08)',
        maxWidth: 800, // Ubah ke 800 atau 900
        margin: '0 auto',
        padding: 0,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Tab Menu */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1.5px solid #fa75aa22',
          background: '#ffe4f0',
          padding: '12px 12px', // padding atas-bawah 12px, kiri-kanan 24px
          justifyContent: 'center',
        }}
      >
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '12px 12px', // padding atas-bawah 12px, kiri-kanan 16px
              background: activeTab === tab.key ? '#fae0ef' : 'transparent',
              color: '#d72688',
              fontWeight: activeTab === tab.key ? 'bold' : 500,
              border: 'none',
              borderBottom: activeTab === tab.key ? '3px solid #fa75aa' : '3px solid transparent',
              fontSize: 17,
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none',
              textAlign: 'center',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: 28, background: '#fff' }}>
        {activeTab === 'adjust' && (
          <>
            <button
              onClick={onResetDefault}
              style={{
                marginBottom: 18,
                padding: '10px 24px',
                background: '#fa75aa',
                color: '#fff',
                border: 'none',
                borderRadius: 16,
                fontWeight: 'bold',
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #fa75aa22',
              }}
            >
              Reset to Default
            </button>
            <label style={{ color: '#d72688', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'block' }}>
              Frame Bottom Size
            </label>
            <input
              type="range"
              min={0}
              max={200}
              value={sliderValue}
              onChange={e => onChangeSlider(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#fa75aa',
                marginBottom: 12,
              }}
            />
            <div style={{ color: '#d72688', fontWeight: 500, fontSize: 14 }}>
              {sliderValue}px
            </div>

            {/* Frame Border Radius */}
            <div style={{ marginTop: 24 }}>
              <label style={{ color: '#d72688', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'block' }}>
                Frame Border Radius
              </label>
              <input
                type="range"
                min={0}
                max={48}
                value={frameBorderRadius}
                onChange={e => onChangeFrameBorderRadius(Number(e.target.value))}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  accentColor: '#fa75aa',
                }}
              />
              <div style={{ color: '#d72688', fontWeight: 500, fontSize: 14 }}>
                {frameBorderRadius}px
              </div>
            </div>

            {/* Photo Gap */}
            <div style={{ marginTop: 24 }}>
              <label style={{ color: '#d72688', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'block' }}>
                Photo Gap
              </label>
              <input
                type="range"
                min={0}
                max={48}
                value={photoGap}
                onChange={e => onChangePhotoGap(Number(e.target.value))}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  accentColor: '#fa75aa',
                }}
              />
              <div style={{ color: '#d72688', fontWeight: 500, fontSize: 14 }}>
                {photoGap}px
              </div>
            </div>

            {/* Photo Border Radius */}
            <div style={{ marginTop: 24 }}>
              <label style={{ color: '#d72688', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'block' }}>
                Photo Border Radius
              </label>
              <input
                type="range"
                min={0}
                max={48}
                value={photoBorderRadius}
                onChange={e => onChangePhotoBorderRadius(Number(e.target.value))}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  accentColor: '#fa75aa',
                }}
              />
              <div style={{ color: '#d72688', fontWeight: 500, fontSize: 14 }}>
                {photoBorderRadius}px
              </div>
            </div>
          </>
        )}

        {activeTab === 'sticker' && (
          <div>
            {/* Upload Sticker */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#d72688', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'block' }}>
                Upload PNG Sticker
              </label>
              <label
                htmlFor="upload-sticker"
                style={{
                  display: 'inline-block',
                  padding: '8px 18px',
                  background: '#fa75aa',
                  color: '#fff',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Choose File
                <input
                  id="upload-sticker"
                  type="file"
                  accept="image/png"
                  onChange={handleUploadSticker}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </label>
              {uploading && <div style={{ color: '#fa75aa', fontSize: 13 }}>Uploading...</div>}
            </div>
            <div style={{ fontWeight: 600, color: '#d72688', marginBottom: 12 }}>Choose Sticker</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[...minioStickers, ...availableStickers].map(sticker => (
                <img
                  key={sticker.src}
                  src={sticker.src}
                  alt={sticker.label}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    border: '2px solid #fa75aa33',
                    background: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #fa75aa11',
                    transition: 'transform 0.1s',
                  }}
                  onClick={() => onAddSticker(sticker.src)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'filter' && (
          <div>
            <div style={{ fontWeight: 600, color: '#d72688', marginBottom: 12 }}>Choose Filter</div>
            <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
      gap: 10 
    }}>
              {availableFilters.map(filter => (
                <button
                  key={filter.name}
                  onClick={() => onSelectFilter(filter.name)}
                  style={{
                    padding: '10px 5px',
                    width: '100%',
                    textAlign: 'center',
                    background: filter.color,
                    color:
                      filter.name === 'none'
                        ? '#111'
                        : selectedFilter === filter.name
                        ? '#fff'
                        : '#d72688',
                    border: selectedFilter === filter.name ? '2px solid #fa75aa' : '2px solid #fa75aa33',
                    borderRadius: 8,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: 15,
                    boxShadow: selectedFilter === filter.name ? '0 2px 8px #fa75aa33' : undefined,
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'frame' && (
          <div>
            <div style={{ fontWeight: 600, color: '#d72688', marginBottom: 12 }}>Choose Frame Color</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {availableFrames.map(frame => (
                <button
                  key={frame.name}
                  onClick={() => onSelectFrame(frame.name)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: frame.color,
                    border: selectedFrame === frame.name ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                    cursor: 'pointer',
                    outline: selectedFrame === frame.name ? '2px solid #fff' : 'none',
                  }}
                  aria-label={frame.label}
                  title={frame.label}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Area preview baru foto */}
      {/* <div style={{ background: '#fff', padding: 0 }}>{children}</div> */}
    </div>
  );
}