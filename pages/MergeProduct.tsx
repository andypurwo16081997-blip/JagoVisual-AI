import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { EnhanceOptions } from '../components/EnhanceOptions';
import { ResultDisplay } from '../components/ResultDisplay';
import { mergeProductImages } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import type { ImageData, EnhanceMethod, CustomizationOptions } from '../types';
import { FeatureHeader } from '../components/FeatureHeader';
import { PlusIcon } from '../components/icons/PlusIcon';
import { TrashIcon } from '../components/icons/TrashIcon';

export const MergeProduct: React.FC = () => {
  const { t } = useLanguage();
  const [productImages, setProductImages] = useState<(ImageData | null)[]>([null, null]);
  const [referenceImage, setReferenceImage] = useState<ImageData | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const validProductImages = productImages.filter(p => p !== null) as ImageData[];

  const handleAddProductSlot = () => {
      if (productImages.length < 4) {
          setProductImages(prev => [...prev, null]);
      }
  };

  const handleProductImageUpload = (dataUrl: string, mimeType: string, index: number) => {
      setProductImages(prev => {
          const newImages = [...prev];
          newImages[index] = { dataUrl, mimeType };
          return newImages;
      });
      setGeneratedImages(null);
      setSelectedImage(null);
      setError(null);
  };

  const handleRemoveProductSlot = (index: number) => {
      const newImages = productImages.filter((_, i) => i !== index);
      if (newImages.length < 2) {
          setProductImages([null, null]);
      } else {
          setProductImages(newImages);
      }
  };

  const handleReferenceImageUpload = (dataUrl: string, mimeType: string) => {
    setReferenceImage({ dataUrl, mimeType });
  };

  const handleEnhance = async (method: EnhanceMethod, options: CustomizationOptions) => {
    if (validProductImages.length < 2) {
      setError(t('mergeProduct.errors.atLeastTwo'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    setSelectedImage(null);

    try {
      const result = await mergeProductImages(validProductImages, method, options, referenceImage);
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
    setProductImages([null, null]);
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
      link.download = `merged-product-${Date.now()}.png`;
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
        title={t('mergeProduct.page.title')}
        description={t('mergeProduct.page.description')}
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
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('mergeProduct.sections.uploadProducts.title').substring(3)}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('mergeProduct.sections.uploadProducts.subtitle')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {productImages.map((img, index) => (
                  <div key={index} className="relative group">
                      <ImageUploader
                          onImageUpload={(dataUrl, mimeType) => handleProductImageUpload(dataUrl, mimeType, index)}
                          uploadedImage={img?.dataUrl || null}
                          label={`Product Image ${index + 1}`}
                          labelKey="uploader.productLabel"
                      />
                      {productImages.length > 2 && (
                          <button
                              onClick={() => handleRemoveProductSlot(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove product"
                          >
                              <TrashIcon className="w-4 h-4" />
                          </button>
                      )}
                  </div>
              ))}
              {productImages.length < 4 && (
                  <button
                      onClick={handleAddProductSlot}
                      className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-fuchsia-500 hover:text-fuchsia-500 transition-colors"
                  >
                      <PlusIcon className="w-8 h-8 mb-2" />
                      <span className="text-sm font-semibold">{t('mergeProduct.sections.uploadProducts.addProduct')}</span>
                  </button>
              )}
            </div>
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
              isProductImageUploaded={validProductImages.length >= 2}
            />
          </div>
        </div>

        {/* Right Column: Result Display */}
        <ResultDisplay
          originalImage={productImages.find(p => p)?.dataUrl || null}
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