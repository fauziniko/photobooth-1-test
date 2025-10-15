import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const TABS = [
  { key: 'color', label: 'Color' }, // Tambahkan tab baru untuk Frame Color
  { key: 'frame', label: 'Frame' },
  { key: 'sticker', label: 'Sticker' },
  { key: 'adjust', label: 'Settings' },
];

export default function PhotoEditor({
  onChangeSlider,
  sliderValue,
  onAddSticker,
  onSelectFrame,
  selectedFrame,
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
  onShowUploadModal,
  userRole,
}: {
  onChangeSlider: (v: number) => void;
  sliderValue: number;
  onAddSticker: (src: string) => void;
  onSelectFrame: (frame: string) => void;
  selectedFrame: string;
  availableStickers: { src: string; label: string }[];
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
  onShowUploadModal: () => void;
  userRole?: string;
}) {
  // Ubah 'filter' menjadi 'frame' agar tab default adalah Frame
  const [activeTab, setActiveTab] = useState('frame');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [frameFile, setFrameFile] = useState<File | null>(null);
  const [stickerFile, setStickerFile] = useState<File | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [showStickerUploadModal, setShowStickerUploadModal] = useState(false);
  const [stickerName, setStickerName] = useState('');
  const [stickerCategory, setStickerCategory] = useState('');

  // Handler for uploading sticker with updated FormData
  const handleStickerUpload = async () => {
    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);
    
    if (!stickerFile) {
      setUploadError('Sticker file is required');
      setUploading(false);
      return;
    }
    
    if (stickerFile.type !== 'image/png') {
      setUploadError('Only PNG files allowed');
      setUploading(false);
      return;
    }
    
    // Gabungkan kategori dan nama untuk membuat nama file yang lebih deskriptif
    const category = stickerCategory.trim() || 'default';
    const name = stickerName.trim() || `sticker_${Date.now()}`;
    const combinedName = `${category}_${name}`;
    
    const formData = new FormData();
    formData.append('file', stickerFile);
    formData.append('name', combinedName); // Gunakan nama gabungan
    formData.append('category', category);
    
    try {
      const res = await fetch('/api/upload-sticker', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `Upload failed (${res.status})` }));
        setUploadError(errorData.error || `Upload failed (${res.status})`);
        setUploading(false);
        return;
      }
      
      const data = await res.json().catch(() => ({}));
      if (data.stickerUrl || data.url) {
        setUploadSuccess(true);
        setStickerFile(null);
        setStickerName('');
        setStickerCategory('');
        // Reload stickers setelah sukses
        setTimeout(reloadStickers, 1000);
      } else {
        setUploadError(data.error || 'Upload successful but no URL returned');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Network error during upload');
    }
    
    setUploading(false);
  };

  // Untuk menambah stiker ke list

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

  // Modal Upload Sticker (sesuaikan agar sama dengan upload template tapi lebih compact)
  const stickerUploadModal = showStickerUploadModal && ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2147483647, // maksimum z-index
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 28,
          minWidth: 300, // sedikit lebih kecil dari template
          maxWidth: 320, // batasi maksimum lebar
          boxShadow: '0 4px 24px #fa75aa22',
          position: 'relative',
        }}
      >
        <h3 style={{ color: '#d72688', marginBottom: 14, fontSize: 16 }}>Upload Sticker</h3>
        <label style={{ fontWeight: 600, color: '#fa75aa', fontSize: 14 }}>Sticker Name</label>
        <input
          type="text"
          value={stickerName}
          onChange={e => setStickerName(e.target.value)}
          placeholder="Sticker name"
          style={{ width: '100%', marginBottom: 10, padding: 6, borderRadius: 6, border: '1px solid #fa75aa33', color: '#fa75aa' }}
          autoFocus
        />
        <label style={{ fontWeight: 600, color: '#fa75aa', fontSize: 14 }}>Category</label>
        <input
          type="text"
          value={stickerCategory}
          onChange={e => setStickerCategory(e.target.value)}
          placeholder="Category"
          style={{ width: '100%', marginBottom: 10, padding: 6, borderRadius: 6, border: '1px solid #fa75aa33', color: '#fa75aa' }}
        />
        <label style={{ fontWeight: 600, color: '#fa75aa', fontSize: 14 }}>Sticker File (PNG)</label>
        <div style={{ marginBottom: 12 }}>
          <label
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              background: '#fa75aa',
              color: '#fff',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              marginRight: 8,
              fontSize: 14,
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
          <span style={{ color: '#fa75aa', fontWeight: 500, fontSize: 14 }}>
            {stickerFile ? stickerFile.name : 'No file chosen'}
          </span>
        </div>
        {uploadError && <div style={{ color: 'red', marginBottom: 8, fontSize: 14 }}>{uploadError}</div>}
        {uploadSuccess && <div style={{ color: 'green', marginBottom: 8, fontSize: 14 }}>Upload Success!</div>}
        {/* Center buttons */}
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          justifyContent: 'center', // Center horizontally
          marginTop: 12 
        }}>
          <button
            onClick={handleStickerUpload}
            disabled={uploading}
            style={{ background: '#fa75aa', color: '#fff', borderRadius: 8, padding: '6px 14px', fontWeight: 600, border: 'none', fontSize: 14 }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            onClick={() => {
              setShowStickerUploadModal(false);
              setUploadError('');
              setUploadSuccess(false);
            }}
            style={{ background: '#eee', color: '#333', borderRadius: 8, padding: '6px 14px', fontWeight: 600, border: 'none', fontSize: 14 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

  const reloadStickers = () => {
    fetch('/api/list-sticker')
      .then(res => {
        if (!res.ok) {
          console.error('Failed to fetch stickers:', res.status);
          return { stickers: [] };
        }
        return res.json();
      })
      .then(data => {
        if (data.stickers && Array.isArray(data.stickers)) {
          setMinioStickers(
            data.stickers.map((src: string) => ({
              src,
              label: src.split('/').pop() || 'sticker',
            }))
          );
        } else {
          console.error('Invalid sticker data format:', data);
        }
      })
      .catch(err => {
        console.error('Error loading stickers:', err);
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
      {uploadModal}
      {stickerUploadModal}
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
              fontSize: 15,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: 28, background: '#fff' }}>
        {activeTab === 'color' && (
          <div>
            <div style={{ fontWeight: 600, color: '#d72688', marginBottom: 12 }}>Choose Frame Color</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
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
            {/* Keterangan Pastel */}
            <div style={{ fontWeight: 500, color: '#d72688', marginBottom: 8, marginTop: 8 }}>Pastel</div>
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10,
    marginBottom: 24,
  }}
>
  <button
    onClick={() => onSelectFrame('#FFDCDC')}
    style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: '#FFDCDC',
      border: selectedFrame === '#FFDCDC' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
      cursor: 'pointer',
      outline: selectedFrame === '#FFDCDC' ? '2px solid #fff' : 'none',
    }}
    aria-label="Pastel Pink"
    title="Pastel Pink"
  />
  <button
    onClick={() => onSelectFrame('#FFF2EB')}
    style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: '#FFF2EB',
      border: selectedFrame === '#FFF2EB' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
      cursor: 'pointer',
      outline: selectedFrame === '#FFF2EB' ? '2px solid #fff' : 'none',
    }}
    aria-label="Pastel Peach"
    title="Pastel Peach"
  />
  <button
    onClick={() => onSelectFrame('#FFE8CD')}
    style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: '#FFE8CD',
      border: selectedFrame === '#FFE8CD' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
      cursor: 'pointer',
      outline: selectedFrame === '#FFE8CD' ? '2px solid #fff' : 'none',
    }}
    aria-label="Pastel Yellow"
    title="Pastel Yellow"
  />
  <button
    onClick={() => onSelectFrame('#FFD6BA')}
    style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: '#FFD6BA',
      border: selectedFrame === '#FFD6BA' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
      cursor: 'pointer',
      outline: selectedFrame === '#FFD6BA' ? '2px solid #fff' : 'none',
    }}
    aria-label="Pastel Orange"
    title="Pastel Orange"
  />
</div>
            {/* Keterangan Vintage */}
            <div style={{ fontWeight: 500, color: '#d72688', marginBottom: 8, marginTop: 8 }}>Vintage</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
              <button
                onClick={() => onSelectFrame('#FFE99A')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#FFE99A',
                  border: selectedFrame === '#FFE99A' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                  cursor: 'pointer',
                  outline: selectedFrame === '#FFE99A' ? '2px solid #fff' : 'none',
                }}
                aria-label="Vintage Yellow"
                title="Vintage Yellow"
              />
              <button
                onClick={() => onSelectFrame('#FFD586')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#FFD586',
                  border: selectedFrame === '#FFD586' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                  cursor: 'pointer',
                  outline: selectedFrame === '#FFD586' ? '2px solid #fff' : 'none',
                }}
                aria-label="Vintage Orange"
                title="Vintage Orange"
              />
              <button
                onClick={() => onSelectFrame('#FFAAAA')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#FFAAAA',
                  border: selectedFrame === '#FFAAAA' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                  cursor: 'pointer',
                  outline: selectedFrame === '#FFAAAA' ? '2px solid #fff' : 'none',
                }}
                aria-label="Vintage Pink"
                title="Vintage Pink"
              />
              <button
                onClick={() => onSelectFrame('#FF9898')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#FF9898',
                  border: selectedFrame === '#FF9898' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                  cursor: 'pointer',
                  outline: selectedFrame === '#FF9898' ? '2px solid #fff' : 'none',
                }}
                aria-label="Vintage Red"
                title="Vintage Red"
              />
            </div>
            {/* Keterangan Retro */}
            <div style={{ fontWeight: 500, color: '#d72688', marginBottom: 8, marginTop: 8 }}>Retro</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
              <button
                onClick={() => onSelectFrame('#309898')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#309898',
                  border: selectedFrame === '#309898' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                  cursor: 'pointer',
                  outline: selectedFrame === '#309898' ? '2px solid #fff' : 'none',
                }}
                aria-label="Retro Green"
                title="Retro Green"
              />
              <button
                onClick={() => onSelectFrame('#FF9F00')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#FF9F00',
                  border: selectedFrame === '#FF9F00' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                  cursor: 'pointer',
                  outline: selectedFrame === '#FF9F00' ? '2px solid #fff' : 'none',
                }}
                aria-label="Retro Orange"
                title="Retro Orange"
              />
              <button
                onClick={() => onSelectFrame('#F4631E')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#F4631E',
                  border: selectedFrame === '#F4631E' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                  cursor: 'pointer',
                  outline: selectedFrame === '#F4631E' ? '2px solid #fff' : 'none',
                }}
                aria-label="Retro Brown"
                title="Retro Brown"
              />
              <button
                onClick={() => onSelectFrame('#CB0404')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#CB0404',
                  border: selectedFrame === '#CB0404' ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                  cursor: 'pointer',
                  outline: selectedFrame === '#CB0404' ? '2px solid #fff' : 'none',
                }}
                aria-label="Retro Red"
                title="Retro Red"
              />
            </div>
          </div>
        )}

        {activeTab === 'frame' && (
          <div>
            {/* Only show Upload Template button for ADMIN users */}
            {userRole === 'ADMIN' && (
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
                Upload Template
              </button>
            )}

            <div style={{ fontWeight: 600, color: '#d72688', marginBottom: 12 }}>Choose Frame Template</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={template.src} alt={template.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ color: '#d72688', fontSize: 12 }}>{template.label}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sticker' && (
          <div>
            {/* Only show Upload Sticker button for ADMIN users */}
            {userRole === 'ADMIN' && (
              <div style={{ marginBottom: 16 }}>
                <button
                  style={{
                    background: '#fa75aa',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '8px 18px',
                    fontWeight: 600,
                    marginBottom: 8,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => setShowStickerUploadModal(true)}
                >
                  Upload Sticker
                </button>
                {uploading && <span style={{ color: '#fa75aa', marginLeft: 8 }}>Uploading...</span>}
                {uploadError && <span style={{ color: 'red', marginLeft: 8 }}>{uploadError}</span>}
              </div>
            )}
            {/* Modal Upload Sticker dipindah ke luar return utama */}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
              {minioStickers.map(sticker => (
                <div
                  key={sticker.src}
                  style={{
                    border: '2px solid #fa75aa33',
                    borderRadius: 12,
                    padding: 0,
                    background: '#fff',
                    cursor: 'pointer',
                    width: 70,
                    height: 70,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px #fa75aa11',
                    transition: 'transform 0.1s',
                  }}
                  onClick={() => onAddSticker(sticker.src)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sticker.src}
                    alt={sticker.label}
                    style={{
                      width: '90%',
                      height: '90%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
      </div>
      {/* Area preview baru foto */}
      {/* <div style={{ background: '#fff', padding: 0 }}>{children}</div> */}
    </div>
  );
}