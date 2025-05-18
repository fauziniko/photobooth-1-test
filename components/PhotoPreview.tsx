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
  onResizeSticker?: (idx: number, newSize: number) => void;
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
  const [resizeIdx, setResizeIdx] = useState<number | null>(null);
  const [touchOffset, setTouchOffset] = useState<{ x: number; y: number } | null>(null);
  const [resizeStart, setResizeStart] = useState<{ startX: number; startY: number; startSize: number } | null>(null);

  // Drag sticker (move)
  const handleMouseDown = (idx: number) => (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return;
    setDragIdx(idx);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragIdx !== null && onMoveSticker) {
      const rect = (e.currentTarget as HTMLElement).querySelector('#strip')?.getBoundingClientRect();
      if (!rect) return;
      const size = stickers[dragIdx]?.size ?? 48;
      let x = e.clientX - rect.left - size / 2;
      let y = e.clientY - rect.top - size / 2;
      x = Math.max(0, Math.min(x, rect.width - size));
      y = Math.max(0, Math.min(y, rect.height - size));
      onMoveSticker(dragIdx, x, y);
    }
    if (resizeIdx !== null && onResizeSticker && resizeStart) {
      const rect = (e.currentTarget as HTMLElement).querySelector('#strip')?.getBoundingClientRect();
      if (!rect) return;
      const dx = e.clientX - resizeStart.startX;
      const dy = e.clientY - resizeStart.startY;
      const delta = Math.max(dx, dy);
      let newSize = Math.max(24, Math.min(200, resizeStart.startSize + delta));
      // Batasi agar tidak keluar frame
      const sticker = stickers[resizeIdx];
      if (sticker) {
        newSize = Math.min(newSize, rect.width - sticker.x, rect.height - sticker.y);
      }
      onResizeSticker(resizeIdx, newSize);
    }
  };
  const handleMouseUp = () => {
    setDragIdx(null);
    setResizeIdx(null);
    setResizeStart(null);
  };

  // Touch (mobile)
  const handleTouchStart = (idx: number) => (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return;
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
      const rect = (e.currentTarget as HTMLElement).querySelector('#strip')?.getBoundingClientRect();
      if (!rect) return;
      const touch = e.touches[0];
      const size = stickers[dragIdx]?.size ?? 48;
      let x = touch.clientX - rect.left - touchOffset.x;
      let y = touch.clientY - rect.top - touchOffset.y;
      x = Math.max(0, Math.min(x, rect.width - size));
      y = Math.max(0, Math.min(y, rect.height - size));
      onMoveSticker(dragIdx, x, y);
    }
    if (resizeIdx !== null && onResizeSticker && resizeStart) {
      const rect = (e.currentTarget as HTMLElement).querySelector('#strip')?.getBoundingClientRect();
      if (!rect) return;
      const touch = e.touches[0];
      const dx = touch.clientX - resizeStart.startX;
      const dy = touch.clientY - resizeStart.startY;
      const delta = Math.max(dx, dy);
      let newSize = Math.max(24, Math.min(200, resizeStart.startSize + delta));
      // Batasi agar tidak keluar frame
      const sticker = stickers[resizeIdx];
      if (sticker) {
        newSize = Math.min(newSize, rect.width - sticker.x, rect.height - sticker.y);
      }
      onResizeSticker(resizeIdx, newSize);
    }
  };
  const handleTouchEnd = () => {
    setDragIdx(null);
    setTouchOffset(null);
    setResizeIdx(null);
    setResizeStart(null);
  };

  // Resize handle events
  const handleResizeMouseDown = (idx: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizeIdx(idx);
    setResizeStart({
      startX: e.clientX,
      startY: e.clientY,
      startSize: stickers[idx]?.size ?? 48,
    });
  };
  const handleResizeTouchStart = (idx: number) => (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    setResizeIdx(idx);
    setResizeStart({
      startX: touch.clientX,
      startY: touch.clientY,
      startSize: stickers[idx]?.size ?? 48,
    });
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
            {/* Resize handle pojok kanan bawah */}
            <div
              className="resize-handle"
              style={{
                position: 'absolute',
                left: sticker.x + sticker.size - 12,
                top: sticker.y + sticker.size - 12,
                width: 24,
                height: 24,
                zIndex: 30,
                cursor: 'nwse-resize',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '50%',
                border: '1.5px solid #d72688',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                touchAction: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
              onMouseDown={handleResizeMouseDown(idx)}
              onTouchStart={handleResizeTouchStart(idx)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <polyline points="4,12 12,12 12,4" fill="none" stroke="#d72688" strokeWidth="2"/>
              </svg>
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
                cursor: dragIdx === idx ? 'grabbing' : 'move',
                zIndex: 10,
                userSelect: 'none',
                transition: 'width 0.1s, height 0.1s',
                touchAction: 'none',
                pointerEvents: resizeIdx === idx ? 'none' : 'auto',
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
