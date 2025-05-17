interface Props {
  onColorChange: (color: string) => void;
}

export default function FrameCustomizer({ onColorChange }: Props) {
  const colors = [
    { name: 'white', label: 'White' },
    { name: 'black', label: 'Black' },
    { name: 'pink', label: 'Pink' },
    { name: 'green', label: 'Green' },
    { name: 'yellow', label: 'Yellow' },
    { name: 'blue', label: 'Blue' },
    { name: 'purple', label: 'Purple' },
    { name: 'maroon', label: 'Maroon' }
  ];
  
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ marginBottom: '12px', color: '#333' }}>Pilih Warna Frame</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {colors.map(color => (
          <button 
            key={color.name} 
            onClick={() => onColorChange(color.name)} 
            style={{ 
              backgroundColor: color.name,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid #ddd',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            title={color.label}
            aria-label={`Warna ${color.label}`}
          />
        ))}
      </div>
    </div>
  );
}
