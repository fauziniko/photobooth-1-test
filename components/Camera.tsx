'use client';
import { useRef, useEffect, useState } from 'react';

interface Props {
  onCapture: (dataUrl: string) => void;
  photosToTake: number;
  countdown: number;
  onStartCapture?: () => void;
}

export default function Camera({ onCapture, photosToTake, countdown, onStartCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('environment');
  const isMobile = typeof window !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Ambil daftar kamera
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) setSelectedDeviceId(videoDevices[0].deviceId);
      });
    }
  }, []);

  // Stream kamera sesuai pilihan
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;

    let constraints: MediaStreamConstraints;
    if (isMobile) {
      constraints = { video: { facingMode: cameraMode } };
    } else if (selectedDeviceId) {
      constraints = { video: { deviceId: { exact: selectedDeviceId } } };
    } else {
      constraints = { video: true };
    }

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => {
        alert('Tidak bisa mengakses kamera: ' + err.name + ' - ' + err.message);
      });
  }, [selectedDeviceId, cameraMode]);

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(e.target.value);
  };

  const takePhotos = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    if (onStartCapture) onStartCapture();

    for (let shot = 0; shot < photosToTake; shot++) {
      // Countdown sebelum setiap foto
      for (let i = countdown; i > 0; i--) {
        setCount(i);
        await new Promise(res => setTimeout(res, 1000));
      }
      setCount(null);

      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        alert('Video belum siap. Mohon tunggu beberapa detik lalu coba lagi.');
        setIsCapturing(false);
        return;
      }

      // Ambil gambar landscape, crop tengah
      const targetRatio = 4 / 3;
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      let sx = 0, sy = 0, sw = vw, sh = vh;
      if (vw / vh > targetRatio) {
        sw = vh * targetRatio;
        sx = (vw - sw) / 2;
      } else if (vw / vh < targetRatio) {
        sh = vw / targetRatio;
        sy = (vh - sh) / 2;
      }

      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

      onCapture(canvas.toDataURL('image/png'));
      // Delay antar foto
      await new Promise(res => setTimeout(res, 500));
    }
    setIsCapturing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative' }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 'bold', color: '#111', marginRight: 8 }}>Pilih Kamera:</label>
        {isMobile ? (
          <select
            value={cameraMode}
            onChange={e => setCameraMode(e.target.value as 'user' | 'environment')}
            style={{
              padding: 6,
              borderRadius: 6,
              color: '#111',
              background: '#fff',
              border: '1px solid #aaa'
            }}
          >
            <option value="environment">Kamera Belakang</option>
            <option value="user">Kamera Depan</option>
          </select>
        ) : (
          <select
            value={selectedDeviceId}
            onChange={handleDeviceChange}
            style={{
              padding: 6,
              borderRadius: 6,
              color: '#111',
              background: '#fff',
              border: '1px solid #aaa'
            }}
          >
            {devices.map(device => (
              <option
                value={device.deviceId}
                key={device.deviceId}
                style={{ color: '#111', background: '#fff' }}
              >
                {device.label || `Kamera ${device.deviceId.slice(-4)}`}
              </option>
            ))}
          </select>
        )}
      </div>
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
        {count !== null && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 64,
            color: '#fff',
            background: 'rgba(0,0,0,0.4)',
            fontWeight: 'bold',
            zIndex: 2
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
          backgroundColor: '#fa75aa',
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
