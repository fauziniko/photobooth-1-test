import React, { useState } from 'react';

interface PhotoResultProps {
  photos: string[];
  frames?: string[];
  gifUrl?: string;
  onClose?: () => void;
}

export default function PhotoResult({ photos, frames = [], gifUrl, onClose }: PhotoResultProps) {
  // Gabungkan semua item untuk thumbnail bar
  const items = [
    ...photos.map((src) => ({ type: 'photo', src })),
    ...frames.map((src) => ({ type: 'frame', src })),
    ...(gifUrl ? [{ type: 'gif', src: gifUrl }] : []),
  ];
  const [current, setCurrent] = useState(0);
  const [shareError, setShareError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
        No photos to display.
      </div>
    );
  }

  const getDownloadName = () => {
    if (items[current].type === 'gif') return 'photobooth.gif';
    if (items[current].type === 'frame') {
      if (items[current].src.startsWith('data:image/png;base64') && items[current].src.length > 100000) {
        return 'photostrip.png';
      }
      return `frame_${current + 1}.png`;
    }
    return `photo_${current + 1}.png`;
  };

  // Share handler
  const handleShare = async () => {
    setShareError(null);
    const item = items[current];
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Photo Booth Result',
          text: 'Check out my photo!',
          url: item.src.startsWith('http') ? item.src : undefined,
          files: item.src.startsWith('data:') && window.File
            ? [
                await fetch(item.src)
                  .then(res => res.blob())
                  .then(blob => new window.File([blob], getDownloadName(), { type: blob.type }))
              ]
            : undefined,
        });
      } catch {
        setShareError('Share cancelled or failed.');
      }
    } else {
      // Fallback: copy link or show message
      if (item.src.startsWith('http')) {
        await navigator.clipboard.writeText(item.src);
        setShareError('Link copied to clipboard!');
      } else {
        setShareError('Sharing is not supported on this device.');
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#faf7fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 0 0 0',
      }}
    >
      {/* Remove the outer <h2> and move it inside the main box */}
      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 4px 24px #fa75aa22',
          padding: 24,
          minWidth: 340,
          maxWidth: 700,
          width: '100%',
          minHeight: 480,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          overflow: 'hidden',
        }}
      >
        <h2 style={{ color: '#d72688', marginBottom: 24, fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>
          Photo Gallery
        </h2>
        <div style={{ width: '100%', textAlign: 'center', minHeight: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {items[current].type === 'gif' ? (
            <img
              src={items[current].src}
              alt="GIF"
              style={{
                maxWidth: '100%',
                maxHeight: 320,
                borderRadius: 12,
                background: '#eee',
                margin: '0 auto',
                display: 'block',
              }}
            />
          ) : (
            <img
              src={items[current].src}
              alt={items[current].type === 'frame' ? 'Photo Strip' : `Photo ${current + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: 320,
                borderRadius: 12,
                background: '#eee',
                margin: '0 auto',
                display: 'block',
              }}
            />
          )}
        </div>
        <div style={{ marginTop: 18, textAlign: 'center', color: '#d72688', fontWeight: 600, fontSize: 18 }}>
          {items[current].type === 'gif'
            ? 'GIF'
            : items[current].type === 'frame'
              ? items[current].src.startsWith('data:image/png;base64') && items[current].src.length > 100000
                ? 'Photo Strip'
                : 'Frame'
              : 'Photo'}
          &nbsp;({current + 1} / {items.length})
        </div>
        {/* Thumbnail bar dipindahkan ke sini */}
        <div
          style={{
            marginTop: 24,
            marginBottom: 8,
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            padding: '8px 0',
            maxWidth: 480,
          }}
        >
          {items.map((item, idx) => {
            const isPhotoStrip =
              item.type === 'frame' &&
              item.src.startsWith('data:image/png;base64') &&
              item.src.length > 100000;
            const isActive = idx === current;

            // Only apply pink background for the active photo strip, not for other types
            const showPink =
              isPhotoStrip && isActive;

            return (
              <div
                key={idx}
                onClick={() => setCurrent(idx)}
                style={{
                  border: isActive
                    ? '3px solid #fa75aa'
                    : '2px solid #eee',
                  borderRadius: 10,
                  padding: 2,
                  background: showPink ? '#ffe0f0' : '#fff',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 8px #fa75aa33' : undefined,
                  transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
                }}
                title={
                  item.type === 'gif'
                    ? 'GIF'
                    : item.type === 'frame'
                      ? 'Photo Strip'
                      : 'Photo'
                }
              >
                <img
                  src={item.src}
                  alt={item.type === 'gif' ? 'GIF' : item.type}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 8,
                    background: isActive
                      ? '#fff'
                      : isPhotoStrip
                        ? '#fff'
                        : '#eee',
                    border:
                      showPink
                        ? '2px solid #fa75aa'
                        : undefined,
                    display: 'block',
                  }}
                />
              </div>
            );
          })}
        </div>
        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 16,
            marginTop: 18,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <a
            href={items[current].src}
            download={getDownloadName()}
            style={{
              display: 'inline-block',
              padding: '12px 0',
              background: '#fae0ef',
              color: '#d72688',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              textDecoration: 'none',
              boxShadow: '0 2px 8px #fa75aa22',
              cursor: 'pointer',
              width: 140,
              textAlign: 'center',
              border: 'none',
            }}
          >
            Download
          </a>
          <button
            onClick={onClose}
            style={{
              padding: '12px 0',
              background: '#fa75aaFF',
              color: '#fff',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              border: 'none',
              boxShadow: '0 2px 8px #fa75aa22',
              cursor: 'pointer',
              width: 140,
              textAlign: 'center',
              display: 'inline-block',
              position: 'relative',
            }}
          >
            Back
          </button>
          <button
            onClick={handleShare}
            style={{
              height: 48,
              width: 48,
              minWidth: 48,
              minHeight: 48,
              padding: 0,
              marginLeft: 0,
              background: '#fff0fa',
              color: '#d72688',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              border: '2px solid #fa75aa',
              boxShadow: '0 2px 8px #fa75aa22',
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 0,
            }}
            title="Share"
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  display: 'block',
                  margin: 0,
                }}
              >
                <path d="M18 8l4 4-4 4" stroke="#d72688" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 12H10" stroke="#d72688" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </div>
        {shareError && (
          <div
            style={{
              marginTop: 12,
              color: '#d72688',
              fontSize: 15,
              textAlign: 'center',
              fontWeight: 500,
              minHeight: 20,
            }}
          >
            {shareError}
          </div>
        )}
        {/* ...rest of your code... */}
      </div>
    </div>
  );
}

// setPhotoResultData({
//   photos,
//   frames: [
//     ...hasilFrameArray,
//     dataUrl // <- ini kemungkinan menambah strip setiap kali tombol ditekan
//   ],
//   gifUrl
// });