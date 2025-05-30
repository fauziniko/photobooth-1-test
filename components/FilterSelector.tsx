import React from 'react';

const FILTERS = [
  { label: 'Normal', value: 'none' },
  { label: 'Grayscale', value: 'grayscale(1)' },
  { label: 'Sepia', value: 'sepia(1)' },
  { label: 'Blur', value: 'blur(2px)' },
  { label: 'Brightness', value: 'brightness(1.3)' },
  { label: 'Contrast', value: 'contrast(1.5)' },
  { label: 'Invert', value: 'invert(1)' },
  { label: 'Hue Rotate', value: 'hue-rotate(90deg)' },
];

interface Props {
  value: string;
  onSelect: (v: string) => void;
}

export default function FilterSelector({ value, onSelect }: Props) {
  return (
    <div style={{ marginTop: 0, height: 48, minWidth: 140, display: 'flex', alignItems: 'center' }}>
      <select
        value={value}
        onChange={e => onSelect(e.target.value)}
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
        {FILTERS.map(f => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
    </div>
  );
}
