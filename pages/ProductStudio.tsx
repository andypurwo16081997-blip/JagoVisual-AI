import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { EnhanceOptions } from '../components/EnhanceOptions';
import { ResultDisplay } from '../components/ResultDisplay';
import { enhanceImage } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import type { ImageData, EnhanceMethod, CustomizationOptions } from '../types';
import { FeatureHeader } from '../components/FeatureHeader';

export const ProductStudio: React.FC = () => {
  const { t } = useLanguage();
  const [productImage, setProductImage] = useState<ImageData | null>(null);
  const [referenceImage, setReferenceImage] = useState<ImageData | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleProductImageUpload = (dataUrl: string, mimeType: string) => {
    setProductImage({ dataUrl, mimeType });
    // Reset results when a new product image is uploaded
    setGeneratedImages(null);
    setSelectedImage(null);
    setError(null);
  };

  const handleReferenceImageUpload = (dataUrl: string, mimeType: string) => {
    setReferenceImage({ dataUrl, mimeType });
  };

  const handleEnhance = async (method: EnhanceMethod, options: CustomizationOptions) => {
    if (!productImage) {
      setError("Please upload a product image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    setSelectedImage(null);

    try {
      const result = await enhanceImage(productImage, method, options, referenceImage);
      setGeneratedImages(result.imageUrls);
      if (result.imageUrls && result.imageUrls.length > 0) {
        setSelectedImage(result.imageUrls[0]);
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setProductImage(null);
    setReferenceImage(null);
    setGeneratedImages(null);
    setSelectedImage(null);
    setIsLoading(false);
    setError(null);
  };

  const handleDownload = () => {
    if (selectedImage) {
      const link = document.createElement('a');
      link.href = selectedImage;
      link.download = `enhanced-product-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div>
      <FeatureHeader 
        title={t('productStudio.page.title')}
        description={t('productStudio.page.description')}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Upload and Options */}
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/50 space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-fuchsia-600 to-fuchsia-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('sections.upload.title').substring(3)}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('sections.upload.subtitle')}</p>
              </div>
            </div>
            <ImageUploader 
              onImageUpload={handleProductImageUpload}
              uploadedImage={productImage?.dataUrl || null}
              label="Upload Product Image"
              labelKey="uploader.productLabel"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-fuchsia-600 to-fuchsia-700 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('sections.style.title').substring(3)}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('sections.style.subtitle')}</p>
                </div>
            </div>
              <EnhanceOptions
              onEnhance={handleEnhance}
              isLoading={isLoading}
              onReferenceImageUpload={handleReferenceImageUpload}
              referenceImage={referenceImage?.dataUrl || null}
              isProductImageUploaded={!!productImage}
            />
          </div>
        </div>

        {/* Right Column: Result Display */}
        <ResultDisplay
          originalImage={productImage?.dataUrl || null}
          generatedImages={generatedImages}
          selectedImage={selectedImage}
          isLoading={isLoading}
          error={error}
          onDownload={handleDownload}
          onReset={handleReset}
          onSelectImage={handleSelectImage}
        />
      </div>
    </div>
  );
}