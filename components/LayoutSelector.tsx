interface Props {
    onSelect: (layout: number) => void;
  }
  
  export default function LayoutSelector({ onSelect }: Props) {
    return (
      <div>
        <h3>Pilih Layout</h3>
        {[2, 3, 4, 6].map(n => (
          <button key={n} onClick={() => onSelect(n)}>{n} Pose</button>
        ))}
      </div>
    );
  }
  