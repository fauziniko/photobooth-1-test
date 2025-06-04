'use client';
import { useRef, useEffect, useState } from 'react';

interface Props {
  onCapture: (dataUrl: string) => void;
  photosToTake: number;
  onStartCapture?: () => void;
  filter?: string;
  frameColor?: string;
}

export default function Camera({ onCapture, photosToTake, onStartCapture, filter, frameColor }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState(3); // Default 3 detik

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const mobileCheck = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobileCheck);
    
    // Set initial camera mode based on mobile detection
    if (mobileCheck) {
      setCameraMode('user');
    } else {
      setCameraMode('environment');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) setSelectedDeviceId(videoDevices[0].deviceId);
      });
    }
  }, []);


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
        alert('Cannot access camera: ' + err.name + ' - ' + err.message);
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
        alert('Video not ready. Please wait a few seconds and try again.');
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
      if (filter && filter !== 'none') {
        ctx.filter = filter; // Terapkan filter ke canvas context
      }
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

      onCapture(canvas.toDataURL('image/png'));
      // Delay antar foto
      await new Promise(res => setTimeout(res, 500));
    }
    setIsCapturing(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '16px', 
      position: 'relative',
      width: '100%',
      maxWidth: '640px',
      margin: '0 auto'
    }}>
      {/* Select Camera & Mirror di atas live foto - Make this responsive */}
      <div style={{ 
        marginBottom: 12, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8,
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        padding: '0 8px'
      }}>
        {isMobile ? (
          <select
            value={cameraMode}
            onChange={e => setCameraMode(e.target.value as 'user' | 'environment')}
            style={{
              padding: '8px 12px',
              borderRadius: 12,
              border: '1px solid #fa75aa',
              color: '#d72688',
              fontWeight: 500,
              fontSize: 14,
              background: '#fff',
              outline: 'none',
              cursor: 'pointer',
              flex: '1 1 auto',
              minWidth: '110px',
              maxWidth: '150px',
              marginBottom: '4px'
            }}
          >
            <option value="environment">Back Camera</option>
            <option value="user">Front Camera</option>
          </select>
        ) : (
          // Desktop camera selector with similar styling
          <select
            value={selectedDeviceId}
            onChange={handleDeviceChange}
            style={{
              padding: '8px 12px',
              borderRadius: 12,
              border: '1px solid #fa75aa',
              color: '#d72688',
              fontWeight: 500,
              fontSize: 14,
              background: '#fff',
              outline: 'none',
              cursor: 'pointer',
              flex: '1 1 auto',
              minWidth: '110px',
              maxWidth: '180px',
              marginBottom: '4px'
            }}
          >
            {devices.map(device => (
              <option
                value={device.deviceId}
                key={device.deviceId}
                style={{ color: '#d72688', background: '#fff' }}
              >
                {device.label || `Kamera ${device.deviceId.slice(-4)}`}
              </option>
            ))}
          </select>
        )}
        {/* Countdown selector with consistent styling */}
        <select
          value={countdown}
          onChange={e => setCountdown(Number(e.target.value))}
          style={{
            padding: '8px 12px',
            borderRadius: 12,
            border: '1px solid #fa75aa',
            color: '#d72688',
            fontWeight: 500,
            fontSize: 14,
            background: '#fff',
            outline: 'none',
            cursor: 'pointer',
            width: '80px',
            textAlign: 'center',
            flex: '0 0 auto',
            marginBottom: '4px'
          }}
          disabled={isCapturing}
        >
          <option value={1}>1s</option>
          <option value={3}>3s</option>
          <option value={5}>5s</option>
        </select>
      </div>
      {/* Live Foto - Make this responsive */}
      <div
        className={isMobile ? 'camera-43-container' : undefined}
        style={{
          position: 'relative',
          width: isMobile ? '100%' : 640,
          height: isMobile ? 'auto' : 480,
          maxWidth: '100%',
          aspectRatio: '4/3',
          background: frameColor,
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 12,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 8,
            background: 'transparent',
            filter: filter,
          }}
        />
        {count !== null && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '48px' : '64px',
            color: '#fff',
            background: 'rgba(0,0,0,0.4)',
            fontWeight: 'bold',
            zIndex: 2
          }}>
            {count}
          </div>
        )}
      </div>
      {/* Tombol capture dst */}
      <button 
        onClick={takePhotos} 
        disabled={isCapturing}
        style={{
          padding: '12px 20px',
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: 'bold',
          backgroundColor: '#fa75aa',
          color: 'white',
          border: 'none',
          borderRadius: '24px',
          cursor: isCapturing ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          width: isMobile ? 'calc(100% - 32px)' : 'auto',
          maxWidth: '320px'
        }}
      >
        {isCapturing ? 'Taking Photo...' : `Start Capture (${photosToTake} photos)`}
      </button>
    </div>
  );
}