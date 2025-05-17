interface Props {
  onSelect: (layout: number) => void;
}

export default function LayoutSelector({ onSelect }: Props) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ marginBottom: '12px', color: '#333' }}>Pilih Layout</h3>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {[2, 3, 4, 6].map(layout => (
          <button
            className="layout-selector-btn"
            key={layout}
            onClick={() => onSelect(layout)}
          >
            {layout} Pose
          </button>
        ))}
      </div>
    </div>
  );
}
