import React, { useState } from 'react';

const TABS = [
  { key: 'adjust', label: 'Settings' },
  { key: 'sticker', label: 'Sticker' },
  { key: 'filter', label: 'Filter' },
  { key: 'frame', label: 'Color' },
];

export default function PhotoEditor({
  onChangeSlider,
  sliderValue,
  onAddSticker,
  onSelectFilter,
  selectedFilter,
  onSelectFrame,
  selectedFrame,

  availableFilters,
  availableFrames,
  frameBorderRadius,
  onChangeFrameBorderRadius,
  photoGap,
  onChangePhotoGap,
  photoBorderRadius,
  onChangePhotoBorderRadius,
  onResetDefault,
  frameTemplates,
  selectedFrameTemplate,
  onSelectFrameTemplate,
  onShowUploadModal, // tambahkan prop ini
}: {
  onChangeSlider: (v: number) => void;
  sliderValue: number;
  onAddSticker: (src: string) => void;
  onSelectFilter: (filter: string) => void;
  selectedFilter: string;
  onSelectFrame: (frame: string) => void;
  selectedFrame: string;
  availableStickers: { src: string; label: string }[];
  availableFilters: { name: string; label: string; color: string }[];
  availableFrames: { name: string; label: string; color: string }[];
  frameBorderRadius: number;
  onChangeFrameBorderRadius: (v: number) => void;
  photoGap: number;
  onChangePhotoGap: (v: number) => void;
  photoBorderRadius: number;
  onChangePhotoBorderRadius: (v: number) => void;
  onResetDefault: () => void;
  frameTemplates: { name: string; label: string; src?: string }[];
  selectedFrameTemplate: string;
  onSelectFrameTemplate: (template: string) => void;
  onShowUploadModal: () => void; // tambahkan tipe untuk prop ini
}) {
  const [activeTab, setActiveTab] = useState('adjust');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [frameFile, setFrameFile] = useState<File | null>(null);
  const [stickerFile, setStickerFile] = useState<File | null>(null);
  const [templateName, setTemplateName] = useState('');

  // Untuk menambah stiker ke list
  const handleUploadSticker = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadSuccess(false);
    setUploadError('');
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload-sticker', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    if (data.url) {
      setUploadSuccess(true);
      // Tambahkan stiker baru ke list
      if (typeof window !== 'undefined') {
        const localStickers = JSON.parse(localStorage.getItem('userStickers') || '[]');
        localStickers.push({ src: data.url, label: data.name });
        localStorage.setItem('userStickers', JSON.stringify(localStickers));
        window.dispatchEvent(new Event('userStickersUpdated'));
      }
    } else {
      setUploadError('Failed to upload sticker');
    }
    e.target.value = '';
  };

  // Gabungkan stiker default dan user
  const [minioStickers, setMinioStickers] = useState<{ src: string; label: string }[]>([]);
  React.useEffect(() => {
    fetch('/api/list-sticker')
      .then(res => res.json())
      .then(data => {
        if (data.stickers) {
          setMinioStickers(
            data.stickers.map((src: string) => ({
              src,
              label: src.split('/').pop() || 'sticker',
            }))
          );
        }
      });
  }, []);

  const handleUploadTemplate = async () => {
    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);
    if (!frameFile || !stickerFile) {
      setUploadError('Both files are required');
      setUploading(false);
      return;
    }
    if (frameFile.type !== 'image/png' || stickerFile.type !== 'image/png') {
      setUploadError('Only PNG files allowed');
      setUploading(false);
      return;
    }
    const formData = new FormData();
    formData.append('frame', frameFile);
    formData.append('sticker', stickerFile);
    formData.append('name', templateName || `template_${Date.now()}`);

    const res = await fetch('/api/upload-frame-template', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.frameUrl && data.stickerUrl) {
      setUploadSuccess(true);
      setFrameFile(null);
      setStickerFile(null);
      setTemplateName('');
      // Trigger refresh template list (bisa pakai event atau refetch)
      window.dispatchEvent(new Event('frameTemplatesUpdated'));
    } else {
      setUploadError(data.error || 'Upload failed');
    }
    setUploading(false);
  };

  // Modal Upload Template (letakkan di luar return utama)
  const uploadModal = showUploadModal && (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 32, minWidth: 320, boxShadow: '0 4px 24px #fa75aa22', position: 'relative'
      }}>
        <h3 style={{ color: '#d72688', marginBottom: 16 }}>Upload Frame Template</h3>
        <label style={{ fontWeight: 600, color: '#fa75aa' }}>Template Name</label>
        <input
          type="text"
          value={templateName}
          onChange={e => setTemplateName(e.target.value)}
          placeholder="Template name"
          style={{ width: '100%', marginBottom: 12, padding: 6, borderRadius: 6, border: '1px solid #fa75aa33' }}
        />
        <label style={{ fontWeight: 600, color: '#fa75aa' }}>Frame Template (PNG)</label>
        <div style={{ marginBottom: 12 }}>
          <label
            style={{
              display: 'inline-block',
              padding: '8px 18px',
              background: '#fa75aa',
              color: '#fff',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              marginRight: 12,
            }}
          >
            Choose File
            <input
              type="file"
              accept="image/png"
              onChange={e => setFrameFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
          </label>
          <span style={{ color: '#fa75aa', fontWeight: 500 }}>
            {frameFile ? frameFile.name : 'No file chosen'}
          </span>
        </div>
        <label style={{ fontWeight: 600, color: '#fa75aa' }}>Sticker (PNG)</label>
        <div style={{ marginBottom: 12 }}>
          <label
            style={{
              display: 'inline-block',
              padding: '8px 18px',
              background: '#fa75aa',
              color: '#fff',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              marginRight: 12,
            }}
          >
            Choose File
            <input
              type="file"
              accept="image/png"
              onChange={e => setStickerFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
          </label>
          <span style={{ color: '#fa75aa', fontWeight: 500 }}>
            {stickerFile ? stickerFile.name : 'No file chosen'}
          </span>
        </div>
        {uploadError && <div style={{ color: 'red', marginBottom: 8 }}>{uploadError}</div>}
        {uploadSuccess && <div style={{ color: 'green', marginBottom: 8 }}>Upload Success!</div>}
        <button
          onClick={handleUploadTemplate}
          disabled={uploading}
          style={{ background: '#fa75aa', color: '#fff', borderRadius: 8, padding: '8px 18px', fontWeight: 600, border: 'none', marginRight: 8 }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <button
          onClick={() => { setShowUploadModal(false); setUploadError(''); setUploadSuccess(false); }}
          style={{ background: '#eee', color: '#333', borderRadius: 8, padding: '8px 18px', fontWeight: 600, border: 'none' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const reloadStickers = () => {
    fetch('/api/list-sticker')
      .then(res => res.json())
      .then(data => {
        if (data.stickers) {
          setMinioStickers(
            data.stickers.map((src: string) => ({
              src,
              label: src.split('/').pop() || 'sticker',
            }))
          );
        }
      });
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 4px 24px rgba(250,117,170,0.08)',
        maxWidth: 800,
        margin: '0 auto',
        padding: 0,
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Render modal di sini agar selalu di atas */}
      {uploadModal}

      {/* Tab Menu */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1.5px solid #fa75aa22',
          background: '#ffe4f0',
          padding: '12px 12px',
          justifyContent: 'center',
        }}
      >
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '5px 5px',
              background: activeTab === tab.key ? '#fae0ef' : 'transparent',
              color: '#d72688',
              fontWeight: activeTab === tab.key ? 'bold' : 700,
              border: 'none',
              fontSize: 15, // tambahkan baris ini untuk mengecilkan teks
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: 28, background: '#fff' }}>
        {activeTab === 'adjust' && (
          <>
            <button
              onClick={onResetDefault}
              style={{
                marginBottom: 18,
                padding: '10px 24px',
                background: '#fa75aa',
                color: '#fff',
                border: 'none',
                borderRadius: 16,
                fontWeight: 'bold',
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #fa75aa22',
              }}
            >
              Reset to Default
            </button>
            <label style={{ color: '#d72688', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'block' }}>
              Frame Bottom Size
            </label>
            <input
              type="range"
              min={0}
              max={200}
              value={sliderValue}
              onChange={e => onChangeSlider(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#fa75aa',
                marginBottom: 12,
              }}
            />
            <div style={{ color: '#d72688', fontWeight: 500, fontSize: 14 }}>
              {sliderValue}px
            </div>

            {/* Frame Border Radius */}
            <div style={{ marginTop: 24 }}>
              <label style={{ color: '#d72688', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'block' }}>
                Frame Border Radius
              </label>
              <input
                type="range"
                min={0}
                max={48}
                value={frameBorderRadius}
                onChange={e => onChangeFrameBorderRadius(Number(e.target.value))}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  accentColor: '#fa75aa',
                }}
              />
              <div style={{ color: '#d72688', fontWeight: 500, fontSize: 14 }}>
                {frameBorderRadius}px
              </div>
            </div>

            {/* Photo Gap */}
            <div style={{ marginTop: 24 }}>
              <label style={{ color: '#d72688', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'block' }}>
                Photo Gap
              </label>
              <input
                type="range"
                min={0}
                max={48}
                value={photoGap}
                onChange={e => onChangePhotoGap(Number(e.target.value))}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  accentColor: '#fa75aa',
                }}
              />
              <div style={{ color: '#d72688', fontWeight: 500, fontSize: 14 }}>
                {photoGap}px
              </div>
            </div>

            {/* Photo Border Radius */}
            <div style={{ marginTop: 24 }}>
              <label style={{ color: '#d72688', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'block' }}>
                Photo Border Radius
              </label>
              <input
                type="range"
                min={0}
                max={48}
                value={photoBorderRadius}
                onChange={e => onChangePhotoBorderRadius(Number(e.target.value))}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  accentColor: '#fa75aa',
                }}
              />
              <div style={{ color: '#d72688', fontWeight: 500, fontSize: 14 }}>
                {photoBorderRadius}px
              </div>
            </div>
          </>
        )}

        {activeTab === 'sticker' && (
          <div>
            {/* Upload Sticker */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#d72688', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'block' }}>
                Upload PNG Sticker
              </label>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: 'inline-block',
                    padding: '8px 18px',
                    background: '#fa75aa',
                    color: '#fff',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 600,
                    marginRight: 12,
                  }}
                >
                  Choose File
                  <input
                    id="upload-sticker"
                    type="file"
                    accept="image/png"
                    onChange={handleUploadSticker}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                </label>
                {uploading && <span style={{ color: '#fa75aa', marginLeft: 8 }}>Uploading...</span>}
                {uploadError && <span style={{ color: 'red', marginLeft: 8 }}>{uploadError}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 600, color: '#d72688', marginRight: 12 }}>Choose Sticker</div>
              <button
                onClick={reloadStickers}
                style={{
                  background: '#fa75aa',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '4px 14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
                title="Reload sticker list"
              >
                Reload
              </button>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {minioStickers.map(sticker => (
                <img
                  key={sticker.src}
                  src={sticker.src}
                  alt={sticker.label}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    border: '2px solid #fa75aa33',
                    background: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #fa75aa11',
                    transition: 'transform 0.1s',
                  }}
                  onClick={() => onAddSticker(sticker.src)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'filter' && (
          <div>
            <div style={{ fontWeight: 600, color: '#d72688', marginBottom: 12 }}>Choose Filter</div>
            <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
      gap: 10 
    }}>
              {availableFilters.map(filter => (
                <button
                  key={filter.name}
                  onClick={() => onSelectFilter(filter.name)}
                  style={{
                    padding: '10px 5px',
                    width: '100%',
                    textAlign: 'center',
                    background: filter.color,
                    color:
                      filter.name === 'none'
                        ? '#111'
                        : selectedFilter === filter.name
                        ? '#fff'
                        : '#d72688',
                    border: selectedFilter === filter.name ? '2px solid #fa75aa' : '2px solid #fa75aa33',
                    borderRadius: 8,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: 15,
                    boxShadow: selectedFilter === filter.name ? '0 2px 8px #fa75aa33' : undefined,
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'frame' && (
          <div>
            {/* Pindahkan tombol upload ke atas */}
            <button
              style={{
                background: '#fa75aa',
                color: '#fff',
                borderRadius: 8,
                padding: '8px 18px',
                fontWeight: 600,
                marginBottom: 16,
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => onShowUploadModal()}
            >
              Upload PNG Frame Template
            </button>

            <div style={{ fontWeight: 600, color: '#d72688', marginBottom: 12 }}>Choose Frame Color</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
              {availableFrames.map(frame => (
                <button
                  key={frame.name}
                  onClick={() => onSelectFrame(frame.name)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: frame.color,
                    border: selectedFrame === frame.name ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                    cursor: 'pointer',
                    outline: selectedFrame === frame.name ? '2px solid #fff' : 'none',
                  }}
                  aria-label={frame.label}
                  title={frame.label}
                />
              ))}
            </div>
            <div style={{ fontWeight: 600, color: '#d72688', marginBottom: 12 }}>Choose Frame Template</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {frameTemplates.map(template => (
                <button
                  key={template.name}
                  onClick={() => onSelectFrameTemplate(template.name)}
                  style={{
                    border: selectedFrameTemplate === template.name ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                    borderRadius: 12,
                    padding: 0,
                    background: '#fff',
                    cursor: 'pointer',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                  title={template.label}
                >
                  {template.src ? (
                    <img src={template.src} alt={template.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ color: '#d72688', fontSize: 12 }}>{template.label}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Area preview baru foto */}
      {/* <div style={{ background: '#fff', padding: 0 }}>{children}</div> */}
    </div>
  );
}