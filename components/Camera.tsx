'use client';

import { useRef, useEffect, useState } from 'react';
import { Copy, Camera as CameraIcon, Maximize2, Minimize2 } from 'lucide-react';

interface Props {
  onCapture: (dataUrl: string) => void;
  onLiveVideoCapture?: (blob: Blob | null) => void | Promise<void>;
  photosToTake: number;
  poseCount?: number;
  onPoseCountChange?: (value: number) => void;
  onStartCapture?: () => void;
  filter?: string;
  frameColor?: string;
  liveMode?: boolean;
  onToggleLiveMode?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  fullscreenMode?: boolean;
}

export default function Camera({
  onCapture,
  onLiveVideoCapture,
  photosToTake,
  poseCount,
  onPoseCountChange,
  onStartCapture,
  filter,
  frameColor,
  liveMode = true,
  onToggleLiveMode,
  isFullscreen = false,
  onToggleFullscreen,
  fullscreenMode = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('user');
  const [isMirrored, setIsMirrored] = useState(true);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const mobileCheck = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    setIsMobile(mobileCheck);

    if (mobileCheck) {
      setCameraMode('user');
    } else {
      setCameraMode('environment');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(deviceList => {
        const videoDevices = deviceList.filter(d => d.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) setSelectedDeviceId(videoDevices[0].deviceId);
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;

    let constraints: MediaStreamConstraints;
    const bestQuality = {
      width: { ideal: 4096 },
      height: { ideal: 4096 },
      frameRate: { ideal: 60, max: 60 },
    };

    if (isMobile) {
      constraints = {
        video: {
          facingMode: cameraMode,
          ...bestQuality,
        },
      };
    } else if (selectedDeviceId) {
      constraints = {
        video: {
          deviceId: { exact: selectedDeviceId },
          ...bestQuality,
        },
      };
    } else {
      constraints = { video: bestQuality };
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => {
        alert('Cannot access camera: ' + err.name + ' - ' + err.message);
      });
  }, [selectedDeviceId, cameraMode, isMobile]);

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(e.target.value);
  };

  const takePhotos = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    if (onStartCapture) onStartCapture();

    let recorder: MediaRecorder | null = null;
    let recordChunks: BlobPart[] = [];

    let resolveRecorderStopped: () => void = () => {};
    const recorderStopped = new Promise<void>(resolve => {
      resolveRecorderStopped = resolve;
    });

    const stopRecorderSafely = async () => {
      if (!recorder) return;

      if (recorder.state !== 'inactive') {
        recorder.stop();
      }

      await recorderStopped;
    };

    try {
      const stream = videoRef.current?.srcObject;
      if (liveMode && stream instanceof MediaStream && typeof MediaRecorder !== 'undefined') {
        const candidateTypes = [
          'video/mp4;codecs=h264',
          'video/mp4',
          'video/webm;codecs=vp9',
          'video/webm;codecs=vp8',
          'video/webm',
        ];
        const supportedType = candidateTypes.find(type =>
          typeof MediaRecorder.isTypeSupported === 'function' ? MediaRecorder.isTypeSupported(type) : false
        );

        recorder = new MediaRecorder(
          stream,
          supportedType ? { mimeType: supportedType, videoBitsPerSecond: 12_000_000 } : undefined
        );

        recorder.ondataavailable = event => {
          if (event.data && event.data.size > 0) {
            recordChunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          resolveRecorderStopped();
        };

        recorder.start(250);
      } else {
        resolveRecorderStopped();
      }

      for (let shot = 0; shot < photosToTake; shot++) {
        for (let i = countdown; i > 0; i--) {
          setCount(i);
          await new Promise(res => setTimeout(res, 1000));
        }
        setCount(null);

        const video = videoRef.current;
        if (!video || video.readyState < 2) {
          alert('Video not ready. Please wait a few seconds and try again.');
          await stopRecorderSafely();
          if (onLiveVideoCapture) await onLiveVideoCapture(null);
          return;
        }

        let waitTry = 0;
        while ((video.videoWidth === 0 || video.videoHeight === 0) && waitTry < 8) {
          await new Promise(res => setTimeout(res, 120));
          waitTry++;
        }

        if (video.videoWidth === 0 || video.videoHeight === 0) {
          alert('Camera frame is not ready yet. Please try again.');
          await stopRecorderSafely();
          if (onLiveVideoCapture) await onLiveVideoCapture(null);
          return;
        }

        const targetRatio = 4 / 3;
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        let sx = 0;
        let sy = 0;
        let sw = vw;
        let sh = vh;

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
          ctx.filter = filter;
        }

        if (isMirrored) {
          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        } else {
          ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        }

        onCapture(canvas.toDataURL('image/png'));
        await new Promise(res => setTimeout(res, 500));
      }

      await stopRecorderSafely();
      if (onLiveVideoCapture) {
        const liveBlob = recordChunks.length > 0
          ? new Blob(recordChunks, { type: recorder?.mimeType || 'video/webm' })
          : null;
        await onLiveVideoCapture(liveBlob && liveBlob.size > 0 ? liveBlob : null);
      }
    } finally {
      setIsCapturing(false);
      recordChunks = [];
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: fullscreenMode ? '0px' : '16px',
        position: 'relative',
        width: fullscreenMode ? '100vw' : '100%',
        maxWidth: fullscreenMode ? 'none' : '640px',
        height: fullscreenMode ? '100vh' : 'auto',
        margin: '0 auto',
      }}
    >
      {!fullscreenMode && onToggleLiveMode && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            background: '#fff2f8',
            borderRadius: 12,
            border: '1px solid #f3bfd7',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: '#b84f84' }}>Live Mode</span>
          <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 24, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={liveMode}
              onChange={onToggleLiveMode}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: liveMode ? '#fa75aa' : '#efc3d8',
                borderRadius: 24,
                transition: 'all 0.3s',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: liveMode ? 26 : 2,
                  top: 2,
                  width: 20,
                  height: 20,
                  background: 'white',
                  borderRadius: '50%',
                  transition: 'all 0.3s',
                }}
              />
            </span>
          </label>
          <span style={{ fontSize: 14, fontWeight: 700, color: liveMode ? '#d72688' : '#a06a86' }}>
            {liveMode ? 'ON' : 'OFF'}
          </span>
        </div>
      )}

      {!fullscreenMode && (
        <div
          style={{
            marginBottom: 12,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '0 8px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
          {isMobile ? (
            <>
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
                }}
              >
                <option value="environment">Back Camera</option>
                <option value="user">Front Camera</option>
              </select>
              <button
                type="button"
                onClick={() => setIsMirrored(m => !m)}
                style={{
                  background: isMirrored ? '#fa75aa' : '#eee',
                  color: isMirrored ? '#fff' : '#d72688',
                  border: 'none',
                  borderRadius: 8,
                  padding: 8,
                  marginLeft: 4,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  height: 36,
                }}
                title={isMirrored ? 'Mirrored (Click to unmirror)' : 'Not mirrored (Click to mirror)'}
              >
                <Copy style={{ transform: isMirrored ? 'scaleX(-1)' : undefined }} size={16} />
              </button>
            </>
          ) : (
            <>
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
              <button
                type="button"
                onClick={() => setIsMirrored(m => !m)}
                style={{
                  background: isMirrored ? '#fa75aa' : '#eee',
                  color: isMirrored ? '#fff' : '#d72688',
                  border: 'none',
                  borderRadius: 8,
                  padding: 8,
                  marginLeft: 4,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  height: 36,
                }}
                title={isMirrored ? 'Mirrored (Click to unmirror)' : 'Not mirrored (Click to mirror)'}
              >
                <Copy style={{ transform: isMirrored ? 'scaleX(-1)' : undefined }} size={16} />
              </button>
            </>
          )}

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
            }}
            disabled={isCapturing}
          >
            <option value={1}>1s</option>
            <option value={3}>3s</option>
            <option value={5}>5s</option>
          </select>

          {typeof poseCount === 'number' && onPoseCountChange && (
            <select
              value={poseCount}
              onChange={e => onPoseCountChange(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: 12,
                border: '1px solid #fa75aa',
                color: '#d72688',
                fontWeight: 600,
                fontSize: 14,
                background: '#fff',
                outline: 'none',
                cursor: 'pointer',
                width: '160px',
                textAlign: 'center',
              }}
              disabled={isCapturing}
            >
              <option value={2}>2 Pose</option>
              <option value={3}>3 Pose</option>
              <option value={4}>4 Pose</option>
            </select>
          )}
          </div>
        </div>
      )}

      <div
        className={isMobile ? 'camera-43-container' : undefined}
        style={{
          position: 'relative',
          width: fullscreenMode ? '100vw' : isMobile ? '100%' : 640,
          height: fullscreenMode ? '100vh' : isMobile ? 'auto' : 480,
          maxWidth: '100%',
          aspectRatio: fullscreenMode ? undefined : '4/3',
          background: frameColor,
          borderRadius: fullscreenMode ? 0 : 8,
          overflow: 'hidden',
          marginBottom: fullscreenMode ? 0 : 12,
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
            borderRadius: fullscreenMode ? 0 : 8,
            transform: isMirrored ? 'scaleX(-1)' : undefined,
            background: 'transparent',
            filter: filter,
          }}
        />
        {count !== null && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '48px' : '64px',
              color: '#fff',
              background: 'rgba(0,0,0,0.4)',
              fontWeight: 'bold',
              zIndex: 2,
            }}
          >
            {count}
          </div>
        )}
      </div>

      <div
        style={{
          position: fullscreenMode ? 'absolute' : 'static',
          bottom: fullscreenMode ? (isMobile ? 'calc(env(safe-area-inset-bottom, 0px) + 12px)' : '20px') : undefined,
          left: fullscreenMode ? '50%' : undefined,
          transform: fullscreenMode ? 'translateX(-50%)' : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          zIndex: 4,
          width: fullscreenMode ? 'auto' : isMobile ? '100%' : 'auto',
          maxWidth: fullscreenMode ? 'none' : '420px',
          padding: fullscreenMode ? 0 : isMobile ? '0 8px' : 0,
        }}
      >
        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? 'Keluar full screen' : 'Masuk full screen'}
            title={isFullscreen ? 'Keluar full screen' : 'Mode full screen'}
            style={{
              width: fullscreenMode ? '60px' : '48px',
              height: fullscreenMode ? '60px' : '48px',
              borderRadius: '9999px',
              border: fullscreenMode ? 'none' : '1px solid #f3bfd7',
              background: '#fa75aa',
              color: '#4a1033',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(215, 38, 136, 0.32)',
              transition: 'all 0.25s ease',
            }}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        )}

        <button
          onClick={takePhotos}
          disabled={isCapturing}
          style={{
            padding: fullscreenMode ? '0' : '12px 20px',
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: 'bold',
            backgroundColor: '#fa75aa',
            color: 'white',
            border: 'none',
            borderRadius: fullscreenMode ? '9999px' : '24px',
            cursor: isCapturing ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            width: fullscreenMode ? '72px' : isMobile ? 'auto' : 'auto',
            height: fullscreenMode ? '72px' : 'auto',
            maxWidth: fullscreenMode ? '72px' : '320px',
            minWidth: fullscreenMode ? '72px' : isMobile ? 0 : 'auto',
            flex: fullscreenMode ? '0 0 auto' : isMobile ? 1 : '0 0 auto',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={isCapturing ? 'Taking photo' : `Start capture ${photosToTake} photos`}
          title={isCapturing ? 'Taking Photo...' : 'Start Capture'}
        >
          {fullscreenMode ? (
            <CameraIcon size={28} />
          ) : isCapturing ? (
            'Taking Photo...'
          ) : (
            `Start Capture (${photosToTake} photos)`
          )}
        </button>
      </div>
    </div>
  );
}
