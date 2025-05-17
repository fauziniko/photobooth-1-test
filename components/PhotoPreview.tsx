import html2canvas from 'html2canvas';

interface Props {
  photos: string[];
  filter: string;
  frameColor: string;
  bottomSpace?: number; // tinggi space kosong dalam px (opsional)
}

export default function PhotoPreview({ photos, filter, frameColor, bottomSpace = 85 }: Props) {
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
        <div
          style={{
            width: 200,
            height: bottomSpace,
            background: 'transparent'
          }}
        />
      </div>
    </div>
  );
}
