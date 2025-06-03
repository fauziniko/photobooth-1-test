import React from 'react';

const FILTERS = [
  { label: 'Normal', value: 'none' },
  { label: 'Grayscale', value: 'grayscale(1)' },
  { label: 'Sepia', value: 'sepia(1)' },
  { label: 'Brightness', value: 'brightness(1.3)' },
  { label: 'Contrast', value: 'contrast(1.5)' },

  // Dazz Cam inspired filters
  { label: 'CPM35 (Grainy Blur Retro)', value: 'blur(1.5px) contrast(1.1) brightness(1.05) sepia(0.2) grayscale(0.1)' },
  { label: 'FXN R (Fuji Warm High Contrast)', value: 'contrast(1.3) brightness(1.1) sepia(0.18) saturate(1.2)' },
  { label: 'D Fun S (Dark Moody)', value: 'brightness(0.7) contrast(1.2) sepia(0.3) saturate(0.8)' },
  { label: 'GRD R (Artistic Highlight)', value: 'contrast(1.4) brightness(1.05) grayscale(0.15)' },
  { label: 'S 67 (Food Saturation)', value: 'saturate(1.5) contrast(1.1) brightness(1.08)' },
  { label: 'NT16 (Natural Soft)', value: 'brightness(1.08) contrast(1.05) sepia(0.08) saturate(1.1)' },
  { label: 'Classic U (Timeless Classic)', value: 'contrast(1.12) brightness(1.04) sepia(0.12)' },

  // Tambahan filter Dazz Cam populer
  { label: 'INS P (Instant Polaroid)', value: 'contrast(1.15) brightness(1.08) sepia(0.12) saturate(1.08)' },
  { label: 'KODAK G (Kodak Gold)', value: 'contrast(1.18) brightness(1.06) sepia(0.18) saturate(1.15)' },
  { label: 'AGFA V (Agfa Vintage)', value: 'contrast(1.08) brightness(1.04) sepia(0.22) saturate(1.12)' },
  { label: 'VHS (Retro VHS)', value: 'contrast(1.2) brightness(0.98) sepia(0.18) grayscale(0.12)' },
  { label: 'BW Film', value: 'grayscale(1) contrast(1.2) brightness(1.02)' },
  { label: 'Summer', value: 'brightness(1.12) saturate(1.18) contrast(1.08)' },
  { label: 'Winter', value: 'brightness(0.92) saturate(0.85) contrast(1.12)' },
  { label: 'Fade', value: 'brightness(1.08) contrast(0.92) sepia(0.08)' },
  { label: 'Warm', value: 'brightness(1.05) sepia(0.18) saturate(1.12)' },
  { label: 'Cool', value: 'brightness(1.02) contrast(1.08) grayscale(0.18)' },
];

interface Props {
  value: string;
  onSelect: (v: string) => void;
  isMobile?: boolean;
}

export default function FilterSelector({ value, onSelect, isMobile = false }: Props) {
  return (
    <div style={{ 
      height: isMobile ? 44 : 48, 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center' 
    }}>
      <select
        value={value}
        onChange={e => onSelect(e.target.value)}
        style={{
          padding: isMobile ? '8px 12px' : '8px 16px',
          borderRadius: 12,
          border: '1px solid #fa75aa',
          color: '#d72688',
          fontWeight: 500,
          fontSize: isMobile ? 14 : 15,
          background: '#fff',
          outline: 'none',
          cursor: 'pointer',
          height: isMobile ? 44 : 48,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {FILTERS.map(f => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
    </div>
  );
}
