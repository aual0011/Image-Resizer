import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ImageResizer from '@/components/ImageResizer';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Image Resizer</h1>
          <p className="text-lg text-muted-foreground">
            Upload an image, set dimensions, and download the resized version
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <ImageUploader onImageUpload={handleImageUpload} />
          <ImageResizer originalImage={uploadedImage} />
        </div>
      </div>
    </div>
  );
};

export default Index;