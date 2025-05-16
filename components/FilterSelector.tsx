interface Props {
    onSelect: (filter: string) => void;
  }
  
  export default function FilterSelector({ onSelect }: Props) {
    const filters = ['none', 'grayscale(1)', 'sepia(1)', 'contrast(1.2)', 'brightness(1.2)'];
    return (
      <div>
        <h3>Pilih Filter</h3>
        {filters.map((f, i) => (
          <button key={i} onClick={() => onSelect(f)}>{f === 'none' ? 'No Filter' : f}</button>
        ))}
      </div>
    );
  }
  