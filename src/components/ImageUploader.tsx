import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader = ({ onImageUpload }: ImageUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        w-full h-64 border-2 border-dashed rounded-lg
        transition-all duration-300 ease-in-out
        flex flex-col items-center justify-center
        cursor-pointer
        ${isDragActive 
          ? 'border-primary bg-primary/5 animate-border-pulse' 
          : 'border-upload-area-border hover:border-upload-area-border-hover'
        }
      `}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-lg text-gray-600">
        {isDragActive
          ? 'Drop the image here'
          : 'Drag & drop an image here, or click to select'}
      </p>
      <p className="text-sm text-gray-400 mt-2">
        Supports: JPG, PNG, GIF, WebP
      </p>
    </div>
  );
};

export default ImageUploader;