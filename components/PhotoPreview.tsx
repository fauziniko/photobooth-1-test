import html2canvas from 'html2canvas';

interface Props {
  photos: string[];
  filter: string;
  frameColor: string;
  bottomSpace?: number; // tinggi space kosong dalam px (opsional)
}

export default function PhotoPreview({ photos, filter, frameColor, bottomSpace = 200 }: Props) {
  const downloadStrip = () => {
    const node = document.getElementById('strip')!;
    html2canvas(node).then(canvas => {
      const link = document.createElement('a');
      link.download = 'photostrip.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
      <div 
        id="strip" 
        style={{ 
          backgroundColor: frameColor, 
          padding: 20, 
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          maxWidth: '90vw'
        }}
      >
        {photos.map((src, i) => (
          <img 
            key={i} 
            src={src} 
            alt={`photo-${i}`} 
            style={{ 
              filter, 
              width: 200, 
              borderRadius: 8,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} 
          />
        ))}
        {/* Space kosong di bawah strip, bisa diatur tingginya */}
        <div
          style={{
            width: 200,
            height: bottomSpace,
            background: 'transparent'
          }}
        />
      </div>
      <button 
        onClick={downloadStrip} 
        style={{
          padding: '12px 24px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '24px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}
      >
        Download Strip
      </button>
    </div>
  );
}
