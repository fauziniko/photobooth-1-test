import React, { useState } from 'react';

interface Sticker {
  src: string;
  x: number;
  y: number;
  size: number;
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
  onResizeSticker?: (idx: number, delta: number) => void;
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
  onResizeSticker,
}: Props) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // Untuk menyimpan offset saat touch
  const [touchOffset, setTouchOffset] = useState<{ x: number; y: number } | null>(null);

  // Mouse (desktop)
  const handleMouseDown = (idx: number) => () => {
    setDragIdx(idx);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragIdx !== null && onMoveSticker) {
      const rect = (e.target as HTMLElement).closest('#strip')?.getBoundingClientRect();
      if (!rect) return;
      const size = stickers[dragIdx]?.size ?? 48;
      let x = e.clientX - rect.left - size / 2;
      let y = e.clientY - rect.top - size / 2;
      // Batasi agar stiker tetap di dalam frame
      x = Math.max(0, Math.min(x, rect.width - size));
      y = Math.max(0, Math.min(y, rect.height - size));
      onMoveSticker(dragIdx, x, y);
    }
  };
  const handleMouseUp = () => setDragIdx(null);

  // Touch (mobile)
  const handleTouchStart = (idx: number) => (e: React.TouchEvent) => {
    setDragIdx(idx);
    const rect = (e.target as HTMLElement).closest('#strip')?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0];
    const sticker = stickers[idx];
    setTouchOffset({
      x: touch.clientX - rect.left - sticker.x,
      y: touch.clientY - rect.top - sticker.y,
    });
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragIdx !== null && onMoveSticker && touchOffset) {
      const rect = (e.target as HTMLElement).closest('#strip')?.getBoundingClientRect();
      if (!rect) return;
      const touch = e.touches[0];
      const size = stickers[dragIdx]?.size ?? 48;
      let x = touch.clientX - rect.left - touchOffset.x;
      let y = touch.clientY - rect.top - touchOffset.y;
      // Batasi agar stiker tetap di dalam frame
      x = Math.max(0, Math.min(x, rect.width - size));
      y = Math.max(0, Math.min(y, rect.height - size));
      onMoveSticker(dragIdx, x, y);
    }
  };
  const handleTouchEnd = () => {
    setDragIdx(null);
    setTouchOffset(null);
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
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
          <React.Fragment key={idx}>
            {/* Tombol resize */}
            <div
              style={{
                position: 'absolute',
                left: sticker.x + sticker.size - 12,
                top: sticker.y - 24,
                zIndex: 20,
                display: 'flex',
                gap: 4,
              }}
            >
              <button
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: '1px solid #aaa',
                  background: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  padding: 0,
                  lineHeight: 1,
                  fontSize: 16,
                }}
                onClick={e => {
                  e.stopPropagation();
                  onResizeSticker?.(idx, 8);
                }}
                aria-label="Perbesar"
              >+</button>
              <button
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: '1px solid #aaa',
                  background: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  padding: 0,
                  lineHeight: 1,
                  fontSize: 16,
                }}
                onClick={e => {
                  e.stopPropagation();
                  onResizeSticker?.(idx, -8);
                }}
                aria-label="Perkecil"
              >−</button>
            </div>
            <img
              src={sticker.src}
              alt=""
              style={{
                position: 'absolute',
                left: sticker.x,
                top: sticker.y,
                width: sticker.size,
                height: sticker.size,
                cursor: 'move',
                zIndex: 10,
                userSelect: 'none',
                transition: 'width 0.1s, height 0.1s',
                touchAction: 'none',
              }}
              onMouseDown={handleMouseDown(idx)}
              onTouchStart={handleTouchStart(idx)}
              draggable={false}
            />
          </React.Fragment>
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
