'use client';
import { useRef, useEffect } from 'react';

interface Props {
  onCapture: (dataUrl: string) => void;
  countdown: number;
  photosToTake: number;
}

export default function Camera({ onCapture, countdown, photosToTake }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      alert('Video belum siap. Mohon tunggu beberapa detik lalu coba lagi.');
      return;
    }
    for (let i = 0; i < photosToTake; i++) {
      await new Promise(resolve => setTimeout(resolve, countdown * 1000));
      // Cek ulang setiap loop
      if (!videoRef.current || videoRef.current.readyState < 2) continue;
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      onCapture(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width="640" height="480" />
      <button onClick={takePhotos}>Start Capture ({photosToTake} photos)</button>
    </div>
  );
}
