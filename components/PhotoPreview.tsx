import React, { useState } from 'react';

interface Sticker {
  src: string;
  x: number;
  y: number;
}

interface Props {
  photos: string[];
  filter: string;
  frameColor: string;
  bottomSpace: number;
  frameBorderRadius: number;
  photoBorderRadius: number;
  stickers?: Sticker[];
  onMoveSticker?: (idx: number, x: number, y: number) => void;
}

export default function PhotoPreview({
  photos,
  filter,
  frameColor,
  bottomSpace,
  frameBorderRadius,
  photoBorderRadius,
  stickers = [],
  onMoveSticker,
}: Props) {
  // Drag logic
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleMouseDown = (idx: number) => () => {
    setDragIdx(idx);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragIdx !== null && onMoveSticker) {
      const rect = (e.target as HTMLElement).closest('#strip')?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left - 24; // 24 = half sticker size
      const y = e.clientY - rect.top - 24;
      onMoveSticker(dragIdx, x, y);
    }
  };

  const handleMouseUp = () => setDragIdx(null);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        id="strip"
        style={{
          backgroundColor: frameColor,
          padding: 20,
          borderRadius: frameBorderRadius,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          maxWidth: '90vw',
          position: 'relative',
        }}
      >
        {photos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`photo-${i}`}
            style={{
              filter,
              width: 240,
              height: 180,
              objectFit: 'cover',
              borderRadius: photoBorderRadius,
            }}
          />
        ))}
        {/* Render stickers di atas foto */}
        {stickers.map((sticker, idx) => (
          <img
            key={idx}
            src={sticker.src}
            alt=""
            style={{
              position: 'absolute',
              left: sticker.x,
              top: sticker.y,
              width: 48,
              height: 48,
              cursor: 'move',
              zIndex: 10,
              userSelect: 'none',
            }}
            onMouseDown={handleMouseDown(idx)}
            draggable={false}
          />
        ))}
        <div
          style={{
            width: 200,
            height: bottomSpace,
            background: 'transparent',
          }}
        />
      </div>
    </div>
  );
}
