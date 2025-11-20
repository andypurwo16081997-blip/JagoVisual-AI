import React, { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (dataUrl: string, mimeType: string) => void;
  uploadedImage: string | null;
  label: string; // Keep for unique ID generation
  labelKey: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedImage, label, labelKey }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useLanguage();

  const handleFileChange = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
        className={`relative block w-full aspect-video rounded-lg border-2 border-dashed
        ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50' : 'border-gray-300 dark:border-gray-600'}
        flex items-center justify-center text-center cursor-pointer transition-colors duration-200 ease-in-out group`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded preview" className="object-contain w-full h-full rounded-lg" />
        ) : (
          <div className="space-y-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-500">
            <UploadIcon className="mx-auto h-12 w-12" />
            <p className="font-semibold">{t(labelKey)}</p>
            <p className="text-xs">{t('uploader.fileTypes')}</p>
          </div>
        )}
      </label>
      <input 
        id={`file-upload-${label.replace(/\s+/g, '-')}`} 
        name={`file-upload-${label.replace(/\s+/g, '-')}`} 
        type="file" 
        className="sr-only" 
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files)}
      />
    </div>
  );
};