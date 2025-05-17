interface Props {
  onSelect: (filter: string) => void;
}

export default function FilterSelector({ onSelect }: Props) {
  const filters = [
    { name: 'none', label: 'Normal' },
    { name: 'grayscale(1)', label: 'B&W' },
    { name: 'sepia(1)', label: 'Sepia' },
    { name: 'contrast(1.2)', label: 'Contrast' },
    { name: 'brightness(1.2)', label: 'Bright' }
  ];
  
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ marginBottom: '12px', color: '#333' }}>Pilih Filter</h3>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {filters.map((filter) => (
          <button 
            key={filter.name} 
            onClick={() => onSelect(filter.name)}
            style={{
              padding: '10px 16px',
              backgroundColor: '#f0f0f0',
              border: '2px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
