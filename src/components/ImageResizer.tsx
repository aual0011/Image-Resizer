import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface ImageResizerProps {
  originalImage: File | null;
}

const ImageResizer = ({ originalImage }: ImageResizerProps) => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resizedImageUrl, setResizedImageUrl] = useState<string>('');

  useEffect(() => {
    if (originalImage) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(originalImage);
      
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
        setPreviewUrl(objectUrl);
      };
      
      img.src = objectUrl;
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [originalImage]);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    setWidth(newWidth);
    
    if (maintainAspectRatio && originalDimensions.width) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    setHeight(newHeight);
    
    if (maintainAspectRatio && originalDimensions.height) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const resizeImage = () => {
    if (!originalImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResizedImageUrl(url);
            toast.success('Image resized successfully!');
          }
        }, originalImage.type);
      }
    };

    img.src = previewUrl;
  };

  const downloadImage = () => {
    if (!resizedImageUrl) return;

    const link = document.createElement('a');
    link.href = resizedImageUrl;
    link.download = `resized-${originalImage?.name || 'image'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!originalImage) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={handleWidthChange}
                min="1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={handleHeightChange}
                min="1"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="aspect-ratio"
              checked={maintainAspectRatio}
              onCheckedChange={setMaintainAspectRatio}
            />
            <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
          </div>

          <Button onClick={resizeImage} className="w-full">
            Resize Image
          </Button>
        </div>

        <div className="space-y-4">
          {resizedImageUrl && (
            <>
              <img
                src={resizedImageUrl}
                alt="Resized preview"
                className="max-w-full h-auto rounded-lg border border-border"
              />
              <Button onClick={downloadImage} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Resized Image
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageResizer;