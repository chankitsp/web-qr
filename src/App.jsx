import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Link2 } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const qrRef = useRef();

  const handleDownload = () => {
    if (!url) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      // Create a temporary canvas to draw the rounded QR code
      const roundedCanvas = document.createElement('canvas');
      const ctx = roundedCanvas.getContext('2d');
      const size = canvas.width;
      const radius = 20; // Adjust for corner roundness

      roundedCanvas.width = size;
      roundedCanvas.height = size;

      // Draw rounded rectangle path
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(size - radius, 0);
      ctx.quadraticCurveTo(size, 0, size, radius);
      ctx.lineTo(size, size - radius);
      ctx.quadraticCurveTo(size, size, size - radius, size);
      ctx.lineTo(radius, size);
      ctx.quadraticCurveTo(0, size, 0, size - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();

      // Clip to the rounded path
      ctx.clip();

      // Draw original QR code onto the rounded canvas
      ctx.drawImage(canvas, 0, 0);

      const pngUrl = roundedCanvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const filename = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}.png`;

      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="app-container">
      <div className="background-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      <main className="glass-card">
        <header className="card-header">
          <div className="icon-wrapper">
            <Link2 size={28} />
          </div>
          <h1>QR Code Generator</h1>
          <p>Create beautiful QR codes instantly. Just paste your URL below.</p>
        </header>

        <div className="input-group">
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="url-input"
          />
        </div>

        <div className={"qr-display " + (url ? "active" : "")}>
          <div className="qr-wrapper" ref={qrRef}>
            {url ? (
              <QRCodeCanvas
                value={url}
                size={220}
                bgColor={"#ffffff"}
                fgColor={"#0f172a"}
                level={"H"}
                includeMargin={true}
                className="qr-code"
              />
            ) : (
              <div className="qr-placeholder">
                <p>Enter a URL to generate</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={!url}
          className="download-btn"
        >
          <Download size={20} />
          <span>Download QR Code</span>
        </button>
      </main>
    </div>
  );
}

export default App;
