'use client';

import { useState, useRef, useEffect } from 'react';
import { X, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface CropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSave: (croppedImageUrl: string) => void;
  photoIndex: number;
}

export default function CropModal({
  isOpen,
  onClose,
  imageUrl,
  onSave,
  photoIndex,
}: CropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<'free' | '1:1' | '4:3' | '16:9'>('free');
  const [cropBox, setCropBox] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = img.width;
    canvas.height = img.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw image
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Restore context
    ctx.restore();

    // Draw overlay (darkened area outside crop box)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop box area
    ctx.clearRect(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
    
    // Redraw image in crop box area
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.restore();

    // Draw crop box border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropBox.x, cropBox.y, cropBox.width, cropBox.height);

    // Draw corner handles
    const handleSize = 10;
    ctx.fillStyle = '#fff';
    // Top-left
    ctx.fillRect(cropBox.x - handleSize / 2, cropBox.y - handleSize / 2, handleSize, handleSize);
    // Top-right
    ctx.fillRect(cropBox.x + cropBox.width - handleSize / 2, cropBox.y - handleSize / 2, handleSize, handleSize);
    // Bottom-left
    ctx.fillRect(cropBox.x - handleSize / 2, cropBox.y + cropBox.height - handleSize / 2, handleSize, handleSize);
    // Bottom-right
    ctx.fillRect(cropBox.x + cropBox.width - handleSize / 2, cropBox.y + cropBox.height - handleSize / 2, handleSize, handleSize);
  };

  useEffect(() => {
    if (!isOpen) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      imageRef.current = img;
      drawCanvas();
      
      // Initialize crop box to center of image
      const canvas = canvasRef.current;
      if (canvas) {
        const boxWidth = Math.min(img.width * 0.7, 300);
        const boxHeight = Math.min(img.height * 0.7, 300);
        setCropBox({
          x: (img.width - boxWidth) / 2,
          y: (img.height - boxHeight) / 2,
          width: boxWidth,
          height: boxHeight,
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, imageUrl]);

  useEffect(() => {
    drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, rotation, cropBox]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const handleSize = 10;

    // Check if clicking on corner handles
    if (Math.abs(x - cropBox.x) < handleSize && Math.abs(y - cropBox.y) < handleSize) {
      setIsResizing('top-left');
    } else if (Math.abs(x - (cropBox.x + cropBox.width)) < handleSize && Math.abs(y - cropBox.y) < handleSize) {
      setIsResizing('top-right');
    } else if (Math.abs(x - cropBox.x) < handleSize && Math.abs(y - (cropBox.y + cropBox.height)) < handleSize) {
      setIsResizing('bottom-left');
    } else if (Math.abs(x - (cropBox.x + cropBox.width)) < handleSize && Math.abs(y - (cropBox.y + cropBox.height)) < handleSize) {
      setIsResizing('bottom-right');
    } else if (x >= cropBox.x && x <= cropBox.x + cropBox.width && y >= cropBox.y && y <= cropBox.y + cropBox.height) {
      // Inside crop box - drag
      setIsDragging(true);
    }

    setDragStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const dx = x - dragStart.x;
    const dy = y - dragStart.y;

    if (isDragging) {
      setCropBox((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(canvas.width - prev.width, prev.x + dx)),
        y: Math.max(0, Math.min(canvas.height - prev.height, prev.y + dy)),
      }));
      setDragStart({ x, y });
    } else if (isResizing) {
      const newBox = { ...cropBox };

      switch (isResizing) {
        case 'top-left':
          newBox.width = Math.max(50, cropBox.width - dx);
          newBox.height = Math.max(50, cropBox.height - dy);
          newBox.x = cropBox.x + dx;
          newBox.y = cropBox.y + dy;
          break;
        case 'top-right':
          newBox.width = Math.max(50, cropBox.width + dx);
          newBox.height = Math.max(50, cropBox.height - dy);
          newBox.y = cropBox.y + dy;
          break;
        case 'bottom-left':
          newBox.width = Math.max(50, cropBox.width - dx);
          newBox.height = Math.max(50, cropBox.height + dy);
          newBox.x = cropBox.x + dx;
          break;
        case 'bottom-right':
          newBox.width = Math.max(50, cropBox.width + dx);
          newBox.height = Math.max(50, cropBox.height + dy);
          break;
      }

      // Apply aspect ratio constraint
      if (aspectRatio !== 'free') {
        const ratios = { '1:1': 1, '4:3': 4/3, '16:9': 16/9 };
        const ratio = ratios[aspectRatio];
        newBox.height = newBox.width / ratio;
      }

      setCropBox(newBox);
      setDragStart({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    // Create a new canvas for the cropped image
    const croppedCanvas = document.createElement('canvas');
    const ctx = croppedCanvas.getContext('2d');
    if (!ctx) return;

    croppedCanvas.width = cropBox.width;
    croppedCanvas.height = cropBox.height;

    // Draw the cropped portion
    ctx.save();
    ctx.translate(croppedCanvas.width / 2, croppedCanvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-cropBox.x - cropBox.width / 2, -cropBox.y - cropBox.height / 2);
    ctx.drawImage(img, 0, 0);
    ctx.restore();

    // Convert to data URL
    const croppedImageUrl = croppedCanvas.toDataURL('image/png');
    onSave(croppedImageUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Crop Photo {photoIndex + 1}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <div className="flex items-center justify-center min-h-full">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full border border-gray-300 cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as 'free' | '1:1' | '4:3' | '16:9')}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="free">Free</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="4:3">4:3</option>
                <option value="16:9">16:9</option>
              </select>
            </div>

            {/* Zoom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoom: {zoom.toFixed(1)}x
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1"
                />
                <button
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation: {rotation}°
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRotation((rotation - 90) % 360)}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
                >
                  <RotateCw className="w-4 h-4 inline mr-1 transform rotate-180" /> -90°
                </button>
                <button
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
                >
                  <RotateCw className="w-4 h-4 inline mr-1" /> +90°
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition shadow-md hover:shadow-lg"
            >
              Save Cropped Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
