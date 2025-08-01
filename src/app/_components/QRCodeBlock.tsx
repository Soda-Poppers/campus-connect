/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface Props {
  targetUrl: string; // the URL on your site the QR code should point to
  size?: number;
}

const QRCodeGenerator = ({ targetUrl, size = 150 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <QRCodeCanvas
        value={targetUrl}
        size={size}
        includeMargin={true}
        ref={(el: any) => {
          // qrcode.react exposes canvas as .canvas (depends on version)
          // we attempt to grab the underlying canvas element
          const canvas =
            el?.canvas instanceof HTMLCanvasElement
              ? el.canvas
              : el instanceof HTMLCanvasElement
                ? el
                : null;

          canvasRef.current = canvas;
        }}
      />
      <div className="flex gap-2">
        <button
          onClick={downloadPNG}
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
        >
          Download PNG
        </button>
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-gray-200 px-3 py-1 text-sm"
        >
          Preview Link
        </a>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
