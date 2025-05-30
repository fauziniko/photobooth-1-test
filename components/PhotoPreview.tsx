import React, { useState, useRef } from 'react';

interface Sticker {
  src: string;
  x: number;
  y: number;
  size: number;
  rotate?: number;
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
  onRotateSticker?: (idx: number, delta: number) => void;
  onDeleteSticker?: (idx: number) => void;
  gap?: number;
  frameTemplates: { name: string; src: string; sticker?: string }[];
  selectedFrameTemplate: string;
  onRetake?: (idx: number) => void;
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
  onRotateSticker,
  onDeleteSticker,
  gap = 8,
  frameTemplates,
  selectedFrameTemplate,
  onRetake,
}: Props) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [resizeIdx, setResizeIdx] = useState<number | null>(null);
  const [touchOffset, setTouchOffset] = useState<{ x: number; y: number } | null>(null);
  const [resizeStart, setResizeStart] = useState<{ startX: number; startY: number; startSize: number } | null>(null);

  // Untuk long press
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const movedDuringResize = useRef(false);

  // Untuk menghapus stiker
  const handleDeleteSticker = (idx: number) => {
    if (!onDeleteSticker) return;
    onDeleteSticker(idx);
  };

  // Mouse resize
  const handleResizeMouseDown = (idx: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizeIdx(idx);
    setResizeStart({
      startX: e.clientX,
      startY: e.clientY,
      startSize: stickers[idx]?.size ?? 48,
    });
    movedDuringResize.current = false;
    longPressTimeout.current = setTimeout(() => {
      if (!movedDuringResize.current) {
        handleDeleteSticker(idx);
        setResizeIdx(null);
        setResizeStart(null);
      }
    }, 700);
  };

  // Touch resize
  const handleResizeTouchStart = (idx: number) => (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    setResizeIdx(idx);
    setResizeStart({
      startX: touch.clientX,
      startY: touch.clientY,
      startSize: stickers[idx]?.size ?? 48,
    });
    movedDuringResize.current = false;
    longPressTimeout.current = setTimeout(() => {
      if (!movedDuringResize.current) {
        handleDeleteSticker(idx);
        setResizeIdx(null);
        setResizeStart(null);
      }
    }, 700);
  };

  // Mouse/touch move: resize
  const handleMouseMove = (e: React.MouseEvent) => {
    // Resize
    if (resizeIdx !== null && onResizeSticker && resizeStart) {
      movedDuringResize.current = true;
      if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
      const rect = (e.currentTarget as HTMLElement).querySelector('#strip')?.getBoundingClientRect();
      if (!rect) return;
      const dx = e.clientX - resizeStart.startX;
      const dy = e.clientY - resizeStart.startY;
      const delta = Math.max(dx, dy);
      let newSize = Math.max(24, Math.min(200, resizeStart.startSize + delta));
      const sticker = stickers[resizeIdx];
      if (sticker) {
        // Batasi agar stiker tidak keluar frame
        newSize = Math.min(
          newSize,
          rect.width - sticker.x,
          rect.height - sticker.y
        );
      }
      onResizeSticker(resizeIdx, newSize);
    }
    // Drag
    if (dragIdx !== null && onMoveSticker) {
      const rect = (e.currentTarget as HTMLElement).querySelector('#strip')?.getBoundingClientRect();
      if (!rect) return;
      const size = stickers[dragIdx]?.size ?? 48;
      let x = e.clientX - rect.left - size / 2;
      let y = e.clientY - rect.top - size / 2;
      // Batasi agar stiker tidak keluar frame (tidak boleh negatif, tidak boleh lebih dari sisi frame)
      x = Math.max(0, Math.min(x, rect.width - size));
      y = Math.max(0, Math.min(y, rect.height - size));
      onMoveSticker(dragIdx, x, y);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    // Resize
    if (resizeIdx !== null && onResizeSticker && resizeStart) {
      movedDuringResize.current = true;
      if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
      const rect = (e.currentTarget as HTMLElement).querySelector('#strip')?.getBoundingClientRect();
      if (!rect) return;
      const touch = e.touches[0];
      const dx = touch.clientX - resizeStart.startX;
      const dy = touch.clientY - resizeStart.startY;
      const delta = Math.max(dx, dy);
      let newSize = Math.max(24, Math.min(200, resizeStart.startSize + delta));
      const sticker = stickers[resizeIdx];
      if (sticker) {
        // Batasi agar stiker tidak keluar frame
        newSize = Math.min(
          newSize,
          rect.width - sticker.x,
          rect.height - sticker.y
        );
      }
      onResizeSticker(resizeIdx, newSize);
    }
    // Drag
    if (dragIdx !== null && onMoveSticker && touchOffset) {
      const rect = (e.currentTarget as HTMLElement).querySelector('#strip')?.getBoundingClientRect();
      if (!rect) return;
      const touch = e.touches[0];
      const size = stickers[dragIdx]?.size ?? 48;
      let x = touch.clientX - rect.left - touchOffset.x;
      let y = touch.clientY - rect.top - touchOffset.y;
      // Batasi agar stiker tidak keluar frame (tidak boleh negatif, tidak boleh lebih dari sisi frame)
      x = Math.max(0, Math.min(x, rect.width - size));
      y = Math.max(0, Math.min(y, rect.height - size));
      onMoveSticker(dragIdx, x, y);
    }
  };

  // Mouse/touch up: resetx
  const handleMouseUp = () => {
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    setDragIdx(null);
    setResizeIdx(null);
    setResizeStart(null);
  };
  const handleTouchEnd = () => {
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    setDragIdx(null);
    setTouchOffset(null);
    setResizeIdx(null);
    setResizeStart(null);
  };

  // Drag sticker (move)
  const handleMouseDown = (idx: number) => (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return;
    setDragIdx(idx);
  };
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

  // Cari sticker url dari template yang dipilih
  const selectedTemplate = frameTemplates.find(t => t.name === selectedFrameTemplate);
  const stickerUrl = selectedTemplate?.sticker;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: gap,
        alignItems: 'center',
        width: '100%',
      }}
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
          gap: gap,
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          maxWidth: '90vw',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Frame template di belakang */}
        {selectedFrameTemplate !== 'none' && (
          <img
            src={selectedTemplate?.src}
            alt="Frame Template"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Sticker PNG di atas foto dan frame */}
        {stickerUrl && (
          <img
            src={stickerUrl}
            alt="Sticker"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Foto-foto di atas frame dan sticker */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: gap,
            alignItems: 'center',
          }}
        >
          {photos.map((src, i) => (
            <div key={i} style={{ position: 'relative', width: 240, height: 180, margin: '0 auto' }}>
              <img
                src={src}
                alt={`photo-${i}`}
                style={{
                  filter,
                  width: 240,
                  height: 180,
                  objectFit: 'cover',
                  borderRadius: photoBorderRadius,
                  display: 'block',
                  zIndex: 1,
                }}
              />
              {onRetake && (
                <button
                  onClick={() => onRetake(i)}
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    background: '#fff',
                    border: '1.5px solid #fa75aa',
                    borderRadius: '50%',
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px #fa75aa22',
                    zIndex: 2,
                    padding: 0,
                  }}
                  title="Retake Photo"
                >
                  {/* Icon retake (refresh/rotate arrow) */}
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                    <path d="M16.5 7.5A6.5 6.5 0 1 0 17 10M16.5 7.5V4M16.5 7.5H13.5" stroke="#d72688" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {/* 3. Stiker di atas foto */}
        {stickers.map((sticker, idx) => (
          <React.Fragment key={idx}>
            {/* --- ICON GROUP --- */}
            <div
              className="sticker-handle-group"
              style={{
                position: 'absolute',
                left: sticker.x + sticker.size - 12,
                top: sticker.y + sticker.size - 12,
                zIndex: 31,
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                pointerEvents: 'auto',
              }}
            >
              {/* ROTATE LEFT */}
              <button
                className="sticker-handle sticker-rotate"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: '2px solid #d72688',
                  background: '#fff',
                  outline: '2px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 2,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  padding: 0,
                  zIndex: 1002,
                }}
                title="Putar Kiri"
                tabIndex={-1}
                onClick={e => {
                  e.stopPropagation();
                  onRotateSticker?.(idx, -15); // putar -15 derajat (kiri)
                }}
              >
                {/* icon rotate left */}
                <svg width="100%" height="100%" viewBox="0 0 20 20">
                  <path d="M10 4V1L6 5l4 4V6c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5" fill="none" stroke="#d72688" strokeWidth="2" transform="scale(-1,1) translate(-20,0)"/>
                </svg>
              </button>
              {/* ROTATE RIGHT */}
              <button
                className="sticker-handle sticker-rotate"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: '2px solid #d72688',
                  background: '#fff',
                  outline: '2px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 2,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  padding: 0,
                  zIndex: 1002,
                }}
                title="Putar Kanan"
                tabIndex={-1}
                onClick={e => {
                  e.stopPropagation();
                  onRotateSticker?.(idx, 15); // putar +15 derajat (kanan)
                }}
              >
                {/* icon rotate right */}
                <svg width="100%" height="100%" viewBox="0 0 20 20">
                  <path d="M10 4V1L6 5l4 4V6c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5" fill="none" stroke="#d72688" strokeWidth="2"/>
                </svg>
              </button>
              {/* DELETE */}
              <button
                className="sticker-handle sticker-delete"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: '2px solid #d72688',
                  background: '#fff',
                  outline: '2px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 2,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  padding: 0,
                  zIndex: 1002,
                }}
                title="Hapus"
                tabIndex={-1}
                onClick={e => {
                  e.stopPropagation();
                  onDeleteSticker?.(idx);
                }}
              >
                {/* icon delete */}
                <svg width="14" height="14" viewBox="0 0 20 20">
                  <line x1="5" y1="5" x2="15" y2="15" stroke="#d72688" strokeWidth="2"/>
                  <line x1="15" y1="5" x2="5" y2="15" stroke="#d72688" strokeWidth="2"/>
                </svg>
              </button>
              {/* RESIZE */}
              <div
                className="resize-handle sticker-handle"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: '1.5px solid #d72688',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'nwse-resize',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  padding: 0,
                  touchAction: 'none',
                }}
                onMouseDown={handleResizeMouseDown(idx)}
                onTouchStart={handleResizeTouchStart(idx)}
                title="Resize"
                tabIndex={-1}
              >
                <svg width="14" height="14" viewBox="0 0 16 16">
                  <polyline points="4,12 12,12 12,4" fill="none" stroke="#d72688" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            {/* --- STICKER IMAGE --- */}
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
                transition: 'width 0.1s, height 0.1s, transform 0.2s',
                touchAction: 'none',
                pointerEvents: resizeIdx === idx ? 'none' : 'auto',
                transform: `rotate(${sticker.rotate ?? 0}deg)`,
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