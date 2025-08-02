import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { QrCode, Download, Copy, X } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  open,
  onClose,
  userId,
  userName,
}) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate the profile URL
  const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${userId}/view`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Profile URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  const handleDownloadQR = async () => {
    try {
      const svg = qrRef.current?.querySelector("svg");
      if (!svg) {
        throw new Error("QR Code SVG not found");
      }

      // Get SVG data
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });

      // Create canvas to convert SVG to PNG
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Set canvas size (make it larger for better quality)
      const scale = 2; // 2x scale for better quality
      canvas.width = 300 * scale;
      canvas.height = 300 * scale;

      // Fill with white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert SVG to image and draw on canvas
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob and download
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const downloadUrl = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.download = `${userName.replace(/\s+/g, "_")}-profile-qr.png`;
              link.href = downloadUrl;
              link.style.display = "none";

              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              // Cleanup
              URL.revokeObjectURL(url);
              URL.revokeObjectURL(downloadUrl);
              toast.success("QR Code downloaded!");
            } else {
              throw new Error("Failed to create PNG blob");
            }
          },
          "image/png",
          1.0,
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        throw new Error("Failed to load SVG as image");
      };

      img.src = url;
    } catch (error) {
      console.error("Download error:", error);

      try {
        const svg = qrRef.current?.querySelector("svg");
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const svgBlob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
          });
          const url = URL.createObjectURL(svgBlob);

          const link = document.createElement("a");
          link.download = `${userName.replace(/\s+/g, "_")}-profile-qr.svg`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(url);
          toast.success("QR Code downloaded as SVG!");
        } else {
          throw new Error("SVG not available");
        }
      } catch (fallbackError) {
        console.error("Fallback download error:", fallbackError);
        toast.error(
          "Failed to download QR code. Please try right-clicking and saving the image.",
        );
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Profile QR Code
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Code Display */}
          <Card className="p-6 text-center">
            <div className="mx-auto mb-4" ref={qrRef}>
              <QRCodeSVG
                value={profileUrl}
                title={"View My Profile"}
                size={128}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
              />
            </div>
            <p className="text-sm text-gray-600">
              Scan this QR code to view {userName}&apos;s profile
            </p>
          </Card>

          {/* Profile URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Profile URL:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={profileUrl}
                readOnly
                className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleDownloadQR}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download QR
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
