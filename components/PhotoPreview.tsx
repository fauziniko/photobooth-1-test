interface Props {
  photos: string[];
  filter: string;
  frameColor: string;
  bottomSpace: number;
  borderRadius: number; // tambahkan prop ini
}

export default function PhotoPreview({ photos, filter, frameColor, bottomSpace, borderRadius }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
      <div 
        id="strip" 
        style={{ 
          backgroundColor: frameColor, 
          padding: 20, 
          borderRadius: borderRadius, // gunakan di frame
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
              width: 240, // landscape, bisa sesuaikan
              height: 180,
              objectFit: 'cover',
              borderRadius: borderRadius, // gunakan di gambar juga
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
