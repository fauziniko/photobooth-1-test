import html2canvas from 'html2canvas';

interface Props {
  photos: string[];
  filter: string;
  frameColor: string;
}

export default function PhotoPreview({ photos, filter, frameColor }: Props) {
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
    <div>
      <div id="strip" style={{ backgroundColor: frameColor, padding: 10 }}>
        {photos.map((src, i) => (
          <img key={i} src={src} alt={`photo-${i}`} style={{ filter, width: 200, margin: 5 }} />
        ))}
      </div>
      <button onClick={downloadStrip}>Download Strip</button>
    </div>
  );
}
