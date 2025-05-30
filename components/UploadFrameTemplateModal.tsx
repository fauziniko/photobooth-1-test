import React, { useState } from 'react';

export default function UploadFrameTemplateModal({ onClose }: { onClose: () => void }) {
  const [templateName, setTemplateName] = useState('');
  const [frameFile, setFrameFile] = useState<File | null>(null);
  const [stickerFile, setStickerFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
      window.dispatchEvent(new Event('frameTemplatesUpdated'));
    } else {
      setUploadError(data.error || 'Upload failed');
    }
    setUploading(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 32, minWidth: 320, boxShadow: '0 4px 24px #fa75aa22', position: 'relative'
      }}>
        <h3 style={{ color: '#d72688', marginBottom: 16, textAlign: 'center', fontWeight: 800 }}>
          Upload Frame Template
        </h3>
        <label style={{ fontWeight: 1200, color: '#fa75aa', marginBottom: 4, display: 'block' }}>Template Name</label>
        <input
          type="text"
          value={templateName}
          onChange={e => setTemplateName(e.target.value)}
          placeholder="Template name"
          style={{
            width: '100%',
            marginBottom: 16,
            padding: 6,
            borderRadius: 6,
            border: '1.5px solid #fa75aa',
            color: '#d72688',
            fontWeight: 500,
          }}
        />
        <label style={{ fontWeight: 600, color: '#fa75aa', marginBottom: 4, display: 'block' }}>Frame Template (PNG)</label>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <label
            style={{
              display: 'inline-block',
              padding: '8px 24px',
              background: '#fa75aa',
              color: '#fff',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              border: 'none',
              boxShadow: '0 2px 8px #fa75aa22',
              textAlign: 'center'
            }}
          >
            {frameFile ? frameFile.name : 'Choose File'}
            <input
              type="file"
              accept="image/png"
              onChange={e => setFrameFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <label style={{ fontWeight: 600, color: '#fa75aa', marginBottom: 4, display: 'block' }}>Sticker (PNG)</label>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <label
            style={{
              display: 'inline-block',
              padding: '8px 24px',
              background: '#fa75aa',
              color: '#fff',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              border: 'none',
              boxShadow: '0 2px 8px #fa75aa22',
              textAlign: 'center'
            }}
          >
            {stickerFile ? stickerFile.name : 'Choose File'}
            <input
              type="file"
              accept="image/png"
              onChange={e => setStickerFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        {uploadError && <div style={{ color: 'red', marginBottom: 8, textAlign: 'center' }}>{uploadError}</div>}
        {uploadSuccess && <div style={{ color: 'green', marginBottom: 8, textAlign: 'center' }}>Upload Success!</div>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button
            onClick={handleUploadTemplate}
            disabled={uploading}
            style={{ background: '#fa75aa', color: '#fff', borderRadius: 8, padding: '8px 24px', fontWeight: 600, border: 'none' }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            onClick={onClose}
            style={{ background: '#eee', color: '#333', borderRadius: 8, padding: '8px 24px', fontWeight: 600, border: 'none' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}