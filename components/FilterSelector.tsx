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
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
      {FILTERS.map(f => (
        <button
          key={f.value}
          type="button"
          onClick={() => onSelect(f.value)}
          style={{
            padding: '7px 16px',
            borderRadius: 16,
            border: value === f.value ? '2px solid #fa75aa' : '1px solid #ccc',
            background: value === f.value ? '#fa75aa' : '#fff',
            color: value === f.value ? '#fff' : '#222',
            fontWeight: 500,
            cursor: 'pointer',
            fontSize: 14,
            transition: 'all 0.2s'
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
