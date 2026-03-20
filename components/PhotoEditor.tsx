import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const TABS = [
  { key: 'color', label: 'Color' }, // Tambahkan tab baru untuk Frame Color
  { key: 'frame', label: 'Frame' },
  { key: 'sticker', label: 'Sticker' },
  { key: 'adjust', label: 'Settings' },
];

type PickerType = 'color' | 'frame' | 'sticker';

const PRESET_COLOR_OPTIONS: { value: string; label: string; swatch: string }[] = [
  { value: '#FFDCDC', label: 'Pastel Pink', swatch: '#FFDCDC' },
  { value: '#FFF2EB', label: 'Pastel Peach', swatch: '#FFF2EB' },
  { value: '#FFE8CD', label: 'Pastel Yellow', swatch: '#FFE8CD' },
  { value: '#FFD6BA', label: 'Pastel Orange', swatch: '#FFD6BA' },
  { value: '#FFE99A', label: 'Vintage Yellow', swatch: '#FFE99A' },
  { value: '#FFD586', label: 'Vintage Orange', swatch: '#FFD586' },
  { value: '#FFAAAA', label: 'Vintage Pink', swatch: '#FFAAAA' },
  { value: '#FF9898', label: 'Vintage Red', swatch: '#FF9898' },
  { value: '#309898', label: 'Retro Green', swatch: '#309898' },
  { value: '#FF9F00', label: 'Retro Orange', swatch: '#FF9F00' },
  { value: '#F4631E', label: 'Retro Brown', swatch: '#F4631E' },
  { value: '#CB0404', label: 'Retro Red', swatch: '#CB0404' },
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
}) {
  // Ubah 'filter' menjadi 'frame' agar tab default adalah Frame
  const [activeTab, setActiveTab] = useState('frame');
  const [isMobile, setIsMobile] = useState(false);
  const [openPicker, setOpenPicker] = useState<PickerType | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colorGridCols = isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))';
  const assetGridCols = isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))';

  const allColorOptions = useMemo(() => {
    const optionMap = new Map<string, { value: string; label: string; swatch: string }>();

    availableFrames.forEach(frame => {
      const value = String(frame.name || '').trim();
      const swatch = String(frame.color || frame.name || '').trim();
      if (!value || !swatch) return;

      optionMap.set(value, {
        value,
        label: frame.label || frame.name || value,
        swatch,
      });
    });

    PRESET_COLOR_OPTIONS.forEach(option => {
      if (!optionMap.has(option.value)) {
        optionMap.set(option.value, option);
      }
    });

    return Array.from(optionMap.values());
  }, [availableFrames]);

  useEffect(() => {
    if (!openPicker) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPicker(null);
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [openPicker]);

  const isTemplateMode = selectedFrameTemplate !== 'none';

  // Untuk menambah stiker ke list

  // Gabungkan stiker default dan user
  const [minioStickers, setMinioStickers] = useState<{ src: string; label: string }[]>([]);
  useEffect(() => {
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

  const pickerModal = openPicker ? (
    <div
      className="pb-modal-backdrop fixed inset-0 z-[2147483640] flex items-center justify-center p-4"
      style={{ zIndex: 2147483640 }}
      onClick={() => setOpenPicker(null)}
    >
      <div
        className="pb-modal-shell w-full max-w-3xl"
        style={{ maxHeight: '85vh', overflow: 'hidden' }}
        onClick={event => event.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid #f3b7d1',
          }}
        >
          <h3 style={{ margin: 0, color: '#4a2337', fontWeight: 700, fontSize: 18 }}>
            {openPicker === 'color' && 'Semua Opsi Color'}
            {openPicker === 'frame' && 'Semua Opsi Frame'}
            {openPicker === 'sticker' && 'Semua Opsi Sticker'}
          </h3>
          <button
            onClick={() => setOpenPicker(null)}
            style={{
              background: '#fff4fa',
              color: '#d72688',
              border: '1px solid #f3b7d1',
              borderRadius: 8,
              padding: '6px 12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Tutup
          </button>
        </div>

        <div style={{ padding: 16, overflowY: 'auto', maxHeight: 'calc(85vh - 64px)' }}>
          {openPicker === 'color' && (
            allColorOptions.length === 0 ? (
              <p style={{ margin: 0, color: '#7a5b6d' }}>Belum ada opsi color tersedia.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(6, minmax(0, 1fr))', gap: 12 }}>
                {allColorOptions.map(option => (
                  <button
                    key={`picker-color-${option.value}`}
                    onClick={() => {
                      onSelectFrame(option.value);
                      setOpenPicker(null);
                    }}
                    style={{
                      border: selectedFrame === option.value ? '3px solid #fa75aa' : '1.5px solid #f3b7d1',
                      borderRadius: 12,
                      background: '#fff',
                      padding: '10px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                    }}
                    title={option.label}
                  >
                    <span
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: option.swatch,
                        border: '1px solid #e7c8d7',
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ color: '#5a2a42', fontSize: 11, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            )
          )}

          {openPicker === 'frame' && (
            frameTemplates.length === 0 ? (
              <p style={{ margin: 0, color: '#7a5b6d' }}>Belum ada frame template tersedia.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(5, minmax(0, 1fr))', gap: 12 }}>
                {frameTemplates.map(template => (
                  <button
                    key={`picker-frame-${template.name}`}
                    onClick={() => {
                      onSelectFrameTemplate(template.name);
                      setOpenPicker(null);
                    }}
                    style={{
                      border: selectedFrameTemplate === template.name ? '3px solid #fa75aa' : '2px solid #fa75aa33',
                      borderRadius: 12,
                      padding: 0,
                      background: '#fff',
                      cursor: 'pointer',
                      width: '100%',
                      aspectRatio: '1 / 1',
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
            )
          )}

          {openPicker === 'sticker' && (
            minioStickers.length === 0 ? (
              <p style={{ margin: 0, color: '#7a5b6d' }}>Belum ada sticker tersedia.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(5, minmax(0, 1fr))', gap: 12 }}>
                {minioStickers.map(sticker => (
                  <button
                    key={`picker-sticker-${sticker.src}`}
                    onClick={() => {
                      onAddSticker(sticker.src);
                      setOpenPicker(null);
                    }}
                    style={{
                      border: '2px solid #fa75aa33',
                      borderRadius: 12,
                      padding: 8,
                      background: '#fff',
                      cursor: 'pointer',
                      width: '100%',
                      aspectRatio: '1 / 1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px #fa75aa11',
                    }}
                    title={sticker.label}
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
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  ) : null;

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
      {/* Tab Menu */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1.5px solid #fa75aa22',
          background: '#ffe4f0',
          padding: isMobile ? '8px 8px' : '12px 12px',
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
              fontSize: isMobile ? 13 : 15,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: isMobile ? 16 : 28, background: '#fff' }}>
        {activeTab === 'color' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
              <div style={{ fontWeight: 600, color: '#d72688' }}>Choose Frame Color</div>
              <button
                onClick={() => setOpenPicker('color')}
                style={{
                  background: '#fff4fa',
                  color: '#d72688',
                  border: '1px solid #f3b7d1',
                  borderRadius: 10,
                  padding: '6px 12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 12,
                }}
                title="Lihat semua color"
              >
                Lihat Semua
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: colorGridCols, gap: 10, marginBottom: 24 }}>
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
    gridTemplateColumns: colorGridCols,
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
            <div style={{ display: 'grid', gridTemplateColumns: colorGridCols, gap: 10, marginBottom: 24 }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: colorGridCols, gap: 10, marginBottom: 24 }}>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
              <div style={{ fontWeight: 600, color: '#d72688' }}>Choose Frame Template</div>
              <button
                onClick={() => setOpenPicker('frame')}
                style={{
                  background: '#fff4fa',
                  color: '#d72688',
                  border: '1px solid #f3b7d1',
                  borderRadius: 10,
                  padding: '6px 12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 12,
                }}
                title="Lihat semua frame"
              >
                Lihat Semua
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: assetGridCols, gap: 10, marginBottom: 24 }}>
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
                    width: '100%',
                    maxWidth: isMobile ? 68 : 80,
                    aspectRatio: '1 / 1',
                    justifySelf: 'center',
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
              <button
                onClick={() => setOpenPicker('sticker')}
                style={{
                  background: '#fff4fa',
                  color: '#d72688',
                  border: '1px solid #f3b7d1',
                  borderRadius: 8,
                  padding: '4px 12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 13,
                  marginLeft: 8,
                }}
                title="Lihat semua sticker"
              >
                Lihat Semua
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: assetGridCols, gap: 10, marginBottom: 24 }}>
              {minioStickers.map(sticker => (
                <div
                  key={sticker.src}
                  style={{
                    border: '2px solid #fa75aa33',
                    borderRadius: 12,
                    padding: 0,
                    background: '#fff',
                    cursor: 'pointer',
                    width: '100%',
                    maxWidth: isMobile ? 70 : 80,
                    aspectRatio: '1 / 1',
                    justifySelf: 'center',
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
              disabled={isTemplateMode}
              style={{
                marginBottom: 18,
                padding: '10px 24px',
                background: '#fa75aa',
                color: '#fff',
                border: 'none',
                borderRadius: 16,
                fontWeight: 'bold',
                fontSize: 15,
                cursor: isTemplateMode ? 'not-allowed' : 'pointer',
                opacity: isTemplateMode ? 0.55 : 1,
                boxShadow: '0 2px 8px #fa75aa22',
              }}
            >
              Reset to Default
            </button>
            {isTemplateMode && (
              <p style={{ marginTop: -6, marginBottom: 14, fontSize: 12, color: '#7a5b6d' }}>
                Mode template aktif: pengaturan size/radius/gap mengikuti template canvas.
              </p>
            )}
            <label style={{ color: '#d72688', fontWeight: 600, fontSize: 15, marginBottom: 8, display: 'block' }}>
              Frame Bottom Size
            </label>
            <input
              type="range"
              min={0}
              max={200}
              value={sliderValue}
              onChange={e => onChangeSlider(Number(e.target.value))}
              disabled={isTemplateMode}
              style={{
                width: '100%',
                accentColor: '#fa75aa',
                marginBottom: 12,
                opacity: isTemplateMode ? 0.5 : 1,
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
                disabled={isTemplateMode}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  accentColor: '#fa75aa',
                  opacity: isTemplateMode ? 0.5 : 1,
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
                disabled={isTemplateMode}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  accentColor: '#fa75aa',
                  opacity: isTemplateMode ? 0.5 : 1,
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
                disabled={isTemplateMode}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  accentColor: '#fa75aa',
                  opacity: isTemplateMode ? 0.5 : 1,
                }}
              />
              <div style={{ color: '#d72688', fontWeight: 500, fontSize: 14 }}>
                {photoBorderRadius}px
              </div>
            </div>
          </>
        )}
      </div>

      {openPicker && typeof document !== 'undefined' ? createPortal(pickerModal, document.body) : null}
      {/* Area preview baru foto */}
      {/* <div style={{ background: '#fff', padding: 0 }}>{children}</div> */}
    </div>
  );
}