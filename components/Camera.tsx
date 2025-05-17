'use client';
import { useRef, useEffect, useState } from 'react';

interface Props {
  onCapture: (dataUrl: string) => void;
  countdown: number;
  photosToTake: number;
  onStartCapture?: () => void; // Tambahan
}

export default function Camera({ onCapture, countdown, photosToTake, onStartCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [count, setCount] = useState<number | null>(null);
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
    for (let i = 0; i < photosToTake; i++) {
      // Countdown animasi
      for (let c = countdown; c > 0; c--) {
        setCount(c);
        await new Promise(res => setTimeout(res, 1000));
      }
      setCount(null);
      if (!videoRef.current || videoRef.current.readyState < 2) continue;
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      onCapture(canvas.toDataURL('image/png'));
      // Tunggu sebentar sebelum lanjut ke pose berikutnya
      await new Promise(res => setTimeout(res, 500));
    }
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
            aspectRatio: '4/3', // agar tetap landscape
          }} 
        />
        {count !== null && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 80, fontWeight: 'bold', color: '#fff', background: 'rgba(0,0,0,0.4)'
          }}>
            {count}
          </div>
        )}
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
