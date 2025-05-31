import React, { useState } from 'react';

interface PhotoResultProps {
  photos: string[];
  frames?: string[];
  gifUrl?: string;
  onClose?: () => void;
}

export default function PhotoResult({ photos, frames = [], gifUrl, onClose }: PhotoResultProps) {
  const items = [
    ...photos.map((src) => ({ type: 'photo', src })),
    ...frames.map((src) => ({ type: 'frame', src })),
    ...(gifUrl ? [{ type: 'gif', src: gifUrl }] : []),
  ];
  const [current, setCurrent] = useState(0);

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
        Tidak ada foto untuk ditampilkan.
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
      <h2 style={{ color: '#d72688', marginBottom: 24, fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>
        Galeri Hasil Foto
      </h2>
      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 4px 24px #fa75aa22',
          padding: 24,
          minWidth: 340,
          maxWidth: 420,
          width: '90vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%', textAlign: 'center', minHeight: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={items[current].src}
            alt={items[current].type === 'gif' ? 'GIF' : `Photo ${current + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: 320,
              borderRadius: 12,
              background: '#eee',
              margin: '0 auto',
              display: 'block',
            }}
          />
        </div>
        <div style={{ marginTop: 18, textAlign: 'center', color: '#d72688', fontWeight: 600, fontSize: 18 }}>
          {items[current].type === 'gif'
            ? 'GIF'
            : items[current].type === 'frame'
              ? items[current].src.startsWith('data:image/png;base64') && items[current].src.length > 100000
                ? 'Photo Strip'
                : 'Foto'
              : 'Foto'}
          &nbsp;({current + 1} / {items.length})
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginTop: 18,
            width: '100%',
            justifyItems: 'center',
          }}
        >
          <a
            href={items[current].src}
            download={getDownloadName()}
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: '#fa75aa',
              color: '#fff',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 2px 8px #fa75aa22',
              cursor: 'pointer',
              width: '100px',
              textAlign: 'center',
            }}
          >
            Download
          </a>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              background: '#ff1744',
              color: '#fff',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              border: 'none',
              boxShadow: '0 2px 8px #fa75aa22',
              cursor: 'pointer',
              width: '100px',
            }}
          >
            Kembali
          </button>
        </div>
      </div>
      {/* Thumbnail bar */}
      <div
        style={{
          marginTop: 32,
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          padding: '8px 0',
          maxWidth: 480,
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setCurrent(idx)}
            style={{
              border: idx === current ? '3px solid #fa75aa' : '2px solid #eee',
              borderRadius: 10,
              padding: 2,
              background: '#fff',
              cursor: 'pointer',
              boxShadow: idx === current ? '0 2px 8px #fa75aa33' : undefined,
              transition: 'border 0.2s, box-shadow 0.2s',
            }}
          >
            <img
              src={item.src}
              alt={item.type === 'gif' ? 'GIF' : item.type}
              style={{
                width: 60,
                height: 60,
                objectFit: 'cover',
                borderRadius: 8,
                background: item.type === 'frame' ? '#ffe0f0' : '#eee',
                border: item.type === 'frame' ? '2px solid #fa75aa' : undefined,
                display: 'block',
              }}
            />
          </div>
        ))}
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