'use client';
import { useRef, useEffect, useState } from 'react';

interface Props {
  onCapture: (dataUrl: string) => void;
  photosToTake: number;
  onStartCapture?: () => void;
}

export default function Camera({ onCapture, photosToTake, onStartCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => {
          alert('Tidak bisa mengakses kamera: ' + err.message);
        });
    }
  }, []);

  const takePhotos = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    if (onStartCapture) onStartCapture();

    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      alert('Video belum siap. Mohon tunggu beberapa detik lalu coba lagi.');
      setIsCapturing(false);
      return;
    }

    // Target rasio landscape 4:3
    const targetRatio = 4 / 3;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    let sx = 0, sy = 0, sw = vw, sh = vh;

    // Crop tengah jika rasio video tidak 4:3
    if (vw / vh > targetRatio) {
      // Video terlalu lebar, crop kiri-kanan
      sw = vh * targetRatio;
      sx = (vw - sw) / 2;
    } else if (vw / vh < targetRatio) {
      // Video terlalu tinggi, crop atas-bawah
      sh = vw / targetRatio;
      sy = (vh - sh) / 2;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 640; // landscape
    canvas.height = 480;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    onCapture(canvas.toDataURL('image/png'));
    await new Promise(res => setTimeout(res, 500));
    setIsCapturing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          width="640" 
          height="480" 
          style={{
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            width: '100%',
            height: 'auto',
            maxWidth: 640,
            background: '#000',
            aspectRatio: '4/3',
          }} 
        />
      </div>
      <button 
        onClick={takePhotos} 
        disabled={isCapturing}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: '24px',
          cursor: isCapturing ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}
      >
        {isCapturing ? 'Mengambil Foto...' : `Start Capture (${photosToTake} photos)`}
      </button>
    </div>
  );
}
