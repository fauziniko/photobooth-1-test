interface Props {
    onColorChange: (color: string) => void;
  }
  
  export default function FrameCustomizer({ onColorChange }: Props) {
    const colors = ['white', 'black', 'pink', 'green', 'yellow', 'blue', 'purple', 'maroon'];
    return (
      <div>
        <h3>Pilih Warna Frame</h3>
        {colors.map(color => (
          <button key={color} onClick={() => onColorChange(color)} style={{ backgroundColor: color }}>{color}</button>
        ))}
      </div>
    );
  }
  