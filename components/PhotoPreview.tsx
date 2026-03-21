import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Sticker {
  src: string;
  x: number;
  y: number;
  size: number;
  rotate?: number;
}

interface TemplateSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TemplateSettings {
  canvasWidth: number;
  canvasHeight: number;
  padding?: number;
  gap?: number;
  bottomSpace?: number;
  frameBorderRadius?: number;
  photoBorderRadius?: number;
  photoWidth?: number;
  photoHeight?: number;
  slotCount?: number;
  photoSlots?: TemplateSlot[];
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
  frameTemplates: { name: string; src: string; sticker?: string; settings?: TemplateSettings | null }[];
  selectedFrameTemplate: string;
  selectedTemplateSettings?: TemplateSettings | null;
  onRetake?: (idx: number) => void;
  onCrop?: (idx: number) => void;
}

const TEMPLATE_CANVAS = {
  padding: 20,
  gap: 8,
  photoWidth: 240,
  photoHeight: 180,
  photoCount: 4,
  bottomSpace: 0,
  frameBorderRadius: 0,
  photoBorderRadius: 0,
};

const TEMPLATE_STRIP_WIDTH = TEMPLATE_CANVAS.padding * 2 + TEMPLATE_CANVAS.photoWidth;
const TEMPLATE_STRIP_HEIGHT =
  TEMPLATE_CANVAS.padding * 2 +
  TEMPLATE_CANVAS.photoHeight * TEMPLATE_CANVAS.photoCount +
  TEMPLATE_CANVAS.gap * (TEMPLATE_CANVAS.photoCount - 1);

const PHOTO_PAN_SCALE = 1.18;
const TEMPLATE_SLOT_PAN_SCALE = 1;

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
  selectedTemplateSettings,
  onRetake,
  onCrop,
}: Props) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [resizeIdx, setResizeIdx] = useState<number | null>(null);
  const [touchOffset, setTouchOffset] = useState<{ x: number; y: number } | null>(null);
  const [resizeStart, setResizeStart] = useState<{ startX: number; startY: number; startSize: number } | null>(null);
  const [photoPanOffsets, setPhotoPanOffsets] = useState<Record<number, { x: number; y: number }>>({});
  const photoDragState = useRef<{
    idx: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    maxX: number;
    maxY: number;
  } | null>(null);

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

  const handlePhotoDragMove = useCallback((event: PointerEvent) => {
    const state = photoDragState.current;
    if (!state) return;

    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;

    const nextX = Math.max(-state.maxX, Math.min(state.maxX, state.originX + dx));
    const nextY = Math.max(-state.maxY, Math.min(state.maxY, state.originY + dy));

    setPhotoPanOffsets(prev => ({
      ...prev,
      [state.idx]: { x: nextX, y: nextY },
    }));
  }, []);

  const stopPhotoDrag = useCallback(() => {
    photoDragState.current = null;
    window.removeEventListener('pointermove', handlePhotoDragMove);
    window.removeEventListener('pointerup', stopPhotoDrag);
    window.removeEventListener('pointercancel', stopPhotoDrag);
  }, [handlePhotoDragMove]);

  const startPhotoDrag = useCallback(
    (idx: number, slot?: TemplateSlot) => (event: React.PointerEvent<HTMLDivElement>) => {
      if (!slot) return;
      if ((event.target as HTMLElement).closest('.frame-action-controls')) return;

      const scale = TEMPLATE_SLOT_PAN_SCALE;
      if (scale <= 1) return;

      event.preventDefault();

      const current = photoPanOffsets[idx] ?? { x: 0, y: 0 };
      const maxX = Math.max(0, (slot.width * scale - slot.width) / 2);
      const maxY = Math.max(0, (slot.height * scale - slot.height) / 2);

      photoDragState.current = {
        idx,
        startX: event.clientX,
        startY: event.clientY,
        originX: current.x,
        originY: current.y,
        maxX,
        maxY,
      };

      window.addEventListener('pointermove', handlePhotoDragMove);
      window.addEventListener('pointerup', stopPhotoDrag);
      window.addEventListener('pointercancel', stopPhotoDrag);
    },
    [handlePhotoDragMove, photoPanOffsets, stopPhotoDrag]
  );

  useEffect(() => {
    return () => {
      stopPhotoDrag();
    };
  }, [stopPhotoDrag]);

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
  const isTemplateMode = selectedFrameTemplate !== 'none' && Boolean(selectedTemplate?.src);
  const templateSettings = selectedTemplateSettings ?? selectedTemplate?.settings ?? null;

  const normalizeTemplateSlot = (value: TemplateSlot): TemplateSlot | null => {
    const x = Number(value?.x);
    const y = Number(value?.y);
    const width = Number(value?.width);
    const height = Number(value?.height);

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) {
      return null;
    }

    if (width <= 0 || height <= 0) return null;
    return { x, y, width, height };
  };

  const templateSlots = Array.isArray(templateSettings?.photoSlots)
    ? templateSettings.photoSlots.map(slot => normalizeTemplateSlot(slot)).filter((slot): slot is TemplateSlot => Boolean(slot))
    : [];

  // Template admin dibuat dengan ukuran canvas tetap, jadi preview perlu ikut ukuran itu agar slot foto sejajar.
  const effectiveGap = isTemplateMode ? Number(templateSettings?.gap ?? TEMPLATE_CANVAS.gap) : gap;
  const effectiveBottomSpace = isTemplateMode ? Number(templateSettings?.bottomSpace ?? TEMPLATE_CANVAS.bottomSpace) : bottomSpace;
  const effectiveStripPadding = isTemplateMode ? Number(templateSettings?.padding ?? TEMPLATE_CANVAS.padding) : 20;
  const effectivePhotoWidth = isTemplateMode ? Number(templateSettings?.photoWidth ?? TEMPLATE_CANVAS.photoWidth) : 240;
  const effectivePhotoHeight = isTemplateMode ? Number(templateSettings?.photoHeight ?? TEMPLATE_CANVAS.photoHeight) : 180;
  const effectiveFrameBorderRadius = isTemplateMode
    ? Number(templateSettings?.frameBorderRadius ?? TEMPLATE_CANVAS.frameBorderRadius)
    : frameBorderRadius;
  const effectivePhotoBorderRadius = isTemplateMode
    ? Number(templateSettings?.photoBorderRadius ?? TEMPLATE_CANVAS.photoBorderRadius)
    : photoBorderRadius;
  const effectiveStripWidth = isTemplateMode
    ? Number(templateSettings?.canvasWidth ?? TEMPLATE_STRIP_WIDTH)
    : effectivePhotoWidth + effectiveStripPadding * 2;
  const effectiveStripHeight = isTemplateMode
    ? Number(templateSettings?.canvasHeight ?? TEMPLATE_STRIP_HEIGHT)
    : effectiveStripPadding * 2 + photos.length * effectivePhotoHeight + Math.max(0, photos.length - 1) * effectiveGap + effectiveBottomSpace;

  const fallbackTemplateSlots: TemplateSlot[] = isTemplateMode
    ? Array.from({ length: Math.max(photos.length, Number(templateSettings?.slotCount ?? photos.length)) }, (_, index) => {
        const x = (effectiveStripWidth - effectivePhotoWidth) / 2;
        const y = effectiveStripPadding + index * (effectivePhotoHeight + effectiveGap);
        return {
          x: Math.max(0, Math.round(x)),
          y: Math.max(0, Math.round(y)),
          width: Math.round(effectivePhotoWidth),
          height: Math.round(effectivePhotoHeight),
        };
      })
    : [];

  const effectiveTemplateSlots = templateSlots.length > 0 ? templateSlots : fallbackTemplateSlots;
  const hasTemplateSlots = isTemplateMode && effectiveTemplateSlots.length > 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: effectiveGap,
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
        data-render-width={Math.round(effectiveStripWidth)}
        data-render-height={Math.round(effectiveStripHeight)}
        style={{
          backgroundColor: frameColor,
          padding: effectiveStripPadding,
          borderRadius: effectiveFrameBorderRadius,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: effectiveGap,
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          width: effectiveStripWidth,
          height: effectiveStripHeight,
          maxWidth: '90vw',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Frame template di belakang */}
        {selectedFrameTemplate !== 'none' && (
          <Image
            src={selectedTemplate?.src || ''}
            alt="Frame Template"
            fill
            style={{
              objectFit: 'contain',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}                {/* Sticker PNG di atas foto dan frame */}
        {stickerUrl && (
          <Image
            src={stickerUrl}
            alt="Sticker"
            fill
            style={{
              objectFit: 'contain',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        )}

        {/* Foto-foto di atas frame dan sticker */}
        <div
          style={{
            position: hasTemplateSlots ? 'absolute' : 'relative',
            inset: hasTemplateSlots ? 0 : undefined,
            zIndex: 1,
            width: '100%',
            height: hasTemplateSlots ? '100%' : undefined,
            display: hasTemplateSlots ? 'block' : 'flex',
            flexDirection: hasTemplateSlots ? undefined : 'column',
            gap: hasTemplateSlots ? undefined : effectiveGap,
            alignItems: hasTemplateSlots ? undefined : 'center',
          }}
        >
          {photos.map((src, i) => {
            const slot = effectiveTemplateSlots[i];
            const hasSlot = Boolean(slot);
            const photoOffset = photoPanOffsets[i] ?? { x: 0, y: 0 };
            const slotPhotoScale = hasSlot ? TEMPLATE_SLOT_PAN_SCALE : PHOTO_PAN_SCALE;
            return (
            <div
              key={i}
              style={
                hasSlot
                  ? {
                      position: 'absolute',
                      left: slot!.x,
                      top: slot!.y,
                      width: slot!.width,
                      height: slot!.height,
                      overflow: 'hidden',
                      cursor: slotPhotoScale > 1 ? 'grab' : 'default',
                      touchAction: 'none',
                    }
                  : {
                      position: 'relative',
                      width: effectivePhotoWidth,
                      height: effectivePhotoHeight,
                      margin: '0 auto',
                    }
              }
            >
              <Image
                src={src}
                alt={`photo-${i}`}
                width={hasSlot ? slot!.width : effectivePhotoWidth}
                height={hasSlot ? slot!.height : effectivePhotoHeight}
                onPointerDown={hasSlot ? startPhotoDrag(i, slot) : undefined}
                style={{
                  filter,
                  objectFit: 'cover',
                  position: hasSlot ? 'absolute' : 'relative',
                  left: hasSlot ? '50%' : undefined,
                  top: hasSlot ? '50%' : undefined,
                  width: hasSlot ? `${slotPhotoScale * 100}%` : undefined,
                  height: hasSlot ? `${slotPhotoScale * 100}%` : undefined,
                  transform: hasSlot
                    ? `translate(calc(-50% + ${photoOffset.x}px), calc(-50% + ${photoOffset.y}px))`
                    : undefined,
                  borderRadius: effectivePhotoBorderRadius,
                  display: 'block',
                  zIndex: 1,
                }}
              />
              {(onRetake || onCrop) && (
                <div
                  className="frame-action-controls"
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    display: 'flex',
                    gap: 6,
                    zIndex: 2,
                  }}
                >
                  {onCrop && (
                    <button
                      className="frame-action-control"
                      onClick={() => onCrop(i)}
                      style={{
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
                        padding: 0,
                      }}
                      title="Crop Photo"
                      aria-label="Crop Photo"
                    >
                      <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                        <path d="M6 4V14.5A1.5 1.5 0 0 0 7.5 16H16" stroke="#d72688" strokeWidth="1.7" strokeLinecap="round"/>
                        <path d="M4 6H14.5A1.5 1.5 0 0 1 16 7.5V10" stroke="#d72688" strokeWidth="1.7" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}

                  {onRetake && (
                    <button
                      className="frame-action-control"
                      onClick={() => onRetake(i)}
                      style={{
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
                        padding: 0,
                      }}
                      title="Retake Photo"
                      aria-label="Retake Photo"
                    >
                      {/* Icon retake (refresh/rotate arrow) */}
                      <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                        <path d="M16.5 7.5A6.5 6.5 0 1 0 17 10M16.5 7.5V4M16.5 7.5H13.5" stroke="#d72688" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          )})}
        </div>
        {/* 3. Stiker di atas foto */}
        {stickers.map((sticker, idx) => (
          <React.Fragment key={idx}>
            {/* --- ICON GROUP --- */}
            <div
              className="sticker-handle-group"
              style={{
                position: 'absolute',
                left: sticker.x + sticker.size / 2,
                top: sticker.y + sticker.size + 8,
                transform: 'translateX(-50%)',
                zIndex: 31,
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                pointerEvents: 'auto',
                minWidth: 0,
                maxWidth: 'none',
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
            <Image
              src={sticker.src}
              alt=""
              width={sticker.size}
              height={sticker.size}
              style={{
                position: 'absolute',
                left: sticker.x,
                top: sticker.y,
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
            height: effectiveBottomSpace,
            background: 'transparent',
          }}
        />
      </div>
    </div>
  );
}