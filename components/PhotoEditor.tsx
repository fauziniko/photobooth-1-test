import React, { useState } from 'react';

const TABS = [
  { key: 'adjust', label: 'Pengaturan' },
  { key: 'sticker', label: 'Sticker' },
  { key: 'filter', label: 'Filter' },
  { key: 'frame', label: 'Frame' },
];

export default function PhotoEditor({
  children,
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
}: {
  children: React.ReactNode;
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
}) {
  const [activeTab, setActiveTab] = useState('adjust');

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 4px 24px rgba(250,117,170,0.08)',
        maxWidth: 420,
        margin: '0 auto',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Tab Menu */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1.5px solid #fa75aa22',
          background: '#ffe4f0',
        }}
      >
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '16px 0',
              background: activeTab === tab.key ? '#fae0ef' : 'transparent',
              color: '#d72688',
              fontWeight: activeTab === tab.key ? 'bold' : 500,
              border: 'none',
              borderBottom: activeTab === tab.key ? '3px solid #fa75aa' : '3px solid transparent',
              fontSize: 17,
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: 28, background: '#fff' }}>
        {activeTab === 'adjust' && (
          <div>
            <label style={{ color: '#d72688', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'block' }}>
              Pengaturan Ukuran Frame
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
          </div>
        )}

        {activeTab === 'sticker' && (
          <div>
            <div style={{ fontWeight: 600, color: '#d72688', marginBottom: 12 }}>Pilih Sticker</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {availableStickers.map(sticker => (
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
            <div style={{ fontWeight: 600, color: '#d72688', marginBottom: 12 }}>Pilih Filter</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {availableFilters.map(filter => (
                <button
                  key={filter.name}
                  onClick={() => onSelectFilter(filter.name)}
                  style={{
                    padding: '10px 18px',
                    background: filter.color,
                    color: selectedFilter === filter.name ? '#fff' : '#d72688',
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
            <div style={{ fontWeight: 600, color: '#d72688', marginBottom: 12 }}>Pilih Warna Frame</div>
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
      <div style={{ background: '#fff', padding: 0 }}>{children}</div>
    </div>
  );
}